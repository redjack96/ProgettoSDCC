import logging
from cassandra.cluster import Cluster
from pandas import DataFrame as df

logging.basicConfig(level=logging.INFO)
session = None


class Cassandra:
    def __init__(self):
        self.session, self.cluster = self.__cassandra_connection()
        self.__create_tables()

    @staticmethod
    def __cassandra_connection():
        """
        Connection object for Cassandra
        :return: session, cluster
        """
        global session
        cluster = Cluster(['cassandra'], port=9042)
        session = cluster.connect()
        session.execute("""
            CREATE KEYSPACE IF NOT EXISTS sdcc
            WITH REPLICATION =
            { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }
            """)
        session.set_keyspace('sdcc')
        return session, cluster

    def __create_tables(self):
        query = "CREATE TABLE cities (id int,name text,country text,PRIMARY KEY(id));"
        self.session.execute(query)

    def insert_entry(self):
        query_insert = "INSERT INTO cities(id,name,country) VALUES (1,'Karachi','Pakistan');"
        self.session.execute(query_insert)

    def select_entry(self):
        query_select = "SELECT * FROM cities;"
        rows = self.session.execute(query_select)
        for row in rows:
            print(row.age, row.name, row.username)
