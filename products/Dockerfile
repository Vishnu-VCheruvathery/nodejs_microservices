FROM node

WORKDIR /app/products

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

EXPOSE 8002

CMD ["npm", "start"]