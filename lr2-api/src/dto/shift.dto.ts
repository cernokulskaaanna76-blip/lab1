export type ShiftStatus = "planned" | "confirmed" | "cancelled";
export type ShiftTimeSlot = "morning" | "day" | "evening" | "night";

export interface ShiftEntity {
    id: number;
    scheduleId: number;
    userId: number;
    date: string;
    timeSlot: ShiftTimeSlot;
    comment?: string | null;
    status: ShiftStatus;
    createdAt?: string;
}

export interface CreateShiftRequestDto {
    scheduleId: number;
    userId: number;
    date: string;
    timeSlot: ShiftTimeSlot;
    comment?: string;
    status: ShiftStatus;
}

export interface UpdateShiftRequestDto {
    scheduleId: number;
    userId: number;
    date: string;
    timeSlot: ShiftTimeSlot;
    comment?: string;
    status: ShiftStatus;
}

export interface PatchShiftRequestDto {
    scheduleId?: number;
    userId?: number;
    date?: string;
    timeSlot?: ShiftTimeSlot;
    comment?: string;
    status?: ShiftStatus;
}

export interface ShiftListQueryDto {
    status?: ShiftStatus;
    timeSlot?: ShiftTimeSlot;
    page?: number;
    pageSize?: number;
}