package com.sdcc.shoppinglist.server;

import com.sdcc.shoppinglist.server.serde.JsonDeserializer;
import com.sdcc.shoppinglist.server.utils.Product;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;
import org.apache.kafka.common.serialization.StringDeserializer;

import java.time.Duration;
import java.util.Arrays;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Pattern;

/**
 * Receives notifications from the other microservices polling a Kafka broker
 */
public class NotificationConsumer {

    public static void main(String[] args) throws InterruptedException {
        final Logger log = Logger.getLogger(NotificationConsumer.class.getSimpleName());
        log.setLevel(Level.INFO);
        final var url = "kafka://kafka:9092";

        final Properties props = new Properties();
        props.put("bootstrap.servers", url);
        props.put("group.id", "consumer");
        props.put("enable.auto.commit", "true");
        props.put("auto.offset.reset", "earliest");
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", JsonDeserializer.class);
        try (Consumer<Long, Product> consumer = new KafkaConsumer<>(props)) {
            System.out.println("Waiting some time for kafka to initialize");
            Thread.sleep(15);
            System.out.println("Now it is time to subscribe!");
            consumer.subscribe(Arrays.asList("consumed", "expired"));

            log.info("Starting receiving notifications");
            while (true) {
                final ConsumerRecords<Long, Product> consumerRecords = consumer.poll(Duration.ofMillis(1000));
                if (consumerRecords.count() == 0) {
                    log.info("No notifications to show");
                } else {
                    consumerRecords.forEach(longStringConsumerRecord -> {
                        String topic = longStringConsumerRecord.topic();
                        Product payload = longStringConsumerRecord.value();
                        log.log(Level.INFO, "Found notification!!! Topic:"+topic+" - Record:"+payload);
                    });
                }
                consumer.commitAsync();
            }
        }

    }
}