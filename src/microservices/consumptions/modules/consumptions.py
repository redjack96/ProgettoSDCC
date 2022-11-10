import sys

import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import SGDRegressor, LinearRegression  # Stochastic Gradient Descent Regressor
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error


class ConsumptionDataset:
    def __init__(self):
        self.X = None
        self.y = None
        self.X_train = None
        self.X_test = None
        self.y_train = None
        self.y_test = None
        self.model = None
        self.y_pred = None
        self.__pipeline()

    def __pipeline(self):
        self.__load_dataset()
        self.__preprocessing()
        self.__split_training_testing()
        self.__scaling()
        self.train_model()

    def __load_dataset(self):
        from sklearn.linear_model import LinearRegression
        print("What we have to estimate here?")
        dataset = pd.read_csv('../consumi-storage.csv')
        dataset.head()

        # n° settimana, nome prodotto, n° acquistati (nella settimana), n° scaduti, n° usati, avanzi della settimana
        # precedente (inizialmente 0), [target: consumi] n° usati /  ( n° acquistati + n° Identifico il feature set e il
        # label set prende tutte le righe e le colonne (di queste tutte tranne l'ultima)
        self.X = dataset.iloc[:, :-1].values  # feature set
        self.y = dataset.iloc[:, -1].values  # label/target

    def __preprocessing(self):
        # one-encode sulla colonna del nome del prodotto
        # transform column in array Encoder: (0...010...0). [1] second column.
        ct = ColumnTransformer(transformers=[('encoder', OneHotEncoder(), [1])], remainder='passthrough')
        self.X = np.array(ct.fit_transform(self.X))

    def __split_training_testing(self):
        self.X_train, self.X_test, self.y_train, self.y_test = train_test_split(self.X, self.y, test_size=0.2, random_state=0)

    def __scaling(self):
        sc = StandardScaler()
        self.X_train = sc.fit_transform(self.X_train)
        self.X_test = sc.transform(self.X_test)

    def train_model(self):
        self.model = LinearRegression().fit(self.X_train, self.y_train)

    def predict_consumptions(self):
        self.y_pred = self.model.predict(self.X_test)
        print("y_pred:", self.y_pred)
        print("y_test:", self.y_test)
        print("R^2 : ", r2_score(self.y_test, self.y_pred))
        print("MeanAbsErr :", mean_absolute_error(self.y_test, self.y_pred))
        print("MeanSquaresError:", np.sqrt(mean_squared_error(self.y_test, self.y_pred)))
