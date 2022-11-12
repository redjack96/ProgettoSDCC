import server
import persistence

# python -m grpc_tools.protoc -I ../../proto --python_out=. --pyi_out=. --grpc_python_out=. ../../proto/*.proto

print("Hello<3")
cass = persistence.Cassandra()
cass.insert_entry()
cass.select_entry()
server.serve()
