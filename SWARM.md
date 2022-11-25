# Deploy on Docker Swarm
1) Use `terraform apply` to run N=3 instances.
2) Connect with ssh to N=3 EC2 instances. 
Use the command with the public ip obtained from terraform output, for example in threee different terminals, use:

first shell: `ssh -i labsuser.pem ec2-user@34.234.91.106` (change the ip)

second shell: `ssh -i labsuser.pem ec2-user@54.172.40.156` (change the ip)

third shell: `ssh -i labsuser.pem ec2-user@54.211.66.163` (change the ip)

2) On one of the EC2 instance, use `hostname -i` or `ifconfig eth0`and copy the **private ip** that you get, for example "172.31.30.79".

3) On the same EC2 instance, use (use the correct ip)


    sudo docker swarm init --advertise-addr 172.31.30.79

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-1cvss9vzvptthzxbwzpvar0jvs7p9vy4gncvc77nxq627m3qok-bdlvgq9pl0ppgh0dbvxr3h3dw 172.31.30.79:2377

To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.

4) On the other EC2 instance, use the command obtained at the previous step

    
    docker swarm join --token SWMTKN-1-1cvss9vzvptthzxbwzpvar0jvs7p9vy4gncvc77nxq627m3qok-bdlvgq9pl0ppgh0dbvxr3h3dw 172.31.30.79:2377

5) [optional] Check active nodes with `docker node ls`. Example Output:
```console
   ID                            HOSTNAME                        STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
   qy3mkh9o7gnis0fj8pwxvoef7     ip-172-31-21-117.ec2.internal   Ready     Active                          20.10.17
   2h8rwv95gfnc8johu5ywop5ea     ip-172-31-24-128.ec2.internal   Ready     Active                          20.10.17
   uoh3cqbl1p8qke3orrir05nnc *   ip-172-31-30-79.ec2.internal    Ready     Active         Leader           20.10.17
```

6) Copy config.properties file into each of the ec2.

   
    ProgettoSDCC$ scp -i terraform/labsuser.pem config.properties ec2-user@<public-ip>:config.properties

7) Create an overlay network to connect all the services:

    
    docker network create --driver overlay sdcc-network

7) Now start the services in the LEADER node:

Mongo DB: TODO: add a volume for mongo!!!

   docker service create --hostname=mongo \
   --network sdcc-network \
   --publish target=27017,published=27017 \
   -e MONGO_INITDB_ROOT_USERNAME='root' \
   -e MONGO_INITDB_ROOT_PASSWORD='example' \
   mongo


Shopping List: 

    docker service create --hostname=shopping_list \
                          --mount source=~/config.properties,target=/usr/src/shopping_list/config.properties,type=bind \
                          --publish target=8001,published=8001 \
                          --network sdcc-network redjack96/shopping_list 



Api Gateway:

    docker service create --hostname=api_gateway \
                        --mount source=~/config.properties,target=/api_gateway/config.properties,type=bind \
                        --network sdcc-network \
                        --publish target=8007,published=8007 \
                        redjack96/api_gateway

8) To remove all services

    
    docker service rm $(docker service ls -q)

9) To destroy the swarm:


    