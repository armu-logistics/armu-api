# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port on which your Node.js app is running
EXPOSE 8085

# Set environment variables for PostgreSQL
ENV POSTGRES_HOST=localhost
ENV POSTGRES_PORT=5432
ENV POSTGRES_DB=your_postgres_db_name
ENV POSTGRES_USER=your_postgres_username
ENV POSTGRES_PASSWORD=your_postgres_password

# Set environment variables for MongoDB
ENV MONGO_HOST=mongodb
ENV MONGO_PORT=27017
ENV MONGO_DB=your_mongo_db_name

# Start the Node.js application
CMD ["npm", "start"]
