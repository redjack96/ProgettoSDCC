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
  instance_type          = "t2.micro"
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

resource "aws_security_group" "instance" {

  name = var.security_group_name

  # needed to install packages
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port        = 0
    protocol         = "-1"
    to_port          = 0
    ipv6_cidr_blocks = ["::/0"]
    cidr_blocks      = ["0.0.0.0/0"]
  }
  # to use SSH
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # to connect to frontend
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  # for cluster communication with docker swarm
  ingress  {
    from_port   = 2377
    to_port     = 2377
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
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
    protocol    = "udp"
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


# 54.209.61.228
# 52.90.2.73
# 54.227.69.109


