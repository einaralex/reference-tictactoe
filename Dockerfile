FROM node
WORKDIR /app
ENV NODE_PATH=.
COPY ./build/ .
COPY package.json .
COPY Dockerfile .
COPY docker-compose.yaml .
COPY scripts_library/ ./scripts_library
COPY .env .
RUN npm install --silent
EXPOSE 3000
CMD ["./scripts_library/dockerfile.sh"]
