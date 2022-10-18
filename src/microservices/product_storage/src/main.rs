enum Unit{
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

fn main() {
    println!("Rust to the rescue!");
}