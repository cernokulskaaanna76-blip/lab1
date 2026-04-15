import { NextFunction, Request, Response } from "express";
import { shiftService } from "../services/shift.service";
import { ApiError } from "../utils/ApiError";
import {
    validateCreateShift,
    validatePatchShift,
    validateUpdateShift,
} from "../validators/shift.validator";

class ShiftController {

    // отримати всі shifts
    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await shiftService.getAll(req.query);
            res.status(200).json({
                items: result,
                meta: { total: result.length }
            });
        } catch (error) {
            next(error);
        }
    };

    // endpoint із JOIN (shift + user + schedule)
    getAllWithUsers = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await shiftService.getAllWithUsers(); // ✅ без аргументів
            res.status(200).json({
                items: result,
                meta: { total: result.length }
            });
        } catch (error) {
            next(error);
        }
    };

    // агрегація (COUNT, SUM)
    getSummaryStats = async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await shiftService.getSummaryStats();
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // SQL injection demo (НЕБЕЗПЕЧНО)
    searchUnsafe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const comment = String(req.query.comment ?? "");
            const result = await shiftService.searchUnsafe(comment);
            res.status(200).json({
                items: result,
                meta: { total: result.length }
            });
        } catch (error) {
            next(error);
        }
    };

    // GET by id
    getById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                throw ApiError.badRequest("Invalid id");
            }

            const result = await shiftService.getById(id);

            if (!result) {
                throw ApiError.notFound("Shift not found");
            }

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // POST create
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validateCreateShift(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Validation failed");
            }

            const result = await shiftService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    // PUT update
    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                throw ApiError.badRequest("Invalid id");
            }

            const errors = validateUpdateShift(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Validation failed");
            }

            const result = await shiftService.update(id, req.body);

            if (!result) {
                throw ApiError.notFound("Shift not found");
            }

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // PATCH update
    patch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                throw ApiError.badRequest("Invalid id");
            }

            const errors = validatePatchShift(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Validation failed");
            }

            const result = await shiftService.patch(id, req.body);

            if (!result) {
                throw ApiError.notFound("Shift not found");
            }

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    // DELETE
    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                throw ApiError.badRequest("Invalid id");
            }

            const deleted = await shiftService.delete(id);

            if (!deleted) {
                throw ApiError.notFound("Shift not found");
            }

            res.status(200).json({ message: "Deleted" });
        } catch (error) {
            next(error);
        }
    };
}

export const shiftController = new ShiftController();