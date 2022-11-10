mod properties;
mod database;
extern crate serde;
extern crate serde_json;
#[macro_use]
extern crate serde_derive;

use std::collections::HashMap;
use tokio::time::sleep;
use std::cmp::max;
use chrono::{TimeZone, Utc};
use tokio::sync::Mutex;
// use kafka::Error;
// use kafka::producer::{DefaultPartitioner, Producer, Record, RequiredAcks};
use crate::database::{Database, DEFAULT_EXPIRATION, QueryType};
use tonic::{transport::Server, Request, Status, Response};
// HELP: nome_progetto::package_file_proto::nome_servizio_client::NomeServizioClient
use product_storage::product_storage::product_storage_server::{ProductStorage, ProductStorageServer};
use product_storage::product_storage::{ItemName, PantryMessage, UsedItem, Item, Pantry};
use product_storage::shopping_list::{ProductList,  ListId, Product, Timestamp};
use crate::properties::get_properties;
use rskafka::{
    client::{
        ClientBuilder,
        partition::{Compression},
    },
    record::Record,
    time::OffsetDateTime,
};

use std::string::ToString;
use std::time::Duration;
use lazy_static::lazy_static;
use rskafka::client::partition::PartitionClient;
use crate::database::QueryType::{SelectConsumed, SelectExpired};
use crate::Notify::{Consumed, Expired};
// use rskafka::client::error::Error::ServerError;

#[derive(Default)]
pub struct ProductStorageImpl {}

// enum for notification microservice
#[derive(Clone, Copy)]
pub enum Notify {
    Consumed,
    Expired,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ProductItem {
    pub name: String,
    pub item_type: i32,
    pub unit: i32,
    pub quantity: i32,
    pub expiration: i64,
    pub last_used: i64,
    pub use_number: i32,
    pub total_used_number: i32,
    pub times_is_bought: i32,
    pub buy_date: i64,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct LogEntry {
    log_timestamp: i64,
    transaction_type: String,
    product_name: String,
    quantity: i32,
    unit: String,
    product_type: String,
    expiration_date: i64,
}

impl ProductItem {
    fn from_product(p: &Product) -> Self {
        ProductItem {
            name: p.clone().product_name,
            item_type: p.r#type,
            unit: p.unit,
            quantity: p.quantity,
            expiration: p.expiration.clone().map_or(DEFAULT_EXPIRATION, |e| e.seconds),
            last_used: 0,
            use_number: 0,
            total_used_number: 0,
            times_is_bought: 1,
            buy_date: Utc::now().timestamp(),
        }
    }

    fn to_item(&self) -> Item {
        // let date_time = api_gateway::shopping_list::Timestamp::from();
        println!("Converting to item");
        let ts = Timestamp {
            seconds: self.expiration,
            nanos: 0,
        };
        Item {
            item_id: 0,
            item_name: self.name.clone(),
            r#type: self.item_type,
            unit: self.unit,
            quantity: self.quantity,
            expiration: Some(ts),
            last_used: self.last_used,
            use_number: self.use_number,
            total_used_number: self.total_used_number,
            times_is_bought: self.times_is_bought,
        }
    }

}

// const KAFKA_RETRIES: i32 = 5;
const KAFKA_TOPIC: &str = "notification";
const SUMMARY_KEY: u8 = 2;
const EXPIRED: &str = "expired";
const CONSUMED: &str = "consumed";
const LOGS: &str = "logs";

lazy_static!{
    static ref KAFKA_CLIENT_HASH_MAP: Mutex<HashMap<String, PartitionClient>> = Mutex::new(HashMap::new());
}

fn unit_to_str(unit: i32) -> String {
    let u = match unit {
        0 => "Bottle",
        2 => "Kg",
        3 => "Grams",
        _ => "Packet",
    };
    u.to_string()
}

pub fn prod_type_to_str(unit: i32) -> String {
    let u = match unit {
        0 => "Meat",
        1 => "Fish",
        2 => "Fruit",
        3 => "Vegetable",
        4 => "Drink",
        _ => "Other",
    };
    u.to_string()
}

pub fn notify_to_int(input: Notify) -> u8 {
    match input {
        Expired => 1,
        Consumed => 2
    }
}

#[tonic::async_trait] // necessary because Rust does not support async trait methods yet.
impl ProductStorage for ProductStorageImpl {
    // Adds all bought products to pantry
    async fn add_bought_products_to_pantry(&self, request: Request<ProductList>) -> Result<tonic::Response<product_storage::shopping_list::Response>, Status> {
        let msg = format!("Items Added to pantry: {}", request.get_ref().products.len());
        let product_list = request.into_inner();
        // Buy date is added to the incoming items
        // Those items must be added to the database
        println!("Adding elements received to db");
        let ts = Utc::now().timestamp();
        add_products_to_db(&product_list);
        // Send log to Kafka for summary
        let mut vec_log_entry: Vec<LogEntry> = vec![];
        for prod in product_list.products {
            let log_entry = LogEntry {
                log_timestamp: ts.clone(),
                transaction_type: "add_bought_products_to_pantry".to_string(),
                product_name: prod.product_name,
                quantity: prod.quantity, // added quantity
                unit: unit_to_str(prod.unit),
                product_type: prod_type_to_str(prod.r#type),
                expiration_date: prod.expiration.map(|e| e.seconds).unwrap_or(DEFAULT_EXPIRATION),
            };
            vec_log_entry.push(log_entry);
        }
        let kafka_client_map = KAFKA_CLIENT_HASH_MAP.lock().await;
        let partition_client = kafka_client_map.get(LOGS).expect("Impossible to get logs partition client");
        produce_logs_to_kafka(partition_client, vec_log_entry).await;
        println!("Sent log to kafka for summary");

        Ok(Response::new(product_storage::shopping_list::Response { msg }))
        // Se alla fine manca il ';' significa che stiamo restituendo l'Ok (Result)
        // In teoria questo METODO va sempre a buon fine, ma ricordiamo che è asincrono
    }

    async fn add_product_to_pantry(&self, request: Request<Item>) -> Result<Response<product_storage::shopping_list::Response>, Status> {
        let msg = format!("Item Added to pantry: {}, quantity: {}", request.get_ref().item_name, request.get_ref().quantity);
        let item = request.into_inner();
        println!("Adding single item to db");
        add_single_product_to_db(&item);
        // Send log to Kafka for summary
        let ts = Utc::now().timestamp();
        let log_entry = LogEntry {
            log_timestamp: ts,
            transaction_type: "add_product_to_pantry".to_string(),
            product_name: item.item_name,
            quantity: item.quantity, // added quantity
            unit: unit_to_str(item.unit),
            product_type: prod_type_to_str(item.r#type),
            expiration_date: item.expiration.map(|e| e.seconds).unwrap_or(DEFAULT_EXPIRATION),
        };
        let kafka_client_map = KAFKA_CLIENT_HASH_MAP.lock().await;
        let partition_client = kafka_client_map.get(LOGS).expect("Impossible to get logs partition client");
        produce_logs_to_kafka(partition_client, vec![log_entry]).await;
        println!("Sent log to kafka for summary");
        Ok(Response::new(product_storage::shopping_list::Response { msg }))
    }

    async fn drop_product_from_pantry(&self, request: Request<ItemName>) -> Result<Response<product_storage::shopping_list::Response>, Status> {
        let msg = format!("Item manually deleted from pantry: {}", request.get_ref().name);
        let item = request.into_inner();
        println!("Removing item from db");
        delete_product_from_db(item);
        Ok(Response::new(product_storage::shopping_list::Response { msg }))
    }

    async fn update_product_in_pantry(&self, request: Request<Item>) -> Result<Response<product_storage::shopping_list::Response>, Status> {
        let prod = request.into_inner();
        let msg = format!("Item manually updated in pantry: {}, quantity: {} {} ({}), expiration: {}",
                          prod.item_name, prod.quantity, unit_to_str(prod.unit), prod_type_to_str(prod.r#type),
                          Utc.timestamp(prod.expiration.as_ref().map(|t| t.seconds).unwrap_or(0), 0));
        println!("Removing item from db");
        update_product_in_db(prod);
        Ok(Response::new(product_storage::shopping_list::Response { msg }))
    }

    async fn use_product_in_pantry(&self, request: Request<UsedItem>) -> Result<Response<product_storage::shopping_list::Response>, Status> {
        let prod = request.into_inner();
        println!("prod_unit: {}", prod.unit);
        let msg = format!("Used {} {} of product {} in pantry!", prod.quantity, unit_to_str(prod.unit), prod.name);
        println!("Using item from db");
        use_product_in_db(&prod);
        // Send log to Kafka for summary
        let ts = Utc::now().timestamp();
        let log_entry = LogEntry {
            log_timestamp: ts,
            transaction_type: "use_product_in_pantry".to_string(),
            product_name: prod.name,
            quantity: prod.quantity, // added quantity
            unit: unit_to_str(prod.unit),
            product_type: prod_type_to_str(prod.item_type),
            expiration_date: DEFAULT_EXPIRATION,
        };
        let kafka_client_map = KAFKA_CLIENT_HASH_MAP.lock().await;
        let partition_client = kafka_client_map.get(LOGS).expect("Impossible to get logs partition client");
        produce_logs_to_kafka(partition_client, vec![log_entry]).await;
        println!("Sent log to kafka for summary");
        Ok(Response::new(product_storage::shopping_list::Response { msg }))
    }

    async fn get_pantry(&self, _: Request<PantryMessage>) -> Result<Response<Pantry>, Status> {
        println!("Getting pantry!");
        let products = select_pantry();
        Ok(Response::new(Pantry {
            products
        }))
    }
}

// used by add_bought_products_to_pantry
fn add_products_to_db(product_list: &ProductList) {
    println!("ListId: {:?}, ListName: {}, Number of products: {}",
             product_list.clone().id.unwrap_or(ListId { list_id: 0 }).list_id,
             product_list.name,
             product_list.products.len());

    for elem in product_list.clone().products {
        let item = ProductItem::from_product(&elem);
        let db = Database::new();

        // TODO: First check if element with same name already present in db
        let query = db.prepare_product_statement(Some(&item), QueryType::Select,
                                                 Some(0), Some(0), Some(0),
        );
        let items = db.execute_select_query(query.as_str());
        let query;
        if items.capacity() != 0 {
            // Incrementa quantità e numero acquisti e aggiorna scadenza
            query = db.prepare_product_statement(Some(&item), QueryType::UpdateExisting,
                                                 Some(items.get(0).unwrap().quantity),
                                                 Some(items.get(0).unwrap().expiration),
                                                 Some(items.get(0).unwrap().times_is_bought));
        } else {
            query = db.prepare_product_statement(Some(&item), QueryType::InsertNew,
                                                 Some(0), Some(0), Some(0),
            );
        }

        println!("{}", query);
        db.execute_insert_update_or_delete(query.as_str());
    }
}

// used by add_product_to_pantry
fn add_single_product_to_db(elem: &Item) {
    let item = elem.clone();
    println!("add single product: {}, quantity {} {}, type {}", elem.item_name, elem.quantity, unit_to_str(elem.unit), prod_type_to_str(elem.r#type));
    let item = ProductItem {
        name: item.item_name,
        item_type: item.r#type,
        unit: item.unit,
        quantity: item.quantity,
        expiration: item.expiration.map(|t| t.seconds).unwrap_or(0),
        last_used: 0,
        use_number: 0,
        total_used_number: 0,
        times_is_bought: 1,
        buy_date: Utc::now().timestamp(), // we do not know when it is bought
    };
    let db = Database::new();

    // build a select query. TODO: watch out for SQL injection!
    let query = db.prepare_product_statement(Some(&item), QueryType::Select,
                                             Some(0), Some(0), Some(0),
    );
    // First check if element with same name already present in db
    let items = db.execute_select_query(query.as_str());
    let query;
    if items.capacity() > 0 {
        // Increments quantity and updates expiration if the item is already present
        query = db.prepare_product_statement(Some(&item), QueryType::UpdateExisting,
                                             Some(items.get(0).unwrap().quantity),
                                             Some(items.get(0).unwrap().expiration),
                                             Some(items.get(0).unwrap().times_is_bought),
        );
    } else {
        // simply adds the new item
        query = db.prepare_product_statement(Some(&item), QueryType::InsertNew,
                                             Some(0), Some(0), Some(0),
        );
    }

    println!("{}", query);
    db.execute_insert_update_or_delete(query.as_str());
}

fn select_pantry() -> Vec<Item> {
    let db = Database::new();
    println!("Selecting all items in pantry.");
    let prod_item = db.execute_select_query("SELECT * FROM Products;");
    println!("Selected all items in pantry");
    prod_item.iter().map(|pi| pi.to_item()).collect()
}


fn delete_product_from_db(elem: ItemName) {
    let db = Database::new();
    let query = format!("DELETE FROM Products WHERE name='{}';", elem.name);
    // First check if element with same name already present in db
    db.execute_insert_update_or_delete(query.as_str());
}

fn update_product_in_db(elem: Item) {
    let db = Database::new();
    let query = format!("UPDATE OR IGNORE Products SET quantity='{}',expiration='{:?}' WHERE name='{}' AND item_type='{}' AND unit='{}';",
                        elem.quantity, elem.expiration.map(|t| t.seconds).unwrap_or(0), elem.item_name, elem.r#type, elem.unit);
    // First check if element with same name already present in db
    db.execute_insert_update_or_delete(&query);
}

fn use_product_in_db(elem: &UsedItem) -> String {
    let db = Database::new();
    // first we need to get current number of product
    let select = format!("SELECT * FROM Products WHERE name='{}' AND unit='{}' AND item_type='{}';", elem.name, elem.unit, elem.item_type);
    println!("{}", select);
    let prod_item = db.execute_select_query(&select);
    println!("unit of elem from API: {}, unit of elem in table: {}", elem.unit, prod_item.first().map(|p| p.unit).unwrap());
    if let Some(prod) = prod_item.first() {
        let new_quantity = max(prod.quantity - elem.quantity, 0);
        println!("old quantity: {}, used_quantity: {}, new quantity: {}", prod.quantity, elem.quantity, new_quantity);
        let used_number = prod.total_used_number; // numero di prodotti usati in totale (ho usato 103 pacchetti di pasta finora)
        let use_number = prod.use_number; // numero di volte che il prodotto viene usato (es. l'ho usato 3 volte)
        let query = format!("UPDATE OR IGNORE Products SET quantity='{}',last_used='{}',total_used_number='{}',use_number='{}' WHERE name='{}' AND item_type='{}' AND unit='{}';",
                            new_quantity, Utc::now().timestamp(), used_number + elem.quantity, use_number + 1, elem.name, elem.item_type, elem.unit);
        db.execute_insert_update_or_delete(&query);
        format!("Used product {} in pantry. Remaining: {}", elem.name, new_quantity)
    } else {
        format!("No product {} in pantry!", elem.name)
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let configs = get_properties();
    let addr = format!("[::]:{}", configs.product_storage_port);
    // Create db and create products table
    let db = Database::new();
    db.create_table_products();
    println!("Created database tables!");

    // Activate thread to communicate with NotificationService (with Kafka)
    // if there are expired products
    // let handle = thread::Builder::new()
    //     .name("kafka-producer-thread".to_string())
    //     .spawn(async_func)
    //     .unwrap();

    // Creo il servizio
    let service = ProductStorageImpl::default(); // istanzia la struct impostando TUTTI i valori in default!
    // aggiungo l'indirizzo al server
    let grpc_server = Server::builder()
        .add_service(ProductStorageServer::new(service)) // Qua si possono aggiungere altri service se vuoi!!!
        .serve(addr.parse().unwrap()); // inizia a servire a questo indirizzo!

    // Attende! E se ci sono errori, restituisce un Result Err con il messaggio di errore
    let x = tokio::join!(grpc_server, async_kafka_producer());
    x.0.unwrap();
    println!("Server listening on {}", addr);
    // Restituisce una tupla vuota dentro un Result Ok!

    Ok(())
}

async fn async_kafka_producer() {
    println!("Establishing connection to Kafka broker...");
    // setup client
    let connection = "kafka:9092".to_owned();
    let topics: Vec<String> = vec![EXPIRED.to_string(), CONSUMED.to_string(), LOGS.to_string()];
    let client = ClientBuilder::new(vec![connection]).build().await.unwrap();

    // create needed topics
    let controller_client = client.controller_client().unwrap();

    for topic in topics {
        let status = topic.to_string();
        match controller_client.create_topic(
            &topic,
            1,      // partitions
            1,      // replication factor
            5_000,  // timeout (ms)
        ).await {
            Ok(_) => println!("created topic {KAFKA_TOPIC}"),
            Err(_) => println!("the topic already exists"),
        }
        // get a partition-bound client
        let partition_client = client
            .partition_client(
                &topic.to_owned(),
                0,  // partition
            )
            .unwrap();
        KAFKA_CLIENT_HASH_MAP.lock().await.insert(status, partition_client);
    }
    println!("Connection to Kafka established.");

    loop {
        println!("Asynchronously checking for consumed or expired products in pantry...");
        sleep(Duration::from_secs(60)).await;
        // check if there are expired or consumed products in pantry
        let expired = check_for_expired().await;
        let consumed = check_for_consumed().await;
        let mut partition;
        let partition_guard = KAFKA_CLIENT_HASH_MAP.lock().await;
        if !expired.is_empty() {
            println!("There are {} expired products in pantry.", expired.len());
            partition = partition_guard.get(EXPIRED).expect("Impossible to get expired topic partition client.");
            produce_to_kafka(&partition, Expired, expired).await;
        }
        if !consumed.is_empty() {
            partition = partition_guard.get(CONSUMED).expect("Impossible to get consumed topic partition client.");
            println!("There are {} consumed products in pantry.", consumed.len());
            produce_to_kafka(&partition, Consumed, consumed).await;
        }
    }
}

async fn check_for_expired() -> Vec<ProductItem> {
    let db = Database::new();
    let query = db.prepare_product_statement(None, SelectExpired,
                                             None, None, None);
    db.execute_select_query(&query)
}

async fn check_for_consumed() -> Vec<ProductItem> {
    let db = Database::new();
    let query = db.prepare_product_statement(None, SelectConsumed,
                                             None, None, None);
    db.execute_select_query(&query)
}

async fn produce_to_kafka(partition_client: &PartitionClient, notify: Notify, products: Vec<ProductItem>) {
    // convert ProductItems to json strings
    for product in products {
        let serialized_product = serde_json::to_string(&product).unwrap_or("{}".to_string());
        println!("{}", serialized_product);

        // create a record for the serialized product
        let record = Record {
            key: Some(vec![notify_to_int(notify)]),
            value: Some(serialized_product.into()),
            headers: Default::default(),
            timestamp: OffsetDateTime::now_utc(),
        };

        // produce some data
        partition_client.produce(vec![record], Compression::NoCompression).await.unwrap();
        println!("Product sent to Kafka.");
    }
}

///
/// Implements Summary Microservice kafka decoupled communication
/// # Arguments
///
/// * `partition_client`:
/// * `log_entry_vec`:
///
/// returns: () Nothing
async fn produce_logs_to_kafka(partition_client: &PartitionClient, log_entry_vec: Vec<LogEntry>) {
    for log_entry in log_entry_vec {
        let serialized_entry = serde_json::to_string(&log_entry).unwrap_or("{}".to_string()); // empty json object
        let record = Record {
            key: Some(vec![SUMMARY_KEY]),
            value: Some(serialized_entry.into()),
            headers: Default::default(),
            timestamp: OffsetDateTime::now_utc(),
        };

        partition_client.produce(vec![record], Compression::NoCompression).await.unwrap();
    }
    println!("Logs sent to Kafka. ");
}