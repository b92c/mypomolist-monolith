let completed = 0;
let pauseAudio = new Audio("pause.mp3");
let backwardAudio = new Audio("backward.mp3");

document.addEventListener("DOMContentLoaded", function () {
    // Pomodoro
    let sessionLength = 25;
    let breakLength = 5;
    let isSession = true;
    let timeLeft = sessionLength * 60;
    let isPaused = true;
    let fillAnimationSess = null;
    let fillAnimationBreak = null;
    let intervalCounter = null;
    // Check if the user has already accepted cookies
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

    // Função para salvar as tarefas no cookie
    function saveTasksToCookie() {
        const taskList = document.getElementById("taskList");
        const tasks = [];

        taskList
            .querySelectorAll(".todo-item .task-text")
            .forEach(function (task) {
                tasks.push(task.textContent);
            });

        setCookie("tasks", JSON.stringify(tasks), 360);
    }

    // Função para carregar as tarefas do cookie
    function loadTasksFromCookie() {
        const storedTasks = getCookie("tasks");

        if (storedTasks) {
            const tasks = JSON.parse(storedTasks);
            const taskList = document.getElementById("taskList");

            // Limpa as tarefas existentes
            taskList.innerHTML = "";

            tasks.forEach(function (taskText) {
                const taskItem = document.createElement("li");
                taskItem.className = "todo-item";
                taskItem.innerHTML = `
                    <div class="task-text">${taskText}</div>
                    <div class="delete-task">X</div>
                `;

                const deleteButton = taskItem.querySelector(".delete-task");
                deleteButton.addEventListener("click", function () {
                    if (taskItem.classList.contains("completed-task")) {
                        taskItem.classList.remove("completed-task");
                    } else {
                        markTaskAsCompleted(taskItem);
                        taskList.appendChild(taskItem);
                    }

                    saveTasksToCookie(); // Salva as tarefas após a remoção ou conclusão
                });

                taskList.appendChild(taskItem);
            });
        }
    }

    // Carregar as tarefas salvas no cookie ao iniciar a página
    loadTasksFromCookie();

    function updateSettingsTimeValues() {
        document.querySelector(".settings>.break>.value>.v").textContent =
            breakLength;
        document.querySelector(".settings>.session>.value>.v").textContent =
            sessionLength;
    }

    function pausePomodoro() {
        if (fillAnimationSess !== null) {
            fillAnimationSess.cancel();
        }

        if (fillAnimationBreak !== null) {
            fillAnimationBreak.cancel();
        }
        isPaused = true;
        clearInterval(intervalCounter);
        document.querySelector(".status").textContent = "Tap to start";
    }

    function nextStep() {
        if (isSession) {
            timeLeft = breakLength * 60;
            document.querySelector(".fill.session").style.height = "100%";
            document.querySelector(".fill.break").style.height = "0%";
            fillAnimationBreak = document
                .querySelector(".fill.break")
                .animate([{ height: "0%" }, { height: "100%" }], {
                    duration: timeLeft * 1000,
                });
            isSession = false;

            completed++;
            pauseAudio.play();
            document.querySelector(".completed").textContent = "";

            if (completed > 3) {
                timeLeft = 25 * 60;
                document.querySelector(".fullycycle").textContent = "🌳";
            } else {
                for (let i = 0; i < completed; i++)
                    document.querySelector(".completed").textContent += "🍅";
            }

            // Adiciona classe ao elemento .pomodoro para estilizar a borda
            document.querySelector(".pomodoro").classList.remove("break-mode");
        } else {
            document.querySelector(".fill.session").style.height = "0%";
            document.querySelector(".fill.break").style.height = "0%";

            backwardAudio.play();

            isSession = true;
            timeLeft = sessionLength * 60;

            fillAnimationSess = document
                .querySelector(".fill.session")
                .animate([{ height: "0%" }, { height: "100%" }], {
                    duration: timeLeft * 1000,
                });

            // Adiciona classe ao elemento .pomodoro para estilizar a borda
            document.querySelector(".pomodoro").classList.add("break-mode");
        }
    }

    function startPomodoro() {
        intervalCounter = setInterval(function () {
            if (timeLeft > 0) {
                timeLeft--;
                document.querySelector(".pomodoro>.time-left").textContent =
                    getFormattedTime();
            } else nextStep();
        }, 1000);
        isPaused = false;
        isSession = !isSession;
        nextStep();
        document.querySelector(".status").textContent = "Tap to stop";
    }

    document.querySelector(".pomodoro>.time-left").textContent =
        getFormattedTime();

    document
        .querySelector(".reset-pomodoro")
        .addEventListener("click", function () {
            pausePomodoro();
            isSession = !isSession;
            nextStep();
            document.querySelector(".pomodoro>.time-left").textContent =
                getFormattedTime();
        });

    document
        .querySelector(".next-pomodoro")
        .addEventListener("click", function () {
            pausePomodoro();
            isSession = !isSession;
            startPomodoro();
        });

    document.querySelector(".pomodoro").addEventListener("click", function () {
        if (isPaused) {
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
                pausePomodoro();
                if (isSession) {
                    timeLeft = sessionLength * 60;
                } else {
                    timeLeft = breakLength * 60;
                }
                document.querySelector(".pomodoro>.time-left").textContent =
                    getFormattedTime();
                updateSettingsTimeValues();
            }
        });

    document
        .querySelector(".control.decrement-pomo")
        .addEventListener("click", function () {
            if (sessionLength > 1) {
                sessionLength--;
                pausePomodoro();
                if (isSession) {
                    timeLeft = sessionLength * 60;
                } else {
                    timeLeft = breakLength * 60;
                }
                document.querySelector(".pomodoro>.time-left").textContent =
                    getFormattedTime();
                updateSettingsTimeValues();
            }
        });

    document
        .querySelector(".control.increment-pause")
        .addEventListener("click", function () {
            breakLength++;
            pausePomodoro();
            if (isSession) {
                timeLeft = sessionLength * 60;
            } else {
                timeLeft = breakLength * 60;
            }
            document.querySelector(".pomodoro>.time-left").textContent =
                getFormattedTime();
            updateSettingsTimeValues();
        });

    document
        .querySelector(".control.decrement-pause")
        .addEventListener("click", function () {
            if (breakLength > 1) {
                breakLength--;
                pausePomodoro();
                if (isSession) {
                    timeLeft = sessionLength * 60;
                } else {
                    timeLeft = breakLength * 60;
                }
                document.querySelector(".pomodoro>.time-left").textContent =
                    getFormattedTime();
                updateSettingsTimeValues();
            }
        });

    function getFormattedTime() {
        let minute = Math.floor(timeLeft / 60),
            second = timeLeft - minute * 60;
        return minute + ":" + (second < 10 ? "0" : "") + second;
    }

    //   To-Do List

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
        <div class="delete-task">X</div>
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

    function markTaskAsCompleted(taskItem) {
        taskItem.classList.add("completed-task");
    }

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
            }
        });

    const taskList = document.getElementById("taskList");
    taskList.addEventListener("click", function (event) {
        const target = event.target;

        // Verificar se o clique foi em um botão de exclusão
        if (target.classList.contains("delete-task")) {
            const taskItem = target.parentElement;

            if (taskItem.classList.contains("completed-task")) {
                taskItem.classList.remove("completed-task");
            } else {
                markTaskAsCompleted(taskItem);
                taskList.appendChild(taskItem);
            }

            saveTasksToCookie();
        }
    });

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

    function getCookie(name) {
        console.log("Entrou aqui no getCookie com o valor: ", name);
        const keyValue = document.cookie.match(
            "(^|;) ?" + name + "=([^;]*)(;|$)"
        );
        console.log(keyValue ? decodeURIComponent(keyValue[2]) : null);
        return keyValue ? decodeURIComponent(keyValue[2]) : null;
    }

    function deleteCookie(name) {
        console.log("Entrou aqui no deleteCookie com o valor: ", name);
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
});
