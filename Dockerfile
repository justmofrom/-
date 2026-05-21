FROM node:18-alpine

WORKDIR /app

# Copy application files
COPY index.html .
COPY data.json .
COPY server.js .
COPY package.json .

# Install dependencies
RUN npm install --production

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]
