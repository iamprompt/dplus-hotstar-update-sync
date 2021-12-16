# syntax=docker/dockerfile:1
FROM node:16-alpine
WORKDIR /app
COPY . .
RUN yarn
RUN yarn build
ENV TZ Asia/Bangkok
ENV AIRTABLE_API_KEY API_KEY_HERE
ENV AIRTABLE_WORKING_BASE BASE_ID_HERE

CMD ["yarn", "start"]