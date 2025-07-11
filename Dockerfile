FROM node:20-alpine
WORKDIR /app

# 1️⃣ Устанавливаем прод-зависимости (json-server в dependencies)
COPY package*.json ./
RUN npm ci --omit=dev

# 2️⃣ Создаём папку для тома и кладём эталонную базу
RUN mkdir -p /data
COPY db.json /app/db.json

EXPOSE 3000

# 3️⃣ Старт:
#    • если в /data ещё нет db.json → копируем дефолт
#    • запускаем сервер через npx
CMD ["sh","-c","test -f /data/db.json || cp /app/db.json /data/db.json && npx json-server --watch /data/db.json --port 3000 --host 0.0.0.0"]
