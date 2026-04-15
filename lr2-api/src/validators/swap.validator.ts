import {
    CreateSwapRequestDto,
    PatchSwapRequestDto,
    UpdateSwapRequestDto,
} from "../dto/swap.dto";

export type ValidationError = {
    field: string;
    message: string;
};

const allowedStatuses = ["pending", "approved", "rejected"];

export function validateCreateSwap(dto: CreateSwapRequestDto): ValidationError[] {
    const errors: ValidationError[] = [];

    if (typeof dto.shiftId !== "number" || dto.shiftId <= 0) {
        errors.push({
            field: "shiftId",
            message: "shiftId must be a positive number",
        });
    }

    if (typeof dto.fromUserId !== "number" || dto.fromUserId <= 0) {
        errors.push({
            field: "fromUserId",
            message: "fromUserId must be a positive number",
        });
    }

    if (typeof dto.toUserId !== "number" || dto.toUserId <= 0) {
        errors.push({
            field: "toUserId",
            message: "toUserId must be a positive number",
        });
    }

    if (typeof dto.status !== "string" || !allowedStatuses.includes(dto.status)) {
        errors.push({
            field: "status",
            message: "status must be one of: pending, approved, rejected",
        });
    }

    return errors;
}

export function validateUpdateSwap(dto: UpdateSwapRequestDto): ValidationError[] {
    return validateCreateSwap(dto);
}

export function validatePatchSwap(dto: PatchSwapRequestDto): ValidationError[] {
    const errors: ValidationError[] = [];

    if (dto.shiftId !== undefined && (typeof dto.shiftId !== "number" || dto.shiftId <= 0)) {
        errors.push({
            field: "shiftId",
            message: "shiftId must be a positive number",
        });
    }

    if (dto.fromUserId !== undefined && (typeof dto.fromUserId !== "number" || dto.fromUserId <= 0)) {
        errors.push({
            field: "fromUserId",
            message: "fromUserId must be a positive number",
        });
    }

    if (dto.toUserId !== undefined && (typeof dto.toUserId !== "number" || dto.toUserId <= 0)) {
        errors.push({
            field: "toUserId",
            message: "toUserId must be a positive number",
        });
    }

    if (
        dto.status !== undefined &&
        (typeof dto.status !== "string" || !allowedStatuses.includes(dto.status))
    ) {
        errors.push({
            field: "status",
            message: "status must be one of: pending, approved, rejected",
        });
    }

    return errors;
}