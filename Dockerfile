# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /app
COPY . .
RUN yarn build
CMD ["node", "dist/index.js"]