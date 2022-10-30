mod properties;
mod surreal;

// use std::os::unix::net::SocketAddr;
use tonic::{transport::Server, Request, Status};
// nome_progetto::package_file_proto::nome_servizio_client::NomeServizioClient
use product_storage::shopping_list::product_storage_server::{ProductStorage, ProductStorageServer};
// nome_progetto::package_file_proto::NomeMessage
// use product_storage::product_storage::{HelloReply, HelloRequest};
use product_storage::shopping_list::{ProductList, ProductId, PantryMessage, ListId};
use crate::properties::get_properties;
use crate::surreal::create_database;

#[derive(Default)]
pub struct ProductStorageImpl {}

#[tonic::async_trait] // necessary because Rust does not support async trait methods yet.
impl ProductStorage for ProductStorageImpl {
    async fn add_bought_product_to_pantry(&self, request: Request<ProductList>) -> Result<tonic::Response<product_storage::shopping_list::Response>, Status> {
        let msg= format!("Items Added to pantry: {}", request.get_ref().products.len());
        let product_list: ProductList = request.into_inner();
        println!("ListId: {:?}, ListName: {}, Number of products: {}", product_list.id.unwrap_or(ListId{list_id:0}).list_id, product_list.name, product_list.products.len());
        //TODO: aggiungere data di acquisto per prodotto in arrivo
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

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let configs = get_properties();
    let addr = format!("[::]:{}", configs.product_storage_port);
    // Create surreal database
    let db = create_database().await;
    // Creo il servizio
    let service = ProductStorageImpl::default(); // istanzia la struct impostando TUTTI i valori in default!
    // aggiungo l'indirizzo al server
    println!("Server listening on {}", addr);
    Server::builder()
        .add_service(ProductStorageServer::new(service)) // Qua si possono aggiungere altri service se vuoi!!!
        .serve(addr.parse().unwrap()) // inizia a servire a questo indirizzo!
        .await?; // Attende! E se ci sono errori, restituisce un Result Err con il messaggio di errore
    println!("Rust to the rescue!");
    // Restituisce una tupla vuota dentro un Result Ok!
    Ok(())
}