#!/bin/bash

if [[ $1 -eq 1 ]]
then
    echo "docker run shopping_list"
    docker run shopping_list

elif [[ $1 -eq 2 ]]
then

    echo "docker run product_storage"
    docker run  product_storage

elif [[ $1 -eq 3 ]]
then

    echo "docker run recipes"
    docker run recipes

elif [[ $1 -eq 4 ]] 
then

    echo "docker run consumptions" 
    docker run consumptions

elif [[ $1 -eq 5 ]] 
then

    echo "docker run notifications"
    docker run notifications

elif [[ $1 -eq 6 ]]
then

    echo "docker run summary"
    docker run summary

else 
    echo    "Usage:
./docker-run.sh [1-6] 
where 
    1 = shopping_list
    2 = product_storage
    3 = recipes
    4 = consumptions
    5 = notifications
    6 = summary
"

fi
