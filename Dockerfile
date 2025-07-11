FROM node:20-alpine
WORKDIR /app

# 1️⃣ Ставим прод-зависимости
COPY package*.json ./
RUN npm ci --omit=dev

# 2️⃣ Создаём точку монтирования и кладём дефолтный db.json внутрь образа
RUN mkdir -p /data
COPY db.json /app/db.json      

# 3️⃣ Экспонируем порт
EXPOSE 3000

# 4️⃣ Стартовый скрипт:
#    • если /data/db.json отсутствует (том пустой) — копируем исходник
#    • запускаем json-server, отслеживая файл на томе
CMD sh -c 'test -f /data/db.json || cp /app/db.json /data/db.json && \
          json-server --watch /data/db.json --port 3000 --host 0.0.0.0'
