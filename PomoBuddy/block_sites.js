//block_sites.js

var newLink;
var found = false;

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
   console.log(tab.url);
   var url = new URL(tab.url);
   url = String(url.hostname);
   url = url.split(".")
   if (url.length-1 == 2 && url[0].startsWith("www"))url = url.slice(1).join(".");
   else url = url.join(".");
   link = "*://*."+url+"/*";
   console.log(link);

   if(chrome.webRequest.onBeforeRequest.hasListener(blockRequest))
     chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
   var rawr = localStorage.getItem("nyaa");
   rawr = rawr.split(',').slice(1);
   console.log(rawr);
   for (let i = 0; i < rawr.length; i += 1){
      console.log(rawr[i]);
      var url = new URL(rawr[i]);
      url = String(url.hostname);
      url = url.split(".")
      if (url.length-1 == 2 && url[0].startsWith("www"))url = url.slice(1).join(".");
      else url = url.join(".");
      rawr[i] = "*://*."+url+"/*";
   }
   console.log(rawr);
   chrome.webRequest.onBeforeRequest.addListener(blockRequest, {urls: rawr }, ['blocking']);
   if (rawr.includes(link) == true && (changeInfo.status == "complete" && tab.status == "complete" && tab.url != undefined)) alert("You are currently in a Pomodoro Session!\nPlease focus.");
})


function updateArray(arr) {
  badLinks = arr.split(", ");
}

function blockRequest(details) {
   return {cancel: true};
}
