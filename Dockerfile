FROM node:18-alpine as build

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Set working directory
WORKDIR /app

# Copy package files for better layer caching
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_URL=http://localhost:8000/api/v1
ARG VITE_APP_NAME="Yo Me Uno - Donaciones Guatemala"
ARG VITE_APP_VERSION=1.0.0
ARG VITE_APP_DESCRIPTION="Plataforma de donaciones para organizaciones guatemaltecas"
ARG VITE_NODE_ENV=production
ARG VITE_ENABLE_ANALYTICS=false
ARG VITE_ENABLE_ERROR_REPORTING=true
ARG VITE_SUPPORT_EMAIL=soporte@yomeuno.gt
ARG VITE_SUPPORT_PHONE=+502-1234-5678

# Set environment variables
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_NAME=$VITE_APP_NAME
ENV VITE_APP_VERSION=$VITE_APP_VERSION
ENV VITE_APP_DESCRIPTION=$VITE_APP_DESCRIPTION
ENV VITE_NODE_ENV=$VITE_NODE_ENV
ENV VITE_ENABLE_ANALYTICS=$VITE_ENABLE_ANALYTICS
ENV VITE_ENABLE_ERROR_REPORTING=$VITE_ENABLE_ERROR_REPORTING
ENV VITE_SUPPORT_EMAIL=$VITE_SUPPORT_EMAIL
ENV VITE_SUPPORT_PHONE=$VITE_SUPPORT_PHONE

# Build the application
RUN pnpm build

# Production stage
FROM nginx:alpine

# Copy build files to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy Netlify redirects file for SPA routing
COPY _redirects /usr/share/nginx/html/_redirects

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create necessary directories and set permissions for nginx
RUN mkdir -p /var/cache/nginx /var/log/nginx /var/run && \
    chown -R nginx:nginx /var/cache/nginx /var/log/nginx /var/run && \
    chmod -R 755 /var/cache/nginx /var/log/nginx /var/run

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx as root (required for port 80)
CMD ["nginx", "-g", "daemon off;"]