import { CreateShiftDto, PatchShiftDto, UpdateShiftDto } from "../dto/shift.dto";
import { shiftRepository } from "../repositories/shift.repository";

class ShiftService {
    // отримати список shifts
    async getAll(query: any) {
        return shiftRepository.getAll(query);
    }

    // отримати пов'язані дані через JOIN
    async getAllWithUsers() {
        return shiftRepository.getAllWithUsers();
    }
    // отримати статистику (агрегація)
    async getSummaryStats() {
        return shiftRepository.getSummaryStats();
    }

    // небезпечний пошук (SQL injection demo)
    async searchUnsafe(comment: string) {
        return shiftRepository.searchUnsafe(comment);
    }

    // отримати shift по id
    async getById(id: number) {
        return shiftRepository.getById(id);
    }

    // створити shift
    async create(dto: CreateShiftDto) {
        return shiftRepository.create(dto);
    }

    // повне оновлення
    async update(id: number, dto: UpdateShiftDto) {
        return shiftRepository.update(id, dto);
    }

    // часткове оновлення
    async patch(id: number, dto: PatchShiftDto) {
        return shiftRepository.patch(id, dto);
    }

    // змінити користувача для shift
    async assignUser(id: number, userId: number) {
        return shiftRepository.assignUser(id, userId);
    }

    // видалити shift
    async delete(id: number) {
        return shiftRepository.delete(id);
    }
}

export const shiftService = new ShiftService();