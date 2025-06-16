# Use a lightweight Node.js image for the backend API
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
# Ensure package.json and package-lock.json are in api/
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm install --production

# Copy the rest of your application code
# Ensure your Express API source code is within the 'api' directory before copying.
COPY . .

# Expose the port your Express app listens on (3000)
EXPOSE 3000

# Command to run your application. We'll add a 'start' script to package.json.
CMD ["npm", "start"]
