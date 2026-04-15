let shifts = [];
let users = [];
let schedules = [];
let editingId = null;

// елементи сторінки
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

// фільтр по статусу
filterStatus.addEventListener("change", render);

// сортування по даті
sortDateBtn.addEventListener("click", () => {
    shifts.sort((a, b) => new Date(a.date) - new Date(b.date));
    render();
});

// відправка форми
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // читаємо форму
    const dto = readForm();

    // перевірка
    if (!validate(dto)) return;

    try {
        // знаходимо або створюємо user
        const userId = await ensureUser(dto.userName);

        // беремо або створюємо schedule
        const scheduleId = await ensureSchedule();

        // мапимо статус під бекенд
        const mappedStatus = mapStatus(dto.status);

        if (!mappedStatus) {
            showError("statusSelect", "statusError", "Некоректний статус");
            return;
        }

        // тіло запиту
        const shiftPayload = {
            scheduleId,
            userId,
            date: dto.date,
            type: mapTimeSlotToType(dto.timeSlot),
            status: mappedStatus,
            comment: dto.comment
        };

        console.log("shiftPayload:", shiftPayload);

        //створення
        if (editingId === null) {
            const response = await fetch("/api/shifts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(shiftPayload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error("POST /api/shifts error:", errorData);
                throw new Error("Не вдалося створити запис");
            }

            showSuccess("Запис додано!");
        } else {
            //редагування
            const response = await fetch(`/api/shifts/${editingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(shiftPayload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error("PUT /api/shifts/:id error:", errorData);
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

// кидання форми
resetBtn.addEventListener("click", () => {
    form.reset();
    clearErrors();
    editingId = null;
});

// нопки в таблиці
tableBody.addEventListener("click", async (event) => {
    const target = event.target;
    if (!target.dataset.id) return;

    const id = Number(target.dataset.id);

    //видалення
    if (target.classList.contains("delete-btn")) {
        if (!confirm("Видалити запис?")) return;

        try {
            const response = await fetch(`/api/shifts/${id}`, {
                method: "DELETE"
            });

            if (!response.ok && response.status !== 204) {
                const errorData = await response.json().catch(() => null);
                console.error("DELETE /api/shifts/:id error:", errorData);
                throw new Error("Не вдалося видалити запис");
            }

            showSuccess("Запис видалено!");
            await loadData();
        } catch (error) {
            console.error(error);
            alert("Помилка під час видалення");
        }
    }

    //редагування
    if (target.classList.contains("edit-btn")) {
        const shift = shifts.find(x => x.id === id);
        if (!shift) return;

        dateInput.value = shift.date ? shift.date.slice(0, 10) : "";
        timeSlotSelect.value = mapTypeToTimeSlot(shift.type);
        userInput.value = getUserNameById(shift.userId);
        commentInput.value = shift.comment || "";
        statusSelect.value = mapApiStatusToUiStatus(shift.status);

        editingId = id;
        window.scrollTo(0, 0);
    }
});

// читаємо поля
function readForm() {
    return {
        date: dateInput.value,
        timeSlot: timeSlotSelect.value,
        userName: userInput.value.trim(),
        comment: commentInput.value.trim(),
        status: statusSelect.value
    };
}

// валідація
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

// статус з форми у статус для БД
function mapStatus(status) {
    const value = String(status).trim().toLowerCase();

    if (
        value === "done" ||
        value === "confirmed" ||
        value === "підтверджено"
    ) {
        return "done";
    }

    if (
        value === "planned" ||
        value === "заплановано"
    ) {
        return "planned";
    }

    if (
        value === "cancelled" ||
        value === "скасовано"
    ) {
        return "cancelled";
    }

    return "";
}

// статус з БД в текст у формі
function mapApiStatusToUiStatus(status) {
    const value = String(status).trim().toLowerCase();

    if (value === "done") return "Підтверджено";
    if (value === "planned") return "Заплановано";
    if (value === "cancelled") return "Скасовано";

    return "";
}

// завантажуємо все
async function loadData() {
    await Promise.all([loadUsers(), loadSchedules(), loadShifts()]);
    render();
}

// отрим users
async function loadUsers() {
    const response = await fetch("/api/users");

    if (!response.ok) {
        throw new Error("Не вдалося отримати користувачів");
    }

    const data = await response.json();
    users = Array.isArray(data) ? data : (data.items || []);
}

// отрим schedules
async function loadSchedules() {
    const response = await fetch("/api/schedules");

    if (!response.ok) {
        throw new Error("Не вдалося отримати розклади");
    }

    const data = await response.json();
    schedules = Array.isArray(data) ? data : (data.items || []);
}

// отрим shifts
async function loadShifts() {
    const response = await fetch("/api/shifts");

    if (!response.ok) {
        throw new Error("Не вдалося отримати зміни");
    }

    const data = await response.json();
    shifts = Array.isArray(data) ? data : (data.items || []);
}

// якщо user є - беремо id, якщо нема - створюємо
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
        const errorData = await response.json().catch(() => null);
        console.error("POST /api/users error:", errorData);
        throw new Error("Не вдалося створити користувача");
    }

    const createdUser = await response.json();
    users.push(createdUser);

    return createdUser.id;
}

// якщо schedule є - беремо, якщо нема - створюємо
async function ensureSchedule() {
    if (schedules.length > 0) {
        return schedules[0].id;
    }

    const response = await fetch("/api/schedules", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: "Основний графік",
            description: "Створено автоматично з фронтенду"
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error("POST /api/schedules error:", errorData);
        throw new Error("Не вдалося створити розклад");
    }

    const createdSchedule = await response.json();
    schedules.push(createdSchedule);

    return createdSchedule.id;
}

// мал таблицю
function render() {
    let filtered = [...shifts];

    if (filterStatus && filterStatus.value !== "") {
        filtered = filtered.filter(
            x => mapApiStatusToUiStatus(x.status) === filterStatus.value
        );
    }

    tableBody.innerHTML = filtered.map((s, index) => `
        <tr>
            <td>${index + 1}</td>
            <td>${formatDate(s.date)}</td>
            <td>${mapTypeToTimeSlot(s.type)}</td>
            <td>${getUserNameById(s.userId)}</td>
            <td>${mapApiStatusToUiStatus(s.status)}</td>
            <td>${s.comment || "-"}</td>
            <td>
                <button type="button" class="edit-btn" data-id="${s.id}">Редагувати</button>
                <button type="button" class="delete-btn" data-id="${s.id}">Видалити</button>
            </td>
        </tr>
    `).join("");
}

// ім'я user по id
function getUserNameById(userId) {
    const user = users.find(x => x.id === userId);
    return user ? user.name : `User ${userId}`;
}

// час з форми в type для БД
function mapTimeSlotToType(timeSlot) {
    const value = String(timeSlot).trim().toLowerCase();

    if (
        value.includes("night") ||
        value.includes("ніч") ||
        value.includes("веч")
    ) {
        return "night";
    }

    return "day";
}

// type з БД в текст у таблиці
function mapTypeToTimeSlot(type) {
    if (!type) return "";
    return type === "night" ? "Night" : "Morning";
}

//формат дати
function formatDate(value) {
    if (!value) return "";
    return new Date(value).toLocaleDateString();
}

// фейковий email
function buildFakeEmail(userName) {
    const normalized = transliterate(userName)
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "");

    return `${normalized || "user"}@mail.com`;
}

function transliterate(text) {
    const map = {
        а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ye",
        ж: "zh", з: "z", и: "y", і: "i", ї: "yi", й: "y", к: "k", л: "l",
        м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
        ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "",
        ю: "yu", я: "ya"
    };

    return text
        .split("")
        .map(char => {
            const lower = char.toLowerCase();
            return map[lower] !== undefined ? map[lower] : char;
        })
        .join("");
}

//показує помилку під полем
function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorLabel = document.getElementById(errorId);

    if (input) input.classList.add("invalid");
    if (errorLabel) errorLabel.textContent = message;
}

//очищає помилки
function clearErrors() {
    document.querySelectorAll(".invalid")
        .forEach(el => el.classList.remove("invalid"));

    document.querySelectorAll(".error-text")
        .forEach(el => el.textContent = "");
}

//успіх
function showSuccess(message) {
    if (!successMessage) return;

    successMessage.textContent = message;
    setTimeout(() => {
        successMessage.textContent = "";
    }, 2000);
}

//стартове завантаження
loadData().catch(error => {
    console.error(error);
    alert("Не вдалося завантажити дані з сервера");
});