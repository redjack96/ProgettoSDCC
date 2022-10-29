# S.D.C.C. Shopping List
Smart Distributed Capable & Consumption-Aware Shopping list. 
A smart automated shopping list, built with microservices.

_Definitely not the final project of Distributed Systems and Cloud Computing._
## Microservices
This project is made of 6 microservices:

1. **ShoppingListService**: implements the shopping list (Golang)
2. **ProductStorageService**: implements the house pantry and storage with bought items (Rustlang). Stateful.
3. **RecipesService**: gives hint on recipes based on the product storage service. (Golang)
4. **ConsumptionsService**: predicts consumption of the product to automatically update the shopping list. (Python)
5. **NotificationsService**: sends e-mail or push notifications when an item is about to expire or a recipe can be done. (Java)
6. **SummaryService**: computes the summary statistics about shopped, used and expired item last week or last month. (Java)

TODO:_ ShoppingListService and ProductStorageService communication is decoupled with the usage of Kafka Publish Subscribe Framework.

TODO: The following pattern are implemented:

- Circuit Breaker:
- Database per Service:
- API Gateway: implemented in Rust. It's a REST API server (built with crate actix-web) and a grpc client (with crates prost+tonic). 

## Development Build single container

Use docker-build.sh with a number 1-6

```console
$ ./docker-build.sh [1-6]
```
## Build and Run single container (compose service)

```console
$ docker compose up <service> --build
```
for example:
```console
$ docker compose up shopping_list --build
```

## TODO: Release Run

Use docker-compose:

```console
$ docker-compose up -d
```

## Frontend UI

TODO!

## DEV
### Use MongoDB:
Call the following command from terminal to run mongo container
```console
$ docker exec -it mongo /bin/bash
```
Run the following command to activate mongo shell:
```console
$ mongosh
```
Once in the mongo shell, run the following command to authenticate
```console
> use admin
> admin.auth("user-name", "password")
```

Some useful mongo commands:
- show dbs: shows all the available databases
- use <dbs-name>: switches context to a certain database (creates a new one if not existing)
- db.<collection-name>.insertOne({att1: <attr1>, ...}): insert one single element
- db.<collection-name>.insertMany({...}, {...}): insert many elements
- db.<collection-name>.find(): search for alla elements in a collection
