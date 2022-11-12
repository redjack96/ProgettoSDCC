import server
import persistence

# python -m grpc_tools.protoc -I ../../proto --python_out=. --pyi_out=. --grpc_python_out=. ../../proto/*.proto

print("Hello<3")
cass = persistence.Cassandra()
# cass.select_entries_for_product("SELECT * FROM dataset WHERE product_name='Pane';")
cass.select_entries_for_product('Pane')
server.serve()
