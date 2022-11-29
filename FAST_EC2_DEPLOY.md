# Fast Deploy on EC2

- Start the Lab (or login into AWS)
- Copy the credentials in `terraform/credentials`
- Copy labsuser.pem (on linux) in `terraform/labsuser.pem`
- Reduce permission of `terraform/labsuser.pem`:
  ```
  terraform$ chmod 400 labsuser.pem
  ```
- Start the EC2 instances
  ```
  terraform$ terraform apply
  ```
- Update ansible/inventory.yaml file with the ip obtained from terraform
  ```
   ec2:
     hosts:
       vm01:
         ansible_host: <ip1-here>
       vm02:
         ansible_host: <ip2-here>
       vm03:
         ansible_host: <ip3-here>
     vars:
       ansible_user: ec2-user
       ansible_ssh_private_key_file: ../terraform/labsuser.pem
     ...
  ```
- Copy files into EC2 and start the swarm
  ```
  ansible$ ansible-playbook playbook.yaml -i inventory.yaml
  ```
  - (optional) To only update files: 
  ```
  ansible$ ansible-playbook playbook-copyfiles.yaml -i inventory.yaml
  ```
- Enter into the leader (the first in ansible inventory) with ssh: 
  ```
  terraform$ ssh -i labsuser.pem ec2-user@<first-ip-in-ansible-inventory>
  ```
- Start the stack: 
  ```
  <ec2-swarm-leader>$ docker stack deploy -c docker-stack.yml sdcc-demo
  ```
- Wait for all services to start:
  ```
  <ec2-swarm-leader>$ docker stack services sdcc-demo
  ```
  Repeat this command until you get all REPLICAS 1/1:
  ```
  ID             NAME                            MODE         REPLICAS   IMAGE                              PORTS
  sh25t6ysrm6g   sdcc-demo_api_gateway           replicated   1/1        redjack96/api_gateway:latest       *:8007->8007/tcp
  lscf2zsmkhjf   sdcc-demo_cassandra             replicated   1/1        cassandra:latest                   *:9042->9042/tcp
  d1n2ziz9ec1q   sdcc-demo_consumptions          replicated   1/1        redjack96/consumptions:latest      *:8004->8004/tcp
  gkffbq550v30   sdcc-demo_frontend              replicated   1/1        redjack96/web_ui:latest            *:3000->3000/tcp
  rermdx4jwa10   sdcc-demo_influxdb              replicated   1/1        influxdb:latest                    *:8086->8086/tcp
  y7zyktzfqyvv   sdcc-demo_kafka                 replicated   1/1        bitnami/kafka:latest               *:9092->9092/tcp, *:29092->29092/tcp
  9hesspspwc3r   sdcc-demo_mongo                 replicated   1/1        mongo:latest                       *:27017->27017/tcp
  lttm6sf5vjwy   sdcc-demo_notifications         replicated   1/1        redjack96/notifications:latest     *:8005->8005/tcp
  jbs3zpaj5fo4   sdcc-demo_product_storage       replicated   1/1        redjack96/product_storage:latest   *:8002->8002/tcp
  d3b6kk9yhxbx   sdcc-demo_recipes               replicated   1/1        redjack96/recipes:latest           *:8003->8003/tcp
  ubahi2l22nqw   sdcc-demo_redis                 replicated   1/1        redis:latest                       *:6379->6379/tcp
  l53jye695780   sdcc-demo_redis-notifications   replicated   1/1        redis:latest                       *:6380->6379/tcp
  fgb6ungjwx0e   sdcc-demo_shopping_list         replicated   1/1        redjack96/shopping_list:latest     *:8001->8001/tcp
  a2jtmz4yk82z   sdcc-demo_summary               replicated   1/1        redjack96/summary:latest           *:8006->8006/tcp
  ojnuizhn8j4f   sdcc-demo_zookeeper             replicated   1/1        bitnami/zookeeper:latest           *:2181->2181/tcp
  ```
- Access the web app writing the URL: <one-ip-in-ansible-inventory>:3000

# Cleanup everything
- Remove the stack:
  ```
  <ec2-swarm-leader>$ docker stack rm sdcc-demo
  ```
- Leave and terminate the swarm:
  ```
  <ec2-swarm-leader>$ docker swarm leave -f
  ```
- Destroy all EC2 machines:
  ```
  terraform$ terraform destroy
  ```