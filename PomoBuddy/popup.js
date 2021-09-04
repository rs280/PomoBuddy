// popup.js
// runs everytime the pop up is clicked
var check;
var chooseBlocked;
var badArray = [];
var newBadArray = [];
var defaultBad = ["https://twitter.com/", "https://www.youtube.com/", "https://www.reddit.com/", "https://www.netflix.com/ca/", "https://www.disneyplus.com/", "https://www.instagram.com/", "https://www.facebook.com/", "https://discord.com/"]

window.onload = function() { // runs everytime the popup extension is opened
    var arr = getCookie("banned").split(", ");
    if (arr.length == 1) { // if no "bad apps", then add the defaultBad
        arr = [];
        for (let i = 0; i < defaultBad.length; i += 1) arr.push(defaultBad[i]);
        addCookie("banned", arr.join(", "));
    }
    var goTo = getCookie("tracker"); // tracker cookie shows where the user last left off
    if (goTo != "timerOn") addCookie("timer-on", "off");
    if (goTo == "") {
        addCookie("tracker", "mainMenu");
        goTo = "mainMenu";
    }
    if (goTo == "mainMenu") mainMenu();
    else if (goTo == "timerOn") timerSetup();

    if (getCookie("timer-on") == "on") {
        document.getElementById("timer").innerText = getCookie("time");
        document.getElementById("subtitle").innerText = getCookie("subtitle");
    } else if (getCookie("timer-on") == "done") {
        showCompletedScreen();
        addCookie("timer-on", "off");
    }
}

function mainMenu() { // show main menu screen
    check = false;
    addCookie("tracker", "mainMenu");
    document.getElementById("MainMenu").hidden = false;
    document.getElementById("SetupTimer").hidden = true;
    document.getElementById("TimerOn").hidden = true;
    document.getElementById("abortedScreen").hidden = true;
    document.getElementById("ToDoList").hidden = true;
    document.getElementById("websitesScreen").hidden = true;
    document.getElementById("completedScreen").hidden = true;
    document.getElementById("PomodoroButton").onclick = () => setPomodoro();
    document.getElementById("ToDoListButton").onclick = () => setToDoList();
    document.getElementById("ManageWebsitesButton").onclick = () => setWebsites();
}

function setPomodoro() { // show pomodoro setup screen
    document.getElementById("MainMenu").hidden = true;
    document.getElementById("SetupTimer").hidden = false;
    document.getElementById("TimerOn").hidden = true;
    document.getElementById("abortedScreen").hidden = true;
    document.getElementById("websitesScreen").hidden = true;
    document.getElementById("SelectAll").onclick = () => toggle();
    document.getElementById("bb1").onclick = () => {
        chooseBlocked.remove();
        mainMenu();
    };
    document.getElementById("start-button").onclick = () => {
        var roundNum = document.getElementById("round_num").value;
        var restNum = document.getElementById("lbreak_num").value;
        addCookie("roundNum", roundNum);
        addCookie("restNum", restNum);

        badArray = sendBadSites(document.getElementById("ChooseBlocked").children); 
	    localStorage.setItem("nyaa",badArray);
        chooseBlocked.remove();
        timerSetup();
    }

    // build list based on "banned" list of user
    chooseBlocked = document.createElement("div");
    chooseBlocked.id = "ChooseBlocked";
    document.getElementById("choose-blocked-form").appendChild(chooseBlocked);
    const things = getCookie("banned").split(", ")
    if (things.length == 1) return;
    for (let i = 0; i < things.length; i += 1) addToBlockedList(things[i]);
}

function timerSetup() { // set up the timer screen, start and reset timer
    document.getElementById("MainMenu").hidden = true;
    document.getElementById("SetupTimer").hidden = true;
    document.getElementById("TimerOn").hidden = false;
    document.getElementById("abortedScreen").hidden = true;
    document.getElementById("abort").onclick = () => showAbortScreen();
    
    // makes sure that the timer is only set once
    if (getCookie("tracker") != "timerOn") createTimer();
    addCookie("tracker", "timerOn")
}

function showAbortScreen() {
    document.getElementById("MainMenu").hidden = true;
    document.getElementById("SetupTimer").hidden = true;
    document.getElementById("TimerOn").hidden = true;
    document.getElementById("abortedScreen").hidden = false;
    document.getElementById("bb2").onclick = () => mainMenu();
    chrome.runtime.sendMessage({message: "abort"})
    addCookie("tracker", "mainMenu");
}

function showCompletedScreen() {
    document.getElementById("MainMenu").hidden = true;
    document.getElementById("SetupTimer").hidden = true;
    document.getElementById("TimerOn").hidden = true;
    document.getElementById("completedScreen").hidden = false;
    document.getElementById("bb3").onclick = () => mainMenu();
    addCookie("tracker", "mainMenu");
}

function addToBlockedList(inner) { // add known blocked website to the blocked website list (in HTML)
    let check = document.createElement("INPUT");
    check.setAttribute("type", "checkbox");
    check.name = "x";
    let label = document.createElement("LABEL");
    label.innerText = inner + "\n";
    label.className = "boxes";
    label.name = "x";
    chooseBlocked.appendChild(check);
    chooseBlocked.appendChild(label);
}
