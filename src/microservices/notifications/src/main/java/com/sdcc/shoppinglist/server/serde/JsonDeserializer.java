package com.sdcc.shoppinglist.server.serde;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdcc.shoppinglist.server.utils.Product;
import org.apache.kafka.common.serialization.Deserializer;

import java.io.IOException;
import java.util.Map;

/**
 * Unused. Can be used to deserialize a JSON string into a SensorDataModel
 */
public class JsonDeserializer implements Deserializer<Product> {
    private final ObjectMapper objectMapper = new ObjectMapper();
    Product dataModel;

    public JsonDeserializer() {
        objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
    }

    @Override
    public void configure(Map configs, boolean isKey) {}

    @Override
    public Product deserialize(String s, byte[] bytes) {
        if (bytes.length == 0) {
            return null;
        }
        try {
            dataModel = objectMapper.readValue(bytes, Product.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return dataModel;
    }

    @Override
    public void close() {}
}