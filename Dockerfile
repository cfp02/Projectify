FROM node:20-alpine

WORKDIR /app

# Install dependencies for development
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    openssl \
    openssl-dev

# Install dependencies only when needed
COPY package*.json ./
RUN npm install
RUN npm install -D @types/node @types/react @types/react-dom

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"] 