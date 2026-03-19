const shiftRepository = require('../repository/shift.repository');
const ApiError = require('../utils/ApiError');

class ShiftService {
    async getAllShifts() {
        return await shiftRepository.findAll();
    }

    async getShiftById(id) {
        const shift = await shiftRepository.findById(id);
        if (!shift) {
            throw ApiError.NotFound(`Shift with ID ${id} not found`);
        }
        return shift;
    }

    async createShift(data) {
        if (!data || !data.date) {
            throw ApiError.BadRequest("Дата обов'язкова");
        }
        return await shiftRepository.create(data);
    }

    async updateShift(id, updateData) {
        await this.getShiftById(id);
        return await shiftRepository.update(id, updateData);
    }

    async deleteShift(id) {
        await this.getShiftById(id);
        return await shiftRepository.delete(id);
    }
}

module.exports = new ShiftService();