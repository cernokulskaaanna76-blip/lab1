import { CreateUserDto, PatchUserDto, UpdateUserDto } from "../dto/user.dto";

export type ValidationError = {
    field: string;
    message: string;
};

export function validateCreateUser(dto: CreateUserDto): ValidationError[] {
    const errors: ValidationError[] = [];

    if (typeof dto.name !== "string" || dto.name.trim().length === 0) {
        errors.push({ field: "name", message: "name is required" });
    }

    if (typeof dto.email !== "string" || dto.email.trim().length === 0) {
        errors.push({ field: "email", message: "email is required" });
    }

    return errors;
}

export function validateUpdateUser(dto: UpdateUserDto): ValidationError[] {
    return validateCreateUser(dto);
}

export function validatePatchUser(dto: PatchUserDto): ValidationError[] {
    const errors: ValidationError[] = [];

    if (dto.name !== undefined && (typeof dto.name !== "string" || dto.name.trim().length === 0)) {
        errors.push({ field: "name", message: "name must be a non-empty string" });
    }

    if (dto.email !== undefined && (typeof dto.email !== "string" || dto.email.trim().length === 0)) {
        errors.push({ field: "email", message: "email must be a non-empty string" });
    }

    return errors;
}