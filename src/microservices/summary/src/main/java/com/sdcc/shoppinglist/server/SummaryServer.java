package com.sdcc.shoppinglist.server;

import com.sdcc.shoppinglist.summary.Period;
import com.sdcc.shoppinglist.summary.SummaryData;
import com.sdcc.shoppinglist.summary.SummaryGrpc;
import com.sdcc.shoppinglist.summary.SummaryRequest;
import com.sdcc.shoppinglist.utils.LogEntry;
import com.sdcc.shoppinglist.utils.OurProperties;
import com.sdcc.shoppinglist.utils.SummaryBuilder;
import com.sdcc.shoppinglist.utils.TimeWindow;
import io.grpc.Server;
import io.grpc.netty.NettyServerBuilder;
import io.grpc.stub.StreamObserver;

import java.io.FileInputStream;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * A gRPC server that produces a summary with some info about the Storage products in a time period.
 */
public class SummaryServer {
    private static final Logger LOGGER = Logger.getLogger(SummaryServer.class.getSimpleName());
    public final int port;
    public final String address;
    private static InfluxSink influx;
    private Server server;

    /**
     * Constructor. Reads the properties file to set port and address.
     */
    public SummaryServer() {
        LOGGER.setLevel(Level.INFO);
        Properties prop = new Properties();
        try {
            var stream = new FileInputStream("src/main/resources/config.properties");
            prop.load(stream);
        } catch (IOException e) {
            e.printStackTrace();
        }
        this.port = Integer.parseInt(prop.getProperty("SummaryPort"));
        this.address = prop.getProperty("SummaryAddress");
    }

    /**
     * Starts the gRPC server and sets the shutdown hook, when it closes.
     *
     * @throws IOException
     */
    private void start() throws IOException {
        SocketAddress address = new InetSocketAddress(this.address, this.port);
        this.server = NettyServerBuilder.forAddress(address)
                .addService(new SummaryImpl())
                .build()
                .start();
        LOGGER.info("Server started, listening on %d".formatted(server.getPort()));
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.err.println("*** shutting down gRPC server since JVM is shutting down");
            try {
                SummaryServer.this.stop();
            } catch (InterruptedException i) {
                i.printStackTrace(System.err); // In this way, it prints on the System.err
            }
            System.err.println("*** server shut down");
        }));
    }

    /**
     * Stops the grpc server and influxDB client.
     *
     * @throws InterruptedException
     */
    private void stop() throws InterruptedException {
        if (server != null) {
            server.shutdown().awaitTermination(30, TimeUnit.SECONDS);
            influx.getClient().close();
        }
    }

    private void blockUntilShutdown() throws InterruptedException {
        if (server != null) {
            server.awaitTermination();
        }
    }

    /**
     * Runs the chron-job thread for consumption and the kafka thread.
     *
     * @param args
     * @throws IOException
     * @throws InterruptedException
     */
    public static void main(String[] args) throws IOException, InterruptedException {
        final var server = new SummaryServer();
        server.start();
        Properties properties = OurProperties.getProperties();
        var influxAddr = properties.getProperty("InfluxAddress");
        var influxPort = properties.getProperty("InfluxPort");
        // Connecting to InfluxDB
        System.out.println("Trying connection to influxDB");
        influx = InfluxSink.getInstance(
                "http://" + influxAddr + ":" + influxPort,
                "admin",
                "password",
                "token");
        System.out.println("Connected to influxDB");
        final KafkaSummaryConsumer kst = new KafkaSummaryConsumer(influx);
        System.out.println("Starting kafka consumer thread");
        new Thread(kst).start();
        System.out.println("Scheduling chron job");
        ConsumptionsChronJob consumptionsChronJob = new ConsumptionsChronJob(influx, true);
        consumptionsChronJob.scheduleWeekly();
        // new ConsumptionsChronJob(influx, true).execution();
        server.blockUntilShutdown();
    }

    // this class implements the grpc abstract class for Summary
    static final class SummaryImpl extends SummaryGrpc.SummaryImplBase {
        /**
         * This method will compute the weekly summary statistics
         * @param request a summary request, it is a simple empty object.
         * @param responseObserver used to send the result to the client.
         */
        @Override
        public void weekSummary(SummaryRequest request, StreamObserver<SummaryData> responseObserver) {
            LOGGER.info("Java Received: %s products".formatted(request));
            LOGGER.info("Getting log entries from influxdb...");
            // Get last week data from influx db
            List<LogEntry> logs = influx.getLogEntriesFromInflux(TimeWindow.Weekly);
            LOGGER.log(Level.INFO, "Logs retrieved from influx in the selected period: " + logs);
            // Calculate the summary data
            SummaryBuilder summary = new SummaryBuilder();
            SummaryData reply = summary.mapToSummary(logs, Period.Weekly);
            // deliver message
            responseObserver.onNext(reply); // delivers the SummaryData reply message
            responseObserver.onCompleted(); // calls the onCompleted
        }

        /**
         * This method will compute the monthly summary statistics
         * @param request a summary request, it is a simple empty object.
         * @param responseObserver used to send the result to the client.
         */
        @Override
        public void monthSummary(SummaryRequest request, StreamObserver<SummaryData> responseObserver) {
            LOGGER.info("Java Received: %s products".formatted(request));
            LOGGER.info("Getting log entries from influxdb...");
            // Get last month data from influx db
            List<LogEntry> logs = influx.getLogEntriesFromInflux(TimeWindow.Monthly);
            LOGGER.log(Level.INFO, "Logs retrieved from influx in the selected period: " + logs);
            // Calculate the summary data
            SummaryBuilder summary = new SummaryBuilder();
            SummaryData reply = summary.mapToSummary(logs, Period.Monthly);
            // deliver message
            responseObserver.onNext(reply); // delivers the SummaryData reply message
            responseObserver.onCompleted(); // calls the onCompleted
        }

        /**
         * This method will compute the total summary statistics
         * @param request a summary request, it is a simple empty object.
         * @param responseObserver used to send the result to the client.
         */
        @Override
        public void totalSummary(SummaryRequest request, StreamObserver<SummaryData> responseObserver) {
            LOGGER.info("Java Received: %s products".formatted(request));
            LOGGER.info("Getting log entries from influxdb...");
            // Get total data from influx db
            List<LogEntry> logs = influx.getLogEntriesFromInflux(TimeWindow.Total);
            LOGGER.log(Level.INFO, "Logs retrieved from influx in the selected period: " + logs);
            // Calculate the summary data
            SummaryBuilder summary = new SummaryBuilder();
            SummaryData reply = summary.mapToSummary(logs, Period.Total);
            // deliver message
            responseObserver.onNext(reply); // delivers the SummaryData reply message
            responseObserver.onCompleted(); // calls the onCompleted
        }
    }
}