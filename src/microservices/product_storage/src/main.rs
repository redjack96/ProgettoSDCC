mod properties;

// use std::os::unix::net::SocketAddr;
use tonic::{transport::Server, Request, Status};
// nome_progetto::package_file_proto::nome_servizio_client::NomeServizioClient
use product_storage::shopping_list::product_storage_server::{ProductStorage, ProductStorageServer};
// nome_progetto::package_file_proto::NomeMessage
// use product_storage::product_storage::{HelloReply, HelloRequest};
use product_storage::shopping_list::{ProductList, ProductId, PantryMessage};
use crate::properties::get_properties;

/*enum Unit{
    Bottle,
    Packet,
    Kg,
    Grams
}
enum ProductType{
    Meat,
    Fish,
    Fruit,
    Vegetable,
    Drink,
    Other
}

struct ProductId(i64);

struct Product{
    id: ProductId,
    product_info: ProductInfo,
    quantity: i32,
    quantity_expired: i32,
    min_expire_date: String,
    last_used: String,      // Todo: usare una data qui
    last_bought: String,    // Todo: e qui
}

//TODO: la quantità va messa qui o no?
struct ProductInfo {
    id: ProductId, // e' un intero a cui ho cambiato il nome i64. Rappresenta l'id di un prodotto. Due prodotti con lo stesso nome possono avere id differenti.
    name: String,
    r#type: ProductType,    // r# serve per fare escape della parola chiave type. Cosi' si puo accedere a ProductInfo.type
    expire_date: String,    // Todo: usare una data
    expired: bool,
}

// dispensa
struct Pantry {
    products: Vec<Product>
}
*/
#[derive(Default)]
pub struct ProductStorageImpl {}

#[tonic::async_trait] // necessary because Rust does not support async trait methods yet.
impl ProductStorage for ProductStorageImpl {
    async fn add_bought_product_to_pantry(&self, request: Request<ProductList>) -> Result<tonic::Response<product_storage::shopping_list::Response>, Status> {
        println!("Added to pantry {}", request.get_ref().products.len());
        Ok(tonic::Response::new(product_storage::shopping_list::Response { // le struct si istanziano esattamente come in Go
            msg: format!("Items added to pantry {}", request.get_ref().products.len()),
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