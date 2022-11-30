use std::collections::HashMap;
use std::fs::File;
use std::io::BufReader;
use std::path::Path;
use std::string::ToString;
use java_properties::PropertiesError;

#[derive(Default)]
pub struct Properties {
    pub shopping_list_port: i32,
    pub shopping_list_address: String,
    pub product_storage_port: i32,
    pub product_storage_address: String,
    pub recipes_port: i32,
    pub recipes_address: String,
    pub consumptions_port: i32,
    pub consumptions_address: String,
    pub notifications_port: i32,
    pub notifications_address: String,
    pub summary_port: i32,
    pub summary_address: String,
    pub api_gateway_port: i32,
    pub api_gateway_address: String,
    pub frontend_port: i32,
    pub frontend_address: String,
    pub mongodb_port: i32,
    pub mongodb_address: String,
    pub cassandra_port: i32,
    pub cassandra_address: String,
    pub redis_recipes_port: i32,
    pub redis_recipes_address: String,
    pub influx_port: i32,
    pub influx_address: String,
    pub redis_notifications_port: i32,
    pub redis_notifications_address: String,
    pub kafka_port: i32,
    pub kafka_address: String,
}

const DEFAULT_PORT : &str = "0";
const DEFAULT_ADDR : &str = "localhost";

fn get_port_or_default(map: &HashMap<String, String>, key: &str) -> i32 {
    map.get(key).unwrap_or(&DEFAULT_PORT.to_string()).parse().unwrap_or(0)
}
fn get_addr_or_default(map: &HashMap<String, String>, key: &str) -> String {
    map.get(key).unwrap_or(&DEFAULT_ADDR.to_string()).to_string()
}

/// Reads the properties file to get ports and addresses of microservices
/// returns: Properties read
pub fn get_properties() -> Properties {
    let f = File::open(Path::new("config.properties"));
    let x: Result<HashMap<String, String>, PropertiesError> = java_properties::read(BufReader::new(f.unwrap()));
    match x {
        Ok(map) => Properties {
            shopping_list_port: get_port_or_default(&map, "ShoppingListPort"),
            shopping_list_address: get_addr_or_default(&map, "ShoppingListAddress"),
            product_storage_port: get_port_or_default(&map, "ProductStoragePort"),
            product_storage_address: get_addr_or_default(&map, "ProductStorageAddress"),
            recipes_port: get_port_or_default(&map, "RecipesPort"),
            recipes_address: get_addr_or_default(&map, "RecipesAddress"),
            consumptions_port: get_port_or_default(&map, "ConsumptionsPort"),
            consumptions_address: get_addr_or_default(&map, "ConsumptionsAddress"),
            notifications_port: get_port_or_default(&map, "NotificationsPort"),
            notifications_address: get_addr_or_default(&map, "NotificationsAddress"),
            summary_port: get_port_or_default(&map, "SummaryPort"),
            summary_address: get_addr_or_default(&map, "SummaryAddress"),
            api_gateway_port: get_port_or_default(&map, "ApiGatewayPort"),
            api_gateway_address: get_addr_or_default(&map, "ApiGatewayAddress"),
            frontend_port: get_port_or_default(&map, "FrontendPort"),
            frontend_address: get_addr_or_default(&map, "FrontendAddress"),
            mongodb_port: get_port_or_default(&map, "MongoDBPort"),
            mongodb_address: get_addr_or_default(&map, "MongoDBAddress"),

            cassandra_port: get_port_or_default(&map, "CassandraPort"),
            cassandra_address: get_addr_or_default(&map, "CassandraAddress"),
            redis_recipes_port: get_port_or_default(&map, "RedisRecipesPort"),
            redis_recipes_address: get_addr_or_default(&map, "RedisRecipesAddress"),
            influx_port: get_port_or_default(&map, "InfluxPort"),
            influx_address: get_addr_or_default(&map, "InfluxAddress"),
            redis_notifications_port: get_port_or_default(&map, "RedisNotificationsPort"),
            redis_notifications_address: get_addr_or_default(&map, "RedisNotificationsAddress"),
            kafka_port: get_port_or_default(&map, "KafkaPort"),
            kafka_address: get_addr_or_default(&map, "KafkaAddress"),
        },
        Err(_) => Properties::default(),
    }
}