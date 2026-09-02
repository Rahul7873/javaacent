# Sandboxed Execution Worker Container
FROM node:20-alpine

# Install Python3, g++, and basic runtimes
RUN apk add --no-cache python3 py3-pip g++ make

# Create non-root unprivileged sandbox user
RUN adduser -D -u 1001 sandboxuser

WORKDIR /judge-service
COPY package.json ./
RUN npm install --production

COPY server.js ./

# Switch to isolated user
USER sandboxuser

EXPOSE 5000
CMD ["node", "server.js"]
