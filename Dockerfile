FROM node:14
WORKDIR /srv/www/demo
ENV NODE_ENV=production

COPY . .
RUN npm install
RUN npm build

EXPOSE 3000
CMD [ "node", "src/main.js" ]
