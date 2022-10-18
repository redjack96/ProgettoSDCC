FROM golang:latest

WORKDIR /usr/src/shopping_list
# TODO: per
COPY . .

# TODO: adesso compila ed esegue: finché programmiamo va bene, ma poi quando si rilascia è troppo pesante. Al rilascio, usare una multibuild (e.g. un altro FROM) per evitare di compilare ed eseguire ogni volta
CMD ["go", "run", "main/shopping_list.go"]