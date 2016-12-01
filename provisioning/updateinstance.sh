#!/bin/bash

# RUN THIS SCRIPT IN ROOT FOLDER
# ./scripts updateaws

echo $GIT_COMMIT

cd ../AWS

ssh -i "hgop-key-pair.pem" ec2-user@ec2-52-214-66-118.eu-west-1.compute.amazonaws.com

docker pull einaralex/tictactoe:$GIT_COMMIT
#þarf líklegast að stoppa fyrst
docker run -d -p 80:8080 einaralex/tictactoe:$GIT_COMMIT node run.js
