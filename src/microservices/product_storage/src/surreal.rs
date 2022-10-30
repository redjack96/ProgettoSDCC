use surrealdb::Datastore;
use surrealdb::Error;

pub async fn create_database() -> Datastore {
    Datastore::new("file://temp.db")
        .await
        .expect("Impossibile accedere al database")
}