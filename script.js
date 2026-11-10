const API_URL = "api";

// Get all tasks
async function loadTasks() {
    try {
        const response = await fetch(`${API_URL}/get-tasks.php`);

        const tasks = await response.json();

        console.log("Tasks from database:", tasks);

        displayTasks(tasks);

    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}


// Display tasks on page
function displayTasks(tasks) {

    const taskList = document.getElementById("taskList");

    if (!taskList) {
        console.error("taskList element not found");
        return;
    }

    taskList.innerHTML = "";

    tasks.forEach(task => {

        const li = document.createElement("li");

        li.innerHTML = `
            <span 
                style="${task.completed ? 'text-decoration: line-through;' : ''}"
            >
                ${task.task}
            </span>

            <button onclick="completeTask(${task.id}, ${task.completed})">
                ${task.completed ? "Undo" : "Complete"}
            </button>

            <button onclick="editTask(${task.id}, '${task.task.replace(/'/g, "\\'")}')">
                Edit
            </button>

            <button onclick="deleteTask(${task.id})">
                Delete
            </button>
        `;

        taskList.appendChild(li);
    });
}


// Add task
async function addTask() {

    const input = document.getElementById("taskInput");

    const task = input.value.trim();

    if (task === "") {
        alert("Please enter a task");
        return;
    }

    try {

        const response = await fetch(`${API_URL}/add-task.php`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                task: task
            })

        });

        const result = await response.json();

        console.log(result);

        if (result.success) {

            input.value = "";

            loadTasks();

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error("Error adding task:", error);

    }
}


// Complete / Undo task
async function completeTask(id, currentStatus) {

    try {

        const response = await fetch(`${API_URL}/update-task.php`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id: id,
                completed: currentStatus ? 0 : 1
            })

        });

        const result = await response.json();

        console.log(result);

        loadTasks();

    } catch (error) {

        console.error("Error updating task:", error);

    }
}


// Edit task
async function editTask(id, oldTask) {

    const newTask = prompt("Edit your task:", oldTask);

    if (newTask === null || newTask.trim() === "") {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/update-task.php`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id: id,
                task: newTask.trim()
            })

        });

        const result = await response.json();

        console.log(result);

        loadTasks();

    } catch (error) {

        console.error("Error editing task:", error);

    }
}


// Delete task
async function deleteTask(id) {

    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    try {

        const response = await fetch(`${API_URL}/delete-task.php`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                id: id
            })

        });

        const result = await response.json();

        console.log(result);

        if (result.success) {

            loadTasks();

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.error("Error deleting task:", error);

    }
}


// Load tasks when page opens
document.addEventListener("DOMContentLoaded", function () {

    loadTasks();

});