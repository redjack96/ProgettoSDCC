package com.sdcc.shoppinglist.server.utils;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Properties;

public class OurProperties {
    public static Properties getProperties(){
        Properties prop = new Properties();
        try {
            InputStream stream = new FileInputStream("src/main/resources/config.properties");
            prop.load(stream);
            stream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return prop;
    }
}
