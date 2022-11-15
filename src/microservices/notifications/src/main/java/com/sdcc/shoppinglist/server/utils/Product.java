package com.sdcc.shoppinglist.server.utils;

public record Product(String name, ProductType item_type, Unit unit, int quantity) {

    public Product(String name) {
        this(name, 1);
    }

    public Product(String name, int quantity) {
        this(name, ProductType.Other, Unit.Packet, quantity);
    }

}
