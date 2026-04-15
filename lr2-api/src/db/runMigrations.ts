import fs from "fs";
import path from "path";
import { get, run } from "./dbClient";
import { logger } from "../utils/logger";

//Тут реалізовано механізм міграцій.
//Програма перевіряє, які міграції вже виконані, і застосовує тільки нові. 
function splitSqlStatements(sql: string): string[] {
    return sql
        .split(";")
        .map((part) => part.trim())
        .filter((part) => part.length > 0);
}

export async function runMigrations(): Promise<void> {
    await run("PRAGMA foreign_keys = ON;");
    // створення таблиці для збереження застосованих міграцій
    await run(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL UNIQUE,
            appliedAt TEXT NOT NULL
        );
    `);

    const migrationsDir = path.join(__dirname, "migrations");

    if (!fs.existsSync(migrationsDir)) {
        logger.info("Migrations folder not found, skip");
        return;
    }

    const files = fs
        .readdirSync(migrationsDir)
        .filter((file) => file.endsWith(".sql"))
        .sort();

    for (const file of files) {
        const existing = await get<{ id: number }>(
            `SELECT id FROM schema_migrations WHERE name = ?`,
            [file]
        );// перевірка чи міграція вже була застосована

        if (existing) {
            continue;
        }

        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, "utf8");
        const statements = splitSqlStatements(sql);

        for (const statement of statements) {
            await run(statement);
        }

        await run(
            `INSERT INTO schema_migrations (name, appliedAt) VALUES (?, ?)`,
            [file, new Date().toISOString()]
        );// запис нової міграції після її виконання

        logger.info(`Migration applied: ${file}`); // лог при застосуванні міграції
    }
}