FROM node:18
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 4000

# For development with volume mounts, reinstall native deps
CMD ["sh", "-c", "npm rebuild bcrypt --build-from-source && node index.js"]
