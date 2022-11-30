# !/usr/bin/python
import sys
import server
import threading
import persistence


# python -m grpc_tools.protoc -I ../../proto --python_out=. --pyi_out=. --grpc_python_out=. ../../proto/*.proto
# --experimental_allow_proto3_optional

def exception_handler(exception_type, exception, traceback):
    # All your trace are belong to us! This is the format for the stack traces:
    print("%s: %s" % (exception_type.__name__, exception))


# global cassandra variable
cass: persistence.Cassandra


def connect_to_database():
    """
    Used to connect to Cassandra datastore
    """
    global cass
    cass = persistence.Cassandra()
    cass.init_database()


def main():
    # this is needed to print less stack trace!
    sys.excepthook = exception_handler

    # calling a thread to wait for cassandra to connect
    thread = threading.Thread(target=connect_to_database, args=())
    thread.start()
    thread.join()
    # only when connected to cassandra, we start the gRPC server
    server.serve(cass)


main()
