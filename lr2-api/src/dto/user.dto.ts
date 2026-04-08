export interface UserEntity {
    id: number;
    name: string;
    email: string;
    createdAt?: string;
}

export interface CreateUserRequestDto {
    name: string;
    email: string;
}

export interface UpdateUserRequestDto {
    name: string;
    email: string;
}

export interface PatchUserRequestDto {
    name?: string;
    email?: string;
}

export interface UserResponseDto {
    id: number;
    name: string;
    email: string;
}