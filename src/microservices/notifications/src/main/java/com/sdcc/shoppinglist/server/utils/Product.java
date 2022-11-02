package com.sdcc.shoppinglist.server.utils;

public record Product(String name, ProductType item_type, Unit unit, int quantity) { }
