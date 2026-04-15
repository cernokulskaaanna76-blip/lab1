import {
    CreateScheduleDto,
    PatchScheduleDto,
    UpdateScheduleDto,
} from "../dto/schedule.dto";
import { scheduleRepository } from "../repositories/schedule.repository";

class ScheduleService {
    async getAll(query: any) {
        return scheduleRepository.getAll(query);
    }

    async getById(id: number) {
        return scheduleRepository.getById(id);
    }

    async create(dto: CreateScheduleDto) {
        return scheduleRepository.create(dto);
    }

    async update(id: number, dto: UpdateScheduleDto) {
        return scheduleRepository.update(id, dto);
    }

    async patch(id: number, dto: PatchScheduleDto) {
        return scheduleRepository.patch(id, dto);
    }

    async delete(id: number) {
        return scheduleRepository.delete(id);
    }
}

export const scheduleService = new ScheduleService();