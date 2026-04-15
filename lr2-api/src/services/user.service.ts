import { CreateUserDto, PatchUserDto, UpdateUserDto } from "../dto/user.dto";
import { userRepository } from "../repositories/user.repository";

class UserService {
    async getAll(query: any) {
        return userRepository.getAll(query);
    }

    async getById(id: number) {
        return userRepository.getById(id);
    }

    async create(dto: CreateUserDto) {
        return userRepository.create(dto);
    }

    async update(id: number, dto: UpdateUserDto) {
        return userRepository.update(id, dto);
    }

    async patch(id: number, dto: PatchUserDto) {
        return userRepository.patch(id, dto);
    }

    async delete(id: number) {
        return userRepository.delete(id);
    }
}

export const userService = new UserService();