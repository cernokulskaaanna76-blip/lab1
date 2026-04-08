import { all, get, run } from "../db/dbClient";

function esc(value: string) {
    return String(value).replace(/'/g, "''");
}

type ShiftFilters = {
    status?: string;
    timeSlot?: string;
    page?: number;
    pageSize?: number;
};

type ShiftCreateDto = {
    scheduleId: number;
    userId: number;
    date: string;
    timeSlot: string;
    comment?: string;
    status: string;
};

type ShiftPatchDto = {
    scheduleId?: number;
    userId?: number;
    date?: string;
    timeSlot?: string;
    comment?: string;
    status?: string;
};

class ShiftRepository {
    async findAll(filters?: ShiftFilters) {
        const conditions: string[] = [];

        if (filters?.status) {
            conditions.push(`status = '${esc(filters.status)}'`);
        }

        if (filters?.timeSlot) {
            conditions.push(`timeSlot = '${esc(filters.timeSlot)}'`);
        }

        let sql = `
      SELECT id, scheduleId, userId, date, timeSlot, comment, status, createdAt
      FROM Shifts
    `;

        if (conditions.length > 0) {
            sql += ` WHERE ${conditions.join(" AND ")}`;
        }

        sql += ` ORDER BY date DESC`;

        const page = filters?.page && filters.page > 0 ? filters.page : 1;
        const pageSize = filters?.pageSize && filters.pageSize > 0 ? filters.pageSize : 10;
        const offset = (page - 1) * pageSize;

        sql += ` LIMIT ${Number(pageSize)} OFFSET ${Number(offset)};`;

        return await all(sql);
    }

    async findAllWithRelations() {
        return await all(`
      SELECT
        s.id,
        s.scheduleId,
        s.userId,
        s.date,
        s.timeSlot,
        s.comment,
        s.status,
        s.createdAt,
        u.name AS userName,
        u.email AS userEmail,
        sc.title AS scheduleTitle
      FROM Shifts s
      JOIN Users u ON s.userId = u.id
      JOIN Schedules sc ON s.scheduleId = sc.id
      ORDER BY s.date DESC
      LIMIT 10;
    `);
    }

    async findById(id: number) {
        return await get(`
      SELECT id, scheduleId, userId, date, timeSlot, comment, status, createdAt
      FROM Shifts
      WHERE id = ${Number(id)};
    `);
    }

    async create(data: ShiftCreateDto) {
        const now = new Date().toISOString();

        const result = await run(`
      INSERT INTO Shifts (scheduleId, userId, date, timeSlot, comment, status, createdAt)
      VALUES (
        ${Number(data.scheduleId)},
        ${Number(data.userId)},
        '${esc(data.date)}',
        '${esc(data.timeSlot)}',
        '${esc(data.comment ?? "")}',
        '${esc(data.status)}',
        '${now}'
      );
    `);

        return await this.findById(result.lastID);
    }

    async update(id: number, data: ShiftCreateDto) {
        const result = await run(`
      UPDATE Shifts
      SET scheduleId = ${Number(data.scheduleId)},
          userId = ${Number(data.userId)},
          date = '${esc(data.date)}',
          timeSlot = '${esc(data.timeSlot)}',
          comment = '${esc(data.comment ?? "")}',
          status = '${esc(data.status)}'
      WHERE id = ${Number(id)};
    `);

        if (result.changes === 0) return undefined;

        return await this.findById(id);
    }

    async patch(id: number, data: ShiftPatchDto) {
        const current = await this.findById(id);
        if (!current) return undefined;

        const nextScheduleId = data.scheduleId ?? current.scheduleId;
        const nextUserId = data.userId ?? current.userId;
        const nextDate = data.date ?? current.date;
        const nextTimeSlot = data.timeSlot ?? current.timeSlot;
        const nextComment = data.comment ?? current.comment ?? "";
        const nextStatus = data.status ?? current.status;

        await run(`
      UPDATE Shifts
      SET scheduleId = ${Number(nextScheduleId)},
          userId = ${Number(nextUserId)},
          date = '${esc(nextDate)}',
          timeSlot = '${esc(nextTimeSlot)}',
          comment = '${esc(nextComment)}',
          status = '${esc(nextStatus)}'
      WHERE id = ${Number(id)};
    `);

        return await this.findById(id);
    }

    async delete(id: number) {
        const result = await run(`
      DELETE FROM Shifts
      WHERE id = ${Number(id)};
    `);

        return result.changes > 0;
    }
}

export const shiftRepository = new ShiftRepository();