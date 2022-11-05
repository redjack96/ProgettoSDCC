package com.sdcc.shoppinglist.server;

import com.influxdb.client.InfluxDBClient;
import com.sdcc.shoppinglist.utils.LogEntry;

public class InfluxThread implements Runnable {
    private LogEntry payload;
    private InfluxSink influx;

    public InfluxThread(LogEntry payload, InfluxSink influx) {
        this.payload = payload;
        this.influx = influx;
    }

    public void run() {
        System.out.println("Hello from a thread!");
        // adding log entry to influxDB
        influx.addLogEntryToInflux(payload);
    }
}
