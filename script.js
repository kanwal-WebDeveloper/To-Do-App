const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const emptyState = document.getElementById("empty-state");
const taskSection = document.getElementById("task-section");
const taskCount = document.getElementById("task-count");

function getFormattedDate() {
    const d = new Date();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[d.getMonth()] + " " + d.getDate();
}

function addTask() {
    const val = inputBox.value.trim();
    if (!val) { alert("Please write something!"); return; }

    const li = document.createElement("li");
    li.dataset.checked = "false";

    li.innerHTML = `
                <div class="checkbox" onclick="toggleCheck(this, event)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </div>
                <span class="task-text">${escapeHtml(val)}</span>
                <span class="task-date">${getFormattedDate()}</span>
                <div class="delete-btn" onclick="deleteTask(this, event)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </div>
            `;

    listContainer.appendChild(li);
    inputBox.value = "";
    updateUI();
    saveData();
}

function toggleCheck(checkbox, e) {
    e.stopPropagation();
    const li = checkbox.parentElement;
    const taskText = li.querySelector(".task-text");
    const isChecked = checkbox.classList.toggle("checked");
    taskText.classList.toggle("checked", isChecked);
    li.dataset.checked = isChecked;
    saveData();
}

function deleteTask(btn, e) {
    e.stopPropagation();
    const li = btn.parentElement;
    li.style.opacity = "0";
    li.style.transform = "translateX(20px)";
    li.style.transition = "all 0.2s ease";
    setTimeout(() => { li.remove(); updateUI(); saveData(); }, 200);
}

function clearAll() {
    if (listContainer.children.length === 0) return;
    if (confirm("Clear all tasks?")) {
        listContainer.innerHTML = "";
        updateUI();
        saveData();
    }
}

function updateUI() {
    const count = listContainer.children.length;
    taskCount.textContent = count;
    if (count === 0) {
        emptyState.style.display = "flex";
        taskSection.style.display = "none";
    } else {
        emptyState.style.display = "none";
        taskSection.style.display = "block";
    }
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function saveData() {
    const tasks = [];
    listContainer.querySelectorAll("li").forEach(li => {
        tasks.push({
            text: li.querySelector(".task-text").textContent,
            checked: li.dataset.checked === "true",
            date: li.querySelector(".task-date").textContent
        });
    });
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

function loadData() {
    const saved = localStorage.getItem("todoTasks");
    if (!saved) return;
    const tasks = JSON.parse(saved);
    tasks.forEach(task => {
        const li = document.createElement("li");
        li.dataset.checked = task.checked;
        li.innerHTML = `
                    <div class="checkbox ${task.checked ? 'checked' : ''}" onclick="toggleCheck(this, event)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                        </svg>
                    </div>
                    <span class="task-text ${task.checked ? 'checked' : ''}">${escapeHtml(task.text)}</span>
                    <span class="task-date">${task.date}</span>
                    <div class="delete-btn" onclick="deleteTask(this, event)">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </div>
                `;
        listContainer.appendChild(li);
    });
    updateUI();
}

loadData();
