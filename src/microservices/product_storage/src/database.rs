use std::any::Any;
use std::fmt::format;
use std::iter::Product;
use actix_web::http::header::q;
use sqlite3::{Connection, Value};
use crate::database::QueryType::{InsertNew, Select, UpdateExisting};
use chrono::{DateTime, TimeZone, Utc};
use crate::ProductItem;

#[derive(PartialEq)]
pub enum QueryType {
    Select,
    InsertNew,
    UpdateExisting
}

pub struct Database {
    pub conn: Connection,
}

impl Database {
    pub fn new() -> Self {
        println!("in new");
        Database {
            conn: sqlite3::open("test.db").unwrap()
        }
    }

    pub fn create_table_products(&self) {
        println!("in create table products");
        self.conn
            .execute(
                "
        CREATE TABLE if not exists Products (
        name TEXT,
        type INTEGER,
        unit INTEGER,
        quantity INTEGER,
        expiration DATETIME,
        buy_date DATETIME);
        ",
            )
            .unwrap()
    }

    pub fn prepare_product_statement(&self, product: &ProductItem, kind: QueryType, former_quantity: i32, former_expiration: i64) -> String {
        if kind == Select {
            format!("SELECT * FROM Products WHERE name='{}' AND type='{}' AND unit='{}';",
                    product.name.as_str(),
                    product.item_type.to_string(),
                    product.unit.to_string())
        } else if kind == InsertNew {
            format!("INSERT INTO Products (name,type,unit,quantity,expiration,buy_date) \
            VALUES ('{}','{}','{}','{}','{}','{}');",
                    product.name.as_str(),
                    product.item_type.to_string(),
                    product.unit.to_string(),
                    product.quantity.to_string(),
                    product.expiration.to_string(),
                    product.buy_date.to_string())
        } else {
            let new_quantity = former_quantity + product.quantity;
            let mut new_expiration;
            if product.expiration >= former_expiration {
                new_expiration = former_expiration;
            } else {
                new_expiration = product.expiration;
            }
            format!("UPDATE Products \
                     SET quantity='{}', expiration='{}', buy_date='{}'\
                     WHERE name='{}';",
                    new_quantity.to_string(),
                    new_expiration.to_string(),
                    product.buy_date.to_string(),
                    product.name.as_str())
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
                .expect("None")
                .as_string()
                .unwrap();
            let item_type = row.get(1)
                .expect("None")
                .as_integer()
                .unwrap();
            let unit = row.get(2)
                .expect("None")
                .as_integer()
                .unwrap();
            let quantity = row.get(3)
                .expect("None")
                .as_integer()
                .unwrap();
            let expiration_ts = row.get(4)
                .expect("None")
                .as_integer()
                .unwrap();
            let expiration = Utc.timestamp(expiration_ts, 0);
            let buy_date_ts = row.get(5)
                .expect("None")
                .as_integer()
                .unwrap();
            let buy_date = Utc.timestamp(buy_date_ts, 0);
            let item = ProductItem {
                name: name.to_string(),
                item_type: item_type as i32,
                unit: unit as i32,
                quantity: quantity as i32,
                expiration: expiration_ts,
                buy_date: buy_date_ts
            };
            v.push(item);
            println!("{}", name);
            println!("{}", quantity);
            println!("{}", buy_date);
            println!("{}", expiration);
        }
        return v;
    }

    pub fn execute_insert_query(&self, query: &str) {
        self.conn
            .execute(query)
            .unwrap()
    }
}