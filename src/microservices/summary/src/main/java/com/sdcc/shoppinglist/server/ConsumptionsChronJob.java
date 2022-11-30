package com.sdcc.shoppinglist.server;

import com.sdcc.shoppinglist.utils.LogEntry;
import com.sdcc.shoppinglist.utils.OurProperties;
import com.sdcc.shoppinglist.utils.TimeWindow;
import consumptions.Consumptions;
import consumptions.EstimatorGrpc;
import io.github.resilience4j.circuitbreaker.CircuitBreaker;
import io.github.resilience4j.circuitbreaker.CircuitBreakerConfig;
import io.github.resilience4j.circuitbreaker.CircuitBreakerRegistry;
import io.grpc.ManagedChannelBuilder;
import io.vavr.control.Try;

import java.io.IOException;
import java.time.Duration;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.logging.Logger;

/**
 * This class schedules a periodic task that will ask consumption microservice to train the dataset,
 * sending new data about finished and expired products. Data will be retrieved from influxDB and then
 * sent to consumption via gRPC.
 */
public class ConsumptionsChronJob implements Runnable {
    private static final Logger LOGGER = Logger.getLogger(ConsumptionsChronJob.class.getSimpleName());
    private final InfluxSink influx;
    private final long initialDelay;
    private final boolean startNow;
    public static final int TEST = 2 * 60;
    // public static final int WEEK = 7;
    public static final String TRANSACTION_ADD = "add_product_to_pantry";
    public static final String TRANSACTION_ADD_BUY = "add_bought_products_to_pantry";
    public static final String TRANSACTION_USE = "use_product_in_pantry";
    private final CircuitBreaker circuitBreaker;

    /**
     * Constructor
     * @param influx the influxSink instance
     * @param startNow true if you want to schedule the chron job starting from now. If false, it will run the next week.
     */
    public ConsumptionsChronJob(InfluxSink influx, boolean startNow) {
        this.influx = influx;
        var now = ZonedDateTime.now(ZoneId.of("America/Los_Angeles"));
        var nextRun = now.withHour(0).withMinute(0).withSecond(0);
        if (now.compareTo(nextRun) > 0)
            nextRun = nextRun.plusSeconds(TEST); // this is for release: plusDays(WEEK)

        var duration = Duration.between(now, nextRun);
        this.initialDelay = duration.getSeconds();
        this.startNow = startNow;
        var circuitBreakerConfig = CircuitBreakerConfig.custom()
                .failureRateThreshold(50)
                .waitDurationInOpenState(Duration.ofMillis(1000))
                .permittedNumberOfCallsInHalfOpenState(2)
                .slidingWindowSize(2)
                .recordExceptions(IOException.class, TimeoutException.class)
                .build();
        this.circuitBreaker = CircuitBreakerRegistry.of(circuitBreakerConfig).circuitBreaker("predict request from summary");
    }

    /**
     * Schedules the chron job every week, to ask consumptions to predict product usage of the next week.
     */
    public void scheduleWeekly() {
        var scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(this,
                startNow ? 0L : initialDelay,
                TimeUnit.SECONDS.toSeconds(TEST), // this is for release: TimeUnit.DAYS.toSeconds(WEEK),
                TimeUnit.SECONDS);
    }

    /**
     * This method will be executed weekly by the chron job and it is blocking.
     * It uses influx to get LogEntries sent from Product Storage with terminated or expired products.
     * Then uses Resilience4j to  communicate with consumptions, to send to it the new product information and train the model.
     */
    public void blockingExecution() {
        LOGGER.info("Chron-job: Sending consumption week data!");
        // Get the data
        List<LogEntry> logs = influx.getLogEntriesFromInflux(TimeWindow.Test);
        LOGGER.info("Chron-job: LOGS:" + logs);
        LOGGER.info("Chron-job: Connecting to consumptions!");
        Properties properties = OurProperties.getProperties();
        var consumptionsAddress = properties.getProperty("ConsumptionsAddress");
        var consumptionsPort = Integer.parseInt(properties.getProperty("ConsumptionsPort"));
        // If the connection cannot be established rapidly, the circuit breaker ends this method.
        var channel = ManagedChannelBuilder.forAddress(consumptionsAddress, consumptionsPort)
                .usePlaintext()
                .build();
        // Create the channel
        LOGGER.info("Chron-job: Successfully connected to consumptions");
        // Create the client
        var client = EstimatorGrpc.newBlockingStub(channel);

        // Build the request parameter
        var trainRequest = Consumptions.TrainRequest.newBuilder()
                .addAllObservations(convertLogsToObservations(logs)) // convert LogEntry to Observations for consumptions microservice
                .setCurrentDate(new Date().getTime())
                .build();
        LOGGER.info("Chron-job: Sending training request to consumptions service!");
        // Sends the request, using the Resilience4j circuit breaker.
        var responseSupplier = circuitBreaker.decorateSupplier(() -> {
            Consumptions.TrainResponse trainResponse = client.trainModel(trainRequest);
            LOGGER.info(trainResponse.getMsg());
            return trainResponse;
        });
        // waits and gets the response if the consumption microservice is up, or else will return an error message.
        Consumptions.TrainResponse trainResponse = Try.ofSupplier(responseSupplier)
                .toJavaOptional()
                .orElse(Consumptions.TrainResponse.newBuilder().setMsg("Failed to receive training response").build());

        circuitBreaker.reset();
        LOGGER.info("Training Response: " + trainResponse);
        try {
            // Synchronously waits the response
            channel.shutdownNow().awaitTermination(15, TimeUnit.SECONDS);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void run() {
        blockingExecution();
    }

    /**
     * Utility function to convert LogEntry into Consumption.Observation object.
     * @param logEntries a list of LogEntry, retrieved by Influx
     * @return a list of object to send to consumptions
     */
    private List<Consumptions.Observation> convertLogsToObservations(List<LogEntry> logEntries) {
        Consumptions.Observation.Builder observationBuilder = Consumptions.Observation.newBuilder();
        List<Consumptions.Observation> list = new ArrayList<>();
        for (LogEntry logEntry : logEntries) {
            observationBuilder.setRequestType(toObservationType(logEntry));
            observationBuilder.setProductName(logEntry.product_name());
            observationBuilder.setQuantity(logEntry.quantity());
            list.add(observationBuilder.build());
        }
        System.out.println("observations = " + list);
        return list;
    }

    /**
     * Gets the transaction type from the logEntry and converts it to Observation type, to correctly update the consumptions' dataset.
     * @param logEntry a single LogEntry, with a transaction type
     * @return the observation type. If the log entry is expired, the observation type will be expired, otherwise added. If the product is used so will be the observation type.
     */
    private Consumptions.ObservationType toObservationType(LogEntry logEntry) {
        System.out.println("transaction type: "+logEntry.transaction_type());
        return switch (logEntry.transaction_type()) {
            case TRANSACTION_USE -> Consumptions.ObservationType.used;
            case TRANSACTION_ADD_BUY, TRANSACTION_ADD -> logEntry.isExpired() ? Consumptions.ObservationType.expired : Consumptions.ObservationType.added;
            default -> Consumptions.ObservationType.added;
        };
    }
}
