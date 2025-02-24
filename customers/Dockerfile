FROM node:18

WORKDIR /app/customers

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

EXPOSE 8001

CMD ["npm", "start"]