# Deploy on Docker Swarm
1) Use `terraform apply` to run N=3 instances.
2) Connect with ssh to N=3 EC2 instances. 

   Use the command with the public ip obtained from terraform output, for example in threee different terminals, use:

   first shell: `ssh -i labsuser.pem ec2-user@34.234.91.106` (change the ip)

   second shell: `ssh -i labsuser.pem ec2-user@54.172.40.156` (change the ip)

   third shell: `ssh -i labsuser.pem ec2-user@54.211.66.163` (change the ip)

   [optional] On one of the EC2 instance, use `hostname -i` or `ifconfig eth0`and copy the **private ip** that you get, for example "172.31.30.79".

3) On the same EC2 instance, use


      docker swarm init --advertise-addr $(hostname -i)

   To add a worker to this swarm, run the following command (_this is an example_):

      docker swarm join --token SWMTKN-1-1cvss9vzvptthzxbwzpvar0jvs7p9vy4gncvc77nxq627m3qok-bdlvgq9pl0ppgh0dbvxr3h3dw 172.31.30.79:2377

   To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.

4) On the other EC2 instances, use the command obtained at the previous step

    
    docker swarm join --token SWMTKN-1-1cvss9vzvptthzxbwzpvar0jvs7p9vy4gncvc77nxq627m3qok-bdlvgq9pl0ppgh0dbvxr3h3dw 172.31.30.79:2377

[optional] Check active nodes with `docker node ls`. Example Output:
```console
   ID                            HOSTNAME                        STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
   qy3mkh9o7gnis0fj8pwxvoef7     ip-172-31-21-117.ec2.internal   Ready     Active                          20.10.17
   2h8rwv95gfnc8johu5ywop5ea     ip-172-31-24-128.ec2.internal   Ready     Active                          20.10.17
   uoh3cqbl1p8qke3orrir05nnc *   ip-172-31-30-79.ec2.internal    Ready     Active         Leader           20.10.17
```

5) On your PC, use the script copy-files-to-ec2.sh for each of the EC2 instance, it will ask you for the public ip to copy to.
IMPORTANT: The files must be copied on all EC2 instances!!


      sh copy-files-to-ec2.sh

Alternatively, use these commands with the public ip of each EC2 istance

      ProgettoSDCC$ scp -i terraform/labsuser.pem config.properties ec2-user@<public-ip>:config.properties
      ProgettoSDCC$ scp -i terraform/labsuser.pem docker-stack.yml ec2-user@<public-ip>:docker-stack.yml

6) Now start the services in the LEADER node from the docker-stack.yml file (copied at step 6):

      
      docker network create -d overlay overlay_net
      docker stack deploy -c docker-stack.yml sdcc-demo

   To check running services in the docker swarm's stack:

      docker stack services sdcc-demo

   To check containers in the stack

      docker stack ps sdcc-demo

   To check logs of a service (for example api_gateway service). Note that the stack name is concatenated with service name in stack.yml to get full docker service name

      docker service logs sdcc-demo_api_gateway
   
   To get container ip:

      docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container_name_or_id


7) To remove the stack


      docker stack rm sdcc-demo

## (deprecated) Deploy services one by one 
Alternatively you could run all containers one by one:

Mongo DB:

   docker service create --hostname=mongo \
   --network sdcc-network \
   --publish target=27017,published=27017 \
   --env MONGO_INITDB_ROOT_USERNAME=root \
   --env MONGO_INITDB_ROOT_PASSWORD=example \
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

To destroy all services

    
    docker service rm $(docker service ls -q)


    