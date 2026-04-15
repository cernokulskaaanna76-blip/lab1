export type SwapStatus = "pending" | "approved" | "rejected";

export interface SwapRequestDto {
    id: number;
    shiftId: number;
    fromUserId: number;
    toUserId: number;
    status: SwapStatus;
    createdAt: string;
}

export interface CreateSwapRequestDto {
    shiftId: number;
    fromUserId: number;
    toUserId: number;
    status: SwapStatus;
}

export interface UpdateSwapRequestDto {
    shiftId: number;
    fromUserId: number;
    toUserId: number;
    status: SwapStatus;
}

export interface PatchSwapRequestDto {
    shiftId?: number;
    fromUserId?: number;
    toUserId?: number;
    status?: SwapStatus;
}