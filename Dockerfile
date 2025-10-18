# Use a lightweight Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy dependency files first for better layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the project files
COPY . .

# Expose the app port
EXPOSE 8000

# Define environment variables (optional defaults)
ENV NODE_ENV=production \
    PORT=8000

# Start the application
CMD ["node", "src/index.js"]
