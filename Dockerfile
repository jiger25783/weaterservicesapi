FROM node:7

RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app

EXPOSE 8080
ENTRYPOINT node server.js

