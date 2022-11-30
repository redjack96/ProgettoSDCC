package com.sdcc.shoppinglist.utils;

import com.sdcc.shoppinglist.summary.Period;
import com.sdcc.shoppinglist.summary.SummaryData;
import com.sdcc.shoppinglist.utils.structure.Tuple2;

import java.util.*;
import java.util.stream.Collectors;

public class SummaryBuilder {

    public SummaryBuilder() {
    }

    /**
     * Calculates the times the user bought a product in the selected period
     * @param entries log entries of the selected period
     * @return times the user bought a product
     */
    public int calculateTimesBought(List<LogEntry> entries) {
        return Math.toIntExact(entries.stream()
                .filter(entry -> entry.transaction_type().contains("add"))
                .count());
    }

    /**
     * Calculates the number of expired products in the selected period
     * @param entries log entries of the selected period
     * @return the number of expired products
     */
    public int calculateNumberExpired(List<LogEntry> entries) {
        // Get today's timestamp
        return Math.toIntExact(entries.stream()
                .filter(LogEntry::isExpired)
                .filter(entry -> entry.transaction_type().contains("add"))
                .count());
    }

    /**
     * Calculates the times the user used a product in the selected period
     * @param entries log entries of the selected period
     * @return times the user used a product
     */
    public int calculateNumberUsed(List<LogEntry> entries) {
        return Math.toIntExact(entries.stream()
                .filter(entry -> Objects.equals(entry.transaction_type(), "use_product_in_pantry"))
                .count());
    }

    /**
     * Calculates the most bought product in the selected period
     * @param entries log entries of the selected period
     * @return the name of the most bought product
     */
    public String calculateMostBoughtProduct(List<LogEntry> entries) {
        Map<String, Integer> add = entries.stream()
                .filter(entry -> entry.transaction_type().contains("add"))
                .map(entry -> new Tuple2<>(entry.product_name(), 1)) // trasforma tutto in tuple (nome, 1)
                .collect(Collectors.groupingBy(Tuple2::getKey, Collectors.summingInt(Tuple2::getValue))); // somma elementi raggruppando per chiave

        if (add.isEmpty()) return "";

        // recupera chiave corrispondente al valore massimo
        return Collections.max(add.entrySet(), Comparator.comparingInt(Map.Entry::getValue)).getKey();
    }

    /**
     * Calculates the most used product in the selected period
     * @param entries log entries of the selected period
     * @return the name of the most used product
     */
    public String calculateMostUsedProduct(List<LogEntry> entries) {
        Map<String, Integer> add = entries.stream()
                .filter(entry -> entry.transaction_type().contains("use"))
                .map(entry -> new Tuple2<>(entry.product_name(), 1)) // trasforma tutto in tuple (nome, 1)
                .collect(Collectors.groupingBy(Tuple2::getKey, Collectors.summingInt(Tuple2::getValue))); // somma elementi raggruppando per chiave

        if (add.isEmpty()) return "";

        // recupera chiave corrispondente al valore massimo
        return Collections.max(add.entrySet(), Comparator.comparingInt(Map.Entry::getValue)).getKey();
    }

    /**
     * Converts a list of log entries to SummaryData that is to be returned to client on demand
     * @param entries log entries
     * @param timeWindow time period selected (Weekly, Monthly, Total)
     * @return a SummaryData instance
     */
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
