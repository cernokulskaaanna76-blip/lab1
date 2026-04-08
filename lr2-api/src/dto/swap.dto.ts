export type SwapRequestStatus = "pending" | "approved" | "rejected";

export interface SwapRequestEntity {
    id: number;
    fromUserId: number;
    toUserId: number;
    shiftId: number;
    status: SwapRequestStatus;
    createdAt?: string;
}

export interface CreateSwapRequestDto {
    fromUserId: number;
    toUserId: number;
    shiftId: number;
    status: SwapRequestStatus;
}

export interface UpdateSwapRequestDto {
    fromUserId: number;
    toUserId: number;
    shiftId: number;
    status: SwapRequestStatus;
}

export interface PatchSwapRequestDto {
    fromUserId?: number;
    toUserId?: number;
    shiftId?: number;
    status?: SwapRequestStatus;
}

export interface SwapResponseDto {
    id: number;
    fromUserId: number;
    toUserId: number;
    shiftId: number;
    status: SwapRequestStatus;
}