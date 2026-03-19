let shifts = [
    { id: 1, userId: 1, date: '2026-03-19', type: 'morning' },
    { id: 2, userId: 2, date: '2026-03-19', type: 'evening' }
];

class ShiftRepository {
    async findAll() {
        return [...shifts];
    }

    async findById(id) {
        return shifts.find(s => s.id === parseInt(id));
    }

    async create(data) {
        const newId = shifts.length > 0
            ? Math.max(...shifts.map(s => s.id)) + 1
            : 1;

        const newShift = { id: newId, ...data };
        shifts.push(newShift);
        return newShift;
    }

    async update(id, updateData) {
        const index = shifts.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            shifts[index] = { ...shifts[index], ...updateData };
            return shifts[index];
        }
        return null;
    }

    async delete(id) {
        const index = shifts.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            const deleted = shifts.splice(index, 1);
            return deleted[0];
        }
        return null;
    }
}

module.exports = new ShiftRepository();