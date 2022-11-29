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

NotificationService, SummaryService and ProductStorageService communication is decoupled with the usage of Kafka Publish Subscribe Framework.

The following pattern are implemented:

- API Gateway: implemented in Rust. It's a REST API server (built with crate actix-web) and a grpc client (with crates prost+tonic). 
- Circuit Breaker: implemented in ApiGateway, ShoppingList, Summary with libraries inspired by hystrix
- Database per Service: every service has its own database. Only ProductStorageService's database is internal to the container, because it's stateful.

The frontend is built in React-Bootstrap with Typescript.
## Release Run

Use Docker Compose:

```console
$ docker compose up -d
```
To use Docker Swarm on EC2, with Terraform and Ansible, refer to the file [FAST_EC2_DEPLOY.md](FAST_EC2_DEPLOY.md)

# Deploy on AWS with terraform
To load credentials from [LAB](https://www.awsacademy.com/LMS_Login):
1) Copy AWS CLI credentials from AWS Details and paste it in terraform/credentials
2) Download PEM and save it in terraform/labsuser.pem
3) `terraform$ chmod 400 terraform/labsuser.pem`
4) `terraform$ terraform apply`
5) To SSH to EC2 VM:

`terraform$ ssh -i labsuser.pem ec2-user@<public-ip-see-output>`

## Manual EC2 Configuration
To copy files from local to EC2 VM (remember to change <public-ip> to the ip obtained from `terraform apply`):

`ProgettoSDCC$ scp -i terraform/labsuser.pem docker-compose.yml ec2-user@<public-ip>:~/docker-compose.yml`

`ProgettoSDCC$ scp -i terraform/labsuser.pem config.properties ec2-user@<public-ip>:~/config.properties`

To copy an entire directory to EC2:

`ProgettoSDCC$ scp -r -i terraform/labsuser.pem docker ec2-user@<public-ip>:~/docker`

`ProgettoSDCC$ scp -pr -i terraform/labsuser.pem src/proto ec2-user@<public-ip>:~/src/proto`

scp -r -i terraform/labsuser.pem src/frontend ec2-user@<public-ip>:~/src/frontend

From the SSHed EC2, you'll need to install some programs, like docker (we use Amazon Linux VMs, so use `yum` instead of `apt`):

```console
sudo yum update && sudo yum install docker
sudo mkdir -p /usr/local/lib/docker/cli-plugins/
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
systemctl start docker
sudo gpasswd -a $USER docker
```

After this, re-login to the EC2 instance to apply changes. Now you can use docker and docker compose without sudo:

`docker compose up api_gateway shopping_list mongo`

When finished:
`terraform destroy`


<a href="https://www.rust-lang.org/it">
<img src="https://www.rust-lang.org/static/images/rust-logo-blk.svg" width="150" height="150">
</a>
<a href="https://www.java.com/it/">
<img src="https://img.icons8.com/color/2x/java-coffee-cup-logo.png" width="150" height="150">
</a>
<a href="https://go.dev/">
<img src="https://img.icons8.com/color/2x/golang.png" width="150" height="150">
</a>
<a href="https://www.python.org/">
<img src="https://img.icons8.com/color/2x/python.png" width="150" height="150">
</a>
<a href="https://www.typescriptlang.org/">
<img src="https://img.icons8.com/color/2x/typescript.png" width="150" height="150">
</a>
<a href="https://www.sqlite.org/index.html">
<img src="https://www.sqlite.org/images/sqlite370_banner.gif" width="300" height="150">
</a>
<a href="https://www.mongodb.com/">
<img src="https://webimages.mongodb.com/_com_assets/cms/kuyjf3vea2hg34taa-horizontal_default_slate_blue.svg?auto=format%252Ccompress" width="150" height="150">
</a>
<a href="https://www.influxdata.com/">
<img src="https://img.icons8.com/flat-round/2x/influxdb.png" width="150" height="150">
</a>
<a href="https://cassandra.apache.org/_/index.html">
<img src="https://www.vectorlogo.zone/logos/apache_cassandra/apache_cassandra-icon.svg" width="150" height="150">
</a>
<a href="https://kafka.apache.org/24/documentation.html">
<img src="https://iconape.com/wp-content/files/vq/370992/svg/370992.svg" width="150" height="150">
</a>
<a href="https://redis.io">
<img src="https://static.cdnlogo.com/logos/r/31/redis.svg" width="150" height="150">
</a>
<a href="https://it.reactjs.org/">
<img src="https://d33wubrfki0l68.cloudfront.net/554c3b0e09cf167f0281fda839a5433f2040b349/ecfc9/img/header_logo.svg" width="150" height="150">
</a>



