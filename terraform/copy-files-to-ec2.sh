echo -n "Enter public ip: "
read -r publicip
scp -i labsuser.pem ec2config.properties ec2-user@"$publicip":~/config.properties
scp -i labsuser.pem ../docker-stack.yml ec2-user@"$publicip":~/docker-stack.yml

#scp -i terraform/labsuser.pem docker-compose.yml ec2-user@"$publicip":~/docker-compose.yml
#scp -r -i terraform/labsuser.pem docker ec2-user@"$publicip":~/docker
#scp -pr -i terraform/labsuser.pem src/proto ec2-user@"$publicip":~/src/proto

#scp -r -i terraform/labsuser.pem src/frontend/public ec2-user@"$publicip":~/src/frontend/public
#scp -r -i terraform/labsuser.pem src/frontend/src ec2-user@"$publicip":~/src/frontend/src
#scp -i terraform/labsuser.pem src/frontend/Dockerfile ec2-user@"$publicip":~/src/frontend/Dockerfile
#scp -i terraform/labsuser.pem src/frontend/tsconfig.json ec2-user@"$publicip":~/src/frontend/tsconfig.json
#scp -i terraform/labsuser.pem src/frontend/package.json ec2-user@"$publicip":~/src/frontend/package.json
