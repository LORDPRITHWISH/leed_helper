// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "addSummary") {
        injectSummaryColumn(message.summary);
        sendResponse({ status: "Column added!" });
    }
});

// Function to inject the summary column
function injectSummaryColumn(summary) {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.right = '0';
    container.style.width = '300px';
    container.style.height = '100%';
    container.style.overflow = 'auto';
    container.style.backgroundColor = '#f1f1f1';
    container.style.boxShadow = '-3px 0 5px rgba(0, 0, 0, 0.2)';
    container.style.padding = '10px';
    container.style.zIndex = '9999';
    container.innerHTML = `
    <h3>Page Summary</h3>
    <p>${summary}</p>
  `;

    // Prevent duplicates by removing any existing column
    const existingColumn = document.getElementById('page-summary-column');
    if (existingColumn) {
        existingColumn.remove();
    }

    container.id = 'page-summary-column';
    document.body.appendChild(container);
}
