package com.sdcc.shoppinglist.utils.structure;

import org.jetbrains.annotations.NotNull;

import java.util.Comparator;

public class Tuple2<K,V extends Comparable<V>> implements Comparable<Tuple2<K,V>> {
    private K key;
    private V value;

    public Tuple2(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() {
        return key;
    }

    public void setKey(K key) {
        this.key = key;
    }

    public V getValue() {
        return value;
    }

    public void setValue(V value) {
        this.value = value;
    }


    @Override
    public int compareTo(@NotNull Tuple2<K, V> o) {
        return this.value.compareTo(o.value);
    }
}
