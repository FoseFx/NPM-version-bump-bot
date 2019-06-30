FROM node:11-alpine

COPY . .
RUN npm ci
RUN npm run build

CMD [ "npm", "start" ]