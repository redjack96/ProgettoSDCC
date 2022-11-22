package com.sdcc.shoppinglist.serde;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sdcc.shoppinglist.utils.LogEntry;
import org.apache.kafka.common.serialization.Deserializer;

import java.io.IOException;
import java.util.Map;

/**
 * Can be used to deserialize a JSON string into a LogEntry
 */
public class JsonDeserializer implements Deserializer<LogEntry> {
    private final ObjectMapper objectMapper = new ObjectMapper();
    LogEntry logEntry;

    public JsonDeserializer() {
        objectMapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
    }

    @Override
    public void configure(Map configs, boolean isKey) {}

    @Override
    public LogEntry deserialize(String s, byte[] bytes) {
        if (bytes.length == 0) {
            return null;
        }
        try {
            logEntry = objectMapper.readValue(bytes, LogEntry.class);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return logEntry;
    }

    @Override
    public void close() {}
}