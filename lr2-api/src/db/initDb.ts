import { run } from "./dbClient";

export async function initDb() {
  await run("PRAGMA foreign_keys = ON;");

  await run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      createdAt TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS Schedules (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      createdAt TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS Shifts (
      id INTEGER PRIMARY KEY,
      scheduleId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      date TEXT NOT NULL,
      timeSlot TEXT NOT NULL CHECK(timeSlot IN ('morning','day','evening','night')),
      comment TEXT,
      status TEXT NOT NULL CHECK(status IN ('planned','confirmed','cancelled')),
      createdAt TEXT NOT NULL,
      FOREIGN KEY (scheduleId) REFERENCES Schedules(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE RESTRICT
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS SwapRequests (
      id INTEGER PRIMARY KEY,
      shiftId INTEGER NOT NULL,
      fromUserId INTEGER NOT NULL,
      toUserId INTEGER NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('pending','approved','rejected')),
      createdAt TEXT NOT NULL,
      FOREIGN KEY (shiftId) REFERENCES Shifts(id) ON DELETE CASCADE,
      FOREIGN KEY (fromUserId) REFERENCES Users(id) ON DELETE RESTRICT,
      FOREIGN KEY (toUserId) REFERENCES Users(id) ON DELETE RESTRICT
    );
  `);

  await run(`
    CREATE INDEX IF NOT EXISTS idx_shifts_status_date
    ON Shifts(status, date);
  `);

  console.log("DB schema initialized");
}