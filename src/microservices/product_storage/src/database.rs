use std::fmt::format;
use std::iter::Product;
use actix_web::http::header::q;
use sqlite3::{Connection, Value};
use crate::database::QueryType::{Insert, Select};
use chrono::{DateTime, TimeZone, Utc};
use crate::ProductItem;

#[derive(PartialEq)]
pub enum QueryType {
    Select,
    Insert
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

    pub fn prepare_product_statement(&self, product: &ProductItem, kind: QueryType) -> String {
        if kind == Select {
            format!("SELECT * FROM Products WHERE name='{}';", product.name)
        } else {
            format!("INSERT INTO Products (name,type,unit,quantity,expiration,buy_date) \
            VALUES ('{}','{}','{}','{}','{}','{}');",
                    product.name,
                    product.item_type,
                    product.unit,
                    product.quantity,
                    product.expiration,
                    product.buy_date)
        }
    }

    pub fn execute_select_query(&self, query: &str) {
        //TODO: ritorna errore se query non contiene select
        let mut cursor = self.conn
            .prepare(query)
            .unwrap()
            .cursor();

        while let Ok(row) = cursor.next() {
            let name = row.unwrap().get(0)
                .expect("Noneeee")
                .as_string()
                .unwrap();
            let quantity = row.unwrap().get(3)
                .expect("Noneeee")
                .as_integer()
                .unwrap();
            let expiration_ts = row.unwrap().get(4)
                .expect("Noneeee")
                .as_integer()
                .unwrap();
            let expiration = Utc.timestamp(expiration_ts, 0);
            let buy_date_ts = row.unwrap().get(5)
                .expect("Noneeee")
                .as_integer()
                .unwrap();
            let buy_date = Utc.timestamp(buy_date_ts, 0);
            println!("{}", name);
            println!("{}", quantity);
            println!("{}", buy_date);
            println!("{}", expiration);
        }
    }

    pub fn execute_insert_query(&self, query: &str) {
        self.conn
            .execute(query)
            .unwrap()
    }
}