let pomodoroElement = document.querySelector(".pomodoro")
let completed = 0;
let pauseAudio = new Audio("pause.mp3");
let backwardAudio = new Audio("backward.mp3");
let sessionLength = 25;
let breakLength = 5;
let isSession = false;
let timeLeft = sessionLength * 60;
let fillAnimationSess = null;
let fillAnimationBreak = null;
let intervalCounter = null;

document.addEventListener("DOMContentLoaded", function () {
    // Check if the user has already accepted cookies policy
    cookiesPolicy();

    // Init tasklist routines
    loadTasksFromCookie();

    saveTasksToCookie();

    // Finish tasklist routines

    // Init applications routines
    document.querySelector(".pomodoro>.counter").textContent =
        getFormattedTime();

    document.querySelector(".pomodoro").addEventListener("click", function () {
        if (!isSession) {
            startPomodoro();
        } else {
            pausePomodoro();
        }
    });

    document
        .querySelector(".reset-pomodoro")
        .addEventListener("click", function () {
            isSession = !isSession;
            nextStep();
            document.querySelector(".pomodoro>.counter").textContent =
                getFormattedTime();
        });

    document
        .querySelector(".next-pomodoro")
        .addEventListener("click", function () {

            if (!isSession) {
                startPomodoro();
            } else {
                pausePomodoro();
            }
        });

    document
        .querySelector(".control.increment-pomo")
        .addEventListener("click", function () {
            if (sessionLength < 100) {
                sessionLength++;

                if (isSession) {
                    timeLeft = sessionLength * 60;
                } else {
                    timeLeft = breakLength * 60;
                }

                document.querySelector(".pomodoro>.counter").textContent =
                    getFormattedTime();
                updateSettingsTimeValues();
            }
        });

    document
        .querySelector(".control.decrement-pomo")
        .addEventListener("click", function () {
            if (sessionLength > 1) {
                sessionLength--;

                if (isSession) {
                    timeLeft = sessionLength * 60;
                } else {
                    timeLeft = breakLength * 60;
                }

                document.querySelector(".pomodoro>.counter").textContent =
                    getFormattedTime();
                updateSettingsTimeValues();
            }
        });

    document
        .querySelector(".control.increment-pause")
        .addEventListener("click", function () {
            breakLength++;

            if (isSession) {
                timeLeft = sessionLength * 60;
            } else {
                timeLeft = breakLength * 60;
            }

            document.querySelector(".pomodoro>.counter").textContent =
                getFormattedTime();

            updateSettingsTimeValues();
        });

    document
        .querySelector(".control.decrement-pause")
        .addEventListener("click", function () {
            if (breakLength > 1) {
                breakLength--;

                if (isSession) {
                    timeLeft = sessionLength * 60;
                } else {
                    timeLeft = breakLength * 60;
                }

                document.querySelector(".pomodoro>.counter").textContent =
                    getFormattedTime();

                updateSettingsTimeValues();
            }
        });

    // Finish applications routines

    // Init Pomodoro functions

    function updateBorderColor() {
        console.log("Valor de isSession: ", isSession);

        if (isSession) {
            console.log("Entrou no isSession true");
            startPomodoro();
        }

        if (!isSession) {
            console.log("Entrou no isSession false");
            pausePomodoro();
        }
    }

    function updateSettingsTimeValues() {
        document.querySelector(".settings>.break>.value>.v").textContent =
            breakLength;
        document.querySelector(".settings>.session>.value>.v").textContent =
            sessionLength;
    }

    function nextStep() {
        console.log("Entrou no nextStep");
        if (isSession) {
            console.log("Entrou no if do nextStep");
            timeLeft = breakLength * 60;
            isSession = false;
            updateBorderColor();
        } else {
            console.log("Entrou no else do nextStep");
            timeLeft = sessionLength * 60;
            isSession = true;
            updateBorderColor();
        }

        document.querySelector(".fill.session").style.height = isSession
            ? "0%"
            : "100%";
        document.querySelector(".fill.break").style.height = isSession
            ? "100%"
            : "0%";

        // Ajuste 1: Remova as animações existentes
        if (fillAnimationSess) fillAnimationSess.cancel();
        if (fillAnimationBreak) fillAnimationBreak.cancel();

        // Ajuste 2: Defina a animação com base no tempo correto
        if (isSession) {
            fillAnimationBreak = document
                .querySelector(".fill.break")
                .animate([{ height: "0%" }, { height: "100%" }], {
                    duration: breakLength * 60 * 1000, // Usando breakLength em vez de timeLeft
                });
        } else {
            fillAnimationSess = document
                .querySelector(".fill.session")
                .animate([{ height: "0%" }, { height: "100%" }], {
                    duration: sessionLength * 60 * 1000, // Usando sessionLength em vez de timeLeft
                });
        }

        isSession = !isSession;
        completed++;
        pauseAudio.play();

        document.querySelector(".completed").textContent = "";
    }

    function startPomodoro() {
        console.log("Entrou no startPomo");
        clearInterval(intervalCounter);

        intervalCounter = setInterval(function () {
        if (timeLeft > 0) {
            timeLeft--;
            document.querySelector(".pomodoro>.counter").textContent =
                getFormattedTime();
        } else {
            nextStep();
        }
    }, 1000);

        isSession = true;

        timeLeft = sessionLength * 60;

        document.querySelector(".status").textContent = "Tap to stop";
        pomodoroElement.style.borderColor = "#2ecc71"; // Green color

        updateSettingsTimeValues();
        backwardAudio.play();
    }

    function pausePomodoro() {
        console.log("Entrou no pause");
        clearInterval(intervalCounter);

        intervalCounter = setInterval(function () {
        if (timeLeft > 0) {
            timeLeft--;
            document.querySelector(".pomodoro>.counter").textContent =
                getFormattedTime();
        } else {
            nextStep();
        }
    }, 1000);

        timeLeft = breakLength * 60;

        isSession = false;
        document.querySelector(".status").textContent = "It's time for a break ☕️";

        pomodoroElement.style.borderColor = "#e74c3c"; // Red color
        updateSettingsTimeValues();
        pauseAudio.play();
    }

    function getFormattedTime() {
        let minute = Math.floor(timeLeft / 60),
            second = timeLeft - minute * 60;
        return minute + ":" + (second < 10 ? "0" : "") + second;
    }

    // Finish pomodoro functions

    // Init To-Do List routines

    // Adicionar evento ao botão de adicionar tarefa para salvar no cookie
    const addTaskButton = document.getElementById("addTask");
    addTaskButton.addEventListener("click", function () {
        addTask();
        saveTasksToCookie();
    });

    document
        .getElementById("newTask")
        .addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
                addTask();
                saveTasksToCookie();
            }
        });

    // Adicionar evento ao botão de concluir tarefa para salvar no cookie
    document
        .getElementById("taskList")
        .addEventListener("click", function (event) {
            const target = event.target;

            // Verificar se o clique foi no botão de exclusão
            if (target.classList.contains("delete-task")) {
                const taskItem = target.parentElement;
                deleteTask(taskItem);
                saveTasksToCookie();
            }

            // Verificar se o clique foi no botão de completar
            if (target.classList.contains("complete-task")) {
                const taskItem = target.parentElement;
                markTaskAsCompleted(taskItem);
                moveTaskToBottom(taskItem);
                saveTasksToCookie();
            }
        });

    // Finish To-Do List routines

    // Init menu routines

    document.getElementById("homeLink").addEventListener("click", function () {
        window.scrollTo(0, 0); // Direciona para o topo da página
        showSection("");
    });

    document
        .getElementById("featuresLink")
        .addEventListener("click", function () {
            showSection("featuresSection");
        });

    document
        .getElementById("pricingLink")
        .addEventListener("click", function () {
            showSection("pricingSection");
        });

    document.getElementById("aboutLink").addEventListener("click", function () {
        showSection("aboutSection");
    });

    // Finish menu routines
});

/**
 * Function to handle the cookies policy.
 *
 * @return {void}
 */
function cookiesPolicy() {
    let cookieNoticeModal = new bootstrap.Modal(
        document.getElementById("cookieNoticeModal")
    );

    const hasAcceptedCookies = localStorage.getItem("cookiesAccepted");

    // If not accepted yet, display the notice modal
    if (hasAcceptedCookies !== "true") {
        cookieNoticeModal.show();
    }

    // Add event to the accept button to handle agreement of cookies
    const acceptButton = document.querySelector(
        "#cookieNoticeModal .btn-primary"
    );

    acceptButton.addEventListener("click", function () {
        localStorage.setItem("cookiesAccepted", "true");
        cookieNoticeModal.hide();
    });

    // Add event to the close button to handle rejection of cookies
    const closeButton = document.querySelector(
        "#cookieNoticeModal .btn-secondary"
    );

    closeButton.addEventListener("click", function () {
        localStorage.setItem("cookiesAccepted", "false");
        cookieNoticeModal.hide();
    });
}

/**
 * INIT COOKIES FUNCTIONS BLOCK
 */

/**
 * Loads tasks from the cookie and displays them on the task list.
 *
 * @return {void}
 */
function loadTasksFromCookie() {
    const storedTasks = getCookie("tasks");

    if (storedTasks) {
        const tasks = JSON.parse(storedTasks);
        const taskList = document.getElementById("taskList");

        // Clean all tasks
        taskList.innerHTML = "";

        tasks.forEach(function (taskData) {
            const taskItem = document.createElement("li");
            taskItem.className = "todo-item";
            taskItem.innerHTML = `
                <div class="task-text">${decodeURIComponent(
                    taskData.text
                )}</div>
                <div class="delete-task">❌</div>
                <div class="complete-task" title="Mark as completed">✅</div>
            `;

            if (taskData.completed) {
                taskItem.classList.add("completed-task");
            }

            const deleteButton = taskItem.querySelector(".delete-task");
            deleteButton.addEventListener("click", function () {
                if (taskItem.classList.contains("completed-task")) {
                    taskItem.classList.remove("completed-task");
                } else {
                    markTaskAsCompleted(taskItem);
                    taskList.appendChild(taskItem);
                }

                saveTasksToCookie();
            });

            taskList.appendChild(taskItem);
        });
    }
}

/**
 * Save tasks to the cookie.
 *
 */
function saveTasksToCookie() {
    const taskList = document.getElementById("taskList");
    const tasks = [];

    taskList.querySelectorAll(".todo-item .task-text").forEach(function (task) {
        tasks.push({
            text: task.textContent,
            completed: task.parentElement.classList.contains("completed-task"),
        });
    });

    setCookie("tasks", JSON.stringify(tasks), 360);
}

/**
 * Sets a cookie with the given name, value, and expiration days.
 *
 * @param {string} name - The name of the cookie
 * @param {string} value - The value of the cookie
 * @param {number} days - The number of days until the cookie expires
 * @return {void}
 */
function setCookie(name, value, days) {
    console.log(
        "Entrou aqui no setCookie com o valor name: ",
        name,
        ", value: ",
        value,
        " days: ",
        days
    );
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    console.log(
        name +
            "=" +
            encodeURIComponent(value) +
            ";expires=" +
            expires.toUTCString()
    );
    document.cookie =
        name +
        "=" +
        encodeURIComponent(value) +
        ";expires=" +
        expires.toUTCString();
}

/**
 * Retrieves the value of the specified cookie from the document's cookies.
 *
 * @param {string} name - The name of the cookie to retrieve.
 * @return {string|null} The value of the specified cookie, or null if the cookie does not exist.
 */
function getCookie(name) {
    const keyValue = document.cookie.match("(^|;) ?" + name + "=([^;]*)(;|$)");
    console.log(keyValue ? decodeURIComponent(keyValue[2]) : null);
    return keyValue ? decodeURIComponent(keyValue[2]) : null;
}

/**
 * Deletes a cookie by setting its expiration date to the past.
 *
 * @param {string} name - the name of the cookie to be deleted
 * @return {void}
 */
function deleteCookie(name) {
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

/**
 * INIT TO-DO LIST FUNCTIONS BLOCK
 */

function addTask() {
    console.log("Entrou na função addTask()");
    const newTaskInput = document.getElementById("newTask");
    const taskText = newTaskInput.value.trim();

    if (taskText !== "") {
        const taskList = document.getElementById("taskList");
        const taskItem = document.createElement("li");
        taskItem.className = "todo-item";
        taskItem.innerHTML = `
        <div class="task-text">${taskText}</div>
        <div class="delete-task" title="Delete task">❌</div>
        <div class="complete-task" title="Mark as completed">✅</div>
      `;

        taskList.appendChild(taskItem);
        newTaskInput.value = "";

        const deleteButton = taskItem.querySelector(".delete-task");
        deleteButton.addEventListener("click", function () {
            if (taskItem.classList.contains("completed-task")) {
                taskItem.classList.remove("completed-task");
            } else {
                markTaskAsCompleted(taskItem);
                taskList.appendChild(taskItem);
            }
        });
    }
}

/**
 * INIT TASK LIST FUNCTIONS BLOCK
 */

/**
 * Marks the task item as completed by adding the "completed-task" class.
 *
 * @param {Object} taskItem - The task item to be marked as completed
 * @return {void}
 */
function markTaskAsCompleted(taskItem) {
    taskItem.classList.add("completed-task");
}


/**
 * Deletes the specified task item.
 *
 * @param {object} taskItem - The task item to be deleted
 * @return {void}
 */
function deleteTask(taskItem) {
    taskItem.remove();
}


/**
 * Moves the given task item to the bottom of the task list.
 *
 * @param {Object} taskItem - The task item to be moved.
 * @return {void}
 */
function moveTaskToBottom(taskItem) {
    const taskList = document.getElementById("taskList");
    taskList.appendChild(taskItem);
}

/**
 * INIT MENU FUNCTIONS BLOCK
 */

/**
 * Shows the specified section by hiding all other menu sections and displaying the selected menu section.
 *
 * @param {string} sectionId - The ID of the section to be shown
 * @return {void}
 */
function showSection(sectionId) {
    // Hide menus
    let sections = document.querySelectorAll(".menu-section");
    sections.forEach(function (section) {
        section.style.display = "none";
    });

    // Show selected menu
    let targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = "block";
    }
}

/**
 * Sets a interval counter to update the time left and trigger the next step when the time is up.
 *
 * @param {} - No parameters
 * @return {} - No return value
 */
function setInvervalCounter() {
    intervalCounter = setInterval(function () {
        if (timeLeft > 0) {
            timeLeft--;
            document.querySelector(".pomodoro>.counter").textContent =
                getFormattedTime();
        } else {
            nextStep();
        }
    }, 1000);
}