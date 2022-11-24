echo "This program must be called inside an EC2 Amazon Linux VM, or it will not work"
sudo yum update && sudo yum install docker
sudo mkdir -p /usr/local/lib/docker/cli-plugins/
systemctl start docker
sudo gpasswd -a $USER docker
echo "Exit and re-login to this EC2 instance to use docker without sudo"