
# I took the next three out of the if-defined because I want them available at all times,
# so I can run other scripts through here without setting these as parameters every time

# exports git commit sha
export GIT_COMMIT := $(shell git rev-parse HEAD)

# exports my projects name
export PROJECT_NAME := tictactoe

# exports my user name
export USERNAME := einaralex

#e xports a string
ifndef IMAGE_TAG
	IMAGE_TAG := ${USERNAME}/${PROJECT_NAME}:${GIT_COMMIT}
endif

#docker-test:
	#add '--net host' if you want to connect to redis container runnin in another container on host or use docker compose with the ' command: 'npm test' '

# build docker
build:
	docker build -t ${IMAGE_TAG} .

# run docker
run:
	docker run -p "80:3000" -d ${IMAGE_TAG}

# stop all images and containers
stop:
	./scripts_library/dockerstop.sh

# docker compose
compose dockercompose  composedocker:
	docker-compose up -d

# test server
test:
	npm run test

# test client
testc:
	cd client; npm run test

apitest:
	npm run apitest

loadtest:
	npm run loadtest

# run dockerbuild / deployment script
deploy:
	./scripts_library/dockerbuild.sh

# write to environmental variables to .env file, currently only GIT_COMMIT sha.
envfile:
	./scripts_library/envfile.sh
