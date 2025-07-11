FROM node:20-alpine
WORKDIR /app

# 1️⃣ Устанавливаем прод-зависимости
COPY package*.json ./
RUN npm ci --omit=dev

# 2️⃣ Каталог для тома + дефолтная база
RUN mkdir -p /data
COPY db.json /app/db.json

# 3️⃣ Открываем порт
EXPOSE 3000

# 4️⃣ Старт:
#    • если в /data ещё нет db.json → копируем дефолт
#    • запускаем json-server через npx
CMD sh -c 'test -f /data/db.json || cp /app/db.json /data/db.json && \
          npx json-server --watch /data/db.json --port 3000 --host 0.0.0.0'
