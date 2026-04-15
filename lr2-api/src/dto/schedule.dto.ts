export interface ScheduleDto {
    id: number;
    title: string;
    description: string | null;
    createdAt: string;
}

export interface CreateScheduleDto {
    title: string;
    description?: string;
}

export interface UpdateScheduleDto {
    title: string;
    description?: string;
}

export interface PatchScheduleDto {
    title?: string;
    description?: string;
}