FROM node:alpine

RUN mkdir app

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm install

COPY src ./src

RUN ls
CMD npm start