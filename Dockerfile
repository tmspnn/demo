FROM node:18-alpine
WORKDIR /opt/apps/node_demo

ENV NODE_ENV=production

COPY . .
RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]
