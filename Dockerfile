# ==================================
# Stage 1: Builder Stage
# ==================================
FROM node:20-alpine AS build-env

# Set working directory
WORKDIR /app

# Copy dependency files first (caching optimization)
COPY package.json package-lock.json ./

# Install only production dependencies for minimal build size
RUN npm ci --only=production --no-audit --no-fund

# Copy remaining application files
COPY . .

# Apply patch-package changes
RUN npx patch-package

# ==================================
# Stage 2: Final Production Image
# ==================================
FROM node:20-alpine

# Copy built application and dependencies from the build stage
COPY --from=build-env /app /app
WORKDIR /app


# Install k6 (performance testing tool) efficiently
#K6
# RUN curl -s https://k6.io/releases/latest/k6-latest-linux-amd64.tar.gz \
#   | tar -xz -C /usr/local/bin
# RUN k6 version
#K6

# Environment and Port
ENV PORT=8080
EXPOSE 8080

# Use non-root user for security
USER node

# Start the Node.js application
CMD ["npm", "start"]
