import { NextFunction, Request, Response } from "express";
import { userService } from "../services/user.service";
import { ApiError } from "../utils/ApiError";
import {
    validateCreateUser,
    validatePatchUser,
    validateUpdateUser,
} from "../validators/user.validator";

class UserController {
    getAll = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await userService.getAll();
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

            const result = await userService.getById(id);

            if (!result) {
                throw ApiError.notFound("User not found");
            }

            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    };

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const errors = validateCreateUser(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Invalid request body", errors);
            }

            const result = await userService.create(req.body);
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

            const errors = validateUpdateUser(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Invalid request body", errors);
            }

            const result = await userService.update(id, req.body);

            if (!result) {
                throw ApiError.notFound("User not found");
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

            const errors = validatePatchUser(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Invalid request body", errors);
            }

            const result = await userService.patch(id, req.body);

            if (!result) {
                throw ApiError.notFound("User not found");
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

            const deleted = await userService.delete(id);

            if (!deleted) {
                throw ApiError.notFound("User not found");
            }

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}

export const userController = new UserController();