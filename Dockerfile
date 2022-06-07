FROM node:14.16.1-alpine3.11 

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
WORKDIR /usr/src/app


COPY package*.json ./
RUN npm install @nestjs/cli -g
RUN npm install --production=false
COPY . .

RUN nest build 
# COPY . .
# RUN nest start &