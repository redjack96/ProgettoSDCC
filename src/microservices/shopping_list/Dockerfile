FROM golang:latest
WORKDIR /usr/src/shopping_list
# Copy go.mod and go.sum files to workspace
COPY . .
# Get dependencies, will also be cached if you don't change mod/sum
RUN go get -d ./...
RUN export PATH="$PATH:$(go env GOPATH)/bin"
# TODO: adesso compila ed esegue: finché programmiamo va bene, ma poi quando si rilascia è troppo pesante. Al rilascio, usare una multibuild (e.g. un altro FROM) per evitare di compilare ed eseguire ogni volta
CMD ["go", "run", "main/shopping_list.go"]