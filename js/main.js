
const defaultTasks = [
    {
        title: "Apprendre mon cours de JavaScript",
        priority: 1,
        id: 1,
    },
    {
        title: "Créer mon compte Github",
        priority: 2,
        id: 2,
    },
    {
        title: "Répondre à mes emails",
        priority: 3,
        id: 3,
    },
]

// retrieves added tasks if exist or set default tasks for demo 
let tasks = localStorage.getItem("todoList") ? JSON.parse(localStorage.getItem("todoList")) : defaultTasks

let taskList = document.getElementById("task-list")
let taskForm = document.getElementById("task-form")
let inputText = taskForm.querySelector("input[type=text]")
let select = taskForm.querySelector("select") 
let datb = document.getElementById("delete-all-tasks-button")
let dialog = document.querySelector("dialog")

/**
 * 
 * @param { Number } priority 
 * @returns { String }
 * Returns a className to display a task with the righr color
 */
function priorityClass(priority) {
    let pc = ""
    switch (priority) {
        case 1:
            pc = "priority-high"
            break
        case 2:
            pc = "priority-medium"
            break
        case 3:
            pc = "priority-low"
            break
    }
    return pc
}

/**
 * 
 * @returns { number }
 * Creates a random ID to easily target a task
 */
function randomId() {
    return Math.random() * Math.pow(10, 17)
}

/**
 * 
 * @param { Array } tasks 
 * Creates the HTML markup for the task-list
 */
function displayTasks(tasks) {
    // Sort the tasks according to priority, to display in the right order
    tasks = sortTasks(tasks)

    // Reset the HTML content of the list
    taskList.innerHTML = null

    // Create a li elmt for each task
    for (task of tasks) {
        let li = document.createElement("li")
        let pc = priorityClass(task.priority)

        li.innerHTML = `
        <label class=${pc}>
            <input type="checkbox" value=${task.id}>
            ${task.title}
        </label>`

        taskList.appendChild(li)
    }

    // Save tasks in local storage 
    localStorage.setItem("todoList", JSON.stringify(tasks))
}

/**
 * 
 * @param { Event } e 
 */
function submitHandler(e) {
    e.preventDefault()

    let data = new FormData(taskForm)
    let text = data.get("text")
    let priority = parseInt(data.get("priority"))

    // add new tasks in the task array
    tasks.push({
        title: text,
        priority: priority,
        id: randomId(),
    })

    // Reset the markup and save into Local Storage
    displayTasks(tasks)

    // Resets form values
    inputText.value = ""
    select.value = "1"
}

taskForm.addEventListener("submit", (e) => submitHandler(e))

/**
 * Delete all tasks marked as done
 */
function datbClickHandler() {
    // get all inputs and convert NodeList into an array to use filter
    let inputs = Array.from(document.querySelectorAll("#task-list input"))
    // keep the inputs that are checked
    let checkedInputs = inputs.filter((input) => input.checked)

    // Get all IDs of tasks marked as done
    let ids = []
    checkedInputs.forEach((input) => ids.push(parseInt(input.value)))
    
    // Keep only the task that are not done
    tasks = tasks.filter((task)=>!ids.includes(task.id))
    
    // Update HTML and save in Local storage
    displayTasks(tasks)

    // Create a confirmation message for the user
    let message = ""
    if(ids.length == 0){
        message = "Pas de tâche à effacer"
    } else if (ids.length == 1){
        message = "Une tâche supprimée avec succès" 
    } else {
        message = `${ids.length} tâches ont été supprimées avec succès`
    }
    displayMessage(message)
}

/**
 * 
 * @param { String } message 
 * Display a modal <dialog> tag with the message
 */
function displayMessage(message){
    let p = dialog.querySelector("p")
    dialog.showModal()
    p.textContent = message
} 

datb.addEventListener("click", datbClickHandler)

/**
 * 
 * @param { Array } tasks 
 * @returns { Array }
 * Sorts the array of tasks according to the priority
 */
function sortTasks(tasks){
    tasks = tasks.sort((a,b)=>{
        if(a.priority == b.priority){
            return 0
        }
        if(a.priority >= b.priority){
            return 1
        }
        if(a.priority <= b.priority){
            return -1
        }
    })

    return tasks
}

// Display the tasks on page load
sortTasks(tasks)
displayTasks(tasks)
