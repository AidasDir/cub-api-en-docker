# Use a lightweight Node.js image for the frontend dev server
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
# Ensure package.json and package-lock.json are in app/
COPY package.json package-lock.json ./

# Install dependencies (including devDependencies needed for 'npm run dev')
RUN npm install

# Copy all application code (including src, public, etc.)
# Ensure your React/Vite source code is within the 'app' directory before copying.
COPY . .

# Expose the port Vite development server runs on (5173)
EXPOSE 5173

# Command to run the Vite development server
# --host 0.0.0.0 makes the dev server accessible from outside the container (within Docker network)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
