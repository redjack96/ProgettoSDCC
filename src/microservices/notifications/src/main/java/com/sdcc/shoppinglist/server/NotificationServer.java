package com.sdcc.shoppinglist.server;

import com.sdcc.shoppinglist.server.utils.Product;
import io.grpc.Server;
import io.grpc.netty.NettyServerBuilder;
import io.grpc.stub.StreamObserver;
import notifications.NotificationGrpc;
import notifications.Notifications;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.logging.Level;
import java.util.logging.Logger;

import static com.sdcc.shoppinglist.server.NotificationConsumer.EXPIRED;

public class NotificationServer implements Runnable {

    private static final Logger LOGGER = Logger.getLogger(NotificationServer.class.getSimpleName());
    public static final int PORT = 8005;

    // TODO remove
    private void redisTest() {
        RedisCache r = new RedisCache();
        r.setNotificationIfNotExist(EXPIRED, new Product("Prova"));
        int timeLeft = 20;
        System.out.println("Added Prova to Expired-NEW. Time left: 20");
        while (timeLeft > 0) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            System.out.println("Time left: " + --timeLeft);
        }
        System.out.println("Added Prova to Expired-OLD. You have " + r.getExpiration() + " seconds to see it.");
        r.consumeNewExpiredNotifications();
        timeLeft = r.getExpiration();
        while (timeLeft > 0) {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            System.out.println("Time left: " + --timeLeft);
        }
        r.cleanup();
    }

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
    }

    private void start() throws IOException {
        SocketAddress address = new InetSocketAddress("notifications", PORT);
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