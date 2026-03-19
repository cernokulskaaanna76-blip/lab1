const STORAGE_KEY = "lab_shifts";

let shifts = loadFromStorage();
let nextId = computeNextId(shifts);
let editingId = null;

const form = document.getElementById("shiftForm");
const tableBody = document.getElementById("tableBody");
const filterStatus = document.getElementById("filterStatus");

filterStatus.addEventListener("change", render);

document.getElementById("sortDate").addEventListener("click", () => {
    shifts.sort((a, b) => new Date(a.date) - new Date(b.date));
    render();
});

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const dto = readForm();
    if (!validate(dto)) return;

    if (editingId === null) {
        dto.id = nextId++;
        shifts.push(dto);
    } else {
        const index = shifts.findIndex(x => x.id === editingId);
        dto.id = editingId;
        shifts[index] = dto;
        editingId = null;
    }

    saveToStorage();
    render();

    document.getElementById("successMessage").textContent = "Запис додано!";
    setTimeout(() => {
        document.getElementById("successMessage").textContent = "";
    }, 2000);

    form.reset();
});

document.getElementById("resetBtn").addEventListener("click", () => {
    form.reset();
    clearErrors();
    editingId = null;
});

tableBody.addEventListener("click", (event) => {

    const id = Number(event.target.dataset.id);

    if (event.target.classList.contains("delete-btn")) {

        if (!confirm("Видалити запис?")) return;

        shifts = shifts.filter(x => x.id !== id);

        saveToStorage();
        render();
    }

    if (event.target.classList.contains("edit-btn")) {

        const shift = shifts.find(x => x.id === id);

        document.getElementById("dateInput").value = shift.date;
        document.getElementById("timeSlotSelect").value = shift.timeSlot;
        document.getElementById("userInput").value = shift.userName;
        document.getElementById("commentInput").value = shift.comment;
        document.getElementById("statusSelect").value = shift.status;

        editingId = id;

        window.scrollTo(0, 0);
    }

});

function readForm() {
    return {
        date: document.getElementById("dateInput").value,
        timeSlot: document.getElementById("timeSlotSelect").value,
        userName: document.getElementById("userInput").value.trim(),
        comment: document.getElementById("commentInput").value.trim(),
        status: document.getElementById("statusSelect").value
    };
}

function validate(dto) {

    clearErrors();

    let valid = true;

    if (dto.date === "") {
        showError("dateInput", "dateError", "Оберіть дату");
        valid = false;
    }

    if (dto.timeSlot === "") {
        showError("timeSlotSelect", "timeSlotError", "Оберіть час");
        valid = false;
    }

    if (dto.userName.length < 3) {
        showError("userInput", "userError", "Мінімум 3 символи");
        valid = false;
    }

    if (dto.comment.length < 5) {
        showError("commentInput", "commentError", "Мінімум 5 символів");
        valid = false;
    }

    if (dto.status === "") {
        showError("statusSelect", "statusError", "Оберіть статус");
        valid = false;
    }

    return valid;
}

function render() {

    let filtered = shifts;

    if (filterStatus && filterStatus.value !== "") {
        filtered = shifts.filter(x => x.status === filterStatus.value);
    }

    tableBody.innerHTML = filtered.map((s, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${new Date(s.date).toLocaleDateString()}</td>
            <td>${s.timeSlot}</td>
            <td>${s.userName}</td>
            <td>${s.status}</td>
            <td>${s.comment}</td>
            <td>
                <button type="button" class="edit-btn" data-id="${s.id}">Редагувати</button>
                <button type="button" class="delete-btn" data-id="${s.id}">Видалити</button>
            </td>
        </tr>
    `).join("");

}

function showError(inputId, errorId, message) {

    const input = document.getElementById(inputId);
    const errorLabel = document.getElementById(errorId);

    if (input) input.classList.add("invalid");
    if (errorLabel) errorLabel.textContent = message;

}

function clearErrors() {

    document.querySelectorAll(".invalid")
        .forEach(el => el.classList.remove("invalid"));

    document.querySelectorAll(".error-text")
        .forEach(el => el.textContent = "");

}

function saveToStorage() {

    localStorage.setItem(STORAGE_KEY, JSON.stringify(shifts));

}

function loadFromStorage() {

    const data = localStorage.getItem(STORAGE_KEY);

    try {
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }

}

function computeNextId(items) {

    if (items.length === 0) return 1;

    return Math.max(...items.map(x => x.id)) + 1;

}

render();