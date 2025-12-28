
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production


RUN npm run build

COPY . .

EXPOSE 8080

CMD ["node", "dist/server.js"]
