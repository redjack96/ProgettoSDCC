package com.sdcc.shoppinglist.utils;

public record LogEntry(long log_timestamp, String transaction_type, String product_name, int quantity, String unit, String product_type, long expiration_date){
}