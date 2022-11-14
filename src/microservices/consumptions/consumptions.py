import numpy as np
import pandas as pd
from numpy import ndarray
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import SGDRegressor  # Stochastic Gradient Descent Regressor
from sklearn.metrics import mean_absolute_error, mean_squared_error

import persistence


# n° settimana, nome prodotto, n° acquistati (nella settimana), n° scaduti, n° usati, avanzi della settimana
# precedente (inizialmente 0), [target: consumi] n° usati /  ( n° acquistati + n° Identifico il feature set e il
# label set prende tutte le righe e le colonne (di queste tutte tranne l'ultima)

def time_series_train_test_split(dataset: ndarray, train_rows: int):
    # train rows cambiano a ogni iterazione, rappresentano la settimana.
    # 1) train rows = settimana 1, testing settimane 2-20
    data_train = dataset[:train_rows]
    data_test = dataset[train_rows:train_rows + 1]  # dalla seconda in poi
    print("data_train: ", data_train)
    print("data_Test :", data_test)
    training_set = pd.DataFrame(data_train)
    testing_set = pd.DataFrame(data_test)
    # Identifico il feature set e il label set
    X_train = training_set.iloc[:, :-1].values
    y_train = training_set.iloc[:, -1].values
    X_test = testing_set.iloc[:, :-1].values
    y_test = testing_set.iloc[:, -1].values
    return X_train, X_test, y_train, y_test


def get_product_dataset(data, product_name):
    return data[data[:, 1] == product_name]


def order_by_week(dataset: ndarray):
    """
    Orders the dataset based on the week column value
    :param dataset: the dataset to order
    :return: the ordered dataset
    """
    print("Want to order dataset: ", dataset)
    data = dataset[dataset[:, 0].argsort()]
    return data


class ConsumptionEstimator:
    def __init__(self, cassandra: persistence.Cassandra):
        self.cassandra_conn = cassandra
        self.total_dataset = None
        self.product_list = ["Pane", "Mortadella", "Pasta"]
        self.week_indexes = {"Pane": 20, "Mortadella": 20,
                             "Pasta": 20}  # dizionario degli indici di split per ogni prodotto
        # SGD si adatta maggiormente in base agli ultimi dati analizzati. Piu' preciso rispetto al regressore base.
        # Se ci sono variazioni elevate, non funziona bene. Invece il Regressore lineare si basa su tutti i dati.
        self.model = SGDRegressor(fit_intercept=True, shuffle=False, warm_start=True, learning_rate='adaptive')
        self.product_datasets_dict = {}  # dizionario dei dataset per ogni prodotto
        self.product_X_train_dict = {}  # dizionario delle features di training per ogni prodotto
        self.product_X_test_dict = {}  # dizionario delle features di testing per ogni prodotto
        self.product_y_train_dict = {}  # dizionario dei valori target di training per ogni prodotto
        self.product_y_test_dict = {}  # dizionario dei valori target di testing per ogni prodotto
        self.product_last_y_pred = {}  # dizionario dei valori predetti per ogni prodotto
        print("Init ML pipeline")
        self.__init_train_dataset()

    def pipeline_training(self):
        # Update the total dataset
        self.total_dataset = self.__update_dataset()  # FIXME è necessario, ma bisogna ordinare il select da cassandra
        print("week indexes: ", self.week_indexes)

        for prod_name in self.product_list:
            print("Init dataset ", prod_name)
            self.__init_per_product_datasets(prod_name)
            print(self.product_datasets_dict[prod_name])
            print("Init preprocessing ", prod_name)
            self.__preprocessing(prod_name)
            print(self.product_datasets_dict[prod_name])
            current_week = self.week_indexes[prod_name]  # get the week index for the product selected
            if current_week == 1:
                # if there is only one observation, skip splitting and scaling
                continue
            for week_index in range(1, current_week):
                print("Splitting dataset ", prod_name)
                self.__split_training_testing(prod_name, week_index)
                print("Scaling dataset ", prod_name)  # serve a normalizzare le quantità alle percentuali
                self.__scaling(prod_name)
                print("Training dataset ", prod_name)
                self.__train_model(prod_name)

    def predict_consumptions(self):
        """
        Get consumption predictions
        :return: dictionary of consumption prediction for each product present
        """
        res = {}
        for prod in self.product_list:
            res[prod] = {}
            res[prod]["week"] = self.week_indexes[prod]
            res[prod]["predicted"] = self.product_last_y_pred[prod]
        return res

    def add_new_product(self, product_name: str):
        """
        Adds the product name to the product list and initializes week index
        :param product_name: the product to add
        :return: void
        """
        if self.product_list.__contains__(product_name):
            return
        else:
            self.product_list.append(product_name)
            self.week_indexes[product_name] = 0
        print("products list: ", self.product_list)

    def increment_week(self, product_name: str):
        old_idx = self.week_indexes[product_name]
        self.week_indexes[product_name] = old_idx + 1

    def __init_train_dataset(self):
        dataset = pd.read_csv('consumi-storage.csv', skipinitialspace=True)
        dataset.head()
        self.total_dataset = np.array(dataset.iloc[:, :].values)

        # train the initial dataset
        self.pipeline_training()

    def __init_per_product_datasets(self, prod_name):
        prod_data = get_product_dataset(self.total_dataset, prod_name)
        self.product_datasets_dict[prod_name] = prod_data

    def __update_dataset(self):
        dataset = self.cassandra_conn.select_all_entries()
        array = np.array(dataset.iloc[:, :].values)
        return order_by_week(array)

    def __preprocessing(self, prod_name):
        """
        Apply One-Hot encoding on the product name column of the dataset
        :param prod_name: the product name
        """
        # One-hot-encoding sulla colonna del nome del prodotto
        # transform column in array Encoder: (0...010...0). [1] second column.
        ct = ColumnTransformer(transformers=[('encoder', OneHotEncoder(), [1])], remainder='passthrough')
        self.product_datasets_dict[prod_name] = np.array(ct.fit_transform(self.product_datasets_dict.get(prod_name)))

    def __split_training_testing(self, prod_name, train_index):
        """
        Splits the dataset of each product in training and testing set
        :param prod_name: product name
        :param train_index: the product index for the split
        """
        print("Splitting dataset of product: ", prod_name)
        dataset = self.product_datasets_dict.get(prod_name)
        X_train, X_test, y_train, y_test = time_series_train_test_split(dataset, train_index)
        self.product_X_train_dict[prod_name] = X_train
        self.product_X_test_dict[prod_name] = X_test
        self.product_y_train_dict[prod_name] = y_train
        self.product_y_test_dict[prod_name] = y_test

    def __scaling(self, prod_name):
        """
        Scale values: this is important to get in scale prediction values
        :param prod_name: name of the product considered
        """
        sc = StandardScaler()
        self.product_X_train_dict[prod_name] = sc.fit_transform(self.product_X_train_dict.get(prod_name))
        self.product_X_test_dict[prod_name] = sc.transform(self.product_X_test_dict.get(prod_name))

    def __train_model(self, prod_name):
        """
        Apply partial fit on the train and test split considered of the product specified
        :param prod_name: the product specified
        """
        X_train = self.product_X_train_dict[prod_name]
        y_train = self.product_y_train_dict[prod_name]
        X_test = self.product_X_test_dict[prod_name]
        y_test = self.product_y_test_dict[prod_name]
        self.model.partial_fit(X_train, y_train)  # a differenza di fit, esegue un addestramento parziale di tipo
        # walk forward
        # (training 1, testing 2 .. training 1-2, testing 3 ..)
        y_pred = self.model.predict(X_test)
        self.product_last_y_pred[prod_name] = y_pred[0]
        # if week == last_week-1:
        print("y_pred:", y_pred)
        print("y_test:", y_test)
        print("MeanAbsErr :", mean_absolute_error(y_test, y_pred))
        print("MeanSquaresError:", np.sqrt(mean_squared_error(y_test, y_pred)))
