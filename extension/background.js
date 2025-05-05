let isConnected = false;
let currentServer = null;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "connect") {
        connectToVPN(request.server);
    } else if (request.action === "disconnect") {
        disconnectVPN();
    } else if (request.action === "getStatus") {
        sendResponse({ isConnected, currentServer });
    }
    return true;
});

// Connect to VPN
async function connectToVPN(server) {
    try {
        const response = await fetch(`http://localhost:5000/api/connect/${server.name}`);
        const data = await response.json();
        
        if (data.status === "success") {
            isConnected = true;
            currentServer = server;
            updateProxySettings(server);
            chrome.runtime.sendMessage({ type: "statusUpdate", isConnected, currentServer });
        }
    } catch (error) {
        console.error("Connection error:", error);
    }
}

// Disconnect from VPN
async function disconnectVPN() {
    try {
        const response = await fetch('http://localhost:5000/api/disconnect');
        const data = await response.json();
        
        if (data.status === "success") {
            isConnected = false;
            currentServer = null;
            resetProxySettings();
            chrome.runtime.sendMessage({ type: "statusUpdate", isConnected, currentServer });
        }
    } catch (error) {
        console.error("Disconnection error:", error);
    }
}

// Update proxy settings
function updateProxySettings(server) {
    const config = {
        mode: "fixed_servers",
        rules: {
            singleProxy: {
                scheme: "socks5",
                host: "localhost",
                port: 1080
            }
        }
    };
    
    chrome.proxy.settings.set({ value: config, scope: "regular" });
}

// Reset proxy settings
function resetProxySettings() {
    chrome.proxy.settings.set({ value: { mode: "direct" }, scope: "regular" });
}

// Monitor bandwidth usage
chrome.webRequest.onCompleted.addListener(
    (details) => {
        if (isConnected) {
            // Update bandwidth usage
            chrome.runtime.sendMessage({ type: "bandwidthUpdate", size: details.responseSize });
        }
    },
    { urls: ["<all_urls>"] }
); 