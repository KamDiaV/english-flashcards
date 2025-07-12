# Vocardo — English Word Cards

Интерактивное React‑приложение для изучения английских слов по карточкам. Может работать **офлайн** как PWA и устанавливаться на мобильные устройства и десктоп.

## 🚀 Функциональность

| Блок | Возможности |
|------|-------------|
| **Словарь** | • добавлять, редактировать, удалять слова |
| **Карточки (Flip Card)** | двустороннее запоминание «слово ⇄ перевод» |
| **Тест-режим** | выбор правильного перевода из нескольких вариантов |
| **Статистика** | количество повторений, текущий streak |
| **PWA** | офлайн-режим, «Add to Home Screen», кэширование API |
| **Бэкенд** | JSON API `/words`, развёрнут на Fly.io |

## 🛠 Стек

- **React 18** + React Router v6
- **@tanstack/react-query** 4
- **Axios**
- **SCSS-Modules**
- **Workbox** (Service Worker)
- **GitHub Actions** — CI/CD: сборка, деплой фронта на **GitHub Pages**, API — на **Fly.io**

## ⏯ Запуск проекта

```bash
# 1. зависимости
npm install

# 2. задать адрес API (или оставить дефолт)
echo "REACT_APP_API_URL=https://flashcards-api-snowy-mountain-4760.fly.dev" > .env

# 3. dev-режим (API + фронт)
npm run dev
# → http://localhost:3000
```

### Полезные команды

- `npm start` — только React-приложение
- `npm run server` — только json-server

## ⚙️ Сборка

```bash
npm run build
```

Сборка появится в папке `build/`.

## 🚢 Деплой

- `npm run deploy` — GitHub Pages
- `fly deploy --remote-only` — API на Fly.io (можно через CI)

Для CI нужен секрет `FLY_API_TOKEN` в Settings → Secrets → Actions.

## ⚡ PWA-особенности
- `manifest.json` — имя приложения, цвета и иконки
- Workbox-сервис-воркер:
  - precache статики
  - `StaleWhileRevalidate` для `/words`
  - кэш Google Fonts
- Без сети приложение и список слов доступны из кеша.

Проверка:
- Lighthouse → категория PWA — все чек-поинты зелёные
- DevTools → Application → Service Workers — activated
- Network → Offline → reload — данные отображаются

## 📌 Дорожная карта
| Этап | Сделано | В планах |
|---|---|---|
| 1 | Инициализация, роутинг, базовые компоненты | — |
| 2 | Стилизация, CRUD (/words) + Fly.io API | — |
| 3 | Мой словарь, Flip Card, тест-режим | — |
| 4 | Статистика прогресса, streak | — |
| 5 | PWA: icons, manifest, сервис-воркер, офлайн | — |
| 6 | Мобильная UI-адаптация | поиск, фильтрация |
| 7 | Улучшения UX | — |

© 2025 Vocardo | English Word Cards