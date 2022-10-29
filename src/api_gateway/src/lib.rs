pub mod shopping_list {
    // Serve a generare il codice automaticamente per i file .proto
    tonic::include_proto!("shopping_list");
    tonic::include_proto!("product_storage");
    tonic::include_proto!("recipes");
    tonic::include_proto!("consumptions");
    tonic::include_proto!("notifications");
    tonic::include_proto!("summary");
}