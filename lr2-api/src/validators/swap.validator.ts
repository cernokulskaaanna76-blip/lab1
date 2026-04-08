import {
    CreateSwapRequestDto,
    PatchSwapRequestDto,
    UpdateSwapRequestDto,
} from "../dto/swap.dto";

type ValidationError = {
    field: string;
    message: string;
};

const allowedStatuses = ["pending", "approved", "rejected"];

export function validateCreateSwap(dto: CreateSwapRequestDto): ValidationError[] {
    const errors: ValidationError[] = [];

    if (typeof dto.fromUserId !== "number") {
        errors.push({
            field: "fromUserId",
            message: "fromUserId must be a number",
        });
    }

    if (typeof dto.toUserId !== "number") {
        errors.push({
            field: "toUserId",
            message: "toUserId must be a number",
        });
    }

    if (typeof dto.shiftId !== "number") {
        errors.push({
            field: "shiftId",
            message: "shiftId must be a number",
        });
    }

    if (!allowedStatuses.includes(dto.status)) {
        errors.push({
            field: "status",
            message: "status must be pending, approved or rejected",
        });
    }

    return errors;
}

