package com.sdcc.shoppinglist.server;

import io.grpc.Server;
import io.grpc.netty.NettyServerBuilder;
import io.grpc.stub.StreamObserver;
import notifications.NotificationGrpc;
import notifications.Notifications;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

public class NotificationServer implements Runnable {

    private static final Logger LOGGER = Logger.getLogger(NotificationServer.class.getSimpleName());
    public int port;
    public String address;

    @Override
    public void run() {
        System.out.println("Starting Notification gRPC server!");
        try {
            this.start();
            this.blockUntilShutdown();
        } catch (InterruptedException | IOException e) {
            e.printStackTrace();
        }
    }

    private Server server;

    public NotificationServer() {
        LOGGER.setLevel(Level.INFO);
        Properties prop = new Properties();
        try {
            InputStream stream = new FileInputStream("src/main/resources/config.properties");
            prop.load(stream);
        } catch (Exception e) {
            LOGGER.info("Config file not found: using default values.");
            e.printStackTrace();
        }
        this.port = Integer.parseInt(prop.getProperty("NotificationsPort"));
        this.address = prop.getProperty("NotificationsAddress");
    }

    private void start() throws IOException {
        SocketAddress address = new InetSocketAddress(this.address, port);
        this.server = NettyServerBuilder.forAddress(address)
                .addService(new NotificationsImpl())
                .build()
                .start();
        LOGGER.info("Server started, listening on %d".formatted(server.getPort()));
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.err.println("*** shutting down gRPC server since JVM is shutting down");
            try {
                NotificationServer.this.stop();
            } catch (InterruptedException i) {
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
        if (server != null) {
            server.awaitTermination();
        }
    }

    static final class NotificationsImpl extends NotificationGrpc.NotificationImplBase {
        @Override
        public void getNotifications(Notifications.NotificationRequest request, StreamObserver<Notifications.NotificationList> responseObserver) {
            // DO NOT EVER NEVER CALL super.getNotifications(request, responseObserver);
            LOGGER.info("Requested latest notifications!");
            RedisCache r = new RedisCache();
            try {
                // Get total data from influx db
                String notificationsExpired = r.consumeNewExpiredNotifications();
                String notificationsFinished = r.consumeNewFinishedNotifications();
                List<String> notifications = new ArrayList<>();
                if (!notificationsExpired.isEmpty()) {
                    notifications.add(notificationsExpired);
                }
                if (!notificationsFinished.isEmpty()) {
                    notifications.add(notificationsFinished);
                }

                LOGGER.log(Level.INFO, "Notifications retrieved from redis");

                var builder = Notifications.NotificationList.newBuilder();

                for (String notification : notifications) {
                    builder.addNotification(notification);
                }
                var reply = builder.build();

                System.out.println(reply);

                // deliver notifications
                responseObserver.onNext(reply); // delivers the SummaryData reply message
                responseObserver.onCompleted(); // calls the onCompleted
            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                r.cleanup();
            }
        }
    }
}
