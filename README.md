# mkr_kanban 🚀

> Web-based Kanban board with **import feature**

![Status](https://img.shields.io/badge/status-MVP-brightgreen)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Python](https://img.shields.io/badge/Python-3.11+-blue)
![Node.js](https://img.shields.io/badge/Node.js-20+-blue)

## 📖 О проекте

**mkr_kanban** — это веб-приложение для управления задачами по методологии Канбан с уникальной фишкой: **открытым, четко документированным форматом импорта карточек**.

### Проблема 🤔
Существующие канбан-доски не поддерживают удобный импорт карточек в эру AI-ассистентов. Пользователям приходится вручную создавать десятки карточек, хотя AI может генерировать их автоматически по ТЗ.

### Решение ✨
Канбан-приложение с **открытым JSON-форматом импорта**, который можно передать Claude, ChatGPT или любому другому AI для автоматической генерации плана проекта в виде готовых к импорту карточек.

---

## 🎯 Целевая аудитория

- 👨‍💻 Соло-разработчики
- 🤖 Технические специалисты, использующие AI для планирования
- 🏠 Пользователи, которым нужен простой канбан с импортом

---

## 🛠️ Технологический стек

### Frontend
- **Next.js** 14+ (App Router)
- **TypeScript**
- **Tailwind CSS**
- **@hello-pangea/dnd** (Drag & Drop)
- **Zustand** (State Management)
- **react-markdown**

### Backend
- **FastAPI** (Python 3.11+)
- **SQLAlchemy** 2.0 (ORM)
- **Alembic** (Migrations)
- **PostgreSQL** 15+
- **asyncpg**

### Infrastructure
- **Docker** + **Docker Compose**
- **Nginx** (Reverse Proxy)
- **Let's Encrypt** (SSL)

---

## 📦 Требования

- Docker 20.10+
- Docker Compose 2.0+
- Git

**Для локальной разработки (опционально):**
- Python 3.11+
- Node.js 20+

---

## 🚀 Быстрый старт

### 1️⃣ Клонировать репозиторий

```bash
git clone https://github.com/mkr-msk/mkr_kanban.git
cd mkr_kanban
```

### 2️⃣ Создать `.env` файл

```bash
cp .env.example .env
```

Отредактировать `.env`:
```env
# Database
DB_USER=kanban_user
DB_PASSWORD=your_strong_password_here
DB_NAME=mkr_kanban

# API
SECRET_KEY=your-secret-key-here
ALLOWED_ORIGINS=http://localhost:3000,http://localhost

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### 3️⃣ Запустить Docker Compose

```bash
docker-compose up -d
```

### 4️⃣ Применить миграции БД

```bash
docker-compose exec backend alembic upgrade head
docker-compose exec backend python -m app.init_db
```

### 5️⃣ Открыть приложение

- 🌐 Frontend: http://localhost:3000
- 📚 API Docs: http://localhost:8000/docs
- 🗄️ Backend: http://localhost:8000

---

## 📋 Формат импорта JSON

Основная фишка приложения — возможность импортировать карточки из JSON:

```json
{
  "cards": [
    {
      "title": "Setup project repository",
      "description": "Create GitHub repo and initial structure",
      "status": "todo",
      "priority": "P0"
    },
    {
      "title": "Configure Docker",
      "description": "Docker Compose with PostgreSQL, FastAPI, Next.js",
      "status": "todo",
      "priority": "P0"
    },
    {
      "title": "Implement Drag & Drop",
      "description": "# Drag & Drop\n\nuse @hello-pangea/dnd",
      "status": "in_progress",
      "priority": "P1"
    }
  ]
}
```

### Правила:
- ✅ `title` — обязательно, 1-500 символов, уникально
- ✅ `description` — опционально, поддерживает markdown
- ✅ `status` — опционально (todo/in_progress/done, default: todo)
- ✅ `priority` — опционально (P0/P1/P2/P3, default: P3)

### Как использовать с AI?

Просто дай Claude или ChatGPT промпт:

```
Сгенерируй план разработки [ПРОЕКТА] в JSON формате для mkr_kanban:

{
  "cards": [
    {
      "title": "string (max 500 chars, unique)",
      "description": "string (optional, markdown)",
      "status": "todo | in_progress | done",
      "priority": "P0 | P1 | P2 | P3"
    }
  ]
}

Создай 15-20 задач с подробными описаниями.
```

Затем скопируй ответ → вставь в приложение → Import! 🚀

---

## 🏗️ Архитектура проекта

```
mkr_kanban/
├── backend/                  # FastAPI приложение
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   └── database.py
│   ├── alembic/             # Database migrations
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                 # Next.js приложение
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── nginx/                   # Reverse proxy конфигурация
│   └── nginx.conf
├── docs/                    # Документация
├── docker-compose.yml       # Local development
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔄 Roadmap

### MVP 0.1.0 (2-3 недели)
- ✅ Канбан доска (3 колонки: Todo, In Progress, Done)
- ✅ Drag & Drop карточек
- ✅ Импорт JSON
- ✅ Приоритеты (P0-P3)
- ✅ Markdown поддержка
- ✅ Dark theme

### Релиз 1.0.0 (1-2 недели после MVP)
- 🔒 Авторизация (email/password)
- 📁 Множество проектов на пользователя
- 👥 Управление пользователями
- 🔐 Изоляция данных между пользователями

### Future (Backlog)
- 🔍 Полнотекстовый поиск
- 📊 Статистика (Burndown chart)
- 💬 Комментарии к карточкам
- 📎 Вложения/файлы
- 🏷️ Теги и метки
- 📅 Дедлайны
- 📱 Мобильное приложение

---

## 🧪 Тестирование

### Запустить unit тесты backend

```bash
docker-compose exec backend pytest tests/ -v
```

### Запустить frontend тесты

```bash
docker-compose exec frontend npm test
```

---

## 🐛 Development

### Просмотреть логи

```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Перезапустить контейнеры

```bash
docker-compose restart
```

### Остановить приложение

```bash
docker-compose down
```

### Очистить все данные

```bash
docker-compose down -v  # удалит volumes с БД
```

---

## 📦 Деплой

### На свой сервер

1. SSH подключение к серверу
2. Клонировать репо: `git clone ... /opt/mkr_kanban`
3. Создать `.env` файл с production переменными
4. Запустить: `docker-compose -f docker-compose.prod.yml up -d --build`
5. Применить миграции: `docker-compose exec backend alembic upgrade head`
6. Настроить SSL: `certbot --nginx -d mkr-msk.ru`

---

**Made with ❤️ using AI-friendly development practices**