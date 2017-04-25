1. Jenkins URL and username and password.
- http://82.221.49.127:8080/

2. Game URL (AWS)
- http://52.214.66.118/



## Scripts

- Docker build - [./scripts_library/dockerbuild.sh](https://github.com/einaralex/reference-tictactoe/blob/master/scripts_library/dockerbuild.sh)

- Docker compose - [./docker-compose.yaml](https://github.com/einaralex/reference-tictactoe/blob/master/docker-compose.yaml)

- Makefile  - [./Makefile](https://github.com/einaralex/reference-tictactoe/blob/master/Makefile)

- Docker stop - [./scripts_library/dockerstop.sh](https://github.com/einaralex/reference-tictactoe/blob/master/scripts_library/dockerstop.sh)

- [./scripts_library/build.sh](https://github.com/einaralex/reference-tictactoe/blob/master/scripts_library/build.sh)

-- 'npm run build' taken apart - part of Milliskil

- (AWS Provisioning) - ./provisioning/*

-- not completely implemented 





## Testing & logic

- UnitTests, server logic TDD (Git commit log)

-- [MovePlaced](https://github.com/einaralex/reference-tictactoe/commit/b6fc5abdecd6686dc56bc6105804eb64d43784d2)

-- [NotYourMove](https://github.com/einaralex/reference-tictactoe/commit/990809d483c44d1217164c5148dad88066823c32)  

-- [IllegalMove / NotYourMove remake](https://github.com/einaralex/reference-tictactoe/commit/d5349c68565bad682a9cd5f0f72df72a25158bbb)

-- [GameWon](https://github.com/einaralex/reference-tictactoe/commit/53add0e8b7d24de54263bb4bffa235b2edb26e44)

-- [GameDraw](https://github.com/einaralex/reference-tictactoe/commit/6f1f7186e330dfe853c774ad5daf534643478c4d)

-- [GameWon on last move](https://github.com/einaralex/reference-tictactoe/commit/35987713dffe8a5b32ef03f472b7333f3aa073ee)



- [API Acceptance test - fluent API](https://github.com/einaralex/reference-tictactoe/commit/cafc81cfcfc208827a2faf536e2258a6539bd508) 

-- not working, but tried my best to finish it up without being able to see results.

- Game is not playable



## Data migration

Did you create a data migration.

- [Added aggregate_id column](https://github.com/einaralex/reference-tictactoe/blob/master/server/migrations/20161217135901-add-column-to-eventlog.js)



## Jenkins

Do you have the following Jobs and what happens in each Job:

- Commit Stage

-- Scheduled a build at 8:00 every morning

-- Run the buildscript

-- Run unit tests

- Deploy stage

-- Runs when CommitStage is succesful

-- Move docker-compose and .env to AWS

-- Login to AWS

-- Pull docker image

Did you use any of the following features in Jenkins?

- Schedule or commit hooks

-- Yes both

- Pipeline

-- No

- Jenkins file

-- [Tried to get it to work, but wasn't able to](https://github.com/einaralex/reference-tictactoe/commit/2f6cb75c21472954b7400eb8a52f7e4f98ce767f)

- Test reports

-- Yes




## Monitoring

Did you do any monitoring?

- Tried to setup datadog, didn't manage to get the jenkins-datadog-plugin to work
 
