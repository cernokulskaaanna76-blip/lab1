class ShiftRepository {
    constructor() {
        this.shifts = [
            { id: 1, userId: 1, date: '2026-03-19', type: 'morning' },
            { id: 2, userId: 2, date: '2026-03-19', type: 'evening' }
        ];
    }

    async findAll() {
        // Повертаємо копію масиву, щоб уникнути прямих змін ззовні
        return [...this.shifts];
    }

    async findById(id) {
        return this.shifts.find(s => s.id === parseInt(id));
    }

    async create(data) {
        // Правильна генерація ID за порадою рев'ювера (Math.max)
        const newId = this.shifts.length > 0
            ? Math.max(...this.shifts.map(s => s.id)) + 1
            : 1;

        const newShift = { id: newId, ...data };
        this.shifts.push(newShift);
        return newShift;
    }

    async update(id, updateData) {
        const index = this.shifts.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            this.shifts[index] = { ...this.shifts[index], ...updateData };
            return this.shifts[index];
        }
        return null;
    }

    async delete(id) {
        const index = this.shifts.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            const deleted = this.shifts.splice(index, 1);
            return deleted[0];
        }
        return null;
    }
}

module.exports = new ShiftRepository();