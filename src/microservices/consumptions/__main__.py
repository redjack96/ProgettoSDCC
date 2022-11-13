import server
import persistence
# !/usr/bin/python
import _thread


# python -m grpc_tools.protoc -I ../../proto --python_out=. --pyi_out=. --grpc_python_out=. ../../proto/*.proto
# --experimental_allow_proto3_optional
def init_connection_and_datasets():
    cassandra = persistence.Cassandra()
    cassandra.init_dataset()


# Create two threads as follows
try:
    _thread.start_new_thread(init_connection_and_datasets, ())
    server.serve()
except OSError:
    print("Error: unable to start thread")
while 1:
    pass
