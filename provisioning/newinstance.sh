#!/bin/bash

scp -o StrictHostKeyChecking=no -i "hgop-key-pair.pem" ./docker-compose.yaml ec2-user@ec2-52-214-66-118.eu-west-1.compute.amazonaws.com:~/docker-compose.yaml
scp -o StrictHostKeyChecking=no -i "hgop-key-pair.pem" ./.env ec2-user@ec2-52-214-66-118.eu-west-1.compute.amazonaws.com:~/.env


ssh -i "hgop-key-pair.pem" ec2-user@ec2-52-214-66-118.eu-west-1.compute.amazonaws.com
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

curl -L "https://github.com/docker/compose/releases/download/1.9.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

exit

ssh -i "hgop-key-pair.pem" ec2-user@ec2-52-214-66-118.eu-west-1.compute.amazonaws.com

docker run -d -p 80:8080 einaralex/tictactoe:latest node run.js
