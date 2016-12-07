#!/bin/bash

# This script is run from within the Dockerfile

# Will exit the shell if a command returns a non-zero status.
set -e

# Sleeps for 10 secoinds
sleep 10
# runs a node package management script called migratedb,
# declared in the package.json, to connect the database
npm run migratedb
# run the node server
node run.js

exit 0
