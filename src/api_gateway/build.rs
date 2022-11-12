fn main() {
    let proto_file_1 = "shopping_list.proto";
    let proto_file_2 = "product_storage.proto";
    let proto_file_3 = "recipes.proto";
    let proto_file_4 = "consumptions.proto";
    let proto_file_5 = "notifications.proto";
    let proto_file_6 = "summary.proto";

    tonic_build::configure()
        .build_server(true)
        .type_attribute(".", "#[derive(serde::Serialize, serde::Deserialize)]")
        .compile_well_known_types(true)
        .protoc_arg("--experimental_allow_proto3_optional")
        .compile(&[
            proto_file_1,
            proto_file_2,
            proto_file_3,
            proto_file_4,
            proto_file_5,
            proto_file_6], &["."])
        .unwrap_or_else(|e| panic!("protobuf compile error: {}", e));

    println!("cargo:rerun-if-changed={}", proto_file_1);
    println!("cargo:rerun-if-changed={}", proto_file_2);
    println!("cargo:rerun-if-changed={}", proto_file_3);
    println!("cargo:rerun-if-changed={}", proto_file_4);
    println!("cargo:rerun-if-changed={}", proto_file_5);
    println!("cargo:rerun-if-changed={}", proto_file_6);
}