# terraform init (solo la prima volta)
# terraform plan
# terraform apply
# terraform destroy
# ssh -i labsuser.pem ec2-user@<public-ip-vedi-output>
# Necessario per far funzionare aws
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "4.34.0"
    }
  }
}

provider "aws" {
  region                   = "us-east-1"
  shared_credentials_files = ["./credentials"] /*Copy-paste the file from the lab*/
}

resource "aws_instance" "ec2_instances" {
  count                  = 3
  ami                    = "ami-0b0dcb5067f052a63"
  instance_type          = "t2.medium" # t2.medium = 4GB, 2 CPU; t2.small = 2GB 1CPU; t2.micro = 1GB 1 CPU
  vpc_security_group_ids = [aws_security_group.instance.id]
  key_name               = "vockey" # RICORDATI CHE SENZA QUESTO NON TI PUOI CONNETTERE A SSH!!!
  # questi comandi vengono eseguiti all'avvio della macchina
  user_data              = <<-EOF
                             #!/bin/bash
                             sudo yum -y update && sudo yum -y install docker
                             systemctl start docker
                             sudo gpasswd -a ec2-user docker
                           EOF

  tags = {
    Name = "terraform-instance-${count.index}"
  }
}

locals {
  ports = [
    3000, # react
    8001, # shopping_list
    8002, # product_storage
    8003, # recipes
    8004, # consumptions
    8005, # notifications
    8006, # summary
    8007, # api_gateway
    27017, # mongo
    2181, # zookeeper
    9092, # kafka
    29092, # kafka 2
    8086, # influx
    6379, # redis notification
    6380, # redis recipes
    9042, # cassandra
  ]
}

resource "aws_security_group" "instance" {

  name = var.security_group_name

  # needed to install packages
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # to use SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 88
    to_port     = 88
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for cluster communication with docker swarm
  ingress {
    from_port   = 2377
    to_port     = 2377
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # for communication among swarm nodes
  ingress {
    from_port   = 7946
    to_port     = 7946
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 7946
    to_port     = 7946
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for overlay network traffic
  ingress {
    from_port   = 4789
    to_port     = 4789
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 4789
    to_port     = 4789
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # needed to install packages
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # to use SSH
  egress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 88
    to_port     = 88
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for cluster communication with docker swarm
  egress {
    from_port   = 2377
    to_port     = 2377
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # for communication among swarm nodes
  egress {
    from_port   = 7946
    to_port     = 7946
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 7946
    to_port     = 7946
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for overlay network traffic
  egress {
    from_port   = 4789
    to_port     = 4789
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 4789
    to_port     = 4789
    protocol    = "udp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # to connect to frontend
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 8001
    to_port     = 8001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 8002
    to_port     = 8002
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 8003
    to_port     = 8003
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 8004
    to_port     = 8004
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 8005
    to_port     = 8005
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 8006
    to_port     = 8006
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 8007
    to_port     = 8007
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for mongo
  ingress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for zookkeeper
  ingress {
    from_port   = 2181
    to_port     = 2181
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for kafka
  ingress {
    from_port   = 9092
    to_port     = 9092
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 29092
    to_port     = 29092
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for influx
  ingress {
    from_port   = 8086
    to_port     = 8086
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for redis notification
  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for redis recipes
  ingress {
    from_port   = 6380
    to_port     = 6380
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for cassandra
  ingress {
    from_port   = 9042
    to_port     = 9042
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # to connect to frontend
  egress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 8001
    to_port     = 8001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 8002
    to_port     = 8002
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 8003
    to_port     = 8003
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 8004
    to_port     = 8004
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 8005
    to_port     = 8005
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 8006
    to_port     = 8006
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 8007
    to_port     = 8007
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for mongo
  egress {
    from_port   = 27017
    to_port     = 27017
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for zookkeeper
  egress {
    from_port   = 2181
    to_port     = 2181
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for kafka
  egress {
    from_port   = 9092
    to_port     = 9092
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 29092
    to_port     = 29092
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for influx
  egress {
    from_port   = 8086
    to_port     = 8086
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for redis notification
  egress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for redis recipes
  egress {
    from_port   = 6380
    to_port     = 6380
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for cassandra
  egress {
    from_port   = 9042
    to_port     = 9042
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

}

variable "security_group_name" {
  description = "The name of the security group"
  type        = string
  default     = "terraform-example-instance"
}

output "public_ip" {
  value       = [aws_instance.ec2_instances.*.public_ip]
  description = "The public IP of the Instance"
}


# 3.93.172.31
# 3.84.42.96
# 34.203.228.9
# terraform apply


