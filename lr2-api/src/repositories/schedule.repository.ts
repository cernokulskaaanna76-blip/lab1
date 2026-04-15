import { all, get, run } from "../db/dbClient";
import {
    CreateScheduleDto,
    PatchScheduleDto,
    ScheduleDto,
    UpdateScheduleDto,
} from "../dto/schedule.dto";

class ScheduleRepository {
    async getAll(query: any): Promise<ScheduleDto[]> {
        let sql = `SELECT id, title, description, createdAt FROM Schedules WHERE 1=1`;
        const params: any[] = [];

        if (query.title) {
            sql += ` AND title LIKE ?`;
            params.push(`%${query.title}%`);
        }

        const allowedSort = ["id", "title", "createdAt"];
        const sort = allowedSort.includes(query.sort) ? query.sort : "id";
        const order = query.order === "asc" ? "ASC" : "DESC";

        sql += ` ORDER BY ${sort} ${order}`;

        return all<ScheduleDto>(sql, params);
    }

    async getById(id: number): Promise<ScheduleDto | undefined> {
        return get<ScheduleDto>(
            `SELECT id, title, description, createdAt FROM Schedules WHERE id = ?`,
            [id]
        );
    }

    async create(dto: CreateScheduleDto): Promise<ScheduleDto | undefined> {
        const now = new Date().toISOString();

        const result = await run(
            `INSERT INTO Schedules (title, description, createdAt) VALUES (?, ?, ?)`,
            [dto.title, dto.description ?? null, now]
        );

        return this.getById(result.lastID);
    }

    async update(id: number, dto: UpdateScheduleDto): Promise<ScheduleDto | null> {
        const result = await run(
            `UPDATE Schedules SET title = ?, description = ? WHERE id = ?`,
            [dto.title, dto.description ?? null, id]
        );

        if (result.changes === 0) {
            return null;
        }

        return (await this.getById(id)) || null;
    }

    async patch(id: number, dto: PatchScheduleDto): Promise<ScheduleDto | null> {
        const current = await this.getById(id);

        if (!current) {
            return null;
        }

        const updatedTitle = dto.title ?? current.title;
        const updatedDescription = dto.description ?? current.description;

        await run(
            `UPDATE Schedules SET title = ?, description = ? WHERE id = ?`,
            [updatedTitle, updatedDescription ?? null, id]
        );

        return (await this.getById(id)) || null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await run(`DELETE FROM Schedules WHERE id = ?`, [id]);
        return result.changes > 0;
    }
}

export const scheduleRepository = new ScheduleRepository();