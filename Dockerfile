# Stage 1: Build the app
FROM node:18-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and lock file to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Serve the app
FROM node:18-alpine AS runner

# Set environment variables
ENV NODE_ENV production

# Set the working directory
WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install only production dependencies
RUN npm install --only=production

# Expose the port Next.js will run on
EXPOSE 3000

# Run the Next.js app
CMD ["npm", "run", "start"]
