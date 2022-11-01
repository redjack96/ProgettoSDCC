use sqlite3::{Connection};
use chrono::{TimeZone, Utc};
use crate::ProductItem;

#[derive(PartialEq, Eq)]
pub enum QueryType {
    Select,
    InsertNew,
    UpdateExisting,
}

pub struct Database {
    pub conn: Connection,
}

impl Database {
    pub fn new() -> Self {
        Database {
            conn: sqlite3::open("test.db").unwrap()
        }
    }

    pub fn create_table_products(&self) {
        println!("in create table products");
        self.conn
            .execute("CREATE TABLE if not exists Products (
                name TEXT,
                item_type INTEGER,
                unit INTEGER,
                quantity INTEGER,
                expiration DATETIME,
                last_used INTEGER,
                use_number INTEGER,
                total_used_number INTEGER,
                times_is_bought INTEGER,
                buy_date DATETIME
                );",
            ).expect("Create table failed!");
    }

    /// prepares a sql query. FIXME: it is vulnerable to SQL injection
    /// # Arguments
    ///
    /// * `product`: &ProductItem to select, insert, update or remove
    /// * `kind`: the kind of the query
    /// * `former_quantity`: only for updates: if not used, use 0
    /// * `former_expiration`: only for updates: if not used, use 0
    ///
    /// returns: String query
    pub fn prepare_product_statement(&self, product: &ProductItem, kind: QueryType, former_quantity: i32, former_expiration: i64) -> String {
        match kind {
            QueryType::Select => format!("SELECT * FROM Products WHERE name='{}' AND item_type='{}' AND unit='{}';", // TODO: forse type e unit non servono
                                         product.name.as_str(),
                                         product.item_type.to_string(),
                                         product.unit.to_string()),
            QueryType::InsertNew => format!("INSERT INTO Products (name,item_type,unit,quantity,\
            expiration,last_used,use_number,total_used_number,times_is_bought,buy_date) VALUES \
            ('{}','{}','{}','{}','{}','{}','{}','{}','{}','{}');",
                                            product.name, product.item_type, product.unit,
                                            product.quantity, product.expiration, product.last_used,
                                            product.use_number, product.total_used_number,
                                            product.times_is_bought, product.buy_date),
            QueryType::UpdateExisting => {
                // sums the quantity
                let new_quantity = former_quantity + product.quantity;
                // gets the most imminent expiration
                let new_expiration;
                if product.expiration >= former_expiration {
                    new_expiration = former_expiration;
                } else {
                    new_expiration = product.expiration;
                }
                format!("UPDATE Products \
                     SET quantity='{}', expiration='{}', buy_date='{}'\
                     WHERE name='{}';", new_quantity, new_expiration, product.buy_date, product.name)
                // TODO: aggiornare il numero di volte in cui è acquistato.
            }
        }
    }

    pub fn execute_select_query(&self, query: &str) -> Vec<ProductItem> {
        //TODO: ritorna errore se query non contiene select
        let mut cursor = self.conn
            .prepare(query)
            .unwrap()
            .cursor();

        // Puts elements retrieved into vector
        let mut v: Vec<ProductItem> = Vec::new();
        while let Ok(Some(row)) = cursor.next() {
            let name = row.get(0)
                .map_or("Unknown Product", |v| v.as_string().unwrap_or("Unknown Product"));
            let item_type = row.get(1)
                .map_or(0, |v| v.as_integer().unwrap_or(0));
            let unit = row.get(2)
                .map_or(0, |v| v.as_integer().unwrap_or(0));
            let quantity = row.get(3)
                .map_or(0, |v| v.as_integer().unwrap_or(0));
            let expiration_ts = row.get(4)
                .map_or(253370764800, |v| v.as_integer().unwrap_or(253370764800)); // per non renderlo la scadenza minima, se non sai qual è
            let expiration = Utc.timestamp(expiration_ts, 0);
            let last_used = row.get(5)
                .map_or(0, |v| v.as_integer().unwrap_or(0)); // se non sai quando è stato usato l'ultima volta, metti 0
            let use_number = row.get(6)
                .map_or(0, |v| v.as_integer().unwrap_or(0)); // se non sai quando è stato usato l'ultima volta, metti 0
            let total_used = row.get(7)
                .map_or(0, |v| v.as_integer().unwrap_or(0)); // se non sai quando è stato usato l'ultima volta, metti 0
            let times_is_bought = row.get(8)
                .map_or(0, |v| v.as_integer().unwrap_or(0)); // se non sai quando è stato usato l'ultima volta, metti 0
            let buy_date_ts = row.get(9)
                .expect("failed to get buy date timestamp")
                .as_integer()
                .unwrap();
            let buy_date = Utc.timestamp(buy_date_ts, 0);
            let item = ProductItem {
                name: name.to_string(),
                item_type: item_type as i32,
                unit: unit as i32,
                quantity: quantity as i32,
                expiration: expiration_ts,
                last_used,
                use_number: use_number as i32,
                total_used_number: total_used as i32,
                times_is_bought: times_is_bought as i32,
                buy_date: buy_date_ts,
            };
            v.push(item);
            println!("{}", name);
            println!("{}", quantity);
            println!("{}", buy_date);
            println!("{}", expiration);
        }
        return v;
    }

    pub fn execute_insert_update_or_delete(&self, query: &str) {
        self.conn.execute(query).expect("query cannot be executed");
    }
}