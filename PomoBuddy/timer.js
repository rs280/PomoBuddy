function createTimer() {
  document.getElementById("timer").innerText = "00:00";
  document.getElementById("subtitle").innerText = "Pomodoro Cycle 1";
  chrome.runtime.sendMessage({message: "start stopwatch"})
  addCookie("timer-on", "on");
}

chrome.runtime.onMessage.addListener(
  function (request) {
    document.getElementById("timer").innerText = request.time;
    document.getElementById("subtitle").innerText = request.subtitle;
  }
);
