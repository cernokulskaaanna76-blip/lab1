const { toUserResponse, toUsersResponse } = require("../dto/user.dto");
const ApiError = require("../utils/ApiError");
const { validateCreateUser } = require("../validators/user.validator");
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
}


module.exports = new UserController();