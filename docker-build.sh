#!/bin/bash

if [[ $1 -eq 1 ]]
then
    echo "docker build src/microservices/shopping_list -t shopping_list"
    docker build src/microservices/shopping_list -t shopping_list

elif [[ $1 -eq 2 ]]
then
    echo "docker build src/microservices/product_storage -t product_storage"
    docker build src/microservices/product_storage -t product_storage

elif [[ $1 -eq 3 ]]
then
    echo "docker build src/microservices/recipes -t recipes"
    docker build src/microservices/recipes -t recipes

elif [[ $1 -eq 4 ]] 
then
    echo "docker build src/microservices/consumptions -t consumptions"
    docker build src/microservices/consumptions -t consumptions
    

elif [[ $1 -eq 5 ]] 
then

    echo "docker build src/microservices/notifications -t notifications"
    docker build src/microservices/notifications -t notifications

elif [[ $1 -eq 6 ]]
then
    echo "docker build src/microservices/summary -t summary"
    docker build src/microservices/summary -t summary

else 
    echo    "Usage:
./docker-build.sh [1-6] 
where 
    1 = shopping_list
    2 = product_storage
    3 = recipes
    4 = consumptions
    5 = notifications
    6 = summary"
fi
