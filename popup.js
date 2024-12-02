// document.getElementById('support').onclick = () => {
//     chrome.runtime.sendMessage({ propagator: "permit" });
//     console.log('Support button clicked');
// }



document.getElementById('support').onclick = async () => {

    const tabs = await chrome.tabs.query({
        active: true,
    });
    if (tabs.length === 0) return;
    console.log(tabs);
    chrome.tabs.sendMessage(tabs[0].id, { propagator: "permit" });
};
