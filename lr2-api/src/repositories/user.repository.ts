import { all, get, run } from "../db/dbClient";

export type UserRow = {
    id: number;
    name: string;
    email: string;
    createdAt: string;
};

function esc(value: string) {
    return String(value).replace(/'/g, "''");
}

class UserRepository {
    //отримати всіх користувачів
    async findAll(): Promise<UserRow[]> {
        return await all<UserRow>(`
      SELECT id, name, email, createdAt
      FROM Users
      ORDER BY id DESC;
    `);
    }

    //отрим користувача по id
    async findById(id: number): Promise<UserRow | undefined> {
        return await get<UserRow>(`
      SELECT id, name, email, createdAt
      FROM Users
      WHERE id = ${Number(id)};
    `);
    }

    //ств користувача
    async create(name: string, email: string): Promise<UserRow | undefined> {
        const now = new Date().toISOString();

        const result = await run(`
      INSERT INTO Users (name, email, createdAt)
      VALUES ('${esc(name)}', '${esc(email)}', '${now}');
    `);

        return await this.findById(result.lastID);
    }

    //повне оновлення
    async update(id: number, name: string, email: string): Promise<UserRow | undefined> {
        const result = await run(`
      UPDATE Users
      SET name = '${esc(name)}',
          email = '${esc(email)}'
      WHERE id = ${Number(id)};
    `);

        if (result.changes === 0) return undefined;

        return await this.findById(id);
    }

    //часткове оновлення
    async patch(
        id: number,
        data: { name?: string; email?: string }
    ): Promise<UserRow | undefined> {
        const current = await this.findById(id);
        if (!current) return undefined;

        const nextName = data.name ?? current.name;
        const nextEmail = data.email ?? current.email;

        await run(`
      UPDATE Users
      SET name = '${esc(nextName)}',
          email = '${esc(nextEmail)}'
      WHERE id = ${Number(id)};
    `);

        return await this.findById(id);
    }

    //видалення
    async delete(id: number): Promise<boolean> {
        const result = await run(`
      DELETE FROM Users
      WHERE id = ${Number(id)};
    `);

        return result.changes > 0;
    }
}

export const userRepository = new UserRepository();