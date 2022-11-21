package com.sdcc.shoppinglist.server;

public class Main {
    public static void main(String[] args) {
        // This thread periodically checks on Kafka if more notification are present
        Thread consumerNotificationThread = new Thread(new NotificationConsumer());
        // This thread accepts incoming gRPC requests
        Thread grpcNotificationThread = new Thread(new NotificationServer());

        consumerNotificationThread.start();
        grpcNotificationThread.start();

        try {
            consumerNotificationThread.join();
            grpcNotificationThread.join();
        } catch (InterruptedException e){
            e.printStackTrace();
        }
    }
}
