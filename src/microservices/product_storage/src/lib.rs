pub mod shopping_list {
    // Serve a generare il codice automaticamente per i file .proto
    tonic::include_proto!("shopping_list");
}
pub mod product_storage {
    tonic::include_proto!("product_storage");
}
pub mod recipes {
    tonic::include_proto!("recipes");
}
pub mod consumptions {
    tonic::include_proto!("consumptions");
}
pub mod notifications {
    tonic::include_proto!("notifications");
}
pub mod summary {
    tonic::include_proto!("summary");
}
