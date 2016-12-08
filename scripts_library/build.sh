#
# 'npm run build' script
#
# export node path environment variable
export NODE_PATH=.

# if there is a folder named build, remove it
if [ -d ./build ]; then rm -r ./build; fi

# if there is no folder named build, create it and enter
[ -d build ] || mkdir build
cd ./client

# export clients node path environment variable
export NODE_PATH=./src/

react-scripts build

# after build, move client build folder to build/static
mv client/build build/static

# copy server folder to build
cp -R server build/server

# create folders client/src inside of build
mkdir -p build/client/src

# more copying to the build folder
cp -r client/src/common build/client/src
cp run.js build

# copy my 'runserver.sh' to build
cp scripts_library/dockerfile.sh build"
