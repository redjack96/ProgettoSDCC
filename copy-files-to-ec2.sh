scp -i terraform/labsuser.pem docker-compose.yml ec2-user@<public-ip>:~/docker-compose.yml
scp -i terraform/labsuser.pem config.properties ec2-user@<public-ip>:~/config.properties
scp -r -i terraform/labsuser.pem docker ec2-user@<public-ip>:~/docker
scp -pr -i terraform/labsuser.pem src/proto ec2-user@<public-ip>:~/src/proto

scp -r -i terraform/labsuser.pem src/frontend/public ec2-user@<public-ip>:~/src/frontend/public
scp -r -i terraform/labsuser.pem src/frontend/src ec2-user@<public-ip>:~/src/frontend/src
scp -i terraform/labsuser.pem src/frontend/Dockerfile ec2-user@<public-ip>:~/src/frontend/Dockerfile
scp -i terraform/labsuser.pem src/frontend/tsconfig.json ec2-user@<public-ip>:~/src/frontend/tsconfig.json
scp -i terraform/labsuser.pem src/frontend/package.json ec2-user@<public-ip>:~/src/frontend/package.json
