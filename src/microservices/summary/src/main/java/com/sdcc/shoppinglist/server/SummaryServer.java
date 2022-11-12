package com.sdcc.shoppinglist.server;

import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.sdcc.shoppinglist.summary.Period;
import com.sdcc.shoppinglist.summary.SummaryData;
import com.sdcc.shoppinglist.summary.SummaryGrpc;
import com.sdcc.shoppinglist.summary.SummaryRequest;
import com.sdcc.shoppinglist.utils.LogEntry;
import com.sdcc.shoppinglist.utils.SummaryBuilder;
import com.sdcc.shoppinglist.utils.TimeWindow;
import consumptions.Consumptions;
import consumptions.EstimatorGrpc;
import io.grpc.ManagedChannelBuilder;
import io.grpc.Server;
import io.grpc.netty.NettyServerBuilder;
import io.grpc.stub.StreamObserver;
import org.jetbrains.annotations.NotNull;

import java.util.Date;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.util.concurrent.TimeUnit;

/**
 * Produces a summary with some infos of the Distributed Storage
 */
public class SummaryServer {
    private static final Logger LOGGER = Logger.getLogger(SummaryServer.class.getSimpleName());
    public static final int PORT = 8006;
    private static InfluxSink influx;
    private Server server;

    public SummaryServer() {
        LOGGER.setLevel(Level.INFO);
    }

    private void start() throws IOException {
        SocketAddress address = new InetSocketAddress("summary", PORT);
        this.server = NettyServerBuilder.forAddress(address)
                .addService(new SummaryImpl())
                .build()
                .start();
        LOGGER.info("Server started, listening on %d".formatted(server.getPort()));
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.err.println("*** shutting down gRPC server since JVM is shutting down");
            try {
                SummaryServer.this.stop();
            } catch(InterruptedException i){
                i.printStackTrace(System.err); // SO that it prints on the System console
            }
            System.err.println("*** server shut down");
        }));
    }

    private void stop() throws InterruptedException {
        if (server != null) {
            server.shutdown().awaitTermination(30, TimeUnit.SECONDS);
            influx.getClient().close();
        }
    }

    private void blockUntilShutdown() throws InterruptedException {
        if(server != null){
            server.awaitTermination();
        }
    }

    public static void main(String[] args) throws IOException, InterruptedException{
        final var server = new SummaryServer();
        server.start();
        // Connecting to InfluxDB
        System.out.println("Trying connection to influxDB");
        influx = InfluxSink.getInstance(
                "http://influxdb:8086",
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

    static final class SummaryImpl extends SummaryGrpc.SummaryImplBase{
        @Override
        public void weekSummary(SummaryRequest request, StreamObserver<SummaryData> responseObserver) {
            LOGGER.info("Java Received: %s products".formatted(request));
            LOGGER.info("Getting log entries from influxdb...");
            // Get last week data from influx db
            List<LogEntry> logs = influx.getLogEntriesFromInflux(TimeWindow.Weekly);
            LOGGER.log(Level.INFO, "Logs retrieved from influx in the selected period: "+logs);
            // Calculate the summary data
            SummaryBuilder summary = new SummaryBuilder();
            SummaryData reply = summary.mapToSummary(logs, Period.Weekly);
            // deliver message
            responseObserver.onNext(reply); // delivers the SummaryData reply message
            responseObserver.onCompleted(); // calls the onCompleted
        }

        @Override
        public void monthSummary(SummaryRequest request, StreamObserver<SummaryData> responseObserver) {
            LOGGER.info("Java Received: %s products".formatted(request));
            LOGGER.info("Getting log entries from influxdb...");
            // Get last month data from influx db
            List<LogEntry> logs = influx.getLogEntriesFromInflux(TimeWindow.Monthly);
            LOGGER.log(Level.INFO, "Logs retrieved from influx in the selected period: "+logs);
            // Calculate the summary data
            SummaryBuilder summary = new SummaryBuilder();
            SummaryData reply = summary.mapToSummary(logs, Period.Monthly);
            // deliver message
            responseObserver.onNext(reply); // delivers the SummaryData reply message
            responseObserver.onCompleted(); // calls the onCompleted
        }

        @Override
        public void totalSummary(SummaryRequest request, StreamObserver<SummaryData> responseObserver) {
            LOGGER.info("Java Received: %s products".formatted(request));
            LOGGER.info("Getting log entries from influxdb...");
            // Get total data from influx db
            List<LogEntry> logs = influx.getLogEntriesFromInflux(TimeWindow.Total);
            LOGGER.log(Level.INFO, "Logs retrieved from influx in the selected period: "+logs);
            // Calculate the summary data
            SummaryBuilder summary = new SummaryBuilder();
            SummaryData reply = summary.mapToSummary(logs, Period.Total);
            // deliver message
            responseObserver.onNext(reply); // delivers the SummaryData reply message
            responseObserver.onCompleted(); // calls the onCompleted
        }
    }
}