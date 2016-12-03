#!/bin/bash


echo Cleaning build...
m -rf ./build

cd ../..
cd AWS

ssh -i "hgop-key-pair.pem" ec2-user@ec2-52-214-66-118.eu-west-1.compute.amazonaws.com
sudo yum update -y
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user
exit

ssh -i "hgop-key-pair.pem" ec2-user@ec2-52-214-66-118.eu-west-1.compute.amazonaws.com

docker run -d -p 80:8080 einaralex/tictactoe:latest node run.js