import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
print("What we have to estimate here?")
dataset = pd.read_csv('consumi-storage.csv')
dataset.head()

# n° settimana, nome prodotto, n° acquistati (nella settimana), n° scaduti, n° usati, avanzi della settimana
# precedente (inizialmente 0), [target: consumi] n° usati /  ( n° acquistati + n° Identifico il feature set e il
# label set prende tutte le righe e le colonne (di queste tutte tranne l'ultima)
X = dataset.iloc[:, :-1].values  # feature set
y = dataset.iloc[:, -1].values  # label/target
print(X)
print(y)
