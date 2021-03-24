FROM node:14
WORKDIR /srv/www/demo
ENV NODE_ENV=production

COPY package*.json ./
RUN npm install
RUN npm build

COPY . .
EXPOSE 3000

CMD [ "node", "src/main.js" ]
