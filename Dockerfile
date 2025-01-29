FROM node:20-alpine

WORKDIR /app

# Install dependencies for development
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Install dependencies only when needed
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"] 