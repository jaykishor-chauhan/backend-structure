# Build and Production Stage
FROM node:22-alpine AS runner

WORKDIR /app

# Install production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --only=production || npm install --production

# Copy application source code
COPY src/ ./src/

# Set production environment variables
ENV NODE_ENV=production
ENV PORT=5000

# Run as non-root user for security
USER node

# Expose server port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

CMD ["node", "src/server.js"]
