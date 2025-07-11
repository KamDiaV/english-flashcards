FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY db.json /data/db.json

EXPOSE 3000
CMD ["npm", "run", "server"]