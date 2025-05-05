document.addEventListener('DOMContentLoaded', () => {
    const statusDiv = document.getElementById('status');
    const serverInfoDiv = document.getElementById('server-info');
    const connectBtn = document.getElementById('connect');
    const disconnectBtn = document.getElementById('disconnect');
    const bandwidthDiv = document.getElementById('bandwidth');

    // Update UI based on connection status
    function updateUI(status) {
        if (status.isConnected) {
            statusDiv.textContent = 'Connected';
            statusDiv.className = 'status connected';
            connectBtn.disabled = true;
            disconnectBtn.disabled = false;
            serverInfoDiv.textContent = `Connected to: ${status.currentServer.name}`;
        } else {
            statusDiv.textContent = 'Disconnected';
            statusDiv.className = 'status disconnected';
            connectBtn.disabled = false;
            disconnectBtn.disabled = true;
            serverInfoDiv.textContent = '';
        }
    }

    // Update bandwidth display
    function updateBandwidth(usage) {
        const mb = (usage / (1024 * 1024)).toFixed(2);
        bandwidthDiv.textContent = `${mb} MB / 500 MB`;
    }

    // Get initial status
    chrome.runtime.sendMessage({ action: "getStatus" }, (response) => {
        updateUI(response);
    });

    // Connect button handler
    connectBtn.addEventListener('click', () => {
        // In a real implementation, you would show a server selection UI
        const defaultServer = { name: "US-East", host: "vpn.example.com", port: 1194 };
        chrome.runtime.sendMessage({ action: "connect", server: defaultServer });
    });

    // Disconnect button handler
    disconnectBtn.addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: "disconnect" });
    });

    // Listen for status updates
    chrome.runtime.onMessage.addListener((message) => {
        if (message.type === "statusUpdate") {
            updateUI(message);
        } else if (message.type === "bandwidthUpdate") {
            updateBandwidth(message.size);
        }
    });
}); 