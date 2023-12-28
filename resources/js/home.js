let completed = 0;
let pauseAudio = new Audio("pause.mp3");
let backwardAudio = new Audio("backward.mp3");

document.addEventListener("DOMContentLoaded", function () {
    // Pomodoro
    let sessionLength = 25;
    let breakLength = 5;
    let isSession = false;
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

    function updateBorderColor() {
        let pomodoroElement = document.querySelector(".pomodoro");

        console.log("Valor de isSession: ", isSession);
        console.log("Valor de isPaused: ", isPaused);

        if (isSession === true && isPaused === false) {
            console.log("Entrou no isSession true");
            pomodoroElement.style.borderColor = "#2ecc71"; // Cor verde
        }

        if (isSession === false && isPaused === true) {
            console.log("Entrou no isPaused false");
            pomodoroElement.style.borderColor = "#e74c3c"; // Cor vermelha
        }
    }

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
                tasks.push({
                    text: task.textContent,
                    completed:
                        task.parentElement.classList.contains("completed-task"),
                });
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

    // Carregar as tarefas salvas no cookie ao iniciar a página
    loadTasksFromCookie();

    function updateSettingsTimeValues() {
        document.querySelector(".settings>.break>.value>.v").textContent =
            breakLength;
        document.querySelector(".settings>.session>.value>.v").textContent =
            sessionLength;
    }

    function nextStep() {
        console.log('Entrou no nextStep');
        if (isSession) {
            console.log('Entrou no if do nextStep');
            timeLeft = breakLength * 60;
            isSession = false; // Atualize isSession corretamente
            updateBorderColor(); // Atualize a cor da borda
        } else {
            console.log('Entrou no else do nextStep');
            timeLeft = sessionLength * 60;
            isSession = true; // Atualize isSession corretamente
            updateBorderColor(); // Atualize a cor da borda
        }

        document.querySelector(".fill.session").style.height = isSession ? "0%" : "100%";
        document.querySelector(".fill.break").style.height = isSession ? "100%" : "0%";

        // Ajuste 1: Remova as animações existentes
        if (fillAnimationSess) fillAnimationSess.cancel();
        if (fillAnimationBreak) fillAnimationBreak.cancel();

        // Ajuste 2: Defina a animação com base no tempo correto
        if (isSession) {
            fillAnimationBreak = document.querySelector(".fill.break").animate([{ height: "0%" }, { height: "100%" }], {
                duration: breakLength * 60 * 1000, // Usando breakLength em vez de timeLeft
            });
        } else {
            fillAnimationSess = document.querySelector(".fill.session").animate([{ height: "0%" }, { height: "100%" }], {
                duration: sessionLength * 60 * 1000, // Usando sessionLength em vez de timeLeft
            });
        }

        isSession = !isSession;
        completed++;
        pauseAudio.play();

        document.querySelector(".completed").textContent = "";
    }


    function startPomodoro() {
        console.log('Entrou no startPomo');
        intervalCounter = setInterval(function () {
            if (timeLeft > 0) {
                timeLeft--;
                document.querySelector(".pomodoro>.time-left").textContent = getFormattedTime();
            } else {
                nextStep();
            }
        }, 1000);
        isSession = true;
        isPaused = false;

        if (isSession) {
            timeLeft = sessionLength * 60; // Se estiver em um período de trabalho, ajuste para o tempo de trabalho
        } else {
            timeLeft = breakLength * 60; // Se estiver em um período de pausa, ajuste para o tempo de pausa
        }

        document.querySelector(".status").textContent = "Tap to stop";
        updateBorderColor(); // Atualize a cor da borda
    }


    function pausePomodoro() {
        console.log('Entrou no pause');
        clearInterval(intervalCounter);

        if (isSession) {
            timeLeft = sessionLength * 60; // Se estiver em um período de trabalho, ajuste para o tempo de trabalho
        } else {
            timeLeft = breakLength * 60; // Se estiver em um período de pausa, ajuste para o tempo de pausa
        }

        isPaused = true;
        isSession = false;
        document.querySelector(".status").textContent = "Tap to start";
        updateBorderColor(); // Atualize a cor da borda
    }


    document.querySelector(".pomodoro>.time-left").textContent =
        getFormattedTime();

    document
        .querySelector(".reset-pomodoro")
        .addEventListener("click", function () {
            // pausePomodoro();
            // if (isPaused === false) {
            //     pausePomodoro();
            // } else {
            //     startPomodoro();
            // }
            isSession = !isSession;
            nextStep();
            document.querySelector(".pomodoro>.time-left").textContent =
                getFormattedTime();
        });

    //TODO: alterar essa regra para entrar em pausePomodoro ou StartPomodoro dependendo da flag de isSession ou isaPause
    document
        .querySelector(".next-pomodoro")
        .addEventListener("click", function () {
            if (isPaused === false) {
                pausePomodoro();
            } else {
                startPomodoro();
            }
            isSession = !isSession;
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
                // pausePomodoro();
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

    function deleteTask(taskItem) {
        taskItem.remove();
    }

    function markTaskAsCompleted(taskItem) {
        taskItem.classList.add("completed-task");
    }

    function moveTaskToBottom(taskItem) {
        const taskList = document.getElementById("taskList");
        taskList.appendChild(taskItem);
    }

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
