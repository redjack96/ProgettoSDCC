package com.sdcc.shoppinglist.server;

import com.influxdb.client.*;
import com.influxdb.client.domain.*;
import com.influxdb.client.write.Point;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import com.sdcc.shoppinglist.utils.LogEntry;
import com.sdcc.shoppinglist.utils.TimeWindow;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

public class InfluxSink {

    private static InfluxSink instance = null;
    private static final String BUCKET = "krakend";
    private static final String ORG =  "myorg";
    private String url;
    private String username;
    private String password;
    private String token;
    private InfluxDBClient client;
    private static final Logger log = Logger.getLogger(InfluxSink.class.getSimpleName());

    private InfluxSink() {}

    public InfluxDBClient getClient() {
        return client;
    }

    public static InfluxSink getInstance(String url, String username, String password, String token) {
        if (instance == null) {
            instance = new InfluxSink();
            instance.url = url;
            instance.username = username;
            instance.password = password;
            instance.token = token;
            instance.client = instance.createConnection();
        }
        return instance;
    }

    public InfluxDBClient createConnection() {
        // You can generate an API token from the "API Tokens Tab" in the UI
        InfluxDBClientOptions options = InfluxDBClientOptions.builder()
                .org(ORG)
                .url(url)
                .authenticate(username, password.toCharArray())
                .bucket(BUCKET)
                .build();
        return InfluxDBClientFactory.create(options);
//        return InfluxDBClientFactory.create(url, username, password.toCharArray());
    }

    public void addLogEntryToInflux(LogEntry entry) {
        WriteApiBlocking writeApi = client.getWriteApiBlocking();
        Point point = Point.measurement("logs")
//                .addTag("entry-number", "log1")
                .addField("ts", entry.log_timestamp())
                .addField("transactionType", entry.transaction_type())
                .addField("prodName", entry.product_name())
                .addField("prodType", entry.product_type())
                .addField("prodUnit", entry.unit())
                .addField("prodQuantity", entry.quantity())
                .addField("prodExpiration", entry.expiration_date())
                .time(Instant.now(), WritePrecision.MS);
        log.log(Level.INFO, "Writing point...");
        writeApi.writePoint(BUCKET, ORG, point);
        log.log(Level.INFO, "Point written.");

    }

    public List<LogEntry> getLogEntryFromInflux(TimeWindow time) {

        List<LogEntry> entries = new ArrayList<>();
        String query;
        QueryApi queryApi = client.getQueryApi();
        switch (time) {
            case Weekly -> {
                // TODO time: Week
            }
            case Monthly -> {
                // TODO time: Month
            }
            case Total -> {
                query = "from(bucket:\""+BUCKET+"\""+") " +
                        "|> range(start: 0)";
                System.out.println(query);
                List<FluxTable> tables = queryApi.query(query);
                log.log(Level.INFO, "Query executed.");
                for (FluxTable table: tables) {
                    List<FluxRecord> records = table.getRecords();
                    for (FluxRecord record: records) {
                        System.out.println("measurements: "+record.getMeasurement());
                        System.out.println("row: "+record.getRow());
                        System.out.println("field: "+record.getField());
                    }
                }
                // time: total

            }
        }

        return null;
    }
}
