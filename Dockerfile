# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build
ENV TZ Asia/Bangkok
CMD ["yarn", "start"]