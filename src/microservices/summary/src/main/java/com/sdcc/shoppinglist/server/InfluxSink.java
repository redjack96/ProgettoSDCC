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
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

public class InfluxSink {

    private static InfluxSink instance = null;
    private static final String BUCKET = "krakend";
    private static final String ORG = "myorg";
    private static final long WEEK_DIFF = 60 * 60 * 24 * 7;
    private static final long MONTH_DIFF = 60 * 60 * 24 * 31;
    private String url;
    private String username;
    private String password;
    private String token;
    private InfluxDBClient client;
    private static final Logger log = Logger.getLogger(InfluxSink.class.getSimpleName());

    private InfluxSink() {
    }

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
    }

    public void addLogEntryToInflux(LogEntry entry) {
        WriteApiBlocking writeApi = client.getWriteApiBlocking();
        Point point = Point.measurement("logs")
                .addTag("entry-record",
                        entry.product_name() + "-"
                        + entry.unit() + "-"
                        + entry.product_type() + "-"
                        + System.currentTimeMillis())
                .addField("transactionType", entry.transaction_type())
                .addField("prodName", entry.product_name())
                .addField("prodType", entry.product_type())
                .addField("prodUnit", entry.unit())
                .addField("prodQuantity", entry.quantity())
                .addField("prodExpiration", entry.expiration_date())
                .time(Instant.ofEpochMilli(entry.log_timestamp()), WritePrecision.MS);
        log.log(Level.INFO, "Writing point...");
        writeApi.writePoint(BUCKET, ORG, point);
        log.log(Level.INFO, "Point written.");

    }

    public List<LogEntry> getLogEntriesFromInflux(TimeWindow time) {
        long unixTimeNow = System.currentTimeMillis() / 1000L;
        long unixTimeStart;
        QueryApi queryApi = client.getQueryApi();
        List<LogEntry> entries = new ArrayList<>();
        String query = "";
        switch (time) {
            case Weekly -> {
                // time: Week
                unixTimeStart = unixTimeNow - WEEK_DIFF;
                query = "from(bucket:\"" + BUCKET + "\"" + ") " +
                        "|> range(start: 0)" +
                        "|> filter(fn: (r) => r._time >= time(v: " + unixTimeStart + "))";
            }
            case Monthly -> {
                // time: Month
                unixTimeStart = unixTimeNow - MONTH_DIFF;
                query = "from(bucket:\"" + BUCKET + "\"" + ") " +
                        "|> range(start: 0)" +
                        "|> filter(fn: (r) => r._time >= time(v: " + unixTimeStart + "))";
            }
            case Total -> {
                // time: total
                unixTimeStart = 0;
                query = "from(bucket:\"" + BUCKET + "\"" + ") " +
                        "|> range(start: " + unixTimeStart + ")";
            }
        }
        System.out.println(query);
        List<FluxTable> tables = queryApi.query(query);
        log.log(Level.INFO, "Query executed.");

        int i = 0;
        String prodName = "", transType = "", prodType = "", prodUnit = "";
        int prodQuantity = 0;
        long ts = 0, prodExpiration = 0;
        for (FluxTable table : tables) {
            i++;
            List<FluxRecord> records = table.getRecords();
            for (FluxRecord record : records) {
                ts = Objects.requireNonNull(record.getTime()).toEpochMilli();
                if (Objects.equals(record.getField(), "prodName")) {
                    prodName = String.valueOf(record.getValueByIndex(5));
                } else if (Objects.equals(record.getField(), "prodQuantity")) {
                    prodQuantity = Integer.parseInt(String.valueOf(record.getValueByIndex(5)));
                } else if (Objects.equals(record.getField(), "prodUnit")) {
                    prodUnit = String.valueOf(record.getValueByIndex(5));
                } else if (Objects.equals(record.getField(), "prodType")) {
                    prodType = String.valueOf(record.getValueByIndex(5));
                } else if (Objects.equals(record.getField(), "prodExpiration")) {
                    prodExpiration = Long.parseLong(String.valueOf(record.getValueByIndex(5)));
                } else if (Objects.equals(record.getField(), "transactionType")) {
                    transType = String.valueOf(record.getValueByIndex(5));
                }
            }
            if (i % 6 == 0) {
//                System.out.println(transType+"-"+prodName+"-"+prodType+"-"+prodUnit+"-"+prodQuantity+"-"+prodExpiration);
                LogEntry entry = new LogEntry(ts,
                        transType,
                        prodName,
                        prodQuantity,
                        prodUnit,
                        prodType,
                        prodExpiration);
                entries.add(entry);
                prodName = "";
                transType = "";
                prodType = "";
                prodUnit = "";
                prodQuantity = 0;
                prodExpiration = 0;
                ts = 0;
            }
        }

        return entries;
    }
}
