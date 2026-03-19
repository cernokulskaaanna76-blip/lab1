let users = [
    { id: 1, name: 'Іван', role: 'student' },
    { id: 2, name: 'Марія', role: 'admin' }
];

class UserRepository {
    async findAll() {
        return [...users];
    }

    async findById(id) {
        return users.find(u => u.id === parseInt(id));
    }

    async create(data) {
        const newId = users.length > 0
            ? Math.max(...users.map(u => u.id)) + 1
            : 1;

        const newUser = { id: newId, ...data };
        users.push(newUser);
        return newUser;
    }

    async update(id, updateData) {
        const index = users.findIndex(u => u.id === parseInt(id));
        if (index !== -1) {
            users[index] = { ...users[index], ...updateData };
            return users[index];
        }
        return null;
    }

    async delete(id) {
        const index = users.findIndex(u => u.id === parseInt(id));
        if (index !== -1) {
            const deleted = users.splice(index, 1);
            return deleted[0];
        }
        return null;
    }
}

module.exports = new UserRepository();