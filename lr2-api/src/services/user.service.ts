import {
    CreateUserRequestDto,
    PatchUserRequestDto,
    UpdateUserRequestDto,
    UserResponseDto,
} from "../dto/user.dto";
import { userRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/ApiError";

function toUserResponse(user: any): UserResponseDto {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
}

class UserService {
    async getAll() {
        const items = (await userRepository.findAll()).map(toUserResponse);

        return {
            items,
            total: items.length,
        };
    }

    async getById(id: number): Promise<UserResponseDto> {
        const user = await userRepository.findById(id);

        if (!user) {
            throw ApiError.notFound("User not found");
        }

        return toUserResponse(user);
    }

    async create(dto: CreateUserRequestDto): Promise<UserResponseDto> {
        const created = await userRepository.create(dto.name, dto.email);

        if (!created) {
            throw ApiError.badRequest("Failed to create user");
        }

        return toUserResponse(created);
    }

    async update(id: number, dto: UpdateUserRequestDto): Promise<UserResponseDto> {
        const updated = await userRepository.update(id, dto.name, dto.email);

        if (!updated) {
            throw ApiError.notFound("User not found");
        }

        return toUserResponse(updated);
    }

    async patch(id: number, dto: PatchUserRequestDto): Promise<UserResponseDto> {
        const updated = await userRepository.patch(id, dto);

        if (!updated) {
            throw ApiError.notFound("User not found");
        }

        return toUserResponse(updated);
    }

    async delete(id: number) {
        const deleted = await userRepository.delete(id);

        if (!deleted) {
            throw ApiError.notFound("User not found");
        }

        return { success: true };
    }
}

export const userService = new UserService();