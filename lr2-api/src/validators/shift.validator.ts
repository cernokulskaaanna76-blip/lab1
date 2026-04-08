import {
    CreateShiftRequestDto,
    PatchShiftRequestDto,
    UpdateShiftRequestDto,
} from "../dto/shift.dto";

type ValidationError = {
    field: string;
    message: string;
};

const allowedStatuses = ["planned", "confirmed", "cancelled"];
const allowedTimeSlots = ["morning", "day", "evening", "night"];

export function validateCreateShift(dto: CreateShiftRequestDto): ValidationError[] {
    const errors: ValidationError[] = [];

    if (typeof dto.scheduleId !== "number") {
        errors.push({
            field: "scheduleId",
            message: "scheduleId must be a number",
        });
    }

    if (typeof dto.userId !== "number") {
        errors.push({
            field: "userId",
            message: "userId must be a number",
        });
    }

    if (typeof dto.date !== "string" || dto.date.trim().length === 0) {
        errors.push({
            field: "date",
            message: "date is required",
        });
    }

    if (!allowedTimeSlots.includes(dto.timeSlot)) {
        errors.push({
            field: "timeSlot",
            message: "timeSlot must be morning, day, evening or night",
        });
    }

    if (!allowedStatuses.includes(dto.status)) {
        errors.push({
            field: "status",
            message: "status must be planned, confirmed or cancelled",
        });
    }

    if (dto.comment !== undefined && typeof dto.comment !== "string") {
        errors.push({
            field: "comment",
            message: "comment must be a string",
        });
    }

    return errors;
}

export function validateUpdateShift(dto: UpdateShiftRequestDto): ValidationError[] {
    return validateCreateShift(dto);
}

export function validatePatchShift(dto: PatchShiftRequestDto): ValidationError[] {
    const errors: ValidationError[] = [];

    if (dto.scheduleId !== undefined && typeof dto.scheduleId !== "number") {
        errors.push({
            field: "scheduleId",
            message: "scheduleId must be a number",
        });
    }

    if (dto.userId !== undefined && typeof dto.userId !== "number") {
        errors.push({
            field: "userId",
            message: "userId must be a number",
        });
    }

    if (dto.date !== undefined && (typeof dto.date !== "string" || dto.date.trim().length === 0)) {
        errors.push({
            field: "date",
            message: "date must be a non-empty string",
        });
    }

    if (dto.timeSlot !== undefined && !allowedTimeSlots.includes(dto.timeSlot)) {
        errors.push({
            field: "timeSlot",
            message: "timeSlot must be morning, day, evening or night",
        });
    }

    if (dto.status !== undefined && !allowedStatuses.includes(dto.status)) {
        errors.push({
            field: "status",
            message: "status must be planned, confirmed or cancelled",
        });
    }

    if (dto.comment !== undefined && typeof dto.comment !== "string") {
        errors.push({
            field: "comment",
            message: "comment must be a string",
        });
    }

    return errors;
}