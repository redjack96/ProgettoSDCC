package com.sdcc.shoppinglist.server;

import com.sdcc.shoppinglist.server.utils.Product;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.args.ExpiryOption;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.logging.Logger;

import static com.sdcc.shoppinglist.server.NotificationConsumer.EXPIRED;
import static com.sdcc.shoppinglist.server.NotificationConsumer.FINISHED;

/**
 * This class uses a Redis Set to add and get all
 */
public class RedisCache {
    private static final Logger LOGGER = Logger.getLogger(RedisCache.class.getSimpleName());
    private final Jedis jedis;

    public static final int TEN_MINUTES = 10*60;
    private final int expiration;

    public int getExpiration() {
        return expiration;
    }

    public RedisCache() {
        this.jedis = new Jedis("redis-notification", 6379);
        this.expiration = 20;  // FIXME: TEN_MINUTES
    }

    public void cleanup(){
        this.jedis.close();
    }
    private String createKeyForSet(String topic, boolean isNew) {
        return isNew ? "NEW-" + topic : "OLD-" + topic;
    }

    private String createMemberForSet(Product product) {
        return product.name() + "-" + product.unit() + "-" + product.item_type();
    }

    public void setNotificationIfNotExist(String topic, Product product) {
        // if the expired/finished product doesn't exists both as NEW and OLD, adds it to the keys with value NEW
        // Key example: Expired-Pane  Value example: NEW // More Expired-Pane is not added. More Finished-Pane will replace expired pane as NEW.
        // An expired or finished new item will be added as a new key value pair
        // Key example: Finished-Pesce Value example: OLD // more Finished Pesce will not be added. More Expired Pesce will be added as NEW and this one will be deleted
        // otherwise it does nothing

        // if the key doesn't exist, nothing will be done
        var key = createKeyForSet(topic, true);
        var otherKey = createKeyForSet(topic, false);
        var member = createMemberForSet(product);
        // if the NEW or the OLD set already contains the member, nothing will be done
        if (!(jedis.sismember(key, member) || jedis.sismember(otherKey, member))) {
            jedis.sadd(key, member);
        }
    }

    public String consumeNewExpiredNotifications() {
        var str = "The following products are expired: " + consumeNotifications(EXPIRED);
        LOGGER.info(str);
        return str;
    }

    public String consumeNewFinishedNotifications() {
        var str = "You run out of the following products: " + consumeNotifications(FINISHED) + ". Do you want to add them to the shopping list?";
        LOGGER.info(str);
        return str;
    }

    private String consumeNotifications(String topic) {
        // finds all the NEW notification that are about <topic>
        var setKey = createKeyForSet(topic, true);
        LOGGER.info(">>>>>>><<setKey>>>>>>>>>>>>> " + setKey);
        String[] newNotifications = jedis.smembers(setKey).toArray(String[]::new);
        if (newNotifications.length == 0) {
            LOGGER.info("No new notifications");
            return "";
        }
        LOGGER.info(">>>>>>>>>>>>>>>>>>>>>" + Arrays.toString(newNotifications));
        jedis.srem(setKey, newNotifications);
        // also adds them to the set of the OLD values, if not already present
        var setKeyOld = createKeyForSet(topic, false);
        jedis.sadd(setKeyOld, newNotifications);
        // WE
        jedis.expire(setKeyOld, this.expiration);

        StringBuilder s = new StringBuilder();
        for (int i = 0, size = newNotifications.length; i < size; i++) {
            String newExpiredProduct = newNotifications[i];
            s.append(newExpiredProduct);
            if (i < size - 1) {
                s.append(", ");
            }
        }
        return s.toString();
    }
}
