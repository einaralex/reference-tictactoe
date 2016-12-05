
ifndef GIT_COMMIT
  #needs to be a project stored in git, gets the short commit sha
	GIT_COMMIT := $(shell git rev-parse HEAD)
endif

ifndef PROJECT_NAME
  #Change to the name of you project
	PROJECT_NAME := tictactoe
endif
ifndef USERNAME
  #Change  to your dockerhub username
	USERNAME := einaralex
endif
ifndef IMAGE_TAG
  #Change <username> to your dockerhub username
	IMAGE_TAG := ${USERNAME}/${PROJECT_NAME}:${TAG}
endif

build:
	docker build -t ${IMAGE_TAG} .
run:
	docker run -p "80:3000" -d ${IMAGE_TAG}
docker-test:
	#add '--net host' if you want to connect to redis container runnin in another container on host or use docker compose with the ' command: 'npm test' '
	docker run -it ${IMAGE_TAG} npm run.js
postgres:
	#-v flag for starting with persistent storage
	docker run -d -p "5432:5432" -v "/srv/docker/postgresql:/var/lib/postgresql"

compose:
	docker-compose up -d --build

hi :
	echo 'hello'

git:
	export GIT_COMMIT=${GIT_COMMIT}

say:
	echo ${GIT_COMMIT}
