package com.sdcc.shoppinglist.server;

import com.influxdb.client.InfluxDBClient;
import com.sdcc.shoppinglist.utils.LogEntry;

// This thread simply adds a new log entry to influx.
public class InfluxThread implements Runnable {
    private final LogEntry payload;
    private final InfluxSink influx;

    public InfluxThread(LogEntry payload, InfluxSink influx) {
        this.payload = payload;
        this.influx = influx;
    }

    public void run() {
        System.out.println("Hello from influx db thread!");
        // adding log entry to influxDB
        influx.addLogEntryToInflux(payload);
    }
}
