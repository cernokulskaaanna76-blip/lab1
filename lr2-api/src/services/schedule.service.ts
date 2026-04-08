import {
    CreateScheduleRequestDto,
    PatchScheduleRequestDto,
    UpdateScheduleRequestDto,
} from "../dto/schedule.dto";
import { scheduleRepository } from "../repositories/schedule.repository";
import { ApiError } from "../utils/ApiError";

function toScheduleResponse(schedule: any) {
    return {
        id: schedule.id,
        title: schedule.title,
        description: schedule.description,
    };
}

class ScheduleService {
    async getAll() {
        const items = (await scheduleRepository.findAll()).map(toScheduleResponse);

        return {
            items,
            total: items.length,
        };
    }

    async getById(id: number) {
        const schedule = await scheduleRepository.findById(id);

        if (!schedule) {
            throw ApiError.notFound("Schedule not found");
        }

        return toScheduleResponse(schedule);
    }

    async create(dto: CreateScheduleRequestDto) {
        const created = await scheduleRepository.create({
            title: dto.title,
            description: dto.description,
        });

        if (!created) {
            throw ApiError.badRequest("Failed to create schedule");
        }

        return toScheduleResponse(created);
    }

    async update(id: number, dto: UpdateScheduleRequestDto) {
        const updated = await scheduleRepository.update(id, {
            title: dto.title,
            description: dto.description,
        });

        if (!updated) {
            throw ApiError.notFound("Schedule not found");
        }

        return toScheduleResponse(updated);
    }

    async patch(id: number, dto: PatchScheduleRequestDto) {
        const updated = await scheduleRepository.patch(id, {
            title: dto.title,
            description: dto.description,
        });

        if (!updated) {
            throw ApiError.notFound("Schedule not found");
        }

        return toScheduleResponse(updated);
    }

    async delete(id: number) {
        const deleted = await scheduleRepository.delete(id);

        if (!deleted) {
            throw ApiError.notFound("Schedule not found");
        }

        return { success: true };
    }
}

export const scheduleService = new ScheduleService();