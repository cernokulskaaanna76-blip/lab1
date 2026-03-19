function toUserResponse(user) {
    if (!user) return null;

    return {
        id: user.id,
        name: user.name,
        role: user.role
    };
}

function toUsersResponse(users) {
    return {
        items: Array.isArray(users) ? users.map(toUserResponse) : []
    };
}

module.exports = {
    toUserResponse,
    toUsersResponse
};