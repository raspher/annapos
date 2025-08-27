# Stage 1: build frontend
FROM node:22-alpine3.22 AS frontend-builder

WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn
COPY frontend ./
RUN yarn build

# Stage 2: build backend + copy frontend dist
# Multi-stage builds automatically discard everything not copied into the final stage
FROM node:22-alpine3.22 AS backend-builder

WORKDIR /app/backend
COPY backend/package.json backend/yarn.lock ./
RUN yarn
COPY backend ./
RUN yarn build

# Copy only the frontend build output
COPY --from=frontend-builder /app/frontend/dist ./public

CMD ["yarn", "start"]

