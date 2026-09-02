// ============================================
// SMART TASK MANAGER
// ============================================


// Get HTML elements

const taskForm =
    document.getElementById("taskForm");

const taskInput =
    document.getElementById("taskInput");

const categoryInput =
    document.getElementById("category");

const priorityInput =
    document.getElementById("priority");

const dueDateInput =
    document.getElementById("dueDate");

const taskList =
    document.getElementById("taskList");

const searchInput =
    document.getElementById("searchInput");

const filterSelect =
    document.getElementById("filterSelect");

const themeToggle =
    document.getElementById("themeToggle");


// Statistics

const totalTasks =
    document.getElementById("totalTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const completedTasks =
    document.getElementById("completedTasks");

const highPriorityTasks =
    document.getElementById("highPriorityTasks");


// ============================================
// LOAD TASKS
// ============================================

let tasks =
    JSON.parse(
        localStorage.getItem("smartTasks")
    ) || [];


// ============================================
// SAVE TASKS
// ============================================

function saveTasks() {

    localStorage.setItem(
        "smartTasks",
        JSON.stringify(tasks)
    );
}


// ============================================
// ADD TASK
// ============================================

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        const title =
            taskInput.value.trim();

        if (!title) {

            alert("Please enter a task.");

            return;
        }


        const newTask = {

            id: Date.now(),

            title: title,

            category:
                categoryInput.value,

            priority:
                priorityInput.value,

            dueDate:
                dueDateInput.value,

            completed: false
        };


        tasks.push(newTask);

        saveTasks();

        taskForm.reset();

        priorityInput.value =
            "Medium";

        renderTasks();

    }
);


// ============================================
// DISPLAY TASKS
// ============================================

function renderTasks() {

    let filteredTasks =
        [...tasks];


    // Search

    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    if (search) {

        filteredTasks =
            filteredTasks.filter(
                task =>
                    task.title
                        .toLowerCase()
                        .includes(search)
            );
    }


    // Filter

    const filter =
        filterSelect.value;


    if (filter === "active") {

        filteredTasks =
            filteredTasks.filter(
                task => !task.completed
            );
    }


    if (filter === "completed") {

        filteredTasks =
            filteredTasks.filter(
                task => task.completed
            );
    }


    if (filter === "high") {

        filteredTasks =
            filteredTasks.filter(
                task =>
                    task.priority === "High"
            );
    }


    // Empty state

    if (filteredTasks.length === 0) {

        taskList.innerHTML = `

            <div class="empty-state">

                <div class="empty-icon">
                    ✓
                </div>

                <h3>No tasks found</h3>

                <p>
                    Try adding a new task or changing your filter.
                </p>

            </div>

        `;

        updateStatistics();

        return;
    }


    // Create task HTML

    taskList.innerHTML =
        filteredTasks
            .map(task => createTaskHTML(task))
            .join("");


    updateStatistics();
}


// ============================================
// CREATE TASK HTML
// ============================================

function createTaskHTML(task) {

    const dueDate =
        task.dueDate
            ? `📅 ${formatDate(task.dueDate)}`
            : "";


    return `

        <div
            class="task-item
            ${task.completed ? "completed" : ""}"
        >

            <div class="task-left">

                <button
                    class="check-btn"
                    onclick="toggleTask(${task.id})"
                    aria-label="Complete task"
                >
                    ${task.completed ? "✓" : ""}
                </button>


                <div class="task-info">

                    <div class="task-title">
                        ${escapeHTML(task.title)}
                    </div>


                    <div class="task-meta">

                        <span class="badge category">
                            ${task.category}
                        </span>

                        <span class="badge
                            priority-${task.priority.toLowerCase()}">

                            ${task.priority}

                        </span>

                        ${
                            dueDate
                                ? `
                                    <span class="badge category">
                                        ${dueDate}
                                    </span>
                                  `
                                : ""
                        }

                    </div>

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="action-btn"
                    onclick="editTask(${task.id})"
                >
                    Edit
                </button>


                <button
                    class="action-btn delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    Delete
                </button>

            </div>

        </div>

    `;
}


// ============================================
// COMPLETE TASK
// ============================================

function toggleTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) return;


    task.completed =
        !task.completed;


    saveTasks();

    renderTasks();
}


// ============================================
// DELETE TASK
// ============================================

function deleteTask(id) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmed) return;


    tasks =
        tasks.filter(
            task => task.id !== id
        );


    saveTasks();

    renderTasks();
}


// ============================================
// EDIT TASK
// ============================================

function editTask(id) {

    const task =
        tasks.find(
            task => task.id === id
        );


    if (!task) return;


    const newTitle =
        prompt(
            "Edit your task:",
            task.title
        );


    if (
        newTitle === null ||
        newTitle.trim() === ""
    ) {
        return;
    }


    task.title =
        newTitle.trim();


    saveTasks();

    renderTasks();
}


// ============================================
// SEARCH
// ============================================

searchInput.addEventListener(
    "input",
    renderTasks
);


// ============================================
// FILTER
// ============================================

filterSelect.addEventListener(
    "change",
    renderTasks
);


// ============================================
// STATISTICS
// ============================================

function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            task => task.completed
        ).length;


    const pending =
        total - completed;


    const highPriority =
        tasks.filter(
            task =>
                task.priority === "High" &&
                !task.completed
        ).length;


    totalTasks.textContent =
        total;

    completedTasks.textContent =
        completed;

    pendingTasks.textContent =
        pending;

    highPriorityTasks.textContent =
        highPriority;
}


// ============================================
// DATE FORMAT
// ============================================

function formatDate(dateString) {

    const date =
        new Date(dateString);


    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric"
        }
    );
}


// ============================================
// SECURITY
// ============================================

function escapeHTML(text) {

    const div =
        document.createElement("div");

    div.textContent =
        text;

    return div.innerHTML;
}


// ============================================
// DARK MODE
// ============================================

themeToggle.addEventListener(
    "click",
    function () {

        document.body.classList.toggle(
            "dark"
        );


        const isDark =
            document.body.classList.contains(
                "dark"
            );


        themeToggle.textContent =
            isDark
                ? "☀️"
                : "🌙";


        localStorage.setItem(
            "darkMode",
            isDark
        );

    }
);


// Load saved theme

const savedTheme =
    localStorage.getItem("darkMode");


if (savedTheme === "true") {

    document.body.classList.add("dark");

    themeToggle.textContent =
        "☀️";
}


// ============================================
// INITIAL RENDER
// ============================================

renderTasks();