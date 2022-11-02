mod properties;
mod database;

use std::any::Any;
use tokio::time::sleep;
use std::cmp::max;
use chrono::{TimeZone, Utc};
extern crate serde;
extern crate serde_json;
#[macro_use] extern crate serde_derive;
// use kafka::Error;
// use kafka::producer::{DefaultPartitioner, Producer, Record, RequiredAcks};
use crate::database::{Database, QueryType};
use tonic::{transport::Server, Request, Status, Response};
// HELP: nome_progetto::package_file_proto::nome_servizio_client::NomeServizioClient
use product_storage::shopping_list::product_storage_server::{ProductStorage, ProductStorageServer};
use product_storage::shopping_list::{ProductList, ItemName, PantryMessage, ListId, UsedItem, Item, Pantry};
use crate::properties::get_properties;
use rskafka::{
    client::{
        ClientBuilder,
        partition::{Compression},
    },
    record::Record,
    time::OffsetDateTime,
};
use std::collections::BTreeMap;
use std::time::Duration;
use rskafka::client::partition::PartitionClient;
use crate::database::QueryType::{SelectConsumed, SelectExpired};
use crate::Notify::{Consumed, Expired};
// use rskafka::client::error::Error::ServerError;

#[derive(Default)]
pub struct ProductStorageImpl {}

#[derive(Clone, Copy)]
pub enum Notify {
    Consumed,
    Expired
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

impl ProductItem {
    fn to_item(&self) -> Item {
        // let date_time = prost_types::Timestamp::from();
        println!("Converting to item");
        let ts = prost_types::Timestamp {
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

pub fn notify_to_str(input: Notify) -> u8 {
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
        add_products_to_db(product_list);
        Ok(tonic::Response::new(product_storage::shopping_list::Response { msg }))
        // Se alla fine manca il ';' significa che stiamo restituendo l'Ok (Result)
        // In teoria questo METODO va sempre a buon fine, ma ricordiamo che è asincrono
    }

    async fn add_product_to_pantry(&self, request: Request<Item>) -> Result<Response<product_storage::shopping_list::Response>, Status> {
        let msg = format!("Item Added to pantry: {}, quantity: {}", request.get_ref().item_name, request.get_ref().quantity);
        let item = request.into_inner();
        println!("Adding single item to db");
        add_single_product_to_db(item);
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
        use_product_in_db(prod);
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
fn add_products_to_db(product_list: ProductList) {
    println!("ListId: {:?}, ListName: {}, Number of products: {}", product_list.id.unwrap_or(ListId { list_id: 0 }).list_id, product_list.name, product_list.products.len());
    let products = product_list.products;
    for elem in products {
        let item = ProductItem {
            name: elem.product_name,
            item_type: elem.r#type,
            unit: elem.unit,
            quantity: elem.quantity,
            expiration: elem.expiration.unwrap().seconds,
            last_used: 0,
            use_number: 0,
            total_used_number: 0,
            times_is_bought: 1,
            buy_date: Utc::now().timestamp(),
        };
        let db = Database::new();

        // TODO: First check if element with same name already present in db
        let query = db.prepare_product_statement(Some(&item), QueryType::Select,
                                                 Some(0), Some(0), Some(0)
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
                                                 Some(0), Some(0), Some(0)
            );
        }

        println!("{}", query);
        db.execute_insert_update_or_delete(query.as_str());
    }
}

// used by add_product_to_pantry
fn add_single_product_to_db(elem: Item) {
    println!("add single product: {}, quantity {} {}, type {}", elem.item_name, elem.quantity, unit_to_str(elem.unit), prod_type_to_str(elem.r#type));
    let item = ProductItem {
        name: elem.item_name,
        item_type: elem.r#type,
        unit: elem.unit,
        quantity: elem.quantity,
        expiration: elem.expiration.map(|t| t.seconds).unwrap_or(0),
        last_used: 0,
        use_number: 0,
        total_used_number: 0,
        times_is_bought: 1,
        buy_date: Utc::now().timestamp(), // we do not know when it is bought
    };
    let db = Database::new();

    // build a select query. TODO: watch out for SQL injection!
    let query = db.prepare_product_statement(Some(&item), QueryType::Select,
                                             Some(0), Some(0), Some(0)
    );
    // First check if element with same name already present in db
    let items = db.execute_select_query(query.as_str());
    let query;
    if items.capacity() > 0 {
        // Increments quantity and updates expiration if the item is already present
        query = db.prepare_product_statement(Some(&item), QueryType::UpdateExisting,
                                             Some(items.get(0).unwrap().quantity),
                                             Some(items.get(0).unwrap().expiration),
                                             Some(items.get(0).unwrap().times_is_bought)
        );
    } else {
        // simply adds the new item
        query = db.prepare_product_statement(Some(&item), QueryType::InsertNew,
                                             Some(0), Some(0), Some(0)
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
    let query = format!("UPDATE OR IGNORE Products SET quantity='{}',expiration='{}' WHERE name='{}' AND item_type='{}' AND unit='{}';",
                        elem.quantity, elem.expiration.unwrap_or_default(), elem.item_name, elem.r#type, elem.unit);
    // First check if element with same name already present in db
    db.execute_insert_update_or_delete(&query);
}

fn use_product_in_db(elem: UsedItem) -> String {
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
    // grpc_server.await.unwrap();
    let x = tokio::join!(grpc_server, async_kafka_producer());
    x.0.unwrap();
    println!("Server listening on {}", addr);
    // Restituisce una tupla vuota dentro un Result Ok!
    // handle.join().unwrap().await;
    Ok(())
}

async fn async_kafka_producer() {
    println!("Establishing connection to Kafka broker...");
    // setup client
    let connection = "kafka:9092".to_owned();
    let client = ClientBuilder::new(vec![connection]).build().await.unwrap();

    // create a topic
    let controller_client = client.controller_client().unwrap();
    match controller_client.create_topic(
        KAFKA_TOPIC,
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
            KAFKA_TOPIC.to_owned(),
            0,  // partition
        )
        .unwrap();
    println!("Connection to Kafka established.");

    loop {
        println!("Asynchronously checking for consumed or expired products in pantry...");
        sleep(Duration::from_secs(60)).await;
        // check if there are expired or consumed products in pantry
        let expired = check_for_expired().await;
        let consumed = check_for_consumed().await;
        if !expired.is_empty() {
            println!("There are {} expired products in pantry.", expired.len());
            produce_to_kafka(&partition_client, Expired, expired).await;
        }
        if !consumed.is_empty() {
            println!("There are {} consumed products in pantry.", consumed.len());
            produce_to_kafka(&partition_client, Consumed, consumed).await;
        }
    }
}

async fn check_for_expired() -> Vec<ProductItem>{
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
        let serialized_product = serde_json::to_string(&product).unwrap();
        println!("{}", serialized_product);

        // create a record for the serialized product
        let record = Record {
            key: Some(vec![notify_to_str(notify)]),
            value: Some(serialized_product.into()),
            headers: BTreeMap::from([
                ("foo".to_owned(), "bar".into()),
            ]),
            timestamp: OffsetDateTime::now_utc(),
        };

        // produce some data
        partition_client.produce(vec![record], Compression::NoCompression).await.unwrap();
        println!("Product sent to Kafka.");
    }
}



#[allow(dead_code)]
fn kafka_consume() {
    // consume data
    // let (records, high_watermark) = partition_client
    //     .fetch_records(
    //         0,  // offset
    //         1..1_000_000,  // min..max bytes
    //         1_000,  // max wait time
    //     )
    //     .await
    //     .unwrap();
    //
    // println!("I got it the record {:#?}", records);
}

#[allow(dead_code)]
fn kafka_rust_not_working() {
    // let mut producer: kafka::Result<Producer<DefaultPartitioner>> = Err(kafka::Error::NoHostReachable);
    // while producer.is_err() {
    //     sleep(Duration::from_secs(1));
    //     println!("Thread: waiting for kafka to build Producer");
    //     producer = Producer::from_hosts(vec!("kafka:9092".to_owned()))
    //         .with_
    //         .with_ack_timeout(Duration::from_secs(1))
    //         .with_required_acks(RequiredAcks::One)
    //         .create();
    // }
    // let mut producer = producer.unwrap(); // here it cannot panic!
    // println!("Thread: created producer");
    // // loop {
    // sleep(Duration::from_secs(5));
    // println!("Thread: writing things");
    // let mut buf = String::with_capacity(2);
    // let mut retries = KAFKA_RETRIES;
    // for i in 0..10 {
    //     let _ = write!(&mut buf, "{}", i); // some computation of the message data to be sent
    //     let mut send_result = producer.send(&Record::from_value(KAFKA_TOPIC, buf.as_bytes())
    //         .with_partition(0));
    //     // we retry
    //     while send_result.is_err() && retries > 0 {
    //         sleep(Duration::from_secs(1));
    //         send_result = producer.send(&Record::from_value(KAFKA_TOPIC, buf.as_bytes())
    //             .with_partition(0));
    //         retries -= 1;
    //     }
    //     if send_result.is_err() {
    //         panic!("Failed to send topic to kafka");
    //     } else {
    //         println!("Sent successfully!");
    //     }
    //     retries = KAFKA_RETRIES;
    //     buf.clear();
    // }
}