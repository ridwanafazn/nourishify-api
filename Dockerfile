# FROM node:21.7.3-alpine3.18

# RUN mkdir -p /opt/app

# WORKDIR /opt/app

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 5000

# CMD ["npm", "run", "start"]

FROM node:18-slim

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY . ./

EXPOSE 5000

CMD ["npm", "run", "start"]