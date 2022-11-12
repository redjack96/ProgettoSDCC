import logging
from cassandra.cluster import Cluster
from cassandra.concurrent import execute_concurrent_with_args
from pandas import DataFrame as df
import pandas as pd

logging.basicConfig(level=logging.INFO)
session = None


def read_csv(filename: str):
    dataset = pd.read_csv(filename, skipinitialspace=True, skiprows=0)
    dataset = dataset.reset_index()  # mi assicuro che l'indice parta da 0
    return dataset


class Cassandra:
    def __init__(self):
        self.session, self.cluster = self.__cassandra_connection()
        self.__create_tables()
        self.__create_index()
        self.__populate_tables("consumi-storage.csv")

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
        query = "CREATE TABLE IF NOT EXISTS dataset " \
                "(week_num int, product_name text, n_bought int, n_expired int, n_used int, n_rem int, " \
                "consumption float," \
                "PRIMARY KEY(week_num, product_name));"
        self.session.execute(query)

    def __create_index(self):
        query = "CREATE INDEX IF NOT EXISTS productIndex ON dataset (product_name);"
        self.session.execute(query)

    def __populate_tables(self, dataset_filename: str):
        dataset = read_csv(dataset_filename)
        for index, row in dataset.iterrows():
            week = row["settimana"]
            name = row["prodotto"]
            bought = row["acquistati (Grammi)"]
            expired = row["scaduti (Grammi)"]
            used = row["usati (Grammi)"]
            rem = row["avanzi_settimana (Grammi)"]
            consumption = row["consumi(Grammi/Settimana)"]
            self.insert_entry([(week, name, bought, expired, used, rem, consumption)])
        print("Tables are populated.")

    def insert_entry(self, zipped_args: list):
        query_insert = "INSERT INTO dataset (week_num, product_name, n_bought, n_expired, n_used, n_rem, consumption) " \
                       "VALUES (?,?,?,?,?,?,?);"
        prepare = self.session.prepare(query_insert)
        execute_concurrent_with_args(self.session, prepare, zipped_args)

    def select_entries_for_product(self, product: str):
        query_select = prepare_select_query(product)
        print(query_select)
        rows = self.session.execute(query_select)
        for row in rows:
            print(row.week_num, row.product_name, row.consumption)

    def select_all_entries(self):
        query_select = "SELECT * FROM dataset;"
        rows = self.session.execute(query_select)
        for row in rows:
            print(row.week_num, row.product_name, row.consumption)


def prepare_select_query(product: str):
    query_first = "SELECT * FROM dataset WHERE product_name="
    prod = f"'{product}'"
    query_last = ";"  # cannot use prepared statement
    return query_first+prod+query_last
