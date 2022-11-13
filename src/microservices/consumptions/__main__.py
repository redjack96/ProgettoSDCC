import server
import persistence
# !/usr/bin/python
from threading import Thread

# python -m grpc_tools.protoc -I ../../proto --python_out=. --pyi_out=. --grpc_python_out=. ../../proto/*.proto
# --experimental_allow_proto3_optional

cassandra_conn: persistence.Cassandra = persistence.Cassandra()


def init_cassandra(cassandra):
    cassandra.init_database()


# Create two threads as follows
try:
    t = Thread(target=init_cassandra, args=(cassandra_conn,))
    t.start()
    server.serve(cassandra_conn)
except OSError:
    print("Error: unable to start thread")
while 1:
    pass
