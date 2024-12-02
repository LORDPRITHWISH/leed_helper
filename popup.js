document.getElementById('helpButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
            const currentTabUrl = tabs[0].url;
            console.log('Current Tab URL:', currentTabUrl);
            let guidance = {name: "help"};
            // Example: Sending the URL to an API
            fetch('https://your-api-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: currentTabUrl })
            }).then(response => response.json())
                .then(data => {
                    console.log('API Response:', data);
                    crome.tabs.sendMessage(tabs[0].id, { action: 'addSummary', summary: data.summary }, response => {
                        console.log('Response from the content script:', guidance);
                    });
                })
                .catch(error => console.error('Error:', error));
        } else {
            console.error('No active tab found.');
        }
    });
});
