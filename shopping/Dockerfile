FROM node

WORKDIR /app/shopping

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

EXPOSE 8003

CMD ["npm", "start"]