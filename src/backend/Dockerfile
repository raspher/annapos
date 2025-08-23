# Dockerfile for development only!
FROM node:22-alpine3.22

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

CMD ["yarn", "dev"]