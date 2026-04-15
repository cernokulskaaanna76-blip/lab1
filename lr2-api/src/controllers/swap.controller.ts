import { NextFunction, Request, Response } from "express";
import { swapService } from "../services/swap.service";
import { ApiError } from "../utils/ApiError";
import {
    validateCreateSwap,
    validatePatchSwap,
    validateUpdateSwap,
} from "../validators/swap.validator";

class SwapController {
    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await swapService.getAll(req.query);
            res.status(200).json({ items: result });
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

            const result = await swapService.getById(id);

            if (!result) {
                throw ApiError.notFound("Swap request not found");
            }

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validateCreateSwap(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Validation failed", errors);
            }

            const result = await swapService.create(req.body);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    };

    approve = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                throw ApiError.badRequest("Invalid id", [
                    { field: "id", message: "Id must be a number" },
                ]);
            }

            const result = await swapService.approve(id);
            res.status(200).json(result);
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

            const errors = validateUpdateSwap(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Validation failed", errors);
            }

            const result = await swapService.update(id, req.body);

            if (!result) {
                throw ApiError.notFound("Swap request not found");
            }

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

            const errors = validatePatchSwap(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Validation failed", errors);
            }

            const result = await swapService.patch(id, req.body);

            if (!result) {
                throw ApiError.notFound("Swap request not found");
            }

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

            const deleted = await swapService.delete(id);

            if (!deleted) {
                throw ApiError.notFound("Swap request not found");
            }

            res.status(200).json({ message: "Swap request deleted successfully" });
        } catch (error) {
            next(error);
        }
    };
}

export const swapController = new SwapController();