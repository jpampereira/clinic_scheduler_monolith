FROM node:23-alpine3.20  
# https://hub.docker.com/_/node

RUN mkdir /app

COPY ./package.json /app/package.json

WORKDIR /app

RUN npm install

CMD ["npm", "start"]