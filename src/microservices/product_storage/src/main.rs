mod properties;
mod database;

use chrono::Utc;
use crate::database::{Database, QueryType};
// use std::os::unix::net::SocketAddr;
use tonic::{transport::Server, Request, Status, Response};
// nome_progetto::package_file_proto::nome_servizio_client::NomeServizioClient
use product_storage::shopping_list::product_storage_server::{ProductStorage, ProductStorageServer};
// nome_progetto::package_file_proto::NomeMessage
// use product_storage::product_storage::{HelloReply, HelloRequest};
use product_storage::shopping_list::{ProductList, ItemName, PantryMessage, ListId, UsedItem, Item, Pantry};
use crate::properties::get_properties;
// use crate::surreal::{create_database, execute_query};

#[derive(Default)]
pub struct ProductStorageImpl {}
// #[prost(int64, tag="1")]
//     pub item_id: i64,
//     #[prost(string, tag="2")]
//     pub item_name: ::prost::alloc::string::String,
//     #[prost(enumeration="super::shopping_list::ProductType", tag="3")]
//     pub r#type: i32,
//     #[prost(enumeration="super::shopping_list::Unit", tag="4")]
//     pub unit: i32,
//     #[prost(int32, tag="5")]
//     pub quantity: i32,
//     #[prost(message, optional, tag="6")]
//     pub expiration: ::core::option::Option<::prost_types::Timestamp>,
//     #[prost(int64, tag="7")]
//     pub last_used: i64,
//     /// times the item is used
//     #[prost(int32, tag="8")]
//     pub use_number: i32,
//     /// times
//     #[prost(int32, tag="9")]
//     pub total_used_number: i32,
//     #[prost(int32, tag="10")]
//     pub times_is_bought: i32,
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
        Ok(Response::new(product_storage::shopping_list::Response{msg}))
    }

    async fn update_product_in_pantry(&self, _request: Request<ItemName>) -> Result<Response<product_storage::shopping_list::Response>, Status> {
        todo!()
    }

    async fn use_product_in_pantry(&self, _request: Request<UsedItem>) -> Result<Response<product_storage::shopping_list::Response>, Status> {
        todo!()
    }

    async fn get_pantry(&self, _request: Request<PantryMessage>) -> Result<Response<Pantry>, Status> {
        todo!()
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
        let query = db.prepare_product_statement(&item, QueryType::Select,
                                                 0, 0);
        let items = db.execute_select_query(query.as_str());
        let query;
        if items.capacity() != 0 {
            // Incrementa quantità e aggiorna scadenza
            query = db.prepare_product_statement(&item, QueryType::UpdateExisting,
                                                 items.get(0).unwrap().quantity,
                                                 items.get(0).unwrap().expiration);
        } else {
            query = db.prepare_product_statement(&item, QueryType::InsertNew,
                                                 0, 0);
        }

        println!("{}", query);
        db.execute_insert_update_or_delete(query.as_str());
    }
}
// used by add_product_to_pantry
fn add_single_product_to_db(elem: Item) {
    println!("add single product: {}", elem.item_name);
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
        buy_date: 0, // we do not know when it is bought
    };
    let db = Database::new();

    // build a select query. TODO: watch out for SQL injection!
    let query = db.prepare_product_statement(&item, QueryType::Select, 0, 0);
    // First check if element with same name already present in db
    let items = db.execute_select_query(query.as_str());
    let query;
    if items.capacity() > 0 {
        // Increments quantity and updates expiration if the item is already present
        query = db.prepare_product_statement(&item, QueryType::UpdateExisting,
                                             items.get(0).unwrap().quantity,
                                             items.get(0).unwrap().expiration);
    } else {
        // simply adds the new item
        query = db.prepare_product_statement(&item, QueryType::InsertNew,
                                             0, 0);
    }

    println!("{}", query);
    db.execute_insert_update_or_delete(query.as_str());
}


fn delete_product_from_db(elem: ItemName) {
    let db = Database::new();
    let query = format!("DELETE FROM Products WHERE name='{}';", elem.name);
    // First check if element with same name already present in db
    db.execute_insert_update_or_delete(query.as_str());
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let configs = get_properties();
    let addr = format!("[::]:{}", configs.product_storage_port);
    // Create db and create products table
    let db = Database::new();
    db.create_table_products();
    println!("Created database tables!");
    // Creo il servizio
    let service = ProductStorageImpl::default(); // istanzia la struct impostando TUTTI i valori in default!
    // aggiungo l'indirizzo al server
    println!("Server listening on {}", addr);
    Server::builder()
        .add_service(ProductStorageServer::new(service)) // Qua si possono aggiungere altri service se vuoi!!!
        .serve(addr.parse().unwrap()) // inizia a servire a questo indirizzo!
        .await?; // Attende! E se ci sono errori, restituisce un Result Err con il messaggio di errore
    // Restituisce una tupla vuota dentro un Result Ok!
    Ok(())
}