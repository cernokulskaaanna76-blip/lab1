import {
    CreateUserRequestDto,
    UpdateUserRequestDto,
    PatchUserRequestDto,
} from "../dto/user.dto";

export type ValidationError = {
    field: string;
    message: string;
};

export function validateCreateUser(
    dto: CreateUserRequestDto
): ValidationError[] {
    const errors: ValidationError[] = [];

    if (typeof dto.name !== "string" || dto.name.trim().length < 2) {
        errors.push({
            field: "name",
            message: "Name must be at least 2 characters",
        });
    }

    if (typeof dto.email !== "string" || !dto.email.includes("@")) {
        errors.push({
            field: "email",
            message: "Email is invalid",
        });
    }

    return errors;
}

export function validateUpdateUser(
    dto: UpdateUserRequestDto
): ValidationError[] {
    return validateCreateUser(dto);
}

export function validatePatchUser(
    dto: PatchUserRequestDto
): ValidationError[] {
    const errors: ValidationError[] = [];

    if (
        dto.name !== undefined &&
        (typeof dto.name !== "string" || dto.name.trim().length < 2)
    ) {
        errors.push({
            field: "name",
            message: "Name must be at least 2 characters",
        });
    }

    if (
        dto.email !== undefined &&
        (typeof dto.email !== "string" || !dto.email.includes("@"))
    ) {
        errors.push({
            field: "email",
            message: "Email is invalid",
        });
    }

    return errors;
}