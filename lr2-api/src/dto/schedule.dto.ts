export interface ScheduleEntity {
    id: number;
    title: string;
    description?: string | null;
    createdAt?: string;
}

export interface CreateScheduleRequestDto {
    title: string;
    description?: string;
}

export interface UpdateScheduleRequestDto {
    title: string;
    description?: string;
}

export interface PatchScheduleRequestDto {
    title?: string;
    description?: string;
}

export interface ScheduleResponseDto {
    id: number;
    title: string;
    description?: string | null;
}