FROM node:14.18-alpine3.11

WORKDIR /opt/app

COPY package*.json /opt/app/

RUN npm install --silent
COPY . /opt/app/

CMD npm start