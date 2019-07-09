FROM node:11-alpine AS builder

COPY . .
RUN npm ci
RUN npm run build

FROM node:11-alpine as runner

COPY --from=builder /package.json package.json
COPY --from=builder /package-lock.json package-lock.json
COPY --from=builder /lib lib
COPY --from=builder /private-key.pem private-key.pem
RUN npm ci --prod

ARG APP_ID
ARG WEBHOOK_SECRET
ENV APP_ID $APP_ID
ENV WEBHOOK_SECRET $WEBHOOK_SECRET
ENV PRIVATE_KEY_PATH "/private-key.pem"

CMD [ "npm", "start" ]