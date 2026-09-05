let intervalId;
let currentTimeLeft;

self.onmessage = function (e) {
    const { command, timeLeft } = e.data;

    if (command === "start") {
        clearInterval(intervalId);
        currentTimeLeft = timeLeft;
        intervalId = setInterval(() => {
            currentTimeLeft--;
            postMessage({ timeLeft: currentTimeLeft });
        }, 1000);
    } else if (command === "stop") {
        clearInterval(intervalId);
    }
};