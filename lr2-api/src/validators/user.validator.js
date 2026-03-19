function validateCreateUser(dto) {
    const errors = [];

    if (!dto.name || dto.name.trim().length < 2) {
        errors.push({ field: "name", message: "Name must be at least 2 characters" });
    }

    if (!dto.email || !dto.email.includes("@")) {
        errors.push({ field: "email", message: "Invalid email" });
    }

    return errors;
}

function validateUpdateUser(dto) {
    const errors = [];

    if (dto.name && dto.name.trim().length < 2) {
        errors.push({ field: "name", message: "Name must be at least 2 characters" });
    }

    if (dto.email && !dto.email.includes("@")) {
        errors.push({ field: "email", message: "Invalid email" });
    }

    return errors;
}

module.exports = {
    validateCreateUser,
    validateUpdateUser
};