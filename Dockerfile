# Stage 1: Build the application
FROM node:18 AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Compile TypeScript
RUN npx tsc

# Stage 2: Create the production image
FROM node:18-slim

WORKDIR /app

# Copy production dependencies from the builder stage
COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

# Copy the compiled code from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/index.js"]
