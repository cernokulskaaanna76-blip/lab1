const shiftService = require('../services/shift.service');
const { toShiftResponse, toShiftsResponse } = require('../dto/shift.dto');

class ShiftController {
    // Використовуємо стрілочні функції, щоб уникнути проблем із контекстом
    getAll = async (req, res, next) => {
        try {
            const shifts = await shiftService.getAllShifts();
            res.json(toShiftsResponse(shifts));
        } catch (error) {
            next(error);
        }
    }

    getById = async (req, res, next) => {
        try {
            const shift = await shiftService.getShiftById(req.params.id);
            res.json(toShiftResponse(shift));
        } catch (error) {
            next(error);
        }
    }

    create = async (req, res, next) => {
        try {
            const newShift = await shiftService.createShift(req.body);
            res.status(201).json(toShiftResponse(newShift));
        } catch (error) {
            next(error);
        }
    }

    update = async (req, res, next) => {
        try {
            const updatedShift = await shiftService.updateShift(req.params.id, req.body);
            res.json(toShiftResponse(updatedShift));
        } catch (error) {
            next(error);
        }
    }

    delete = async (req, res, next) => {
        try {
            await shiftService.deleteShift(req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ShiftController();