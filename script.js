// GIRLHOOD PLANNER
// Beginner-friendly JavaScript using arrays and localStorage

// Get saved accounts and current user
let accounts = JSON.parse(localStorage.getItem("girlhoodAccounts")) || [];
let currentUser = localStorage.getItem("girlhoodCurrentUser");

// Get the current page
let currentPage = document.body.getAttribute("data-page");

// Save accounts
function saveAccounts() {
    localStorage.setItem("girlhoodAccounts", JSON.stringify(accounts));
}

// Find an account using its username
function findAccount(username) {
    for (let i = 0; i < accounts.length; i++) {
        if (accounts[i].username.toLowerCase() === username.toLowerCase()) {
            return accounts[i];
        }
    }

    return null;
}

// Get the current account's tasks
function getTasks() {
    let account = findAccount(currentUser);

    if (account === null) {
        return [];
    }

    if (!account.tasks) {
        account.tasks = [];
        saveAccounts();
    }

    return account.tasks;
}

// Save the current account's tasks
function saveTasks(tasks) {
    let account = findAccount(currentUser);

    if (account !== null) {
        account.tasks = tasks;
        saveAccounts();
    }
}

// Check if a user is logged in
function checkLogin() {
    if (currentPage !== null && !currentUser) {
        window.location.href = "index.html";
        return false;
    }

    if (currentPage !== null && currentUser) {
        let account = findAccount(currentUser);

        if (account === null) {
            localStorage.removeItem("girlhoodCurrentUser");
            window.location.href = "index.html";
            return false;
        }
    }

    return true;
}

// LOG OUT
let logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", function () {
        let confirmLogout = confirm("Are you sure you want to log out?");

        if (confirmLogout) {
            localStorage.removeItem("girlhoodCurrentUser");
            window.location.href = "index.html";
        }
    });
}

// LOGIN PAGE
let loginForm = document.getElementById("loginForm");
let registerForm = document.getElementById("registerForm");
let forgotForm = document.getElementById("forgotForm");
let authMessage = document.getElementById("authMessage");

let tabButtons = document.querySelectorAll(".tab-button");
let showForgot = document.getElementById("showForgot");
let backToLogin = document.getElementById("backToLogin");

// Switch between login and registration
function showAuthForm(formName) {
    if (loginForm) {
        loginForm.classList.add("hidden");
        registerForm.classList.add("hidden");
        forgotForm.classList.add("hidden");

        if (formName === "login") {
            loginForm.classList.remove("hidden");
        } else if (formName === "register") {
            registerForm.classList.remove("hidden");
        } else if (formName === "forgot") {
            forgotForm.classList.remove("hidden");
        }

        authMessage.textContent = "";

        for (let i = 0; i < tabButtons.length; i++) {
            tabButtons[i].classList.remove("active");

            if (tabButtons[i].getAttribute("data-auth") === formName) {
                tabButtons[i].classList.add("active");
            }
        }
    }
}

// Tab button events
for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].addEventListener("click", function () {
        showAuthForm(this.getAttribute("data-auth"));
    });
}

// Show forgot password form
if (showForgot) {
    showForgot.addEventListener("click", function () {
        showAuthForm("forgot");
    });
}

// Return to login form
if (backToLogin) {
    backToLogin.addEventListener("click", function () {
        showAuthForm("login");
    });
}

// CREATE ACCOUNT
if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let name = document.getElementById("registerName").value.trim();
        let username = document.getElementById("registerUsername").value.trim();
        let password = document.getElementById("registerPassword").value;
        let confirmPassword = document.getElementById("confirmPassword").value;

        if (name === "" || username === "" || password === "") {
            authMessage.textContent = "Please fill in all fields.";
            return;
        }

        if (/\s/.test(username)) {
            authMessage.textContent = "Username must not contain spaces.";
            return;
        }

        if (password.length < 6) {
            authMessage.textContent = "Password must have at least 6 characters.";
            return;
        }

        if (password !== confirmPassword) {
            authMessage.textContent = "Passwords do not match.";
            return;
        }

        if (findAccount(username) !== null) {
            authMessage.textContent = "That username is already taken.";
            return;
        }

        let newAccount = {
            name: name,
            username: username,
            password: password,
            tasks: [],
            reflection: ""
        };

        accounts.push(newAccount);
        saveAccounts();

        alert("Account created successfully! You can now log in.");

        registerForm.reset();
        showAuthForm("login");
    });
}

// LOGIN
if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let username = document.getElementById("loginUsername").value.trim();
        let password = document.getElementById("loginPassword").value;

        let account = findAccount(username);

        if (account === null || account.password !== password) {
            authMessage.textContent = "Incorrect username or password.";
            return;
        }

        localStorage.setItem("girlhoodCurrentUser", account.username);
        window.location.href = "bloom.html";
    });
}

// RESET PASSWORD
if (forgotForm) {
    forgotForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let username = document.getElementById("forgotUsername").value.trim();
        let newPassword = document.getElementById("newPassword").value;
        let confirmNewPassword = document.getElementById("confirmNewPassword").value;

        let account = findAccount(username);

        if (account === null) {
            authMessage.textContent = "Username not found.";
            return;
        }

        if (newPassword.length < 6) {
            authMessage.textContent = "Password must have at least 6 characters.";
            return;
        }

        if (newPassword !== confirmNewPassword) {
            authMessage.textContent = "Passwords do not match.";
            return;
        }

        account.password = newPassword;
        saveAccounts();

        alert("Password updated successfully!");

        forgotForm.reset();
        showAuthForm("login");
    });
}

// DASHBOARD
function loadDashboard() {
    let account = findAccount(currentUser);

    if (account === null) {
        return;
    }

    let welcomeName = document.getElementById("welcomeName");

    if (welcomeName) {
        welcomeName.textContent = account.name;
    }

    updateDashboard();
    createCalendar();
    showBibleVerse();
}

// Update dashboard task counts and graph
function updateDashboard() {
    let tasks = getTasks();

    let total = tasks.length;
    let completed = 0;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].completed) {
            completed++;
        }
    }

    let pending = total - completed;
    let percent = 0;

    if (total > 0) {
        percent = Math.round((completed / total) * 100);
    }

    document.getElementById("totalTasks").textContent = total;
    document.getElementById("completedTasks").textContent = completed;
    document.getElementById("pendingTasks").textContent = pending;
    document.getElementById("progressPercent").textContent = percent + "%";
    document.getElementById("progressFill").style.width = percent + "%";

    // The graph uses a maximum bar height of 140 pixels
    let completedHeight = 0;
    let pendingHeight = 0;

    if (total > 0) {
        completedHeight = (completed / total) * 140;
        pendingHeight = (pending / total) * 140;
    }

    document.getElementById("completedBar").style.height =
        completedHeight + "px";

    document.getElementById("pendingBar").style.height =
        pendingHeight + "px";
}

// CALENDAR
let calendarDate = new Date();

function createCalendar() {
    let calendarGrid = document.getElementById("calendarGrid");

    if (!calendarGrid) {
        return;
    }

    calendarGrid.innerHTML = "";

    let year = calendarDate.getFullYear();
    let month = calendarDate.getMonth();

    let monthNames = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ];

    document.getElementById("calendarMonth").textContent =
        monthNames[month] + " " + year;

    let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 0; i < dayNames.length; i++) {
        let dayName = document.createElement("div");
        dayName.className = "calendar-day-name";
        dayName.textContent = dayNames[i];
        calendarGrid.appendChild(dayName);
    }

    let firstDay = new Date(year, month, 1).getDay();
    let daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty spaces before the first day
    for (let i = 0; i < firstDay; i++) {
        let emptyDay = document.createElement("div");
        calendarGrid.appendChild(emptyDay);
    }

    let tasks = getTasks();
    let today = new Date();

    for (let day = 1; day <= daysInMonth; day++) {
        let calendarDay = document.createElement("div");
        calendarDay.className = "calendar-day";
        calendarDay.textContent = day;

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            calendarDay.classList.add("today");
        }

        let monthNumber = String(month + 1).padStart(2, "0");
        let dayNumber = String(day).padStart(2, "0");
        let dateString = year + "-" + monthNumber + "-" + dayNumber;

        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i].date === dateString) {
                calendarDay.classList.add("has-task");
                break;
            }
        }

        calendarGrid.appendChild(calendarDay);
    }
}

// Calendar month buttons
let previousMonth = document.getElementById("previousMonth");
let nextMonth = document.getElementById("nextMonth");

if (previousMonth) {
    previousMonth.addEventListener("click", function () {
        calendarDate.setMonth(calendarDate.getMonth() - 1);
        createCalendar();
    });
}

if (nextMonth) {
    nextMonth.addEventListener("click", function () {
        calendarDate.setMonth(calendarDate.getMonth() + 1);
        createCalendar();
    });
}

// BIBLE VERSES
let bibleVerses = [
    {
        text: '"I can do all things through Christ who strengthens me."',
        reference: "Philippians 4:13"
    },
    {
        text: '"Be still, and know that I am God."',
        reference: "Psalm 46:10"
    },
    {
        text: '"Trust in the Lord with all your heart."',
        reference: "Proverbs 3:5"
    },
    {
        text: '"The Lord is my shepherd; I shall not want."',
        reference: "Psalm 23:1"
    },
    {
        text: '"For with God nothing shall be impossible."',
        reference: "Luke 1:37"
    }
];

function showBibleVerse() {
    let today = new Date();
    let verseIndex = (today.getDate() - 1) % bibleVerses.length;
    let verse = bibleVerses[verseIndex];

    let verseText = document.getElementById("verseText");
    let verseReference = document.getElementById("verseReference");
    let glowVerse = document.getElementById("glowVerse");
    let glowVerseReference = document.getElementById("glowVerseReference");

    if (verseText) {
        verseText.textContent = verse.text;
        verseReference.textContent = verse.reference;
    }

    if (glowVerse) {
        glowVerse.textContent = verse.text;
        glowVerseReference.textContent = verse.reference;
    }
}

// TASK ORGANIZER
let taskDialog = document.getElementById("taskDialog");
let taskForm = document.getElementById("taskForm");
let openTaskDialog = document.getElementById("openTaskDialog");
let closeTaskDialog = document.getElementById("closeTaskDialog");
let cancelTask = document.getElementById("cancelTask");
let taskList = document.getElementById("taskList");
let taskSearch = document.getElementById("taskSearch");
let taskFilter = document.getElementById("taskFilter");

// Open task dialog
if (openTaskDialog) {
    openTaskDialog.addEventListener("click", function () {
        taskForm.reset();

        let today = new Date();
        let year = today.getFullYear();
        let month = String(today.getMonth() + 1).padStart(2, "0");
        let day = String(today.getDate()).padStart(2, "0");

        document.getElementById("taskDate").value =
            year + "-" + month + "-" + day;

        document.getElementById("taskFormMessage").textContent = "";
        taskDialog.showModal();
    });
}

// Close task dialog
if (closeTaskDialog) {
    closeTaskDialog.addEventListener("click", function () {
        taskDialog.close();
    });
}

if (cancelTask) {
    cancelTask.addEventListener("click", function () {
        taskDialog.close();
    });
}

// Add a new task
if (taskForm) {
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        let title = document.getElementById("taskTitle").value.trim();
        let category = document.getElementById("taskCategory").value;
        let priority = document.getElementById("taskPriority").value;
        let date = document.getElementById("taskDate").value;
        let message = document.getElementById("taskFormMessage");

        if (title === "") {
            message.textContent = "Please enter a task name.";
            return;
        }

        if (date === "") {
            message.textContent = "Please choose a due date.";
            return;
        }

        let tasks = getTasks();

        let newTask = {
            id: Date.now(),
            title: title,
            category: category,
            priority: priority,
            date: date,
            completed: false
        };

        tasks.push(newTask);
        saveTasks(tasks);

        taskForm.reset();
        taskDialog.close();

        renderTasks();
        alert("Your task has been added!");

        if (currentPage === "bloom") {
            updateDashboard();
            createCalendar();
        }
    });
}

// Display tasks
function renderTasks() {
    if (!taskList) {
        return;
    }

    taskList.innerHTML = "";

    let tasks = getTasks();
    let searchText = taskSearch.value.toLowerCase().trim();
    let filterValue = taskFilter.value;
    let visibleTasks = [];

    for (let i = 0; i < tasks.length; i++) {
        let matchesSearch = tasks[i].title.toLowerCase().includes(searchText);
        let matchesFilter = true;

        if (filterValue === "pending" && tasks[i].completed) {
            matchesFilter = false;
        }

        if (filterValue === "completed" && !tasks[i].completed) {
            matchesFilter = false;
        }

        if (matchesSearch && matchesFilter) {
            visibleTasks.push(tasks[i]);
        }
    }

    document.getElementById("taskCountLabel").textContent =
        visibleTasks.length + (visibleTasks.length === 1 ? " task" : " tasks");

    document.getElementById("emptyTasksMessage").style.display =
        visibleTasks.length === 0 ? "block" : "none";

    for (let i = 0; i < visibleTasks.length; i++) {
        let task = visibleTasks[i];

        let taskItem = document.createElement("article");
        taskItem.className = "task-item";

        if (task.completed) {
            taskItem.classList.add("completed-task");
        }

        let checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "task-checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Mark task as completed");

        checkbox.addEventListener("change", function () {
            changeTaskStatus(task.id, checkbox.checked);
        });

        let details = document.createElement("div");
        details.className = "task-details";

        let title = document.createElement("h3");
        title.textContent = task.title;

        let meta = document.createElement("div");
        meta.className = "task-meta";

        let category = document.createElement("span");
        category.className = "task-tag";
        category.textContent = task.category;

        let priority = document.createElement("span");
        priority.className = "task-tag priority-" + task.priority.toLowerCase();
        priority.textContent = task.priority + " Priority";

        let dueDate = document.createElement("span");
        dueDate.textContent = "Due: " + task.date;

        meta.appendChild(category);
        meta.appendChild(priority);
        meta.appendChild(dueDate);

        details.appendChild(title);
        details.appendChild(meta);

        let deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "delete-task";
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("aria-label", "Delete " + task.title);

        deleteButton.addEventListener("click", function () {
            deleteTask(task.id);
        });

        taskItem.appendChild(checkbox);
        taskItem.appendChild(details);
        taskItem.appendChild(deleteButton);

        taskList.appendChild(taskItem);
    }
}

// Mark task completed or pending
function changeTaskStatus(taskID, completed) {
    let tasks = getTasks();

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskID) {
            tasks[i].completed = completed;
            break;
        }
    }

    saveTasks(tasks);
    renderTasks();
    updateDashboard();
    createCalendar();
}

// Delete task
function deleteTask(taskID) {
    let confirmDelete = confirm("Do you want to delete this task?");

    if (!confirmDelete) {
        return;
    }

    let tasks = getTasks();

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === taskID) {
            tasks.splice(i, 1);
            break;
        }
    }

    saveTasks(tasks);
    renderTasks();
    updateDashboard();
    createCalendar();
}

// Search tasks
if (taskSearch) {
    taskSearch.addEventListener("input", renderTasks);
}

// Filter tasks
if (taskFilter) {
    taskFilter.addEventListener("change", renderTasks);
}

// DAILY MOTIVATION
let motivationMessages = [
    "You do not have to do everything at once.",
    "Small progress is still progress.",
    "You are allowed to rest and start again.",
    "Believe in the person you are becoming.",
    "One difficult day does not mean a difficult life.",
    "Your worth is not measured by your productivity.",
    "Keep showing up for yourself, even in small ways.",
    "You can learn from mistakes without being defined by them.",
    "Give yourself the same patience you give others.",
    "You are growing, even when you cannot see it."
];

let newMotivation = document.getElementById("newMotivation");

if (newMotivation) {
    newMotivation.addEventListener("click", function () {
        let randomIndex = Math.floor(Math.random() * motivationMessages.length);

        document.getElementById("dailyMotivation").textContent =
            motivationMessages[randomIndex];
    });
}

// DAILY REFLECTION
let dailyReflection = document.getElementById("dailyReflection");
let saveReflection = document.getElementById("saveReflection");
let clearReflection = document.getElementById("clearReflection");
let reflectionMessage = document.getElementById("reflectionMessage");

// Load saved reflection
function loadReflection() {
    let account = findAccount(currentUser);

    if (account !== null && dailyReflection) {
        dailyReflection.value = account.reflection || "";
    }
}

// Save reflection
if (saveReflection) {
    saveReflection.addEventListener("click", function () {
        let account = findAccount(currentUser);

        if (account === null) {
            return;
        }

        account.reflection = dailyReflection.value;
        saveAccounts();

        reflectionMessage.textContent = "Your reflection has been saved. ♡";
    });
}

// Clear reflection
if (clearReflection) {
    clearReflection.addEventListener("click", function () {
        let confirmClear = confirm("Do you want to clear your reflection?");

        if (!confirmClear) {
            return;
        }

        let account = findAccount(currentUser);

        dailyReflection.value = "";

        if (account !== null) {
            account.reflection = "";
            saveAccounts();
        }

        reflectionMessage.textContent = "Your reflection has been cleared.";
    });
}

// START THE CORRECT PAGE
if (currentPage !== null) {
    if (checkLogin()) {
        if (currentPage === "bloom") {
            loadDashboard();
        }

        if (currentPage === "petals") {
            renderTasks();
        }

        if (currentPage === "glow") {
            showBibleVerse();
            loadReflection();
        }
    }
}