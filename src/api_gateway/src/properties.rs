#[derive(Default)]
pub struct Properties {
    pub shopping_list_port: i32,
    pub shopping_list_address: String,
    pub product_storage_port: i32,
    pub product_storage_address: String,
    pub recipes_port: i32,
    pub recipes_address: String,
    pub consumptions_port: i32,
    pub consumptions_address: String,
    pub notifications_port: i32,
    pub notifications_address: String,
    pub summary_port: i32,
    pub summary_address: String,
    pub api_gateway_port: i32,
    pub api_gateway_address: String,
    pub frontend_port: i32,
    pub frontend_address: String,
    pub mongodb_port: i32,
    pub mongodb_address: String,
}

pub fn get_properties() -> Properties {



    let mut x = Properties::default();
    x.api_gateway_port = 8007;
    x.shopping_list_port = 8001;
    x
}