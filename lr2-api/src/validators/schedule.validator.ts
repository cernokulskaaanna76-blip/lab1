import {
    CreateScheduleDto,
    PatchScheduleDto,
    UpdateScheduleDto,
} from "../dto/schedule.dto";

export type ValidationError = {
    field: string;
    message: string;
};

export function validateCreateSchedule(dto: CreateScheduleDto): ValidationError[] {
    const errors: ValidationError[] = [];

    if (typeof dto.title !== "string" || dto.title.trim().length === 0) {
        errors.push({ field: "title", message: "title is required" });
    }

    return errors;
}

export function validateUpdateSchedule(dto: UpdateScheduleDto): ValidationError[] {
    return validateCreateSchedule(dto);
}

export function validatePatchSchedule(dto: PatchScheduleDto): ValidationError[] {
    const errors: ValidationError[] = [];

    if (dto.title !== undefined && (typeof dto.title !== "string" || dto.title.trim().length === 0)) {
        errors.push({ field: "title", message: "title must be a non-empty string" });
    }

    return errors;
}