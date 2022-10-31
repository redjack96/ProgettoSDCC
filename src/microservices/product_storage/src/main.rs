mod properties;
mod database;

use std::time::SystemTime;
use actix_web::http::header::q;
use chrono::Utc;
use prost_types::Timestamp;
use crate::database::{Database, QueryType};
// use std::os::unix::net::SocketAddr;
use tonic::{transport::Server, Request, Status};
// nome_progetto::package_file_proto::nome_servizio_client::NomeServizioClient
use product_storage::shopping_list::product_storage_server::{ProductStorage, ProductStorageServer};
// nome_progetto::package_file_proto::NomeMessage
// use product_storage::product_storage::{HelloReply, HelloRequest};
use product_storage::shopping_list::{ProductList, ProductId, PantryMessage, ListId};
use crate::properties::get_properties;
// use crate::surreal::{create_database, execute_query};

#[derive(Default)]
pub struct ProductStorageImpl {}

struct ProductItem {
    name: String,
    item_type: i32,
    unit: i32,
    quantity: i32,
    expiration: i64,
    buy_date: i64
}

#[tonic::async_trait] // necessary because Rust does not support async trait methods yet.
impl ProductStorage for ProductStorageImpl {
    async fn add_bought_product_to_pantry(&self, request: Request<ProductList>) -> Result<tonic::Response<product_storage::shopping_list::Response>, Status> {
        let msg= format!("Items Added to pantry: {}", request.get_ref().products.len());
        let product_list = request.into_inner();
        // Buy date is added to the incoming items
        // Those items must be added to the database
        println!("Adding elements received to db");
        add_products_to_db(product_list);
        Ok(tonic::Response::new(product_storage::shopping_list::Response { // le struct si istanziano esattamente come in Go
            msg
        })) // Se alla fine manca il ';' significa che stiamo restituendo l'Ok (Result)
        // In teoria questo METODO va sempre a buon fine, ma ricordiamo che è asincrono
    }
    async fn add_product_to_pantry(&self, _item: Request<product_storage::shopping_list::Item>) -> Result<tonic::Response<product_storage::shopping_list::Response>, Status> {
        todo!()
    }
    async fn remove_product_from_pantry(&self, _item_id: Request<ProductId>) -> Result<tonic::Response<product_storage::shopping_list::Item>, Status> {
        todo!()
    }
    async fn update_product_in_pantry(&self, _item_id: Request<ProductId>) -> Result<tonic::Response<product_storage::shopping_list::Response>, Status> {
        todo!()
    }
    async fn get_pantry(&self, _msg: Request<PantryMessage>) -> Result<tonic::Response<product_storage::shopping_list::Pantry>, Status> {
        todo!()
    }
}

fn add_products_to_db(product_list: ProductList) {
    println!("ListId: {:?}, ListName: {}, Number of products: {}", product_list.id.unwrap_or(ListId{list_id:0}).list_id, product_list.name, product_list.products.len());
    let products = product_list.products;
    for elem in products {
        let item = ProductItem {
            name: elem.product_name,
            item_type: elem.r#type,
            unit: elem.unit,
            quantity: elem.quantity,
            expiration: elem.expiration.unwrap().seconds,
            buy_date: Utc::now().timestamp()
        };
        let db = Database::new();

        // TODO: First check if element with same name already present in db
        let query = db.prepare_product_statement(&item, QueryType::Select,
                                                 0, 0);
        let items = db.execute_select_query(query.as_str());
        let mut query;
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
        db.execute_insert_query(query.as_str());

        // // //TODO: elimina questa parte (serve per verificare se è stato inserito qualcosa)
        // let query = db.prepare_product_statement(&item, QueryType::Select);
        // println!("{}", query);
        // db.execute_select_query(query.as_str());
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