# Use an official Node.js runtime as a parent image
FROM node:16-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install any needed dependencies
RUN npm install --production

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that the app will run on
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
