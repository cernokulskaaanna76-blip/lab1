import { shiftRepository } from "../repositories/shift.repository";
import { ApiError } from "../utils/ApiError";
import {
    CreateShiftRequestDto,
    PatchShiftRequestDto,
    ShiftListQueryDto,
    UpdateShiftRequestDto,
} from "../dto/shift.dto";

function toShiftResponse(item: any) {
    return {
        id: item.id,
        scheduleId: item.scheduleId,
        userId: item.userId,
        date: item.date,
        timeSlot: item.timeSlot,
        comment: item.comment,
        status: item.status,
    };
}

class ShiftService {
    async getAll(query: ShiftListQueryDto) {
        const items = (await shiftRepository.findAll(query)).map(toShiftResponse);

        return {
            items,
            total: items.length,
            page: query.page ?? 1,
            pageSize: query.pageSize ?? 10,
        };
    }

    async getAllWithRelations() {
        const items = await shiftRepository.findAllWithRelations();

        return {
            items,
            total: items.length,
        };
    }

    async getById(id: number) {
        const item = await shiftRepository.findById(id);

        if (!item) {
            throw ApiError.notFound("Shift not found");
        }

        return toShiftResponse(item);
    }

    async create(dto: CreateShiftRequestDto) {
        const created = await shiftRepository.create(dto);

        if (!created) {
            throw ApiError.badRequest("Failed to create shift");
        }

        return toShiftResponse(created);
    }

    async update(id: number, dto: UpdateShiftRequestDto) {
        const updated = await shiftRepository.update(id, dto);

        if (!updated) {
            throw ApiError.notFound("Shift not found");
        }

        return toShiftResponse(updated);
    }

    async patch(id: number, dto: PatchShiftRequestDto) {
        const updated = await shiftRepository.patch(id, dto);

        if (!updated) {
            throw ApiError.notFound("Shift not found");
        }

        return toShiftResponse(updated);
    }

    async delete(id: number) {
        const deleted = await shiftRepository.delete(id);

        if (!deleted) {
            throw ApiError.notFound("Shift not found");
        }

        return { success: true };
    }
}

export const shiftService = new ShiftService();