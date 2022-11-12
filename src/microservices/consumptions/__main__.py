import server
import persistence
# !/usr/bin/python
import _thread


# python -m grpc_tools.protoc -I ../../proto --python_out=. --pyi_out=. --grpc_python_out=. ../../proto/*.proto --experimental_allow_proto3_optional

def wait_for_dataset_entries():
    print("Hello<3")
    cass = persistence.Cassandra()
    cass.select_entries_for_product('Pane')


# Create two threads as follows
try:
    _thread.start_new_thread(wait_for_dataset_entries, ())
    _thread.start_new_thread(server.serve(), ())
except OSError:
    print("Error: unable to start thread")
while 1:
    pass
