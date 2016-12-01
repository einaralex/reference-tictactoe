FROM node
WORKDIR /app
ENV NODE_PATH=.
COPY ./build/ .
COPY package.json .
COPY Dockerfile .
RUN npm install --silent
EXPOSE 8080
CMD ["npm","migratedb-prod","&&","node", "run.js"]
