import { NextFunction, Request, Response } from "express";
import { shiftService } from "../services/shift.service";
import { ApiError } from "../utils/ApiError";
import {
    validateCreateShift,
    validatePatchShift,
    validateUpdateShift,
} from "../validators/shift.validator";

class ShiftController {
    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const query = {
                status: req.query.status as "planned" | "confirmed" | "cancelled" | undefined,
                timeSlot: req.query.timeSlot as "morning" | "day" | "evening" | "night" | undefined,
                page: req.query.page ? Number(req.query.page) : 1,
                pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
            };

            const result = await shiftService.getAll(query);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getAllWithRelations = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const result = await shiftService.getAllWithRelations();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                throw ApiError.badRequest("Invalid id", [
                    { field: "id", message: "Id must be a number" },
                ]);
            }

            const result = await shiftService.getById(id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validateCreateShift(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Invalid request body", errors);
            }

            const result = await shiftService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                throw ApiError.badRequest("Invalid id", [
                    { field: "id", message: "Id must be a number" },
                ]);
            }

            const errors = validateUpdateShift(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Invalid request body", errors);
            }

            const result = await shiftService.update(id, req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    patch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                throw ApiError.badRequest("Invalid id", [
                    { field: "id", message: "Id must be a number" },
                ]);
            }

            const errors = validatePatchShift(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Invalid request body", errors);
            }

            const result = await shiftService.patch(id, req.body);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                throw ApiError.badRequest("Invalid id", [
                    { field: "id", message: "Id must be a number" },
                ]);
            }

            await shiftService.delete(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}

export const shiftController = new ShiftController();