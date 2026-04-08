import { all, get, run } from "../db/dbClient";

export type ScheduleRow = {
    id: number;
    title: string;
    description: string | null;
    createdAt: string;
};

function esc(value: string) {
    return String(value).replace(/'/g, "''");
}

class ScheduleRepository {
    //отримати всі розклади
    async findAll(): Promise<ScheduleRow[]> {
        return await all<ScheduleRow>(`
            SELECT id, title, description, createdAt
            FROM Schedules
            ORDER BY id DESC
            LIMIT 10;
        `);
    }

    //отримати розклад по id
    async findById(id: number): Promise<ScheduleRow | undefined> {
        return await get<ScheduleRow>(`
            SELECT id, title, description, createdAt
            FROM Schedules
            WHERE id = ${Number(id)};
        `);
    }

    //ств розклад
    async create(data: {
        title: string;
        description?: string;
    }): Promise<ScheduleRow | undefined> {
        const now = new Date().toISOString();

        const result = await run(`
            INSERT INTO Schedules (title, description, createdAt)
            VALUES (
                '${esc(data.title)}',
                '${esc(data.description ?? "")}',
                '${now}'
            );
        `);

        return await this.findById(result.lastID);
    }

    //повне оновлення
    async update(
        id: number,
        data: { title: string; description?: string }
    ): Promise<ScheduleRow | undefined> {
        const result = await run(`
            UPDATE Schedules
            SET title = '${esc(data.title)}',
                description = '${esc(data.description ?? "")}'
            WHERE id = ${Number(id)};
        `);

        if (result.changes === 0) return undefined;

        return await this.findById(id);
    }

    //часткове оновлення
    async patch(
        id: number,
        data: { title?: string; description?: string }
    ): Promise<ScheduleRow | undefined> {
        const current = await this.findById(id);
        if (!current) return undefined;

        const nextTitle = data.title ?? current.title;
        const nextDescription = data.description ?? current.description ?? "";

        await run(`
            UPDATE Schedules
            SET title = '${esc(nextTitle)}',
                description = '${esc(nextDescription)}'
            WHERE id = ${Number(id)};
        `);

        return await this.findById(id);
    }

    //видалити
    async delete(id: number): Promise<boolean> {
        const result = await run(`
            DELETE FROM Schedules
            WHERE id = ${Number(id)};
        `);

        return result.changes > 0;
    }
}

export const scheduleRepository = new ScheduleRepository();