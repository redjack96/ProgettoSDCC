# Manual Deploy on Docker Swarm
1) Use `terraform apply` to run N=3 instances.
2) Connect with ssh to N=3 EC2 instances. 

   Use the command with the public ip obtained from terraform output, for example in threee different terminals, use:

   first shell: `ssh -i labsuser.pem ec2-user@34.234.91.106` (change the ip)

   second shell: `ssh -i labsuser.pem ec2-user@54.172.40.156` (change the ip)

   third shell: `ssh -i labsuser.pem ec2-user@54.211.66.163` (change the ip)

   [optional] On one of the EC2 instance, use `hostname -i` or `ifconfig eth0`and copy the **private ip** that you get, for example "172.31.30.79".

3) On one of the EC2 instance, use
   ```
   <ec2-swarm-leader>$ docker swarm init --advertise-addr $(hostname -i)
   ```
4) On the other 2 EC2 instances, use the command obtained at the previous step
   ```
   <ec2-swarm-worker>$ docker swarm join --token SWMTKN-1-1cvss9vzvptthzxbwzpvar0jvs7p9vy4gncvc77nxq627m3qok-bdlvgq9pl0ppgh0dbvxr3h3dw 172.31.30.79:2377
   ```
   Check active nodes with `docker node ls`. Example Output:
   ```console
   ID                            HOSTNAME                        STATUS    AVAILABILITY   MANAGER STATUS   ENGINE VERSION
   qy3mkh9o7gnis0fj8pwxvoef7     ip-172-31-21-117.ec2.internal   Ready     Active                          20.10.17
   2h8rwv95gfnc8johu5ywop5ea     ip-172-31-24-128.ec2.internal   Ready     Active                          20.10.17
   uoh3cqbl1p8qke3orrir05nnc *   ip-172-31-30-79.ec2.internal    Ready     Active         Leader           20.10.17
   ```
5) On your PC, use this ANSIBLE command to copy files to each of the EC2 instance.

   ```
   ansible$ ansible-playbook playbook-copyfiles.yaml -i inventory.yaml
   ```
   
6) Now start the services from the LEADER node with the docker-stack.yml file (copied at previous step). **Most of the following command can only be used in the leader node.**

   [needed] **To deploy the stack with the entire application (Leader-only)**
   ```
   docker stack deploy -c docker-stack.yml sdcc-demo
   ```
   [good to use - which service are running] To check running services (and their replication) in the docker swarm's stack (Leader-only):
   ```
   docker stack services sdcc-demo
   ```   
   Alternatively (Leader only):
   ```   
   docker service ls
   ```
   [which container are running correctly] To check containers in the stack (Leader-only)
   ```
   docker stack ps sdcc-demo
   ```
   [which container are running in the node] To check the container running in one node:
   ```
   docker ps
   ```
   [to debug] To check logs (Leader-only) of a service (for example api_gateway service). Note that the stack name is concatenated with service name in stack.yml to get full docker service name
   ```
   docker service logs sdcc-demo_api_gateway
   ```
   Alternatively, in the correct node you can simply use:
   ```
   docker logs <container-id>
   ```
   [for reference] To get container ip (on the correct node):
   ```
   docker inspect -f '{{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}' <container_name_or_id>
   ```
   [needed to stop] **To remove the stack (Leader only), with all internal volume and networks**
   ```   
   docker stack rm sdcc-demo
   ```
   [optional] To leave the swarm: this can be avoided if you directly run `terraform destroy`, but you will lose all data in this way.
   ```
   docker swarm leave [-f]
   ```

## (deprecated) Deploy services one by one 
Alternatively, if you like losing time, you could create all service one by one:

Mongo DB:

```
docker service create --hostname=mongo \
                     --network sdcc-network \
                     --publish target=27017,published=27017 \
                     --env MONGO_INITDB_ROOT_USERNAME=root \
                     --env MONGO_INITDB_ROOT_PASSWORD=example \
                     mongo
```

Shopping List: 
```
docker service create --hostname=shopping_list \
                    --mount source=~/config.properties,target=/usr/src/shopping_list/config.properties,type=bind \
                    --publish target=8001,published=8001 \
                    --network sdcc-network redjack96/shopping_list 
```


Api Gateway:
```
docker service create --hostname=api_gateway \
                  --mount source=~/config.properties,target=/api_gateway/config.properties,type=bind \
                  --network sdcc-network \
                  --publish target=8007,published=8007 \
                  redjack96/api_gateway
```
And so on.

To destroy all services
```
docker service rm $(docker service ls -q)
```

    