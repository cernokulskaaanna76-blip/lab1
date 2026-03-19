function requireString(value, field) {
    if (typeof value !== "string" || value.trim().length === 0) {
        return { field, message: `${field} must be a non-empty string` };
    }
    return null;
}

function validateCreateShift(dto) {
    const errors = [];

    const e1 = requireString(dto.date, "date");
    if (e1) errors.push(e1);

    const e2 = requireString(dto.type, "type");
    if (e2) errors.push(e2);

    if (typeof dto.userId !== "number") {
        errors.push({ field: "userId", message: "userId must be a number" });
    }

    return errors;
}

function validateUpdateShift(dto) {
    return validateCreateShift(dto);
}

module.exports = {
    validateCreateShift,
    validateUpdateShift
};