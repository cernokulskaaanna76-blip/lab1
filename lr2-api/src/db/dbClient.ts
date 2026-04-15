import { db } from "./db";

export function all<T = any>(sql: string, params: any[] = []): Promise<T[]> {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows as T[]);
        });
    });
}

export function get<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row as T | undefined);
        });
    });
}

export function run(
    sql: string,
    params: any[] = []
): Promise<{ lastID: number; changes: number }> {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) {
                reject(err);
                return;
            }

            resolve({
                lastID: this.lastID,
                changes: this.changes,
            });
        });
    });
}

export async function transaction<T>(callback: () => Promise<T>): Promise<T> {
    await run("BEGIN TRANSACTION");
    try {
        const result = await callback();
        await run("COMMIT");
        return result;
    } catch (error) {
        await run("ROLLBACK");
        throw error;
    }
}