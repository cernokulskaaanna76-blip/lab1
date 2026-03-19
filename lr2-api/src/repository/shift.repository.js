class ShiftRepository {
    constructor() {
        this.shifts = [
            { id: 1, userId: 1, date: '2026-03-19', type: 'morning' },
            { id: 2, userId: 2, date: '2026-03-19', type: 'evening' }
        ];
    }

    async findAll() {
        return [...this.shifts];
    }

    async findById(id) {
        return this.shifts.find(s => s.id === id);
    }

    async create(data) {
        const newId = this.shifts.length > 0
            ? Math.max(...this.shifts.map(s => s.id)) + 1
            : 1;

        const newShift = {
            id: newId,
            createdAt: new Date(), // 🔥 додали
            ...data
        };

        this.shifts.push(newShift);
        return newShift;
    }

    async update(id, updateData) {
        const index = this.shifts.findIndex(s => s.id === id);

        if (index !== -1) {
            this.shifts[index] = {
                ...this.shifts[index],
                ...updateData
            };
            return this.shifts[index];
        }

        return null;
    }

    async delete(id) {
        const index = this.shifts.findIndex(s => s.id === id);

        if (index !== -1) {
            this.shifts.splice(index, 1);
            return true; // 🔥 замість об'єкта
        }

        return false;
    }
}

module.exports = new ShiftRepository();