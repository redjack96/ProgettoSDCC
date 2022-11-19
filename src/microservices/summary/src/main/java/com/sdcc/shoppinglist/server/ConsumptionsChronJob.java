package com.sdcc.shoppinglist.server;

import com.sdcc.shoppinglist.utils.LogEntry;
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
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.logging.Logger;

public class ConsumptionsChronJob implements Runnable {
    private static final Logger LOGGER = Logger.getLogger(ConsumptionsChronJob.class.getSimpleName());
    private final InfluxSink influx;
    private final long initialDelay;
    private final boolean startNow;
    public static final int WEEK = 7;
    public static final String TRANSACTION_ADD = "add_product_to_pantry";
    public static final String TRANSACTION_USE = "use_product_in_pantry";
    private final CircuitBreaker circuitBreaker;

    public ConsumptionsChronJob(InfluxSink influx, boolean startNow) {
        this.influx = influx;
        var now = ZonedDateTime.now(ZoneId.of("America/Los_Angeles"));
        var nextRun = now.withHour(0).withMinute(0).withSecond(0);
        if (now.compareTo(nextRun) > 0)
            nextRun = nextRun.plusSeconds(WEEK); // TODO: plusDays(WEEK)

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

    public void scheduleWeekly() {
        var scheduler = Executors.newScheduledThreadPool(1);
        scheduler.scheduleAtFixedRate(this,
                startNow ? 0L : initialDelay,
                TimeUnit.SECONDS.toSeconds(WEEK), // TODO: TimeUnit.DAYS.toSeconds(WEEK),
                TimeUnit.SECONDS);
    }

    public void blockingExecution() {
        LOGGER.info("Chron-job: Sending consumption week data!");
        // Get the data
        List<LogEntry> logs = influx.getLogEntriesFromInflux(TimeWindow.Weekly);
        LOGGER.info("Chron-job: LOGS:" + logs);
        LOGGER.info("Chron-job: Connecting to consumptions!");
        // If the connection cannot be established rapidly, the circuit breaker ends this method.
        var channel = ManagedChannelBuilder.forAddress("consumptions", 8004)
                .usePlaintext()
                .build();
        // Create the channel
        LOGGER.info("Chron-job: Successfully connected to consumptions");
        // Create the client
        var client = EstimatorGrpc.newBlockingStub(channel);
        // convert LogEntry to Observations for consumptions microservice

        // Build the request parameter
        var trainRequest = Consumptions.TrainRequest.newBuilder()
                .addAllObservations(convertLogsToObservations(logs))
                .setCurrentDate(new Date().getTime())
                .build();
        LOGGER.info("Chron-job: Sending training request to consumptions service!");
        // Sends the request
        var responseSupplier = circuitBreaker.decorateSupplier(() -> {
            Consumptions.TrainResponse trainResponse = client.trainModel(trainRequest);
            LOGGER.info(trainResponse.getMsg());
            return trainResponse;
        });

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

    private List<Consumptions.Observation> convertLogsToObservations(List<LogEntry> logEntries) {
        Consumptions.Observation.Builder observationBuilder = Consumptions.Observation.newBuilder();
        List<Consumptions.Observation> list = new ArrayList<>();
        for (LogEntry logEntry : logEntries) {
            observationBuilder.setRequestType(toObservationType(logEntry));
            observationBuilder.setProductName(logEntry.product_name());
            observationBuilder.setQuantity(logEntry.quantity());
            list.add(observationBuilder.build());
        }
        return list;
    }

    private Consumptions.ObservationType toObservationType(LogEntry logEntry) {
        return switch (logEntry.transaction_type()) {
            case TRANSACTION_USE -> Consumptions.ObservationType.used;
            case TRANSACTION_ADD -> logEntry.isExpired() ? Consumptions.ObservationType.expired : Consumptions.ObservationType.added;
            default -> Consumptions.ObservationType.added;
        };
    }
}
