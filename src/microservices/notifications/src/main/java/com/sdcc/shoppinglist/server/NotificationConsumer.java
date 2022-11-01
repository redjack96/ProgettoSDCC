package com.sdcc.shoppinglist.server;

import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.io.FileWriter;
import java.time.Duration;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Pattern;

/**
 * Receives notifications from the other microservices polling a Kafka broker
 */
public class NotificationConsumer {

    public static void main(String[] args) {
        Logger log = Logger.getLogger(NotificationConsumer.class.getSimpleName());
        var url = "kafka://kafka:9092";

        Properties props = new Properties();
        props.put("bootstrap.servers", url);
        props.put("group.id", "consumer");
        props.put("enable.auto.commit", "true");
        props.put("auto.offset.reset", "earliest");
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", StringDeserializer.class);
        try (Consumer<Long, String> consumer = new KafkaConsumer<>(props)) {
            consumer.subscribe(Pattern.compile("notification"));

            log.info("Starting receiving notifications");
            while (true) {
                final ConsumerRecords<Long, String> consumerRecords = consumer.poll(Duration.ofMillis(100));
                if (consumerRecords.count() == 0) {
                    log.fine("No notifications to show");
                } else {
                    consumerRecords.forEach(longStringConsumerRecord -> {
                        String topic = longStringConsumerRecord.topic();
                        String notificationMessage = longStringConsumerRecord.value();
                        log.log(Level.FINER, "Topic: {0} - Record: {1}",
                                Arrays.asList(topic, notificationMessage));
                    });
                }
                consumer.commitAsync();
            }
        }

    }
}