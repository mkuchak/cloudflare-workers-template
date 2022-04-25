FROM node:18-alpine

RUN mkdir -p /home/dataproxy/node_modules && chown -R node:node /home/dataproxy

WORKDIR /home/dataproxy

COPY ./package*.json ./

RUN npm install

COPY . ./

COPY --chown=node:node . .

USER node
