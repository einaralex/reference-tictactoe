FROM node
WORKDIR /app
ENV NODE_PATH=.
COPY ./build/ .
COPY package.json .
COPY Dockerfile .
COPY scripts_library/ ./scripts_library
RUN npm install --silent
EXPOSE 8080
CMD ["./scripts_library/dockerfile.sh"]
