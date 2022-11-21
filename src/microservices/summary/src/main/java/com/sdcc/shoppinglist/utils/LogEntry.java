package com.sdcc.shoppinglist.utils;

public record LogEntry(long log_timestamp, String transaction_type, String product_name, int quantity, String unit, String product_type, long expiration_date){

    public boolean isExpired(){
        var unixTimeNow = System.currentTimeMillis() / 1000L;
        boolean isExpired = this.expiration_date <= unixTimeNow;
        if (isExpired) {
            System.out.println("isExpired = " + isExpired);
        }
        return isExpired;
    }
}