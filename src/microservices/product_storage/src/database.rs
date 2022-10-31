use std::iter::Product;
use actix_web::http::header::q;
use sqlite3::{Connection, Value};
use crate::database::QueryType::{Insert, Select};
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
            let val = row.unwrap().get(0)
                .expect("Noneeee")
                .as_string()
                .unwrap();
            println!("{}", val)
        }
    }

    pub fn execute_insert_query(&self, query: &str) {
        self.conn
            .execute(query)
            .unwrap()
    }
}