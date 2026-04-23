# Use Node.js 20 LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better Docker layer caching)
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

# Start server
CMD ["node", "src/server.js"]
