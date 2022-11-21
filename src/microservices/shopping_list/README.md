# Use MongoDB:
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