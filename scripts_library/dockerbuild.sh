#!/bin/bash

# RUN THIS SCRIPT IN ROOT FOLDER
# ./scripts dockerbuild

echo Cleaning build...
rm -rf ./build

echo Building...
npm run build --silent

# Error handling
rc=$?
if [[ $rc != 0 ]] ; then
  echo "NPM Build failed with exit code " $rc
  exit $rc
fi


echo Writing git informations to files
cat > ./build/githash.txt << _EOF_
$GIT_COMMIT
_EOF_

cat > ./build/static/version.html << _EOF_
<!doctype html>
<head>
   <title>App version information</title>
</head>
<body>
   <span>Origin:</span> <span>$GIT_URL</span>
   <span>Revision:</span> <span>$GIT_COMMIT</span>
   <p>
   <div><a href="$GIT_URL/commits/$GIT_COMMIT">History of current version</a></div>
</body>
_EOF_

echo Building docker
docker build -t einaralex/tictactoe:$GIT_COMMIT .

# Error handling
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker build failed " $rc
    exit $rc
fi

echo Pushing docker
docker push einaralex/tictactoe:$GIT_COMMIT

# Error handling
rc=$?
if [[ $rc != 0 ]] ; then
    echo "Docker push failed " $rc
    exit $rc
fi

echo Done
