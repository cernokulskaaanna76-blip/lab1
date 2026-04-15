import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { userService } from "../services/user.service";
import {
    validateCreateUser,
    validatePatchUser,
    validateUpdateUser,
} from "../validators/user.validator";

class UserController {
    getAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await userService.getAll(req.query);
            res.status(200).json({ items: result });
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction) => {
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

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const errors = validateCreateUser(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Validation failed", errors);
            }

            const created = await userService.create(req.body);
            res.status(201).json(created);
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                throw ApiError.badRequest("Invalid id", [
                    { field: "id", message: "Id must be a number" },
                ]);
            }

            const errors = validateUpdateUser(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Validation failed", errors);
            }

            const updated = await userService.update(id, req.body);

            if (!updated) {
                throw ApiError.notFound("User not found");
            }

            res.status(200).json(updated);
        } catch (error) {
            next(error);
        }
    };

    patch = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = Number(req.params.id);

            if (Number.isNaN(id)) {
                throw ApiError.badRequest("Invalid id", [
                    { field: "id", message: "Id must be a number" },
                ]);
            }

            const errors = validatePatchUser(req.body);

            if (errors.length > 0) {
                throw ApiError.badRequest("Validation failed", errors);
            }

            const updated = await userService.patch(id, req.body);

            if (!updated) {
                throw ApiError.notFound("User not found");
            }

            res.status(200).json(updated);
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
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