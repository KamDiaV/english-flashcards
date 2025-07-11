FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY db.json /data/db.json

EXPOSE 3000
CMD ["json-server", "--watch", "/data/db.json", "--port", "3000", "--host", "0.0.0.0"]