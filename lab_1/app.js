let shifts = [];
let users = [];
let editingId = null;

const form = document.getElementById("shiftForm");
const tableBody = document.getElementById("tableBody");
const filterStatus = document.getElementById("filterStatus");
const successMessage = document.getElementById("successMessage");

const dateInput = document.getElementById("dateInput");
const timeSlotSelect = document.getElementById("timeSlotSelect");
const userInput = document.getElementById("userInput");
const commentInput = document.getElementById("commentInput");
const statusSelect = document.getElementById("statusSelect");
const resetBtn = document.getElementById("resetBtn");
const sortDateBtn = document.getElementById("sortDate");

filterStatus.addEventListener("change", render);

sortDateBtn.addEventListener("click", () => {
    shifts.sort((a, b) => new Date(a.date) - new Date(b.date));
    render();
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const dto = readForm();
    if (!validate(dto)) return;

    try {
        const userId = await ensureUser(dto.userName);

        const shiftPayload = {
            userId,
            date: dto.date,
            type: mapTimeSlotToType(dto.timeSlot),
            status: mapStatus(dto.status) // 🔥 ВИПРАВЛЕНО
        };

        if (editingId === null) {
            const response = await fetch("/api/shifts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(shiftPayload)
            });

            if (!response.ok) {
                throw new Error("Не вдалося створити запис");
            }

            showSuccess("Запис додано!");
        } else {
            const response = await fetch(`/api/shifts/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(shiftPayload)
            });

            if (!response.ok) {
                throw new Error("Не вдалося оновити запис");
            }

            showSuccess("Запис оновлено!");
            editingId = null;
        }

        form.reset();
        clearErrors();
        await loadData();
    } catch (error) {
        console.error(error);
        alert("Помилка під час збереження запису");
    }
});

resetBtn.addEventListener("click", () => {
    form.reset();
    clearErrors();
    editingId = null;
});

tableBody.addEventListener("click", async (event) => {
    const target = event.target;
    if (!target.dataset.id) return;

    const id = Number(target.dataset.id);

    if (target.classList.contains("delete-btn")) {
        if (!confirm("Видалити запис?")) return;

        try {
            const response = await fetch(`/api/shifts/${id}`, {
                method: "DELETE"
            });

            if (!response.ok && response.status !== 204) {
                throw new Error("Не вдалося видалити запис");
            }

            showSuccess("Запис видалено!");
            await loadData();
        } catch (error) {
            console.error(error);
            alert("Помилка під час видалення");
        }
    }

    if (target.classList.contains("edit-btn")) {
        const shift = shifts.find(x => x.id === id);
        if (!shift) return;

        dateInput.value = shift.date ? shift.date.slice(0, 10) : "";
        timeSlotSelect.value = mapTypeToTimeSlot(shift.type);
        userInput.value = getUserNameById(shift.userId);
        commentInput.value = "";
        statusSelect.value = capitalizeStatus(shift.status);

        editingId = id;
        window.scrollTo(0, 0);
    }
});

function readForm() {
    return {
        date: dateInput.value,
        timeSlot: timeSlotSelect.value,
        userName: userInput.value.trim(),
        comment: commentInput.value.trim(),
        status: statusSelect.value
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

    if (dto.userName.length < 2) {
        showError("userInput", "userError", "Мінімум 2 символи");
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

// 🔥 ДОДАНО МАПІНГ СТАТУСІВ
function mapStatus(status) {
    switch (status) {
        case "Підтверджено": return "confirmed";
        case "Заплановано": return "planned";
        case "Скасовано": return "cancelled";
        default: return "planned";
    }
}

async function loadData() {
    await Promise.all([loadUsers(), loadShifts()]);
    render();
}

async function loadUsers() {
    const response = await fetch("/api/users");

    if (!response.ok) {
        throw new Error("Не вдалося отримати користувачів");
    }

    const data = await response.json();
    users = Array.isArray(data) ? data : (data.items || []);
}

async function loadShifts() {
    const response = await fetch("/api/shifts");

    if (!response.ok) {
        throw new Error("Не вдалося отримати зміни");
    }

    const data = await response.json();
    shifts = Array.isArray(data) ? data : (data.items || []);
}

async function ensureUser(userName) {
    let existingUser = users.find(
        x => (x.name || "").trim().toLowerCase() === userName.toLowerCase()
    );

    if (existingUser) {
        return existingUser.id;
    }

    const email = buildFakeEmail(userName);

    const response = await fetch("/api/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: userName,
            email
        })
    });

    if (!response.ok) {
        throw new Error("Не вдалося створити користувача");
    }

    const createdUser = await response.json();
    users.push(createdUser);

    return createdUser.id;
}

function render() {
    let filtered = [...shifts];

    if (filterStatus && filterStatus.value !== "") {
        filtered = filtered.filter(
            x => capitalizeStatus(x.status) === filterStatus.value
        );
    }

    tableBody.innerHTML = filtered.map((s, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${formatDate(s.date)}</td>
            <td>${mapTypeToTimeSlot(s.type)}</td>
            <td>${getUserNameById(s.userId)}</td>
            <td>${capitalizeStatus(s.status)}</td>
            <td>-</td>
            <td>
                <button type="button" class="edit-btn" data-id="${s.id}">Редагувати</button>
                <button type="button" class="delete-btn" data-id="${s.id}">Видалити</button>
            </td>
        </tr>
    `).join("");
}

function getUserNameById(userId) {
    const user = users.find(x => x.id === userId);
    return user ? user.name : `User ${userId}`;
}

function mapTimeSlotToType(timeSlot) {
    const value = timeSlot.toLowerCase();
    if (value.includes("night")) return "night";
    return "day";
}

function mapTypeToTimeSlot(type) {
    if (!type) return "";
    return type === "night" ? "Night" : "Morning";
}

function capitalizeStatus(status) {
    if (!status) return "";
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
}

function formatDate(value) {
    if (!value) return "";
    return new Date(value).toLocaleDateString();
}

function buildFakeEmail(userName) {
    const normalized = userName
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9а-яіїєґ]/gi, "");

    return `${normalized || "user"}@mail.com`;
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

function showSuccess(message) {
    if (!successMessage) return;

    successMessage.textContent = message;
    setTimeout(() => {
        successMessage.textContent = "";
    }, 2000);
}

loadData().catch(error => {
    console.error(error);
    alert("Не вдалося завантажити дані з сервера");
});