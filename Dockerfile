FROM node:11-alpine AS builder

COPY . .
RUN npm ci
RUN npm run build

FROM node:11-alpine as runner

COPY --from=builder /package.json package.json
COPY --from=builder /package-lock.json package-lock.json
COPY --from=builder /lib lib
RUN npm ci --prod

CMD [ "npm", "run", "start" ]
