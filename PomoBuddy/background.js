var min = 0;
var sec = 0;
var cycle = 1;
var totalRounds, longBreak;
var stopwatchStart = false;
var breakOrWork = false;
var timerStart = false;
var stopwatch, timer;
var isTimerDone = false;
aborted = false;
var finish;
var tmp = [];
chrome.runtime.onMessage.addListener(
  function (request) {
    if (request.message == "start stopwatch") {
      min = 0;
      sec = 0;
      cycle = 1;
      totalRounds = getCookie("roundNum");
      longBreak = getCookie("restNum");
      stopwatchStart = true;
      aborted = false;
      stopwatch = setInterval(stopwatchFunction, 1000);
    } else if (request.message == "abort") {
      clearInterval(stopwatch);
      clearInterval(timer);
      aborted = true;
    } else if (request.message == "completed") clearInterval(finish);
    else if (request.message == "update badLinks") {
      tmp = request.content;
      updateArray(request.content);
    }
  }
);

function timerFunction() {
  if (timerStart) {
    breakOrWork = false;
    sec = parseInt(sec) - 1;
    min = parseInt(min);
    if (sec == -1) {
      sec = 59;
      min -= 1;
    }
    if (sec < 10) sec = '0' + sec;
    if (min < 10) min = '0' + min;
  } else clearInterval(timer);
  if (min == "0-1") {
    timerStart = false;
    alert("Back to Work!");
    chrome.runtime.sendMessage({message: "text", time: "00:00", subtitle: `Pomodoro Cycle ${cycle}`});
    updateArray(tmp);
    localStorage.setItem("nyaa",localStorage.getItem("TEMP"));

    // start stopwatch
    clearInterval(timer);
    stopwatchStart = true;
    aborted = false;
    min = 0;
    sec = 0;
    stopwatch = setInterval(stopwatchFunction, 1000)
  } else {
    addCookie("time", `${min}:${sec}`);
    addCookie("subtitle", "Take a Break!");
    chrome.runtime.sendMessage({message: "text", time: `${min}:${sec}`, subtitle: "Take a Break!"});
  }
}

function stopwatchFunction() {
  breakOrWork = true;
  if (stopwatchStart) {
    sec = parseInt(sec) + 1;
    min = parseInt(min);

    if (sec == 60) {
      min += 1;
      sec = 0;
    }

    if (sec < 10) sec = '0' + sec;
    if (min < 10) min = '0' + min;
  }
  if (min == "25" && sec == "01") {
    clearInterval(stopwatch);
    resetArray();
    if (!aborted && cycle == totalRounds) {
      alert("You are done!");
      breakOrWork = false;
      addCookie("timer-on", "done");
    }
    else if (!aborted && cycle % 4 == 0) {
      min = longBreak;
      sec = 0;
      stopwatchStart = false;
      alert(`You have completed Cycle ${cycle} of the Pomodoro!\nPlease take a longer break.`);
      cycle += 1;

      var t = `${min}:00`;
      chrome.runtime.sendMessage({message: "text", time: t, subtitle: "Take a Break!"});

      timerStart = true;
      aborted = false;
      timer = setInterval(timerFunction, 1000);
    } else {
      stopwatchStart = false;
      alert(`You have completed Cycle ${cycle} of the Pomodoro!\nPlease take a five minute break.`);
      cycle += 1;
      chrome.runtime.sendMessage({message: "text", time: "05:00", subtitle: "Take a Break!"});

      timerStart = true;
      aborted = false;
      min = 5;
      sec = 0;
      timer = setInterval(timerFunction, 1000);
    }
  } else {
    addCookie("time", `${min}:${sec}`);
    addCookie("subtitle", `Pomodoro Cycle ${cycle}`);
    chrome.runtime.sendMessage({message: "text", time: `${min}:${sec}`, subtitle: `Pomodoro Cycle ${cycle}`});
  }
}

function resetArray() {
  updateArray("null");
  badArray = ["*://*.thisisnotarealwebsite.com/*","*://*.ijustneedaplaceholderorelsethiswillerror.com/*"];
  localStorage.setItem("TEMP",localStorage.getItem("nyaa"));
  localStorage.setItem("nyaa",badArray);
}
