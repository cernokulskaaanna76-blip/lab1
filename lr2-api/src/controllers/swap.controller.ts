import {
    CreateSwapRequestDto,
    PatchSwapRequestDto,
    UpdateSwapRequestDto,
} from "../dto/swap.dto";

type ValidationError = {
    field: string;
    message: string;
};

const ALLOWED_STATUSES = ["pending", "approved", "rejected"];

export function validateCreateSwap(dto: CreateSwapRequestDto): ValidationError[] {
    const errors: ValidationError[] = [];

    if (dto.fromUserId === undefined || dto.fromUserId === null) {
        errors.push({ field: "fromUserId", message: "fromUserId is required" });
    } else if (typeof dto.fromUserId !== "number") {
        errors.push({ field: "fromUserId", message: "fromUserId must be a number" });
    }

    if (dto.toUserId === undefined || dto.toUserId === null) {
        errors.push({ field: "toUserId", message: "toUserId is required" });
    } else if (typeof dto.toUserId !== "number") {
        errors.push({ field: "toUserId", message: "toUserId must be a number" });
    }

    if (dto.shiftId === undefined || dto.shiftId === null) {
        errors.push({ field: "shiftId", message: "shiftId is required" });
    } else if (typeof dto.shiftId !== "number") {
        errors.push({ field: "shiftId", message: "shiftId must be a number" });
    }

    if (!dto.status) {
        errors.push({ field: "status", message: "status is required" });
    } else if (!ALLOWED_STATUSES.includes(dto.status)) {
        errors.push({
            field: "status",
            message: "status must be pending, approved or rejected",
        });
    }

    return errors;
}

export function validateUpdateSwap(dto: UpdateSwapRequestDto): ValidationError[] {
    return validateCreateSwap(dto as CreateSwapRequestDto);
}

export function validatePatchSwap(dto: PatchSwapRequestDto): ValidationError[] {
    const errors: ValidationError[] = [];

    if (
        dto.fromUserId !== undefined &&
        typeof dto.fromUserId !== "number"
    ) {
        errors.push({ field: "fromUserId", message: "fromUserId must be a number" });
    }

    if (
        dto.toUserId !== undefined &&
        typeof dto.toUserId !== "number"
    ) {
        errors.push({ field: "toUserId", message: "toUserId must be a number" });
    }

    if (
        dto.shiftId !== undefined &&
        typeof dto.shiftId !== "number"
    ) {
        errors.push({ field: "shiftId", message: "shiftId must be a number" });
    }

    if (
        dto.status !== undefined &&
        !ALLOWED_STATUSES.includes(dto.status)
    ) {
        errors.push({
            field: "status",
            message: "status must be pending, approved or rejected",
        });
    }

    return errors;
}