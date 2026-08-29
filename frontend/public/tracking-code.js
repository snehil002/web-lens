console.log("You are being tracked! For analytics! No private data!");

const backendUrl = "https://web-lens-backend.onrender.com";
// const backendUrl = "http://localhost:3030";
let canSendData;
let myTimeout;

if (!sessionStorage.getItem("session_id")) {
  sessionStorage.setItem("session_id", crypto.randomUUID());
}

/* create initial user data */
const userData = {
  "webId": "SUB001",
  "origin": location.origin,
  "sourceUrl": document.referrer || "Direct",
  "deviceWidth": screen.width,
  "sessionId": sessionStorage.getItem("session_id"),
  "currUrl": location.href,
  "prevUrl": document.referrer || "Direct",
  "initialTime": 0,
  "finalTime": 0,
  "timeDelta": 0,
};


const resetInitialTime = () => {
  canSendData = false;
  userData["initialTime"] = Date.now();
  
  clearTimeout(myTimeout);
  myTimeout = setTimeout(() => {
    canSendData = true;
  }, 10000);
};


const resetPrevNCurrUrl = () => {
  if (userData["currUrl"] !== location.href) {
    userData["prevUrl"] = userData["currUrl"];
    userData["currUrl"] = location.href;
  }
};


/* Send Data to Analytics Server */
const sendData = async () => {
  const URL = `${backendUrl}/save-session-data`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData),
    keepalive: true
  }

  try {
    const response = await fetch(URL, options);
    const result = await response.json();
    console.log(result);
  }
  catch(err) {
    console.error(err);
  }
};


const sendExitData = () => {
  if (canSendData) {
    userData["finalTime"] = Date.now();
    userData["timeDelta"] = (userData["finalTime"] - userData["initialTime"]) / 1000;
    sendData();
  }
};


/* Capture Page Hide Or Show Event */
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    sendExitData();
  }
  else if (document.visibilityState === "visible") {
    resetInitialTime();
  }
});


/* Monkey-patch pushState & replaceState to capture SPA navigations */
const patchHistory = function (type) {
  const orig = history[type];
  
  return function () {
    const result = orig.apply(this, arguments);
    
    sendExitData();
    resetInitialTime();
    resetPrevNCurrUrl();
    
    return result;
  };
};

history.pushState = patchHistory('pushState');
history.replaceState = patchHistory('replaceState');


resetInitialTime();
