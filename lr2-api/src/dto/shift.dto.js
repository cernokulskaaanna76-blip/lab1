const toShiftResponse = (shift) => {
    if (!shift) return null;

    return {
        id: shift.id,
        userId: shift.userId,
        date: shift.date,
        type: shift.type
    };
};

const toShiftsResponse = (shifts) => {
    return {
        items: Array.isArray(shifts) ? shifts.map(toShiftResponse) : []
    };
};

module.exports = {
    toShiftResponse,
    toShiftsResponse
};