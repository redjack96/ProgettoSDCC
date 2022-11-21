package com.sdcc.shoppinglist.utils;

public record LogEntry(long log_timestamp, String transaction_type, String product_name, int quantity, String unit, String product_type, long expiration_date){

    public boolean isExpired(){
        var unixTimeNow = System.currentTimeMillis() / 1000L;
        return this.expiration_date <= unixTimeNow;
    }
}