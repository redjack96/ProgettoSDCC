mod properties;

use properties::get_properties;

use std::env::args;
use tonic::transport::Uri;
// Vedi il server.rs per più spiegazioni sulla sintassi di Rust
// sintassi per gli use grpc
// nome_progetto::package_file_proto::nome_servizio_client::NomeServizioClient
use api_gateway::shopping_list::shopping_list_client::ShoppingListClient;
// nome_progetto::package_file_proto::NomeMessage
use api_gateway::shopping_list::Product;
use api_gateway::shopping_list::ProductId;
use api_gateway::shopping_list::ProductType;
use api_gateway::shopping_list::Unit;
use std::{thread, time::Duration};
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
    // unwrap_or e' SEMPRE da preferire ad unwrap perché non va in "panic".
    // unwrap_or Restituisce T se Option è Some(T) altrimenti restituisce il valore T di default specificato

    // match user_input {
    //     1 => addProduct(),
    //     _ => (),
    // }

    println!("Waiting for response");
    // Crea un canale per la connessione al server
    let mut channel = tonic::transport::Channel::builder(Uri::try_from(format!("http://shopping_list:{}", configs.shopping_list_port)).unwrap()).connect().await;
    while let Err(err) = channel {
        thread::sleep(Duration::from_millis(4000));
        println!("Waiting for shopping_list!");
        channel = tonic::transport::Channel::builder(Uri::try_from(format!("http://shopping_list:{}", configs.shopping_list_port)).unwrap()).connect().await;
    }
    println!("Channel created");
    // Creo un gRPC client
    let mut client = ShoppingListClient::new(channel.unwrap());
    println!("gRPC client created");
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
    println!("Request created");
    // Invio la richiesta e attendo la risposta:
    let response = client.add_product_to_list(request)
        .await?
        .into_inner();
    println!("Response received: {:?}", response);
    Ok(())
}