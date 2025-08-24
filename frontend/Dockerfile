# Dockerfile for development only!
FROM node:22-alpine3.22

WORKDIR /app

# Copy package.json and lock file first (for caching)
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Development command
CMD ["yarn", "dev"]