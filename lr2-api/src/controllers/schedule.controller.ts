import { NextFunction, Request, Response } from "express";
import { scheduleService } from "../services/schedule.service";
import { ApiError } from "../utils/ApiError";
import {
    validateCreateSchedule,
    validatePatchSchedule,
    validateUpdateSchedule,
} from "../validators/schedule.validator";

class ScheduleController {
    getAll = (_req: Request, res: Response, next: NextFunction): void => {
        try {
            const result = scheduleService.getAll();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getById = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const id = Number(req.params.id);
            const result = scheduleService.getById(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    create = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const errors = validateCreateSchedule(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Invalid request body", errors);
            }

            const result = scheduleService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    update = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const id = Number(req.params.id);
            const errors = validateUpdateSchedule(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Invalid request body", errors);
            }

            const result = scheduleService.update(id, req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    patch = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const id = Number(req.params.id);
            const errors = validatePatchSchedule(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Invalid request body", errors);
            }

            const result = scheduleService.patch(id, req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    delete = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const id = Number(req.params.id);
            scheduleService.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}

export const scheduleController = new ScheduleController();