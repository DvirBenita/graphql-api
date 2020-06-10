FROM node:14

WORKDIR /usr/src/app/simulation

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]