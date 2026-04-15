export type ShiftType = "day" | "night";
export type ShiftStatus = "planned" | "done" | "cancelled";

export interface ShiftDto {
    id: number;
    scheduleId: number;
    userId: number;
    date: string;
    type: ShiftType;
    status: ShiftStatus;
    comment?: string | null;
    createdAt: string;
}

export interface ShiftWithUserDto {
    id: number;
    scheduleId: number;
    userId: number;
    date: string;
    type: ShiftType;
    status: ShiftStatus;
    comment?: string | null;
    createdAt: string;
    userName: string;
    userEmail: string;
    scheduleTitle: string;
}

export interface CreateShiftDto {
    scheduleId: number;
    userId: number;
    date: string;
    type: ShiftType;
    status: ShiftStatus;
    comment?: string;
}

export interface UpdateShiftDto {
    scheduleId: number;
    userId: number;
    date: string;
    type: ShiftType;
    status: ShiftStatus;
    comment?: string;
}

export interface PatchShiftDto {
    scheduleId?: number;
    userId?: number;
    date?: string;
    type?: ShiftType;
    status?: ShiftStatus;
    comment?: string;
}