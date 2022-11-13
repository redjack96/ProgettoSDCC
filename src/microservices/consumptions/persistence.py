import logging
from cassandra.cluster import Cluster
import time
from cassandra.concurrent import execute_concurrent_with_args
from pandas import DataFrame as df
import pandas as pd

import consumptions_pb2

logging.basicConfig(level=logging.INFO)
session = None


def read_csv(filename: str):
    dataset = pd.read_csv(filename, skipinitialspace=True, skiprows=0)
    dataset = dataset.reset_index()  # mi assicuro che l'indice parta da 0
    return dataset


def prepare_select_query(product: str):
    query_first = "SELECT * FROM dataset WHERE product_name="
    prod = f"'{product}'"
    query_last = ";"  # cannot use prepared statement
    return query_first + prod + query_last


def prepare_select_week_query(product: str, week_num: int):
    query_first = "SELECT * FROM dataset WHERE week_num="
    week = str(week_num)
    query_mid = " AND product_name="
    prod = f"'{product}'"
    query_last = ";"  # cannot use prepared statement
    print(query_first + week + query_mid + prod + query_last)
    return query_first + week + query_mid + prod + query_last


def prepare_update_query(type_update: consumptions_pb2.ObservationType, old_quantity: int,
                         week_num: int, product_name: str, new_quantity: int):
    # select previous value of observation in database
    week_str = str(week_num)
    total_str = str(old_quantity + new_quantity)
    prod = f"'{product_name}'"
    query_2 = " WHERE week_num="
    query_3 = " AND product_name= "
    query_end = ";"
    if type_update == consumptions_pb2.added:
        query_1 = "UPDATE dataset SET n_bought="
    elif type_update == consumptions_pb2.expired:
        query_1 = "UPDATE dataset SET n_expired="
    elif type_update == consumptions_pb2.used:
        query_1 = "UPDATE dataset SET n_used="
    else:
        return ""
    print(query_1 + total_str + query_2 + week_str + query_3 + prod + query_end)
    return query_1 + total_str + query_2 + week_str + query_3 + prod + query_end


def convert_rows_to_dataframe(rows):
    data = []
    for row in rows:
        week = row.week_num
        prod = row.product_name
        bought = row.n_bought
        expired = row.n_expired
        used = row.n_used
        rem = row.n_rem
        consumption = row.consumption
        data.append([week, prod, bought, expired, used, rem, consumption])
        # convert data list to DataFrame
    print(pd.DataFrame(data,
                       columns=['week_num', 'product_name', 'n_bought', 'n_expired', 'n_used', 'n_rem', 'consumption']))
    return pd.DataFrame(data,
                        columns=['week_num', 'product_name', 'n_bought', 'n_expired', 'n_used', 'n_rem', 'consumption'])


class Cassandra:
    def __init__(self):
        self.session, self.cluster = self.__cassandra_connection()

    def init_dataset(self):
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
            self.insert_entry([week, name, bought, expired, used, rem, consumption])
        print("Tables are populated.")

    def update_entry(self, week_num: int, product_name: str, new_quantity: int,
                     type_update: consumptions_pb2.ObservationType):
        # select previous value of observation in database
        entry = self.select_entries_for_week_product(week_num, product_name)
        if entry.size == 0:  # if no previous observation for week and product are found, insert it
            print("No previous observations")
            if type_update == consumptions_pb2.added:
                self.insert_entry([week_num, product_name, new_quantity, 0, 0, 0, 0.0])
            elif type_update == consumptions_pb2.used:
                self.insert_entry([week_num, product_name, 0, 0, new_quantity, 0, 0.0])
            elif type_update == consumptions_pb2.expired:
                self.insert_entry([week_num, product_name, 0, new_quantity, 0, 0, 0.0])
        else:
            # check which quantity is to be updated
            print("Yes previous observation")
            if type_update == consumptions_pb2.added:
                old_quantity = entry.iloc[0]["n_bought"]
            elif type_update == consumptions_pb2.used:
                old_quantity = entry.iloc[0]["n_used"]
            elif type_update == consumptions_pb2.expired:
                old_quantity = entry.iloc[0]["n_expired"]
            else:
                old_quantity = 0
            print("old_quantity: ", old_quantity)
            print("week_num: ", week_num)
            print("product_name: ", product_name)
            print("new_quantity: ", new_quantity)
            print("type update: ", consumptions_pb2.ObservationType.Name(type_update))
            query_update = prepare_update_query(type_update, old_quantity, week_num, product_name, new_quantity)
            self.session.execute(query_update)

    def insert_entry(self, zipped_args: list):
        print("zipped args: ", zipped_args)
        query_insert = "INSERT INTO dataset (week_num, product_name, n_bought, n_expired, n_used, n_rem, consumption) " \
                       "VALUES (?,?,?,?,?,?,?);"
        stmt = self.session.prepare(query_insert)
        query = stmt.bind(zipped_args)
        self.session.execute(query)

    def select_entries_for_product(self, product: str):
        """
        Selects some observation given a product name
        :param product:
        :return: A DataFrame of the observations selected
        """
        query_select = prepare_select_query(product)
        rows = self.session.execute(query_select)
        return convert_rows_to_dataframe(rows)

    def select_entries_for_week_product(self, week_num: int, product: str):
        """
        Selects some observation given a product name and a week number
        :param week_num:
        :param product:
        :return: A DataFrame of the observations selected
        """
        query_select = prepare_select_week_query(product, week_num)
        rows = self.session.execute(query_select)
        return convert_rows_to_dataframe(rows)

    def select_all_entries(self):
        """
        Selects all the observations
        :return: A DataFrame of the observations selected
        """
        query_select = "SELECT * FROM dataset;"
        rows = self.session.execute(query_select)
        return convert_rows_to_dataframe(rows)
