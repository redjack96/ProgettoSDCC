package com.sdcc.shoppinglist.server;

import com.sdcc.shoppinglist.summary.SummaryData;
import com.sdcc.shoppinglist.summary.SummaryGrpc;
import io.grpc.Server;
import io.grpc.ServerBuilder;
import io.grpc.stub.StreamObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import product_storage.ProductStorageOuterClass;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

/**
 * Receives notifications from the other microservices polling a Kafka broker
 */
public class SummaryServer {
    private static final Logger LOGGER = LoggerFactory.getLogger(SummaryServer.class);
    public static final int PORT = 50051;

    private Server server;

    private void start() throws IOException {
        this.server = ServerBuilder.forPort(PORT)
                .addService(new SummaryImpl())
                .build()
                .start();
        LOGGER.info("Server started, listening on %d".formatted(PORT));
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
        server.blockUntilShutdown();
    }

    static class SummaryImpl extends SummaryGrpc.SummaryImplBase{
        @Override
        public void weekSummary(ProductStorageOuterClass.Pantry request, StreamObserver<SummaryData> responseObserver) {
            LOGGER.info("Java Received: %s products".formatted(request.getProductsCount()));
            SummaryData reply = SummaryData.newBuilder()
                    //.setNomeCampo(..)
                    .build();
            responseObserver.onNext(reply); // delivers the SummaryData reply message
            responseObserver.onCompleted(); // calls the onCompleted
        }

        @Override
        public void monthSummary(ProductStorageOuterClass.Pantry request, StreamObserver<SummaryData> responseObserver) {
            LOGGER.info("Java Received: %s products".formatted(request.getProductsCount()));
            SummaryData reply = SummaryData.newBuilder()
                    //.setNomeCampo(..)
                    .build();
            responseObserver.onNext(reply); // delivers the SummaryData reply message
            responseObserver.onCompleted(); // calls the onCompleted
        }

        @Override
        public void totalSummary(ProductStorageOuterClass.Pantry request, StreamObserver<SummaryData> responseObserver) {
            LOGGER.info("Java Received: %s products".formatted(request.getProductsCount()));
            SummaryData reply = SummaryData.newBuilder()
                    //.setNomeCampo(..)
                    .build();
            responseObserver.onNext(reply); // delivers the SummaryData reply message
            responseObserver.onCompleted(); // calls the onCompleted
        }
    }
}