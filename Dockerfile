# Use the official Node.js image
FROM node:21.6-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install typescript
RUN npm install -g ts-node


# Copy the rest of the application code
COPY . .

# Compile TypeScript code
RUN npm run build

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npx", "ts-node", "index.ts"]