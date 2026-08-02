console.log("You are being tracked! For analytics! No private data!");

let canSendData;
let myTimeout;

/* create initial user data */
const userData = {
  "webId": "SUB001",
  "currOrigin": location.origin,
  "currUrl": location.href,
  "initialTime": 0,
  "finalTime": 0,
  "timeDelta": 0,
  "sourceUrl": document.referrer || "Direct",
  "deviceWidth": screen.width
};


const resetInitialTime = () => {
  canSendData = false;
  userData["initialTime"] = Date.now();
  
  clearTimeout(myTimeout);
  myTimeout = setTimeout(() => {
    canSendData = true;
  }, 10000);
};


const resetSrcNCurrUrl = (prevUrl, currUrl) => {
  if (userData["currUrl"] !== location.href) {
    userData["sourceUrl"] = userData["currUrl"];
    userData["currUrl"] = location.href;
  }
  userData["currOrigin"] = location.origin;
};


/* Send Data to Analytics Server */
const sendData = async () => {
  const host = "MY_SERVER_API_HERE";
  const URL = host + `/save-session-data`;

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
    const finalTime = Date.now();
    const initialTime = userData["initialTime"];

    userData["timeDelta"] = (finalTime - initialTime) / 1000;
    userData["finalTime"] = finalTime;

    sendData();
    // console.log(JSON.stringify(userData));
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
    resetSrcNCurrUrl();
    
    return result;
  };
};

history.pushState = patchHistory('pushState');
history.replaceState = patchHistory('replaceState');


resetInitialTime();
