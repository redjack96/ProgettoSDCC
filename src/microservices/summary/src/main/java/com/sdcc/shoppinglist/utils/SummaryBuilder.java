package com.sdcc.shoppinglist.utils;

import com.sdcc.shoppinglist.summary.Period;
import com.sdcc.shoppinglist.summary.SummaryData;
import com.sdcc.shoppinglist.utils.structure.Tuple2;

import java.util.*;
import java.util.stream.Collectors;

public class SummaryBuilder {

    public SummaryBuilder() {
    }

    public int calculateTimesBought(List<LogEntry> entries) {
        return Math.toIntExact(entries.stream()
                .filter(entry -> entry.transaction_type().contains("add"))
                .count());
    }

    public int calculateNumberExpired(List<LogEntry> entries) {
        // Get today's timestamp
        long unixTimeNow = System.currentTimeMillis() / 1000L;
        return Math.toIntExact(entries.stream()
                .filter(entry -> entry.expiration_date() <= unixTimeNow)
                .filter(entry -> entry.transaction_type().contains("add"))
                .count());
    }

    public int calculateNumberUsed(List<LogEntry> entries) {
        return Math.toIntExact(entries.stream()
                .filter(entry -> Objects.equals(entry.transaction_type(), "use_product_in_pantry"))
                .count());
    }

    public String calculateMostBoughtProduct(List<LogEntry> entries) {
        // FIXME
        Map<String, Integer> add = entries.stream()
                .filter(entry -> entry.transaction_type().contains("add"))
                .map(entry -> new Tuple2<>(entry.product_name(), 1)) // trasforma tutto in tuple (nome, 1)
                .collect(Collectors.groupingBy(Tuple2::getKey, Collectors.summingInt(Tuple2::getValue))); // somma elementi raggruppando per chiave

        if (add.isEmpty()) return "";

        // recupera chiave corrispondente al valore massimo
        return Collections.max(add.entrySet(), Comparator.comparingInt(Map.Entry::getValue)).getKey();
    }

    public String calculateMostUsedProduct(List<LogEntry> entries) {
        //FIXME
        Map<String, Integer> add = entries.stream()
                .filter(entry -> entry.transaction_type().contains("use"))
                .map(entry -> new Tuple2<>(entry.product_name(), 1)) // trasforma tutto in tuple (nome, 1)
                .collect(Collectors.groupingBy(Tuple2::getKey, Collectors.summingInt(Tuple2::getValue))); // somma elementi raggruppando per chiave

        if (add.isEmpty()) return "";

        // recupera chiave corrispondente al valore massimo
        return Collections.max(add.entrySet(), Comparator.comparingInt(Map.Entry::getValue)).getKey();
    }

    public SummaryData mapToSummary(List<LogEntry> entries, Period timeWindow) {
        int timesBought = calculateTimesBought(entries); // totale elementi acquistati
        int numUsed = calculateNumberUsed(entries); // totale elementi usati
        int numExpired = calculateNumberExpired(entries); // totale scaduti
        String mostBought = calculateMostBoughtProduct(entries); // più acquistato
        String mostUsed = calculateMostUsedProduct(entries);


        // Build a reply of type SummaryData with the infos
        return SummaryData.newBuilder()
                .setReference(timeWindow)
                .setMostBoughtProduct(mostBought)
                .setMostUsedProduct(mostUsed)
                .setTimesUsed(numUsed)
                .setNumberExpired(numExpired)
                .setTimesBought(timesBought)
                .build();
    }
}
