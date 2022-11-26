mod properties;

use properties::get_properties;

use tonic::transport::{Channel, Uri};
// nome_progetto::package_file_proto::nome_servizio_client::NomeServizioClient
use api_gateway::shopping_list::shopping_list_client::ShoppingListClient;
// nome_progetto::package_file_proto::NomeMessage
use api_gateway::shopping_list::{Product, ProductKey, ProductUpdate, ProductType, Unit, GetListRequest, BuyRequest, Timestamp, Response as OurResponse, ProductList};
use api_gateway::product_storage::{ItemName, Pantry, PantryMessage};
use api_gateway::summary::{SummaryData, SummaryRequest};
use api_gateway::recipes::{Ingredient, IngredientsList, RecipeList, RecipesRequest};
use api_gateway::product_storage::{Item, UsedItem};
use actix_web::{get, post, App, HttpResponse, HttpServer, Responder, HttpRequest, web};
use actix_web::web::Query;
use failsafe::{Config, StateMachine};
use failsafe::backoff::EqualJittered;
use failsafe::failure_policy::{ConsecutiveFailures, OrElse, SuccessRateOverTimeWindow};
use serde::{Serialize, Deserialize};
use tonic::Response;
use api_gateway::product_storage::product_storage_client::ProductStorageClient;
use api_gateway::summary::summary_client::SummaryClient;
use api_gateway::recipes::recipes_client::RecipesClient;
use api_gateway::consumptions::estimator_client::EstimatorClient;
use api_gateway::consumptions::PredictRequest;
use failsafe::futures::CircuitBreaker;
use tokio::sync::Mutex;

extern crate serde;
extern crate serde_json;
extern crate serde_derive;

use lazy_static::lazy_static;
use api_gateway::notifications::notification_client::NotificationClient;
use api_gateway::notifications::{NotificationList, NotificationRequest};
// use ginepro::{LoadBalancedChannel, LoadBalancedChannelBuilder};

lazy_static! {
    static ref CIRCUIT_BREAKER: Mutex<StateMachine<OrElse<SuccessRateOverTimeWindow<EqualJittered>, ConsecutiveFailures<EqualJittered>>, ()>> = Mutex::new(Config::new().build());
}

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

fn our_timestamp(their_timestamp: prost_types::Timestamp) -> Timestamp {
    Timestamp {
        seconds: their_timestamp.seconds,
        nanos: their_timestamp.nanos,
    }
}

// fn json_response(json: serde_json::Value) -> HttpResponse {
//     HttpResponse::Ok()
//         .insert_header(("Access-Control-Allow-Origin", "*"))
//         .body(json.to_string())
// }
//
// fn str_response(str: String) -> HttpResponse {
//     HttpResponse::Ok()
//         .insert_header(("Access-Control-Allow-Origin", "*"))
//         .body(str)
// }

fn to_json_response<T>(obj: T) -> HttpResponse where T: Serialize {
    let string = serde_json::to_string_pretty(&obj).unwrap_or_default();
    println!("{}", &string);
    HttpResponse::Ok()
        .insert_header(("Access-Control-Allow-Origin", "*"))
        .body(string)
}

fn to_json_unavailable(err: failsafe::Error<tonic::transport::Error>) -> HttpResponse {
    let msg = format!("Service Unavailable, retry later. Error: {}", err);
    let string = serde_json::json!({
        "msg": &msg,
    });
    HttpResponse::ServiceUnavailable()
        .insert_header(("Access-Control-Allow-Origin", "*"))
        .body(string.to_string())
}

// fn to_json_unavailable_lb(err: failsafe::Error<anyhow::Error>) -> HttpResponse {
//     let msg = format!("Service Unavailable, retry later. Error: {}", err);
//     let string = serde_json::json!({
//         "msg": &msg,
//     });
//     HttpResponse::ServiceUnavailable()
//         .insert_header(("Access-Control-Allow-Origin", "*"))
//         .body(string.to_string())
// }

fn to_json_error(err: failsafe::Error<tonic::Status>) -> HttpResponse {
    let msg = format!("Error in calling the API: {}", err);
    let string = serde_json::json!({
        "msg": &msg,
    });
    HttpResponse::ServiceUnavailable()
        .insert_header(("Access-Control-Allow-Origin", "*"))
        .body(string.to_string())
}

#[derive(Deserialize, Default, Debug)]
struct ProductUpdateInfo {
    product_name: String,
    r#type: String,
    unit: String,
    quantity: Option<i32>,
    expiration: Option<String>,
}

impl ProductUpdateInfo {
    fn to_product_update(&self) -> ProductUpdate {
        ProductUpdate {
            name: self.product_name.clone(),
            r#type: type_from_str(&self.r#type).into(),
            unit: unit_from_str(&self.unit).into(),
            expiration: self.expiration.clone(),
            quantity: self.quantity,
        }
    }
}

/** SHOPPING LIST API **/
#[post("/addProduct/{name}/{quantity}/{unit}/{type}/{expiry}")]
async fn add_product(req: HttpRequest) -> impl Responder {
    let configs = get_properties();
    println!("Product addition requested.");
    // Crea un canale per la connessione al server
    let result = get_channel(&configs.shopping_list_address, configs.shopping_list_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
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
    let expiry_date = prost_types::Timestamp::date(year, month, day).unwrap();
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
            expiration: Some(our_timestamp(expiry_date)),
        },
    );
    println!("Request created");
    // Invio la richiesta e attendo la risposta:
    let response = CIRCUIT_BREAKER.lock().await.call(client.add_product_to_list(request))
        .await
        .unwrap_or(Response::new(OurResponse { msg: "Empty Response".to_string() }))
        .into_inner();
    to_json_response(response)
}

#[post("/removeProduct/{name}/{unit}/{type}")]
async fn remove_product(req: HttpRequest) -> impl Responder {
    let configs = get_properties();
    println!("Product removal requested.");
    // Crea un canale per la connessione al server
    let result = get_channel(&configs.shopping_list_address, configs.shopping_list_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
    println!("Channel created");
    // Creo un gRPC client
    let mut client = ShoppingListClient::new(channel);
    println!("gRPC client created");
    // Creo una Request del crate tonic
    let name = req.match_info().get("name").unwrap_or("");
    let unit = req.match_info().get("unit").unwrap_or("Packet");
    let ptype = req.match_info().get("type").unwrap_or("Other");
    let request = tonic::Request::new(
        ProductKey {
            product_name: name.to_string(),
            product_unit: unit_from_str(unit).into(),
            product_type: type_from_str(ptype).into(),
        },
    );
    println!("Request created");
    // Invio la richiesta e attendo la risposta:
    let response = CIRCUIT_BREAKER.lock().await.call(client.remove_product_from_list(request))
        .await
        .unwrap_or(Response::new(OurResponse { msg: "Empty Response".to_string() }))
        .into_inner();
    to_json_response(response)
}

#[post("/updateProduct")]
async fn update_product(query: Query<ProductUpdateInfo>) -> impl Responder {
    let configs = get_properties();
    println!("Product update requested: {:?}", query);
    // Crea un canale per la connessione al server
    let result = get_channel(&configs.shopping_list_address, configs.shopping_list_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
    println!("Channel created");
    // Creo un gRPC client
    let mut client = ShoppingListClient::new(channel);
    println!("gRPC client created");
    // Creo una Request del crate tonic
    let request = tonic::Request::new(query.to_product_update());
    println!("Request created");
    // Invio la richiesta e attendo la risposta:
    let response = CIRCUIT_BREAKER.lock().await.call(client.update_product_in_list(request))
        .await
        .unwrap_or(Response::new(OurResponse { msg: "Empty Response".to_string() }))
        .into_inner();
    to_json_response(response)
}


#[post("/addToCart/{name}/{unit}/{type}")]
async fn add_to_cart(req: HttpRequest) -> impl Responder {
    let configs = get_properties();
    println!("Product addition to cart requested.");
    // Crea un canale per la connessione al server
    let result = get_channel(&configs.shopping_list_address, configs.shopping_list_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
    println!("Channel created");
    // Creo un gRPC client
    let mut client = ShoppingListClient::new(channel);
    println!("gRPC client created");
    // Creo una Request del crate tonic
    let name = req.match_info().get("name").unwrap_or("");
    let unit = req.match_info().get("unit").unwrap_or("Packet");
    let ptype = req.match_info().get("type").unwrap_or("Other");
    let request = tonic::Request::new(
        ProductKey {
            product_name: name.to_string(),
            product_unit: unit_from_str(unit).into(),
            product_type: type_from_str(ptype).into(),
        },
    );
    println!("Request created");
    // Invio la richiesta e attendo la risposta:
    let response = CIRCUIT_BREAKER.lock().await.call(client.add_product_to_cart(request))
        .await
        .unwrap_or(Response::new(OurResponse { msg: "Empty Response".to_string() }))
        .into_inner();
    to_json_response(response)
}

#[post("/removeFromCart/{name}/{unit}/{type}")]
async fn remove_from_cart(req: HttpRequest) -> impl Responder {
    let configs = get_properties();
    println!("Product removal from cart requested.");
    // Crea un canale per la connessione al server
    let result = get_channel(&configs.shopping_list_address, configs.shopping_list_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
    println!("Channel created");
    // Creo un gRPC client
    let mut client = ShoppingListClient::new(channel);
    println!("gRPC client created");
    // Creo una Request del crate tonic
    let name = req.match_info().get("name").unwrap_or("");
    let unit = req.match_info().get("unit").unwrap_or("Packet");
    let ptype = req.match_info().get("type").unwrap_or("Other");
    let request = tonic::Request::new(
        ProductKey {
            product_name: name.to_string(),
            product_unit: unit_from_str(unit).into(),
            product_type: type_from_str(ptype).into(),
        },
    );
    println!("Request created");
    // Invio la richiesta e attendo la risposta:
    let response = CIRCUIT_BREAKER.lock().await.call(client.remove_product_from_cart(request))
        .await
        .unwrap_or(Response::new(OurResponse { msg: "Empty response".to_string() }))
        .into_inner();
    to_json_response(response)
}

#[get("/getList")]
async fn get_shopping_list() -> impl Responder {
    let configs = get_properties();
    println!("Shopping List requested.");
    // Crea un canale per la connessione al server
    let result = get_channel(&configs.shopping_list_address, configs.shopping_list_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
    println!("Channel created");
    // Creo un gRPC client
    let mut client = ShoppingListClient::new(channel);
    println!("gRPC client created");
    // Creo una Request del crate tonic
    let request = tonic::Request::new(GetListRequest {});

    println!("Request created");
    // Invio la richiesta e attendo la risposta con il circuit breaker
    let product_list = CIRCUIT_BREAKER.lock().await.call(client.get_list(request))
        .await
        .unwrap_or(Response::new(ProductList {
            id: None,
            name: "Empty List".to_string(),
            products: vec![],
        }))
        .into_inner();
    return to_json_response(product_list);
}

// rpc BuyAllProductsInCart(ProductList) returns (Response)
#[post("/buyProductsInCart")]
async fn buy_products_in_cart() -> impl Responder {
    let configs = get_properties();
    println!("Buy products requested");
    let result = get_channel(&configs.shopping_list_address, configs.shopping_list_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
    println!("Channel created");
    let mut client = ShoppingListClient::new(channel);
    println!("gRPC client created");
    // Creating a Tonic request
    let request = tonic::Request::new(BuyRequest {});
    println!("Request created");
    // Sending request and waiting for response
    match CIRCUIT_BREAKER.lock().await.call(client.buy_all_products_in_cart(request)).await {
        Ok(resp) => to_json_response(resp.into_inner()),
        Err(e) => to_json_error(e),
    }
}


/** PRODUCT STORAGE APIS **/
#[post("/addProductToStorage/{name}/{quantity}/{unit}/{type}/{expiry}")]
async fn add_product_to_storage(req: HttpRequest) -> impl Responder {
    let configs = get_properties();
    println!("Product addition to product storage requested.");
    // Crea un canale per la connessione al server
    let result = get_channel(&configs.product_storage_address, configs.product_storage_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
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
    let expiry_date = prost_types::Timestamp::date(year, month, day).unwrap();
    let unit = unit_from_str(unit_str).into();
    let ptype = type_from_str(ptype_str).into();
    let request = tonic::Request::new(
        Item {
            item_id: 0,
            item_name: prod_name.to_string(),
            r#type: ptype,
            unit,
            quantity,
            expiration: Some(our_timestamp(expiry_date)),
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
        .unwrap_or(Response::new(OurResponse { msg: "Empty response".to_string() }))
        .into_inner();
    to_json_response(response)
}

#[post("/dropProductFromStorage/{name}")]
async fn drop_product_from_storage(req: HttpRequest) -> impl Responder {
    let configs = get_properties();
    println!("Drop product from storage requested.");
    // Crea un canale per la connessione al server
    let result = get_channel(&configs.product_storage_address, configs.product_storage_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
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
    let response = CIRCUIT_BREAKER.lock().await.call(client.drop_product_from_pantry(request))
        .await
        .unwrap_or(Response::new(OurResponse { msg: "Empty response".to_string() }))
        .into_inner();
    to_json_response(response)
}

// aggiornare OPZIONALMENTE almeno uno tra quantity, expiration, lastUsed, useNumber, totalUseNumber timesIsBought buyDate. Usa Query!!
#[post("/updateProductInStorage/{name}/{quantity}/{unit}/{type}/{expiration}/{lastUsed}/{useNumber}/{totalUseNumber}/{timesIsBought}/{buyDate}")]
async fn update_product_in_storage(req: HttpRequest) -> impl Responder {
    let configs = get_properties();
    println!("Product addition to product storage requested.");
    // Crea un canale per la connessione al server
    let result = get_channel(&configs.product_storage_address, configs.product_storage_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
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
    let expiry_date = prost_types::Timestamp::date(year, month, day).unwrap_or_default();
    let unit = unit_from_str(unit_str).into();
    let ptype = type_from_str(ptype_str).into();
    let request = tonic::Request::new(
        Item {
            item_id: 0,
            item_name: prod_name,
            r#type: ptype,
            unit,
            quantity,
            expiration: Some(our_timestamp(expiry_date)),
            last_used: 0,
            use_number: 0,
            total_used_number: 0,
            times_is_bought: 1, // anche se è aggiunto a mano, è stato comunque comprato un giorno.
        },
    );
    println!("Request created");

    // Invio la richiesta e attendo la risposta:
    let response = CIRCUIT_BREAKER.lock().await.call(client.update_product_in_pantry(request))
        .await
        .unwrap_or(Response::new(OurResponse { msg: "Empty response".to_string() }))
        .into_inner();
    to_json_response(response)
}

#[get("/getPantry")]
async fn get_pantry() -> impl Responder {
    let configs = get_properties();
    println!("Storage content requested.");
    let result = get_channel(&configs.product_storage_address, configs.product_storage_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
    println!("Channel to product_storage created");
    // Create a gRPC client for ProductStorage
    let mut client = ProductStorageClient::new(channel);
    println!("gRPC client created");

    // Creates a tonic::Request
    let request = tonic::Request::new(PantryMessage {});
    println!("Request created");

    // Invio la richiesta e attendo la risposta:
    let pantry = CIRCUIT_BREAKER.lock().await.call(client.get_pantry(request))
        .await
        .unwrap_or(Response::new(Pantry { products: vec![] }))
        .into_inner();

    to_json_response(pantry)
}

#[post("/useProductInPantry/{name}/{quantity}/{unit}/{type}")]
async fn use_product_in_pantry(req: HttpRequest) -> impl Responder {
    let configs = get_properties();
    println!("Storage content requested.");
    let result = get_channel(&configs.product_storage_address, configs.product_storage_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
    println!("Channel to product_storage created");
    // Create a gRPC client for ProductStorage
    let mut client = ProductStorageClient::new(channel);
    println!("gRPC client created");

    let name = req.match_info().get("name").unwrap_or("Unknown Product").to_string();
    let quantity = req.match_info().get("quantity").unwrap_or("1").to_string();
    let unit_str = req.match_info().get("unit").unwrap_or("Packet");
    let ptype_str = req.match_info().get("type").unwrap_or("Other");
    let unit: i32 = unit_from_str(unit_str).into();
    let ptype: i32 = type_from_str(ptype_str).into();
    println!("{},{},{},{}", name, quantity, unit, ptype);
    // Creates a tonic::Request
    let request = tonic::Request::new(UsedItem {
        name,
        quantity: quantity.parse::<i32>().unwrap_or(1),
        unit,
        item_type: ptype,
    });
    println!("Request created");

    // Invio la richiesta e attendo la risposta:
    let response = CIRCUIT_BREAKER.lock().await.call(client.use_product_in_pantry(request))
        .await
        .unwrap_or(Response::new(OurResponse { msg: "Empty response".to_string() }))
        .into_inner();

    to_json_response(response)
}

/** NOTIFICATION API **/
#[get("/getNotifications")]
async fn get_notifications() -> impl Responder {
    let configs = get_properties();
    let result = get_channel(&configs.notifications_address, configs.notifications_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
    println!("Channel to notifications created!");
    let mut client = NotificationClient::new(channel);
    println!("gRPC client created");

    let request = tonic::Request::new(NotificationRequest {});
    let response = CIRCUIT_BREAKER.lock().await.call(client.get_notifications(request))
        .await
        .unwrap_or(Response::new(NotificationList {
            notification: vec![]
        })).into_inner();

    to_json_response(response)
}


/** SUMMARY API **/
#[get("/getWeekSummary")]
async fn get_week_summary() -> impl Responder {
    let configs = get_properties();
    let result = get_channel(&configs.summary_address, configs.summary_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
    println!("Channel to summary created");
    // Create a gRPC client for ProductStorage
    let mut client = SummaryClient::new(channel);
    println!("gRPC client created");

    let request = tonic::Request::new(SummaryRequest {});
    println!("Request created");

    // Invio la richiesta e attendo la risposta:
    let response = CIRCUIT_BREAKER.lock().await.call(client.week_summary(request))
        .await
        .unwrap_or(Response::new(SummaryData {
            reference: 0,
            most_used_product: "".to_string(),
            most_bought_product: "".to_string(),
            times_used: 0,
            times_bought: 0,
            number_expired: 0,
        }))
        .into_inner();

    to_json_response(response)
}


#[get("/getMonthSummary")]
async fn get_month_summary() -> impl Responder {
    let configs = get_properties();
    let result = get_channel(&configs.summary_address, configs.summary_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
    println!("Channel to summary created");
    // Create a gRPC client for ProductStorage
    let mut client = SummaryClient::new(channel);
    println!("gRPC client created");

    let request = tonic::Request::new(SummaryRequest {});
    println!("Request created");

    // Invio la richiesta e attendo la risposta:
    let response = CIRCUIT_BREAKER.lock().await.call(client.month_summary(request))
        .await
        .unwrap_or(Response::new(SummaryData {
            reference: 0,
            most_used_product: "".to_string(),
            most_bought_product: "".to_string(),
            times_used: 0,
            times_bought: 0,
            number_expired: 0,
        }))
        .into_inner();

    to_json_response(response)
}


#[get("/getTotalSummary")]
async fn get_total_summary() -> impl Responder {
    let configs = get_properties();
    let result = get_channel(&configs.summary_address, configs.summary_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
    println!("Channel to summary created");
    // Create a gRPC client for ProductStorage
    let mut client = SummaryClient::new(channel);
    println!("gRPC client created");

    let request = tonic::Request::new(SummaryRequest {});
    println!("Request created");

    // Invio la richiesta e attendo la risposta:
    let response = CIRCUIT_BREAKER.lock().await.call(client.total_summary(request))
        .await
        .unwrap_or(Response::new(SummaryData {
            reference: 0,
            most_used_product: "".to_string(),
            most_bought_product: "".to_string(),
            times_used: 0,
            times_bought: 0,
            number_expired: 0,
        }))
        .into_inner();

    to_json_response(response)
}

/** RECIPES APIS **/
#[get("/getRecipes")]
async fn get_recipes_from_pantry() -> impl Responder {
    let configs = get_properties();
    let result = get_channel(&configs.recipes_address, configs.recipes_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
    println!("Channel to recipes created");
    // Create a gRPC client for ProductStorage
    let mut client = RecipesClient::new(channel);
    println!("gRPC client created");

    let request = tonic::Request::new(RecipesRequest {});
    println!("Request created");

    // Invio la richiesta e attendo la risposta:
    let response = CIRCUIT_BREAKER.lock().await.call(client.get_recipes_from_pantry(request))
        .await
        .unwrap_or(Response::new(RecipeList { recipes: vec![] }))
        .into_inner();

    to_json_response(response)
}

#[get("/getRecipesWith/{commaSeparatedIngredients}")]
async fn get_recipes_from_ingredients(strings: web::Path<String>) -> impl Responder {
    let configs = get_properties();
    let result = get_channel(&configs.recipes_address, configs.recipes_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
    println!("Channel to recipes created");
    // Create a gRPC client for ProductStorage
    let mut client = RecipesClient::new(channel);
    println!("gRPC client created");

    let ingredients = strings.into_inner();

    let request = tonic::Request::new(IngredientsList {
        ingredients_list: ingredients.split(",").map(|s| Ingredient { name: s.to_string() }).collect(),
    });
    println!("Request created");

    // Invio la richiesta e attendo la risposta:
    let response = CIRCUIT_BREAKER.lock().await.call(client.get_recipes_from_ingredients(request))
        .await
        .unwrap_or(Response::new(RecipeList { recipes: vec![] }))
        .into_inner();

    to_json_response(response)
}

/** CONSUMPTIONS APIS **/

// // runs an online training method with the newly added or used product from product storage
// // this should be called by product storage!!
// async fn train_model() -> impl Responder {
//
// }
#[get("/predictConsumptions")]
async fn predict() -> impl Responder {
    let configs = get_properties();
    let result = get_channel(&configs.consumptions_address, configs.consumptions_port).await;
    if let Err(err) = result {
        return to_json_unavailable(err);
    }
    let channel = result.unwrap();
    println!("Channel to consumptions created");
    // Create a gRPC client for ProductStorage
    let mut client = EstimatorClient::new(channel);
    println!("gRPC client created");

    let request = tonic::Request::new(PredictRequest {});
    println!("Request created");

    // Invio la richiesta e attendo la risposta:
    let response = CIRCUIT_BREAKER.lock().await.call(client.predict(request))
        .await
        .expect("Failed to await response from consumptions!!!")
        .into_inner();

    to_json_response(response)
}


async fn get_channel(address: &String, port: i32) -> Result<Channel, failsafe::Error<tonic::transport::Error>> {
    let uri_str = format!("http://{}:{}", address, port);
    println!("{}", &uri_str);
    let uri = Uri::try_from(uri_str.clone()).expect(&format!("Error in creating uri {}", uri_str));
    println!("{:?}", &uri);
    let endpoint = Channel::builder(uri);
    CIRCUIT_BREAKER.lock().await.call(endpoint.connect()).await
}


// cargo run --bin client -- tuoiparametri
#[actix_web::main] // or #[tokio::main]
async fn main() -> std::io::Result<()> {
    let configs = get_properties();
    println!("inter container address: 0.0.0.0:{}, on the host: localhost:{}", configs.api_gateway_port, configs.api_gateway_port);
    HttpServer::new(|| {
        App::new()
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
            .service(get_notifications)
            .service(get_week_summary)
            .service(get_month_summary)
            .service(get_total_summary)
            .service(get_recipes_from_pantry)
            .service(get_recipes_from_ingredients)
            .service(predict)
    }).bind(("0.0.0.0", configs.api_gateway_port as u16))?
        .run()
        .await
}