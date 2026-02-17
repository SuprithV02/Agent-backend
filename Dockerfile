# Use Node LTS
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if exists)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all backend files
COPY . .

# Expose the port
EXPOSE 3001

# Start the server
CMD ["node", "src/server.js"]
