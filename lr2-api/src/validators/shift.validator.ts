import { CreateShiftDto, PatchShiftDto, UpdateShiftDto } from "../dto/shift.dto";

export type ValidationError = {
    field: string;
    message: string;
};

const allowedTypes = ["day", "night"];
const allowedStatuses = ["planned", "done", "cancelled"];

export function validateCreateShift(dto: CreateShiftDto): ValidationError[] {
    const errors: ValidationError[] = [];

    if (typeof dto.scheduleId !== "number" || dto.scheduleId <= 0) {
        errors.push({
            field: "scheduleId",
            message: "scheduleId must be a positive number",
        });
    }

    if (typeof dto.userId !== "number" || dto.userId <= 0) {
        errors.push({
            field: "userId",
            message: "userId must be a positive number",
        });
    }

    if (typeof dto.date !== "string" || dto.date.trim().length === 0) {
        errors.push({
            field: "date",
            message: "date is required",
        });
    }

    if (typeof dto.type !== "string" || !allowedTypes.includes(dto.type)) {
        errors.push({
            field: "type",
            message: "type must be one of: day, night",
        });
    }

    if (typeof dto.status !== "string" || !allowedStatuses.includes(dto.status)) {
        errors.push({
            field: "status",
            message: "status must be one of: planned, done, cancelled",
        });
    }

    return errors;
}

export function validateUpdateShift(dto: UpdateShiftDto): ValidationError[] {
    return validateCreateShift(dto);
}

export function validatePatchShift(dto: PatchShiftDto): ValidationError[] {
    const errors: ValidationError[] = [];

    if (
        dto.scheduleId !== undefined &&
        (typeof dto.scheduleId !== "number" || dto.scheduleId <= 0)
    ) {
        errors.push({
            field: "scheduleId",
            message: "scheduleId must be a positive number",
        });
    }

    if (
        dto.userId !== undefined &&
        (typeof dto.userId !== "number" || dto.userId <= 0)
    ) {
        errors.push({
            field: "userId",
            message: "userId must be a positive number",
        });
    }

    if (
        dto.date !== undefined &&
        (typeof dto.date !== "string" || dto.date.trim().length === 0)
    ) {
        errors.push({
            field: "date",
            message: "date must be a non-empty string",
        });
    }

    if (
        dto.type !== undefined &&
        (typeof dto.type !== "string" || !allowedTypes.includes(dto.type))
    ) {
        errors.push({
            field: "type",
            message: "type must be one of: day, night",
        });
    }

    if (
        dto.status !== undefined &&
        (typeof dto.status !== "string" || !allowedStatuses.includes(dto.status))
    ) {
        errors.push({
            field: "status",
            message: "status must be one of: planned, done, cancelled",
        });
    }

    return errors;
}