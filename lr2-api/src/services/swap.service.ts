import {
    CreateSwapRequestDto,
    PatchSwapRequestDto,
    UpdateSwapRequestDto,
} from "../dto/swap.dto";
import { transaction } from "../db/dbClient";
import { shiftRepository } from "../repositories/shift.repository";
import { swapRepository } from "../repositories/swap.repository";
import { ApiError } from "../utils/ApiError";

class SwapService {
    async getAll(query: any) {
        return swapRepository.getAll(query);
    }

    async getById(id: number) {
        return swapRepository.getById(id);
    }

    async create(dto: CreateSwapRequestDto) {
        return swapRepository.create(dto);
    }

    async update(id: number, dto: UpdateSwapRequestDto) {
        return swapRepository.update(id, dto);
    }

    async patch(id: number, dto: PatchSwapRequestDto) {
        return swapRepository.patch(id, dto);
    }

    async approve(id: number) {
        const swap = await swapRepository.getById(id);

        if (!swap) {
            throw ApiError.notFound("Swap request not found");
        }

        if (swap.status !== "pending") {
            throw ApiError.badRequest("Only pending swap can be approved");
        }

        const shift = await shiftRepository.getById(swap.shiftId);

        if (!shift) {
            throw ApiError.notFound("Shift not found");
        }

        await transaction(async () => {
            await swapRepository.updateStatus(id, "approved");
            await shiftRepository.assignUser(swap.shiftId, swap.toUserId);
        });

        return swapRepository.getById(id);
    }

    async delete(id: number) {
        return swapRepository.delete(id);
    }
}

export const swapService = new SwapService();