/**
 * Created by nayan on 6/24/15.
 */


// Check whether new version is installed

chrome.runtime.onInstalled.addListener(function (d,x,z) {
    console.log(d);
});


chrome.browserAction.setBadgeText({text: "1"});
chrome.browserAction.setBadgeBackgroundColor({color: [255, 255, 0, 255]}); // RGBA array
chrome.browserAction.setBadgeBackgroundColor({color: "#FFFF00"}); // CSS value


chrome.webRequest.onBeforeRequest.addListener(
    function() {
        return {cancel: true};
    },
    {
        urls: ["*://*.googlesyndication.com/*"]
    },
    ["blocking"]
);