chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        console.log('Page loaded:');
        console.log('Title:', tab.title);
        console.log('URL:', tab.url);
    }
});


chrome.tabs.onCreated.addListener(function (tab) {
    chrome.storage.local.set({ capture: true });
});

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    console.log('Current tab URL:', activeTab.url);
});

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.propagator) {
        console.log('Support button clicked');
        sendResponse({ farewell: "Goodbye from background script!" });
    }
})