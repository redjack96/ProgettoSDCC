#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

echo "Copying proto files in product_storage"
find "${SCRIPT_DIR}/src/proto" -name \*.proto -exec cp {} "${SCRIPT_DIR}/src/microservices/product_storage" \;
echo "Copying proto files in api_gateway"
find "${SCRIPT_DIR}/src/proto" -name \*.proto -exec cp {} "${SCRIPT_DIR}/src/api_gateway" \;
echo "Copying proto files in summary"
find "${SCRIPT_DIR}/src/proto" -name \*.proto -exec cp {} "${SCRIPT_DIR}/src/microservices/summary/src/main/proto" \;
echo "Copying proto files in notifications"
find "${SCRIPT_DIR}/src/proto" -name \*.proto -exec cp {} "${SCRIPT_DIR}/src/microservices/notifications/src/main/proto" \;

cd "${SCRIPT_DIR}/src/microservices/shopping_list" || exit
echo "Generating Go GRPC files for shopping_list"
protoc --proto_path ../../proto --go_out generated --go-grpc_out generated ../../proto/*.proto --experimental_allow_proto3_optional

cd "${SCRIPT_DIR}/src/microservices/recipes" || exit
echo "Generating Go GRPC files for recipes"
protoc --proto_path ../../proto --go_out generated --go-grpc_out generated ../../proto/*.proto --experimental_allow_proto3_optional

cd "${SCRIPT_DIR}/src/microservices/consumptions" || exit

echo "Generating Python GRPC files"
python3 -m grpc_tools.protoc -I ../../proto --python_out=. --pyi_out=. --grpc_python_out=. ../../proto/*.proto --experimental_allow_proto3_optional




