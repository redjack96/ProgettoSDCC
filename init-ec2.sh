echo "This program must be called inside an EC2 Amazon Linux VM, or it will not work"
sudo yum update && sudo yum install docker
sudo mkdir -p /usr/local/lib/docker/cli-plugins/
sudo curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/lib/docker/cli-plugins/docker-compose
sudo chmod +x /usr/local/lib/docker/cli-plugins/docker-compose
systemctl start docker
sudo gpasswd -a $USER docker
echo "Exit and re-login to this EC2 instance to use docker"