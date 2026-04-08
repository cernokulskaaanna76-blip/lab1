import {
    CreateSwapRequestDto,
    PatchSwapRequestDto,
    UpdateSwapRequestDto,
} from "../dto/swap.dto";
import { shiftRepository } from "../repositories/shift.repository";
import { swapRepository } from "../repositories/swap.repository";
import { userRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/ApiError";

function toSwapResponse(item: any) {
    return {
        id: item.id,
        fromUserId: item.fromUserId,
        toUserId: item.toUserId,
        shiftId: item.shiftId,
        status: item.status,
    };
}

class SwapService {
    async getAll() {
        const items = (await swapRepository.findAll()).map(toSwapResponse);

        return {
            items,
            total: items.length,
        };
    }

    async getById(id: number) {
        const item = await swapRepository.findById(id);

        if (!item) {
            throw ApiError.notFound("Swap request not found");
        }

        return toSwapResponse(item);
    }

    async create(dto: CreateSwapRequestDto) {
        const fromUser = await userRepository.findById(dto.fromUserId);
        const toUser = await userRepository.findById(dto.toUserId);
        const shift = await shiftRepository.findById(dto.shiftId);

        if (!fromUser) {
            throw ApiError.badRequest("Invalid request body", [
                { field: "fromUserId", message: "User not found" },
            ]);
        }

        if (!toUser) {
            throw ApiError.badRequest("Invalid request body", [
                { field: "toUserId", message: "User not found" },
            ]);
        }

        if (!shift) {
            throw ApiError.badRequest("Invalid request body", [
                { field: "shiftId", message: "Shift not found" },
            ]);
        }

        const created = await swapRepository.create({
            fromUserId: dto.fromUserId,
            toUserId: dto.toUserId,
            shiftId: dto.shiftId,
            status: dto.status,
        });

        if (!created) {
            throw ApiError.badRequest("Failed to create swap request");
        }

        return toSwapResponse(created);
    }

    async update(id: number, dto: UpdateSwapRequestDto) {
        const fromUser = await userRepository.findById(dto.fromUserId);
        const toUser = await userRepository.findById(dto.toUserId);
        const shift = await shiftRepository.findById(dto.shiftId);

        if (!fromUser) {
            throw ApiError.badRequest("Invalid request body", [
                { field: "fromUserId", message: "User not found" },
            ]);
        }

        if (!toUser) {
            throw ApiError.badRequest("Invalid request body", [
                { field: "toUserId", message: "User not found" },
            ]);
        }

        if (!shift) {
            throw ApiError.badRequest("Invalid request body", [
                { field: "shiftId", message: "Shift not found" },
            ]);
        }

        const updated = await swapRepository.update(id, {
            fromUserId: dto.fromUserId,
            toUserId: dto.toUserId,
            shiftId: dto.shiftId,
            status: dto.status,
        });

        if (!updated) {
            throw ApiError.notFound("Swap request not found");
        }

        return toSwapResponse(updated);
    }

    async patch(id: number, dto: PatchSwapRequestDto) {
        if (dto.fromUserId !== undefined) {
            const fromUser = await userRepository.findById(dto.fromUserId);
            if (!fromUser) {
                throw ApiError.badRequest("Invalid request body", [
                    { field: "fromUserId", message: "User not found" },
                ]);
            }
        }

        if (dto.toUserId !== undefined) {
            const toUser = await userRepository.findById(dto.toUserId);
            if (!toUser) {
                throw ApiError.badRequest("Invalid request body", [
                    { field: "toUserId", message: "User not found" },
                ]);
            }
        }

        if (dto.shiftId !== undefined) {
            const shift = await shiftRepository.findById(dto.shiftId);
            if (!shift) {
                throw ApiError.badRequest("Invalid request body", [
                    { field: "shiftId", message: "Shift not found" },
                ]);
            }
        }

        const updated = await swapRepository.patch(id, {
            fromUserId: dto.fromUserId,
            toUserId: dto.toUserId,
            shiftId: dto.shiftId,
            status: dto.status,
        });

        if (!updated) {
            throw ApiError.notFound("Swap request not found");
        }

        return toSwapResponse(updated);
    }

    async delete(id: number) {
        const deleted = await swapRepository.delete(id);

        if (!deleted) {
            throw ApiError.notFound("Swap request not found");
        }

        return { success: true };
    }
}

export const swapService = new SwapService();