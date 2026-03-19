const shiftService = require('../services/shift.service');
const { toShiftResponse, toShiftsResponse } = require('../dto/shift.dto');
const ApiError = require('../utils/ApiError');
const { validateCreateShift, validateUpdateShift } = require('../validators/shift.validator');

class ShiftController {

    getAll = async (req, res, next) => {
        try {
            const shifts = await shiftService.getAllShifts();
            res.status(200).json(toShiftsResponse(shifts));
        } catch (error) {
            next(error);
        }
    }

    getById = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) throw ApiError.BadRequest("Invalid id");

            const shift = await shiftService.getShiftById(id);

            if (!shift) {
                throw ApiError.NotFound("Shift not found");
            }

            res.status(200).json(toShiftResponse(shift));
        } catch (error) {
            next(error);
        }
    }

    create = async (req, res, next) => {
        try {
            const errors = validateCreateShift(req.body);

            if (errors.length > 0) {
                throw ApiError.BadRequest("Invalid request data", errors);
            }

            const newShift = await shiftService.createShift(req.body);
            res.status(201).json(toShiftResponse(newShift));
        } catch (error) {
            next(error);
        }
    }

    update = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) throw ApiError.BadRequest("Invalid id");

            const errors = validateUpdateShift(req.body);
            if (errors.length > 0) {
                throw ApiError.BadRequest("Invalid request data", errors);
            }

            const updatedShift = await shiftService.updateShift(id, req.body);

            if (!updatedShift) {
                throw ApiError.NotFound("Shift not found");
            }

            res.status(200).json(toShiftResponse(updatedShift));
        } catch (error) {
            next(error);
        }
    }

    delete = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            if (isNaN(id)) throw ApiError.BadRequest("Invalid id");

            const ok = await shiftService.deleteShift(id);

            if (!ok) {
                throw ApiError.NotFound("Shift not found");
            }

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ShiftController();