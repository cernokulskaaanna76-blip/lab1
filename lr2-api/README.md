 Лабораторна робота №3

 Як запустити проєкт
1. Встановити залежності:
npm install

2. Запустити сервер:
npm run dev

## База даних
- SQLite файл створюється автоматично:
./data/app.db
- Файл не зберігається в репозиторії

## Ініціалізація БД
- При запуску викликається initDb()
- Таблиці створюються через CREATE TABLE IF NOT EXISTS

## Схема БД
- Users (id, email, name)
- Shifts (id, userId, date, type, status)
- SwapRequests (id, fromUserId, toUserId, shiftId, status)

## Приклади запитів

### Створення користувача
POST /api/users
{
  "email": "Anna@gmail.com",
  "name": "Anna"
}

### Отримати всіх користувачів
GET /api/users

### Отримати користувача по id
GET /api/users/1

### Приклад з WHERE + ORDER + LIMIT
GET /api/shifts?status=planned
