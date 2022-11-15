package com.sdcc.shoppinglist.server;

public class Main {
    public static void main(String[] args) {
        new Thread(new NotificationConsumer()).start();
        new Thread(new NotificationServer()).start();
    }
}
