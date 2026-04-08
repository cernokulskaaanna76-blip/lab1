import { all, get, run } from "../db/dbClient";

export type SwapRow = {
    id: number;
    shiftId: number;
    fromUserId: number;
    toUserId: number;
    status: string;
    createdAt: string;
};

function esc(value: string) {
    return String(value).replace(/'/g, "''");
}

class SwapRepository {
    //всі заявки
    async findAll(): Promise<SwapRow[]> {
        return await all<SwapRow>(`
            SELECT id, shiftId, fromUserId, toUserId, status, createdAt
            FROM SwapRequests
            ORDER BY id DESC
            LIMIT 10;
        `);
    }

    //по id
    async findById(id: number): Promise<SwapRow | undefined> {
        return await get<SwapRow>(`
            SELECT id, shiftId, fromUserId, toUserId, status, createdAt
            FROM SwapRequests
            WHERE id = ${Number(id)};
        `);
    }

    //ств
    async create(data: {
        shiftId: number;
        fromUserId: number;
        toUserId: number;
        status: string;
    }): Promise<SwapRow | undefined> {
        const now = new Date().toISOString();

        const result = await run(`
            INSERT INTO SwapRequests (shiftId, fromUserId, toUserId, status, createdAt)
            VALUES (
                ${Number(data.shiftId)},
                ${Number(data.fromUserId)},
                ${Number(data.toUserId)},
                '${esc(data.status)}',
                '${now}'
            );
        `);

        return await this.findById(result.lastID);
    }

    //повне оновлення
    async update(
        id: number,
        data: {
            shiftId: number;
            fromUserId: number;
            toUserId: number;
            status: string;
        }
    ): Promise<SwapRow | undefined> {
        const result = await run(`
            UPDATE SwapRequests
            SET shiftId = ${Number(data.shiftId)},
                fromUserId = ${Number(data.fromUserId)},
                toUserId = ${Number(data.toUserId)},
                status = '${esc(data.status)}'
            WHERE id = ${Number(id)};
        `);

        if (result.changes === 0) return undefined;

        return await this.findById(id);
    }

    //часткове оновлення
    async patch(
        id: number,
        data: {
            shiftId?: number;
            fromUserId?: number;
            toUserId?: number;
            status?: string;
        }
    ): Promise<SwapRow | undefined> {
        const current = await this.findById(id);
        if (!current) return undefined;

        const nextShiftId = data.shiftId ?? current.shiftId;
        const nextFromUserId = data.fromUserId ?? current.fromUserId;
        const nextToUserId = data.toUserId ?? current.toUserId;
        const nextStatus = data.status ?? current.status;

        await run(`
            UPDATE SwapRequests
            SET shiftId = ${Number(nextShiftId)},
                fromUserId = ${Number(nextFromUserId)},
                toUserId = ${Number(nextToUserId)},
                status = '${esc(nextStatus)}'
            WHERE id = ${Number(id)};
        `);

        return await this.findById(id);
    }

    //видалити
    async delete(id: number): Promise<boolean> {
        const result = await run(`
            DELETE FROM SwapRequests
            WHERE id = ${Number(id)};
        `);

        return result.changes > 0;
    }
}

export const swapRepository = new SwapRepository();