# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Expose port 3000
EXPOSE 3000

# Start development server
# Using --host 0.0.0.0 to make the server accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
