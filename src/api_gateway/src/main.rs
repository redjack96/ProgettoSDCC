mod properties;

use properties::get_properties;

// use std::env::args;
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
use api_gateway::shopping_list::Response;
use std::{thread, time::Duration};
use std::any::Any;
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder, HttpRequest};
use actix_web::web::Path;
use async_trait::async_trait;
use prost_types::Timestamp;

fn unit_from_str(input: &str) -> Unit {
    match input {
        "Grams"  => Unit::Grams,
        "Kg"  => Unit::Kg,
        "Bottle"  => Unit::Bottle,
        "Packet" => Unit::Packet,
        _      => Unit::Packet
    }
}

fn type_from_str(input: &str) -> ProductType {
    match input {
        "Meat" => ProductType::Meat,
        "Fish" => ProductType::Fish,
        "Fruit" => ProductType::Fruit,
        "Vegetable" => ProductType::Vegetable,
        "Drink" => ProductType::Drink,
        _   => ProductType::Other
    }
}
// #[derive(Debug, PartialEq)]
// enum Unit {
//     Bottle = 0,
//     Packet = 1,
//     Kg = 2,
//     Grams = 3
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


#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("Hello world!")
}

#[post("/echo")]
async fn echo(req_body: String) -> impl Responder {
    HttpResponse::Ok().body(req_body)
}

// FIXME: Qua invece di usare la #[macro] scriviamo route ... preferisco la macro
async fn manual_hello() -> impl Responder {
    HttpResponse::Ok().body("Hey there!")
}

#[get("/greet/{name}")]
async fn greet(name: web::Path<String>) -> impl Responder {
    println!("Sent greetings to {name}");
    format!("Hello {name}!")
}

#[post("/addProduct/{name}/{quantity}/{unit}/{type}/{expiry}")]
async fn add_product(req: HttpRequest) -> impl Responder {
    let configs = get_properties();
    println!("Product addition requested.");
    // Crea un canale per la connessione al server
    let mut channel = tonic::transport::Channel::builder(Uri::try_from(format!("http://shopping_list:{}", configs.shopping_list_port)).unwrap()).connect().await;
    while let Err(_) = channel {
        thread::sleep(Duration::from_millis(4000));
        println!("Waiting for shopping_list service!");
        channel = tonic::transport::Channel::builder(Uri::try_from(format!("http://shopping_list:{}", configs.shopping_list_port)).unwrap()).connect().await;
    }
    println!("Channel created");
    // Creo un gRPC client
    let mut client = ShoppingListClient::new(channel.unwrap());
    println!("gRPC client created");
    // Creo una Request del crate tonic
    let prod_name = req.match_info().get("name").unwrap().to_string();
    let quantity = req.match_info().get("quantity").unwrap().to_string().parse::<i32>().unwrap();
    let unit_str = req.match_info().get("unit").unwrap();
    let ptype_str = req.match_info().get("type").unwrap();
    let expiry = req.match_info().get("expiry").unwrap();

    // transform data collected from url
    let mut expiry_str = expiry.split("-");
    let year = expiry_str.next().unwrap().parse::<i64>().unwrap();
    let month = expiry_str.next().unwrap().parse::<u8>().unwrap();
    let day = expiry_str.next().unwrap().parse::<u8>().unwrap();
    let expiry_date = Timestamp::date(year, month, day).unwrap();
    let unit = unit_from_str(unit_str).into();
    let ptype = type_from_str(ptype_str).into();
    let request = tonic::Request::new(
        Product {
            product_name: prod_name,
            r#type: ptype,
            unit,
            quantity,
            added_to_cart: false,
            expiration: Some(expiry_date)
        },
    );
    println!("Request created");
    // Invio la richiesta e attendo la risposta:
    let response = client.add_product_to_list(request)
        .await
        .unwrap() // TODO: CAPIRE BENE COSA FARE QUI, POTREBBE APPANICARSI
        .into_inner();
    let response_str = format!("Response received: {:?}", response);
    println!("{}", response_str);
    HttpResponse::Ok().body(response_str)
}

#[post("/removeProduct/{productName}")]
async fn remove_product(productName: web::Path<String>) -> impl Responder {
    let configs = get_properties();
    println!("Product removal requested.");
    // Crea un canale per la connessione al server
    let mut channel = tonic::transport::Channel::builder(Uri::try_from(format!("http://shopping_list:{}", configs.shopping_list_port)).unwrap()).connect().await;
    while let Err(_) = channel {
        thread::sleep(Duration::from_millis(4000));
        println!("Waiting for shopping_list service!");
        channel = tonic::transport::Channel::builder(Uri::try_from(format!("http://shopping_list:{}", configs.shopping_list_port)).unwrap()).connect().await;
    }
    println!("Channel created");
    // Creo un gRPC client
    let mut client = ShoppingListClient::new(channel.unwrap());
    println!("gRPC client created");
    // Creo una Request del crate tonic
    let string_name = productName.into_inner().to_string();
    let request = tonic::Request::new(
        ProductId {
            product_name: string_name
        },
    );
    println!("Request created");
    // Invio la richiesta e attendo la risposta:
    let response = client.remove_product_from_list(request)
        .await
        .unwrap() // TODO: CAPIRE BENE COSA FARE QUI, POTREBBE APPANICARSI
        .into_inner();
    let response_str = format!("Response received: {:?}", response);
    println!("{}", response_str);
    HttpResponse::Ok().body(response_str)
}

// cargo run --bin client -- tuoiparametri
#[actix_web::main] // or #[tokio::main]
async fn main() -> std::io::Result<()> {
    let configs = get_properties();
    println!("inter container address: {}:{}, on the host: localhost:{}", configs.api_gateway_address, configs.api_gateway_port, configs.api_gateway_port);
    HttpServer::new(|| {
        App::new()
            // se non metti il nome, verrà inserito hello world
            .route("/hello", web::get().to(|| async { "Hello World!" }))
            .route("/manual_hello", web::get().to(manual_hello))
            .service(hello) // manual_hello, hello, echo e greet sono funzioni!!
            .service(echo)
            .service(greet)
            .service(add_product)
            .service(remove_product)
    }).bind((configs.api_gateway_address, configs.api_gateway_port as u16))?
        .run()
        .await
}


// per passare parametri usa:
// #[allow(dead_code)]
// async fn add_product() -> Result<api_gateway::shopping_list::Response, Box<dyn std::error::Error>> {
//     let configs = get_properties();
//
//     // Prendo il primo elemento dalla linea di comando. Per default uso "Giacomo"
//     let _user_input = args().nth(1)// Option<String>
//         // Option è come Optional in Java. In Rust è una Enum con 2 varianti: Some(T) e None
//         // Se il metodo restituisce qualcosa, si ottiene Some(T). In questo caso T = String
//         // se non restituisce nulla, si usa None (che è l'altra variante di Option e ha dei metodi definiti).
//         .unwrap_or("1".to_owned())// to_owned trasforma &str (stack) in String (heap)
//         .parse::<i32>()
//         .unwrap_or(1);
//     // unwrap_or e' SEMPRE da preferire ad unwrap perché non va in "panic".
//     // unwrap_or Restituisce T se Option è Some(T) altrimenti restituisce il valore T di default specificato
//
//     match user_input {
//         1 => addProduct(),
//         _ => (),
//     }
//
//     println!("Waiting for response");
//     // Crea un canale per la connessione al server
//     let mut channel = tonic::transport::Channel::builder(Uri::try_from(format!("http://shopping_list:{}", configs.shopping_list_port)).unwrap()).connect().await;
//     while let Err(_) = channel {
//         thread::sleep(Duration::from_millis(4000));
//         println!("Waiting for shopping_list!");
//         channel = tonic::transport::Channel::builder(Uri::try_from(format!("http://shopping_list:{}", configs.shopping_list_port)).unwrap()).connect().await;
//     }
//     println!("Channel created");
//     // Creo un gRPC client
//     let mut client = ShoppingListClient::new(channel.unwrap());
//     println!("gRPC client created");
//     // Creo una Request del crate tonic
//     let request = tonic::Request::new(
//         Product {
//             item_id: Some(ProductId { product_id: 0 }),
//             product_name: "Prosciutto".to_string(),
//             r#type: ProductType::Meat.into(),
//             unit: Unit::Grams.into(),
//             quantity: 200,
//             added_to_cart: false,
//         },
//     );
//     println!("Request created");
//     // Invio la richiesta e attendo la risposta:
//     let response = client.add_product_to_list(request)
//         .await?
//         .into_inner();
//     println!("Response received: {:?}", response);
//     Ok(response)
// }