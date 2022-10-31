use sqlite3::{Connection, Value};

pub struct Database {
    pub conn: Connection
}

impl Database {
    pub fn new() -> Self {
        Database {
            conn: sqlite3::open("data.db").unwrap()
        }
    }

    pub fn create_table_products(&self) {
        self.conn
            .execute(
                "
        CREATE TABLE products (
        id INTEGER,
        name TEXT,
        type INTEGER,
        unit INTEGER,
        quantity INTEGER,
        expiration DATETIME);
        ",
            )
            .unwrap()
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
        //TODO: ritorna errore se query non contiene insert
        self.conn
            .execute(query)
            .unwrap()
    }
}