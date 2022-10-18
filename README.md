# SDCC Final Project
A smart automated shopping list, built with microservices.

## Microservices
This project is made of by 6 microservices:

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
- API Gateway:

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