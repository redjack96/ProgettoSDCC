mod properties;

use properties::get_properties;

// use std::env::args;
use tonic::transport::{Channel, Uri};
// Vedi il server.rs per più spiegazioni sulla sintassi di Rust
// sintassi per gli use grpc
// nome_progetto::package_file_proto::nome_servizio_client::NomeServizioClient
use api_gateway::shopping_list::shopping_list_client::ShoppingListClient;
// nome_progetto::package_file_proto::NomeMessage
use api_gateway::shopping_list::{ItemName, PantryMessage, Product};
use api_gateway::shopping_list::ProductRemove;
use api_gateway::shopping_list::ProductUpdate;
use api_gateway::shopping_list::ProductType;
use api_gateway::shopping_list::Unit;
use api_gateway::shopping_list::GetListRequest;
use api_gateway::shopping_list::BuyRequest;
use api_gateway::shopping_list::Item;
use api_gateway::shopping_list::UsedItem;
use std::{thread, time::Duration};
use actix_web::{get, post, web, App, HttpResponse, HttpServer, Responder, HttpRequest};
use prost_types::Timestamp;
use api_gateway::shopping_list::product_storage_client::ProductStorageClient;

fn unit_from_str(input: &str) -> Unit {
    match input {
        "Grams" => Unit::Grams,
        "Kg" => Unit::Kg,
        "Bottle" => Unit::Bottle,
        "Packet" => Unit::Packet,
        _ => Unit::Packet
    }
}

fn type_from_str(input: &str) -> ProductType {
    match input {
        "Meat" => ProductType::Meat,
        "Fish" => ProductType::Fish,
        "Fruit" => ProductType::Fruit,
        "Vegetable" => ProductType::Vegetable,
        "Drink" => ProductType::Drink,
        _ => ProductType::Other
    }
}

// TODO: rimuovere queste API di test
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
    let channel = try_get_channel(&configs.shopping_list_address, configs.shopping_list_port).await;
    println!("Channel created");
    // Creo un gRPC client
    let mut client = ShoppingListClient::new(channel);
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
            checked_out: false,
            expiration: Some(expiry_date),
        },
    );
    println!("Request created");
    // Invio la richiesta e attendo la risposta:
    let response = client.add_product_to_list(request)
        .await
        .unwrap() // TODO: CAPIRE BENE COSA FARE QUI, POTREBBE APPANICARSI
        .into_inner();
    let response_str = format!("Response received: {}", response.msg);
    println!("{}", response_str);
    HttpResponse::Ok().body(response_str)
}

#[post("/removeProduct/{productName}")]
async fn remove_product(product_name: web::Path<String>) -> impl Responder {
    let configs = get_properties();
    println!("Product removal requested.");
    // Crea un canale per la connessione al server
    let channel = try_get_channel(&configs.shopping_list_address, configs.shopping_list_port).await;
    println!("Channel created");
    // Creo un gRPC client
    let mut client = ShoppingListClient::new(channel);
    println!("gRPC client created");
    // Creo una Request del crate tonic
    let string_name = product_name.into_inner().to_string();
    let request = tonic::Request::new(
        ProductRemove {
            product_name: string_name
        },
    );
    println!("Request created");
    // Invio la richiesta e attendo la risposta:
    let response = client.remove_product_from_list(request)
        .await
        .unwrap() // TODO: CAPIRE BENE COSA FARE QUI, POTREBBE APPANICARSI
        .into_inner();
    let response_str = format!("Response received: {}", response.msg);
    println!("{}", response_str);
    HttpResponse::Ok().body(response_str)
}

#[post("/updateProduct/{product_id}/{field}/{value}")]
async fn update_product(req: HttpRequest) -> impl Responder {
    let configs = get_properties();
    println!("Product update requested.");
    // Crea un canale per la connessione al server
    let channel = try_get_channel(&configs.shopping_list_address, configs.shopping_list_port).await;
    println!("Channel created");
    // Creo un gRPC client
    let mut client = ShoppingListClient::new(channel);
    println!("gRPC client created");
    // Creo una Request del crate tonic
    let id = req.match_info().get("product_id").unwrap().to_string();
    let field = req.match_info().get("field").unwrap().to_string();
    let value = req.match_info().get("value").unwrap().to_string();
    let request = tonic::Request::new(
        ProductUpdate {
            product_id: id,
            field,
            value,
        },
    );
    println!("Request created");
    // Invio la richiesta e attendo la risposta:
    let response = client.update_product_in_list(request)
        .await
        .unwrap() // TODO: CAPIRE BENE COSA FARE QUI, POTREBBE APPANICARSI
        .into_inner();
    let response_str = format!("Response received: {}", response.msg);
    println!("{}", response_str);
    HttpResponse::Ok().body(response_str)
}

async fn try_get_channel(address: &String, port: i32) -> Channel {
    let mut channel = Channel::builder(Uri::try_from(format!("http://{}:{}", address, port)).unwrap())
        .connect()
        .await;
    while channel.is_err() {
        println!("Waiting for shopping_list service!");
        thread::sleep(Duration::from_millis(4000));
        channel = Channel::builder(Uri::try_from(format!("http://{}:{}", address, port)).unwrap()).connect().await;
    }
    channel.unwrap()
}

#[post("/addToCart/{productId}")]
async fn add_to_cart(req: HttpRequest) -> impl Responder {
    let configs = get_properties();
    println!("Product addition to cart requested.");
    // Crea un canale per la connessione al server
    let channel = try_get_channel(&configs.shopping_list_address, configs.shopping_list_port).await;
    println!("Channel created");
    // Creo un gRPC client
    let mut client = ShoppingListClient::new(channel);
    println!("gRPC client created");
    // Creo una Request del crate tonic
    let id = req.match_info().get("productId").unwrap().to_string();
    let field = "addedToCart".to_string(); // TODO: stringa hardcoded
    let value = true.to_string();
    let request = tonic::Request::new(
        ProductUpdate {
            product_id: id,
            field,
            value,
        },
    );
    println!("Request created");
    // Invio la richiesta e attendo la risposta:
    let response = client.add_product_to_cart(request)
        .await
        .unwrap() // TODO: CAPIRE BENE COSA FARE QUI, POTREBBE APPANICARSI
        .into_inner();
    let response_str = format!("Response received: {}", response.msg);
    println!("{}", response_str);
    HttpResponse::Ok().body(response_str)
}

#[post("/removeFromCart/{productId}")]
async fn remove_from_cart(req: HttpRequest) -> impl Responder {
    let configs = get_properties();
    println!("Product removal from cart requested.");
    // Crea un canale per la connessione al server
    let channel = try_get_channel(&configs.shopping_list_address, configs.shopping_list_port).await;
    println!("Channel created");
    // Creo un gRPC client
    let mut client = ShoppingListClient::new(channel);
    println!("gRPC client created");
    // Creo una Request del crate tonic
    let id = req.match_info().get("productId").unwrap().to_string();
    let field = "addedToCart".to_string(); // TODO: stringa Hardcoded
    let value = false.to_string();
    let request = tonic::Request::new(
        ProductUpdate {
            product_id: id,
            field,
            value,
        },
    );
    println!("Request created");
    // Invio la richiesta e attendo la risposta:
    let response = client.remove_product_from_cart(request)
        .await
        .unwrap() // TODO: CAPIRE BENE COSA FARE QUI, POTREBBE APPANICARSI
        .into_inner();
    let response_str = format!("Response received: {}", response.msg);
    println!("{}", response_str);
    HttpResponse::Ok().body(response_str)
}

#[get("/getList")]
async fn get_shopping_list() -> impl Responder {
    let configs = get_properties();
    println!("Shopping List requested.");
    // Crea un canale per la connessione al server
    let channel = try_get_channel(&configs.shopping_list_address, configs.shopping_list_port).await;
    println!("Channel created");
    // Creo un gRPC client
    let mut client = ShoppingListClient::new(channel);
    println!("gRPC client created");
    // Creo una Request del crate tonic
    let request = tonic::Request::new(GetListRequest {});

    println!("Request created");
    // Invio la richiesta e attendo la risposta:
    let response = client.get_list(request)
        .await
        .unwrap() // TODO: CAPIRE BENE COSA FARE QUI, POTREBBE APPANICARSI
        .into_inner();
    let response_str = format!("Response received: {:?}", response);
    println!("{}", response_str);
    HttpResponse::Ok().body(response_str)
}

// rpc BuyAllProductsInCart(ProductList) returns (Response)
#[post("/buyProductsInCart")]
async fn buy_products_in_cart() -> impl Responder {
    let configs = get_properties();
    println!("Buy products requested");
    let channel = try_get_channel(&configs.shopping_list_address, configs.shopping_list_port).await;
    println!("Channel created");
    let mut client = ShoppingListClient::new(channel);
    println!("gRPC client created");
    // Creating a Tonic request
    let request = tonic::Request::new(BuyRequest {});
    println!("Request created");
    // Sending request and waiting for response
    let response = client.buy_all_products_in_cart(request)
        .await
        .unwrap()
        .into_inner();
    let response_str = format!("Response received: {}", response.msg);
    println!("{}", response_str);
    HttpResponse::Ok().body(response_str)
}

#[post("/addProductToStorage/{name}/{quantity}/{unit}/{type}/{expiry}")]
async fn add_product_to_storage(req: HttpRequest) -> impl Responder {
    let configs = get_properties();
    println!("Product addition to product storage requested.");
    // Crea un canale per la connessione al server
    let channel = try_get_channel(&configs.product_storage_address, configs.product_storage_port).await;
    println!("Channel to product_storage created");
    // Create a gRPC client for ProductStorage
    let mut client = ProductStorageClient::new(channel);
    println!("gRPC client created");
    // Creates a tonic::Request
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
        Item {
            item_id: 0,
            item_name: prod_name.to_string(),
            r#type: ptype,
            unit,
            quantity,
            expiration: Some(expiry_date),
            last_used: 0,
            use_number: 0,
            total_used_number: 0,
            times_is_bought: 1, // anche se è aggiunto a mano, è stato comunque comprato un giorno.
        },
    );
    println!("Request created");
    // Invio la richiesta e attendo la risposta:
    let response = client.add_product_to_pantry(request)
        .await
        .unwrap() // TODO: CAPIRE BENE COSA FARE QUI, POTREBBE APPANICARSI
        .into_inner();
    let response_str = format!("Response received: {}", response.msg);
    println!("{}", response_str);
    HttpResponse::Ok().body(response_str)
}

#[post("/dropProductFromStorage/{name}")]
async fn drop_product_from_storage(req: HttpRequest) -> impl Responder {
    let configs = get_properties();
    println!("Drop product from storage requested.");
    // Crea un canale per la connessione al server
    let channel = try_get_channel(&configs.product_storage_address, configs.product_storage_port).await;
    println!("Channel to product_storage created");
    // Create a gRPC client for ProductStorage
    let prod_name = req.match_info().get("name").map(|n| n.to_string()).unwrap_or("".to_string());
    let mut client = ProductStorageClient::new(channel);
    println!("gRPC client created");
    let request = tonic::Request::new(
        ItemName {
            name: prod_name
        },
    );
    println!("Request created");
    // Invio la richiesta e attendo la risposta:
    let response = client.drop_product_from_pantry(request)
        .await
        .unwrap() // TODO: CAPIRE BENE COSA FARE QUI, POTREBBE APPANICARSI
        .into_inner();
    let response_str = format!("Response received: {}", response.msg);
    println!("{}", response_str);
    HttpResponse::Ok().body(response_str)
}

#[post("/updateProductInStorage/{name}/{quantity}/{unit}/{type}/{expiration}/{lastUsed}/{useNumber}/{totalUseNumber}/{timesIsBought}/{buyDate}")]
async fn update_product_in_storage(req: HttpRequest) -> impl Responder {
    let configs = get_properties();
    println!("Product addition to product storage requested.");
    // Crea un canale per la connessione al server
    let channel = try_get_channel(&configs.product_storage_address, configs.product_storage_port).await;
    println!("Channel to product_storage created");
    // Create a gRPC client for ProductStorage
    let mut client = ProductStorageClient::new(channel);
    println!("gRPC client created");
    // Creates a tonic::Request
    let prod_name = req.match_info().get("name").unwrap_or("Unknown Product").to_string();
    let quantity = req.match_info().get("quantity").unwrap_or("1").parse::<i32>().unwrap_or(1);
    let unit_str = req.match_info().get("unit").unwrap_or("Packet");
    let ptype_str = req.match_info().get("type").unwrap_or("Other");
    let expiry = req.match_info().get("expiry").unwrap_or("9999-12-31");

    // transform data collected from url
    let mut expiry_str = expiry.split("-");
    let year = expiry_str.next().map(|y| y.parse::<i64>().unwrap_or(9999)).unwrap_or(9999);
    let month = expiry_str.next().map(|m| m.parse::<u8>().unwrap_or(12)).unwrap_or(12);
    let day = expiry_str.next().map(|d| d.parse::<u8>().unwrap_or(31)).unwrap_or(31);
    let expiry_date = Timestamp::date(year, month, day).unwrap_or_default();
    let unit = unit_from_str(unit_str).into();
    let ptype = type_from_str(ptype_str).into();
    let request = tonic::Request::new(
        Item {
            item_id: 0,
            item_name: prod_name,
            r#type: ptype,
            unit,
            quantity,
            expiration: Some(expiry_date),
            last_used: 0,
            use_number: 0,
            total_used_number: 0,
            times_is_bought: 1, // anche se è aggiunto a mano, è stato comunque comprato un giorno.
        },
    );
    println!("Request created");

    // Invio la richiesta e attendo la risposta:
    let response = client.update_product_in_pantry(request)
        .await
        .unwrap() // TODO: CAPIRE BENE COSA FARE QUI, POTREBBE APPANICARSI
        .into_inner();
    let response_str = format!("Response received: {}", response.msg);
    println!("{}", response_str);
    HttpResponse::Ok().body(response_str)
}

#[get("/getPantry")]
async fn get_pantry() -> impl Responder {
    let configs = get_properties();
    println!("Storage content requested.");
    let channel = try_get_channel(&configs.product_storage_address, configs.product_storage_port).await;
    println!("Channel to product_storage created");
    // Create a gRPC client for ProductStorage
    let mut client = ProductStorageClient::new(channel);
    println!("gRPC client created");

    // Creates a tonic::Request
    let request = tonic::Request::new(PantryMessage {});
    println!("Request created");

    // Invio la richiesta e attendo la risposta:
    let response = client.get_pantry(request)
        .await
        .unwrap() // TODO: CAPIRE BENE COSA FARE QUI, POTREBBE APPANICARSI
        .into_inner();

    let response_str = format!("Response received: {:?}", response);
    HttpResponse::Ok().body(response_str)
}

#[post("/useProductInPantry/{name}/{quantity}/{unit}/{type}")]
async fn use_product_in_pantry(req: HttpRequest) -> impl Responder {
    let configs = get_properties();
    println!("Storage content requested.");
    let channel = try_get_channel(&configs.product_storage_address, configs.product_storage_port).await;
    println!("Channel to product_storage created");
    // Create a gRPC client for ProductStorage
    let mut client = ProductStorageClient::new(channel);
    println!("gRPC client created");

    let name = req.match_info().get("name").unwrap_or("Unknown Product").to_string();
    let quantity = req.match_info().get("quantity").unwrap_or("1").to_string();
    let unit = req.match_info().get("unit").unwrap_or("Packet").to_string();
    let ptype = req.match_info().get("type").unwrap_or("Other").to_string();

    // Creates a tonic::Request
    let request = tonic::Request::new(UsedItem {
        name,
        quantity: quantity.parse::<i32>().unwrap_or(1),
        unit: unit.parse::<i32>().unwrap_or(Unit::Packet.into()),
        item_type: ptype.parse::<i32>().unwrap_or(ProductType::Other.into()),
    });
    println!("Request created");

    // Invio la richiesta e attendo la risposta:
    let response = client.use_product_in_pantry(request)
        .await
        .unwrap() // TODO: CAPIRE BENE COSA FARE QUI, POTREBBE APPANICARSI
        .into_inner();

    let response_str = format!("Response received: {:?}", response);
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
            .service(update_product)
            .service(add_to_cart)
            .service(remove_from_cart)
            .service(get_shopping_list)
            .service(buy_products_in_cart)
            .service(add_product_to_storage)
            .service(drop_product_from_storage)
            .service(update_product_in_storage)
            .service(get_pantry)
            .service(use_product_in_pantry)
    }).bind((configs.api_gateway_address, configs.api_gateway_port as u16))?
        .run()
        .await
}