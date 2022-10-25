mod properties;

use properties::get_properties;

use std::env::args;
use tonic::transport::Uri;
// Vedi il server.rs per più spiegazioni sulla sintassi di Rust
// sintassi per gli use grpc
// nome_progetto::nome_file_proto::nome_servizio+"_client"::NomeServizioClient
use api_gateway::api_gateway::shopping_list_api_client::ShoppingListApiClient;
// nome_progetto::nome_file_proto::NomeMessage
use api_gateway::api_gateway::Product;
use api_gateway::api_gateway::ProductId;
use api_gateway::api_gateway::ProductType;
use api_gateway::api_gateway::Unit;
// use api_gateway::api_gateway::Response;

// enum Unit {
//     Bottle,
//     Packet,
//     Kg,
//     Grams,
// }

// struct Product {
//     item_id: i64,
//     // an int with type ProductId.Two Products with the same name can have different ProductIds
//     product_name: String,
//     prod_type: ProductType,
//     unit: Unit,
//     quantity: i32,
//     added_to_cart: bool, // true if it is checked on the list
//     // expireDate string // Todo: usare una data
// }


// per passare parametri usa:
// cargo run --bin client -- tuoiparametri
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let configs = get_properties();

    // Prendo il primo elemento dalla linea di comando. Per default uso "Giacomo"
    let _user_input = args().nth(1)// Option<String>
        // Option è come Optional in Java. In Rust è una Enum con 2 varianti: Some(T) e None
        // Se il metodo restituisce qualcosa, si ottiene Some(T). In questo caso T = String
        // se non restituisce nulla, si usa None (che è l'altra variante di Option e ha dei metodi definiti).
        .unwrap_or("1".to_owned())// to_owned trasforma &str (stack) in String (heap)
        .parse::<i32>()
        .unwrap_or(1);
    // unwrap_or e' SEMPRE da preferire ad unwrap perché non va in "panic".fleet
    // unwrap_or Restituisce T se Option è Some(T) altrimenti restituisce il valore T di default specificato

    // match user_input {
    //     1 => addProduct(),
    //     _ => (),
    // }

    // Crea un canale per la connessione al server
    let channel = tonic::transport::Channel::builder(Uri::try_from(format!("http://shopping_list:{}", configs.shopping_list_port)).unwrap()).connect()
        .await?;
    // Creo un gRPC client
    let mut client = ShoppingListApiClient::new(channel);
    // Creo una Request del crate tonic
    let request = tonic::Request::new(
        Product {
            item_id: Some(ProductId{product_id: 0}),
            product_name: "Prosciutto".to_string(),
            r#type: ProductType::Meat.into(),
            unit: Unit::Grams.into(),
            quantity: 200,
            added_to_cart: false
        },
    );
    // Invio la richiesta e attendo la risposta:
    let response = client.add_product_to_list(request)
        .await?
        .into_inner();
    println!("Response received: {:?}", response);
    Ok(())
}