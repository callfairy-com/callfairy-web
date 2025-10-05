# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps (use lockfile if present)
COPY package.json package-lock.json* ./
RUN npm install

# Copy sources and build
COPY . .
RUN npm run build

# ---- Production stage ----
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Only install production deps
COPY package.json package-lock.json* ./
RUN npm install --omit=dev

# Copy server (API) and built frontend from builder
COPY --from=builder /app/server ./server
COPY --from=builder /app/dist ./dist

# Ensure data directory exists
RUN mkdir -p /app/server/data

# Expose API port
EXPOSE 3001

# Start the Express server (serves /api and static dist)
CMD ["node", "server/api.js"]
