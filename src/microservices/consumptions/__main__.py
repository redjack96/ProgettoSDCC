# !/usr/bin/python
import sys

import server
import persistence


# python -m grpc_tools.protoc -I ../../proto --python_out=. --pyi_out=. --grpc_python_out=. ../../proto/*.proto
# --experimental_allow_proto3_optional

def exception_handler(exception_type, exception, traceback):
    # All your trace are belong to us!
    # your format
    print("%s: %s" % (exception_type.__name__, exception))


def main():
    # this is needed to print less stack trace!
    sys.excepthook = exception_handler

    # now just call everything, without threads
    cassandra_conn: persistence.Cassandra = persistence.Cassandra()
    cassandra_conn.init_database()
    server.serve(cassandra_conn)


main()
