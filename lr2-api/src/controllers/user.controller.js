const { toUserResponse, toUsersResponse } = require("../dto/user.dto");
const ApiError = require("../utils/ApiError");
const { validateCreateUser, validateUpdateUser } = require("../validators/user.validator");
const userService = require('../services/user.service');

class UserController {

    async getAll(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.status(200).json(toUsersResponse(users));
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) throw ApiError.BadRequest("Invalid id");

            const user = await userService.getUserById(id);

            if (!user) {
                throw ApiError.NotFound("User not found");
            }

            res.status(200).json(toUserResponse(user));
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const errors = validateCreateUser(req.body);

            if (errors.length > 0) {
                throw ApiError.BadRequest("Invalid request data", errors);
            }

            const newUser = await userService.registerUser(req.body);
            res.status(201).json(toUserResponse(newUser));
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) throw ApiError.BadRequest("Invalid id");

            const errors = validateUpdateUser(req.body);
            if (errors.length > 0) {
                throw ApiError.BadRequest("Invalid request data", errors);
            }

            const user = await userService.updateUser(id, req.body);

            if (!user) {
                throw ApiError.NotFound("User not found");
            }

            res.status(200).json(toUserResponse(user));
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) throw ApiError.BadRequest("Invalid id");

            const ok = await userService.deleteUser(id);

            if (!ok) {
                throw ApiError.NotFound("User not found");
            }

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();