import { all, get, run } from "../db/dbClient";
import {
    CreateSwapRequestDto,
    PatchSwapRequestDto,
    SwapRequestDto,
    UpdateSwapRequestDto,
} from "../dto/swap.dto";

class SwapRepository {
    async getAll(query: any): Promise<SwapRequestDto[]> {
        let sql = `
            SELECT id, shiftId, fromUserId, toUserId, status, createdAt
            FROM Swaps
            WHERE 1=1
        `;
        const params: any[] = [];

        if (query.status) {
            sql += ` AND status = ?`;
            params.push(query.status);
        }

        if (query.fromUserId) {
            sql += ` AND fromUserId = ?`;
            params.push(Number(query.fromUserId));
        }

        const allowedSort = ["id", "status", "shiftId", "fromUserId", "toUserId", "createdAt"];
        const sort = allowedSort.includes(query.sort) ? query.sort : "id";
        const order = query.order === "asc" ? "ASC" : "DESC";

        sql += ` ORDER BY ${sort} ${order}`;

        return all<SwapRequestDto>(sql, params);
    }

    async getById(id: number): Promise<SwapRequestDto | undefined> {
        return get<SwapRequestDto>(
            `SELECT id, shiftId, fromUserId, toUserId, status, createdAt FROM Swaps WHERE id = ?`,
            [id]
        );
    }

    async create(dto: CreateSwapRequestDto): Promise<SwapRequestDto | undefined> {
        const now = new Date().toISOString();

        const result = await run(
            `INSERT INTO Swaps (shiftId, fromUserId, toUserId, status, createdAt)
             VALUES (?, ?, ?, ?, ?)`,
            [dto.shiftId, dto.fromUserId, dto.toUserId, dto.status, now]
        );

        return this.getById(result.lastID);
    }

    async update(id: number, dto: UpdateSwapRequestDto): Promise<SwapRequestDto | null> {
        const result = await run(
            `UPDATE Swaps
             SET shiftId = ?, fromUserId = ?, toUserId = ?, status = ?
             WHERE id = ?`,
            [dto.shiftId, dto.fromUserId, dto.toUserId, dto.status, id]
        );

        if (result.changes === 0) {
            return null;
        }

        return (await this.getById(id)) || null;
    }

    async patch(id: number, dto: PatchSwapRequestDto): Promise<SwapRequestDto | null> {
        const current = await this.getById(id);

        if (!current) {
            return null;
        }

        await run(
            `UPDATE Swaps
             SET shiftId = ?, fromUserId = ?, toUserId = ?, status = ?
             WHERE id = ?`,
            [
                dto.shiftId ?? current.shiftId,
                dto.fromUserId ?? current.fromUserId,
                dto.toUserId ?? current.toUserId,
                dto.status ?? current.status,
                id,
            ]
        );

        return (await this.getById(id)) || null;
    }

    async updateStatus(id: number, status: "pending" | "approved" | "rejected"): Promise<boolean> {
        const result = await run(`UPDATE Swaps SET status = ? WHERE id = ?`, [status, id]);
        return result.changes > 0;
    }

    async delete(id: number): Promise<boolean> {
        const result = await run(`DELETE FROM Swaps WHERE id = ?`, [id]);
        return result.changes > 0;
    }
}

export const swapRepository = new SwapRepository();