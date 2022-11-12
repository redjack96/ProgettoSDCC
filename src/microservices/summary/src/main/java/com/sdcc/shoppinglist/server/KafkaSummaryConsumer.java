package com.sdcc.shoppinglist.server;

import com.influxdb.client.InfluxDBClient;
import com.sdcc.shoppinglist.serde.JsonDeserializer;
import com.sdcc.shoppinglist.utils.LogEntry;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import java.time.Duration;
import java.util.List;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

public class KafkaSummaryConsumer implements Runnable {
    private static final Logger log = Logger.getLogger(KafkaSummaryConsumer.class.getSimpleName());
    private final InfluxSink influx;

    public KafkaSummaryConsumer(InfluxSink influx){
        log.setLevel(Level.INFO);
        this.influx = influx;
    }

    @Override
    public void run() {
        final var url = "kafka://kafka:9092";
        final Properties props = new Properties();
        props.put("bootstrap.servers", url);
        props.put("group.id", "consumer");
        props.put("enable.auto.commit", "true");
        props.put("auto.offset.reset", "earliest");
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", JsonDeserializer.class);
        try (Consumer<Long, LogEntry> consumer = new KafkaConsumer<>(props)) {
            System.out.println("Waiting some time for kafka to initialize");
            Thread.sleep(15);
            System.out.println("Now it is time to subscribe!");
            consumer.subscribe(List.of("logs"));

            log.info("Starting receiving notifications");
            while (true) {
                final ConsumerRecords<Long, LogEntry> consumerRecords = consumer.poll(Duration.ofMillis(5000));
                if (consumerRecords.count() == 0) {
                    log.info("No logs to analyze");
                } else {
                    consumerRecords.forEach(longStringConsumerRecord -> {
                        String topic = longStringConsumerRecord.topic();
                        LogEntry payload = longStringConsumerRecord.value();
                        log.log(Level.INFO, "Found logs!!! Topic:"+topic+" - Record:"+payload);
                        // adding log entry to influxDB
                        log.log(Level.INFO, "Adding log entry to the influxDB database");
                        try {
                            InfluxThread influxThread = new InfluxThread(payload, influx);
                            Thread t = new Thread(influxThread);
                            t.start();
                            t.join();
                        } catch (InterruptedException e) {
                            throw new RuntimeException(e);
                        }
                        log.log(Level.INFO, "Added log entry to the influxDB database");
                    });
                }
                consumer.commitAsync();
            }
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
