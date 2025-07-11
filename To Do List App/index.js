const addTaskBtn = document.querySelector('.add-task-btn');
const inputField = document.querySelector('.task-input');
const tasksContainer = document.querySelector('.tasks-container');

const deleteAllTasksBtn = document.querySelector('.remove-tasks-btn');
const scrollToTopBtn = document.querySelector('.scrll-top-btn');
const scrollToBottomBtn = document.querySelector('.scrll-bottom-btn');

deleteAllTasksBtn.onclick = removeAllTasks;
scrollToTopBtn.onclick = scrollToTop;
scrollToBottomBtn.onclick = scrollToBottom;

let tasks = [];
let taskChecked = true;

addTaskBtn.onclick = addTask;

const place = document.querySelector('.task-placeholder');

inputField.onkeydown = (e)=>{
    if (e.key == 'Enter') {
        addTask();
    };
};

function addTask() {
    let newTask = document.createElement('div');
    tasks.push(newTask);
    newTask.style.animation = 'animateBack .2s cubic-bezier(.57,-0.04,.36,1.02) forwards';
    
    let taskName = inputField.value ? inputField.value : `Task ${tasks.length}`;
    newTask.className = 'task';
    newTask.innerHTML = `
        <span class="task-name" ondblclick="editTask(event)" onclick="checkTask(event)">${taskName}</span>
        <div class="task-btns">
            <button class="remove-task-btn" onclick="removeTask(event)"><i class="fa fa-trash"></i></button>
        </div>
    `;
    place.style.opacity = '0';
    setTimeout(() => {
        tasksContainer.appendChild(newTask);
        place.style.opacity = '1';
        tasksContainer.scrollTo({ top: tasksContainer.scrollHeight, behavior: 'smooth' });
    }, 200);

    // Clear the input field
    inputField.value = '';
    saveData();
};

function removeTask(event) {
    let targetTask = event.target.closest('.task');
    targetTask.style.animation = 'hide .2s cubic-bezier(.57,-0.04,.36,1.02) forwards';
    
    setTimeout(() => {
        tasksContainer.removeChild(targetTask);
        tasks = tasks.filter(task => task !== targetTask);
    }, 200);
    saveData();
}

function editTask(event) {
    let targetTask = event.target;
    targetTask.parentNode.classList.add('editing');
    targetTask.tabIndex = '0';  // Make the element focusable
    targetTask.setAttribute('contenteditable', 'true');
    targetTask.focus();  // Automatically focus on the element for editing

    // Optional: Add a visual indicator for editing (e.g., a border)
    targetTask.style.outline = '2px solid var(--color)';
    
    // Save the edited task on "Enter" key press
    targetTask.onkeydown = function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();  // Prevent new line
            targetTask.setAttribute('contenteditable', 'false');
            targetTask.parentNode.classList.remove('editing');
            targetTask.style.outline = 'none';
        }
    };
    targetTask.onblur = (e)=>{
        e.preventDefault();  // Prevent new line
        targetTask.setAttribute('contenteditable', 'false');
        targetTask.parentNode.classList.remove('editing');
        targetTask.style.outline = 'none';
    };
    saveData();
}

function checkTask(event) {
    let taskElement = event.target.closest('.task');
    if (!taskElement.classList.contains('checked')) {
        event.target.style.textDecoration = 'line-through';
        taskElement.classList.add('checked');
    } else {
        event.target.style.textDecoration = 'none';
        taskElement.classList.remove('checked');
    }
    saveData();
}

function removeAllTasks() {

    let taskList = document.querySelectorAll('.task');
    taskList.forEach(task=>{
        task.style.animation = `hide .2s cubic-bezier(.57,-0.04,.36,1.02) forwards`;
        setTimeout(()=>{
            tasksContainer.removeChild(task);
        }, 200);
    });
    tasks = [];
}

function scrollToTop() {
    tasksContainer.scrollTo({top: 0, behavior: 'smooth'})
};

function scrollToBottom() {
    tasksContainer.scrollTo({top: tasksContainer.scrollHeight, behavior: 'smooth'})
};

function saveData () {
    let tasksContainerData = tasksContainer.innerHTML;
    localStorage.setItem('data', tasksContainerData);
}

saveData();
