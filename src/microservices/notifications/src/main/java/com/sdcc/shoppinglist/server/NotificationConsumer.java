package com.sdcc.shoppinglist.server;

import com.sdcc.shoppinglist.server.serde.JsonDeserializer;
import com.sdcc.shoppinglist.server.utils.OurProperties;
import com.sdcc.shoppinglist.server.utils.Product;
import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.KafkaConsumer;

import java.time.Duration;
import java.util.Arrays;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Receives notifications from the other microservices polling a Kafka broker
 */
public class NotificationConsumer implements Runnable {

    public static final String EXPIRED = "expired";
    public static final String FINISHED = "consumed";


    @Override
    public void run() {
        final Logger log = Logger.getLogger(NotificationConsumer.class.getSimpleName());
        log.setLevel(Level.INFO);
        Properties properties = OurProperties.getProperties();
        String kafkaAddr = properties.getProperty("KafkaAddress");
        int kafkaPort = Integer.parseInt(properties.getProperty("KafkaPort"));
        final var url = "kafka://%s:%d".formatted(kafkaAddr, kafkaPort); // TODO: mi sa che va messo quello parametrico. Provare a pushare e vedere se funziona su ec2.
        // final var url = "kafka://kafka:9092";

        final Properties props = new Properties();
        props.put("bootstrap.servers", url);
        props.put("group.id", "consumer");
        props.put("enable.auto.commit", "true");
        props.put("auto.offset.reset", "earliest");
        props.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer");
        props.put("value.deserializer", JsonDeserializer.class);
        final RedisCache redis = new RedisCache();
        try (Consumer<Long, Product> consumer = new KafkaConsumer<>(props)) {
            System.out.println("Waiting some time for kafka to initialize");
            Thread.sleep(15);
            System.out.println("Now it is time to subscribe!");
            consumer.subscribe(Arrays.asList(FINISHED, EXPIRED));

            log.info("Starting receiving notifications");
            while (true) {
                final ConsumerRecords<Long, Product> consumerRecords = consumer.poll(Duration.ofMillis(5000));
                if (consumerRecords.count() == 0) {
                    log.info("No notifications to show");
                } else {
                    for (ConsumerRecord<Long, Product> consumerRecord : consumerRecords) {
                        String topic = consumerRecord.topic();
                        Product payload = consumerRecord.value();
                        if (FINISHED.equals(topic)) {
                            redis.setNotificationIfNotExist(FINISHED, payload);
                        } else if (EXPIRED.equals(topic)) {
                            redis.setNotificationIfNotExist(EXPIRED, payload);
                        }
                        log.log(Level.INFO, "Found notification!!! Topic:" + topic + " - Record:" + payload);
                    }
                }
                consumer.commitAsync();
            }
        } catch (InterruptedException e) {
            log.warning("Kafka consumer thread interrupted.");
        } finally {
            redis.cleanup();
        }
    }
}