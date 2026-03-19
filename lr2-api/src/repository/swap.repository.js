let swaps = [];

class SwapRepository {
    async findAll() {
        return [...swaps];
    }

    async findById(id) {
        return swaps.find(s => s.id === parseInt(id));
    }

    async create(data) {
        const newId = swaps.length > 0
            ? Math.max(...swaps.map(s => s.id)) + 1
            : 1;

        const newSwap = {
            id: newId,
            status: 'pending',
            createdAt: new Date(),
            ...data
        };
        swaps.push(newSwap);
        return newSwap;
    }

    async update(id, updateData) {
        const index = swaps.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            swaps[index] = { ...swaps[index], ...updateData };
            return swaps[index];
        }
        return null;
    }

    async delete(id) {
        const index = swaps.findIndex(s => s.id === parseInt(id));
        if (index !== -1) {
            const deleted = swaps.splice(index, 1);
            return deleted[0];
        }
        return null;
    }
}

module.exports = new SwapRepository();