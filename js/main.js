
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

let tasks = localStorage.getItem("todoList") ? JSON.parse(localStorage.getItem("todoList")) : defaultTasks

let taskList = document.getElementById("task-list")
let taskForm = document.getElementById("task-form")
let datb = document.getElementById("delete-all-tasks-button")

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

function randomId() {
    return Math.random() * Math.pow(10, 17)
}

function displayTasks(tasks) {
    // sort the tasks according to priority
    tasks = sortTasks(tasks)

    // resets the HTML content
    taskList.innerHTML = null

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

    localStorage.setItem("todoList", JSON.stringify(tasks))
}

function submitHandler(e) {
    e.preventDefault()

    let data = new FormData(taskForm)
    let text = data.get("text")
    let priority = parseInt(data.get("priority"))

    tasks.push({
        title: text,
        priority: priority,
        id: randomId(),
    })

    displayTasks(tasks)
}

taskForm.addEventListener("submit", (e) => submitHandler(e))

function datbClickHandler() {
    let inputs = Array.from(document.querySelectorAll("#task-list input"))
    let checkedInputs = inputs.filter((input) => input.checked)

    let ids = []
    checkedInputs.forEach((input) => ids.push(parseInt(input.value)))
    
    tasks = tasks.filter((task)=>!ids.includes(task.id))
    displayTasks(tasks)

    let message = ""
    if(ids.length == 0){
        message = "Pas de tâche à effacer"
    } else if (ids.length == 1){
        message = "Une tâche supprimée avec succès" 
    } else {
        message = `${ids.length} tâches ont été supprimées avec succès`
    }
    
    alert(message)

}

datb.addEventListener("click", datbClickHandler)

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

// Display the default tasks on load
sortTasks(tasks)
displayTasks(tasks)
