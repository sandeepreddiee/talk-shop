# Multi-stage build for production-ready AccessShop application

# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy all source code
COPY . .

# Build arguments for environment variables (will be embedded in build)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_SUPABASE_PROJECT_ID

# Set environment variables for build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_PROJECT_ID=$VITE_SUPABASE_PROJECT_ID

# Build the production application
RUN npm run build

# Stage 2: Production server with Nginx
FROM nginx:alpine

# Install curl for healthcheck
RUN apk add --no-cache curl

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Expose port 80
EXPOSE 80

# Add metadata labels
LABEL maintainer="AccessShop Team"
LABEL description="AccessShop - Voice-First Accessible E-Commerce Platform"
LABEL version="1.0"

# Start nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
