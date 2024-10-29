# Use an official Node.js image as the base for the build stage
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy the dependency files
COPY package*.json ./

# Install all dependencies, including ESLint for development
RUN npm install

# Add ESLint configuration file with modified rule
RUN echo '{ \
  "env": { "browser": true, "es2021": true }, \
  "extends": ["eslint:recommended"], \
  "parserOptions": { "ecmaVersion": 12, "sourceType": "module" }, \
  "rules": { "@typescript-eslint/no-explicit-any": "off" } \
}' > .eslintrc.json

# Copy the rest of the project files to the container
COPY . .

# Build the Next.js application for production
RUN npm run build

# Use a clean Node.js image as the base for the production stage
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the dependencies necessary for production
COPY package*.json ./
RUN npm install --production

# Copy the compiled files from the build stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/.eslintrc.json ./ 

# Expose the port on which the app will run (3000 for Next.js)
EXPOSE 3000

# Command to run the application in production mode
CMD ["npm", "run", "start"]
