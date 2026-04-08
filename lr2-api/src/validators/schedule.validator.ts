import {
    CreateScheduleRequestDto,
    PatchScheduleRequestDto,
    UpdateScheduleRequestDto,
} from "../dto/schedule.dto";

type ValidationError = {
    field: string;
    message: string;
};

export function validateCreateSchedule(dto: CreateScheduleRequestDto): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!dto.title || dto.title.trim().length < 2) {
        errors.push({
            field: "title",
            message: "title must be at least 2 characters",
        });
    }

    if (dto.description !== undefined && typeof dto.description !== "string") {
        errors.push({
            field: "description",
            message: "description must be a string",
        });
    }

    if (
        dto.description !== undefined &&
        typeof dto.description === "string" &&
        dto.description.length > 500
    ) {
        errors.push({
            field: "description",
            message: "description is too long",
        });
    }

    return errors;
}

export function validateUpdateSchedule(dto: UpdateScheduleRequestDto): ValidationError[] {
    return validateCreateSchedule(dto);
}

export function validatePatchSchedule(dto: PatchScheduleRequestDto): ValidationError[] {
    const errors: ValidationError[] = [];

    if (dto.title !== undefined && dto.title.trim().length < 2) {
        errors.push({
            field: "title",
            message: "title must be at least 2 characters",
        });
    }

    if (dto.description !== undefined && typeof dto.description !== "string") {
        errors.push({
            field: "description",
            message: "description must be a string",
        });
    }

    if (
        dto.description !== undefined &&
        typeof dto.description === "string" &&
        dto.description.length > 500
    ) {
        errors.push({
            field: "description",
            message: "description is too long",
        });
    }

    return errors;
}