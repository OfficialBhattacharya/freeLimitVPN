# FreeLimitVPN

A free VPN service with limited bandwidth (500MB/day) and server rotation capabilities.

## Architecture Overview

```
+------------------+     +------------------+     +------------------+
|   Web Interface  |     |  Browser Ext.    |     |  VPN Manager     |
|   (Flask)        |<--->|  (Chrome/Firefox)|<--->|  (Python)        |
+------------------+     +------------------+     +------------------+
        ^                        ^                        ^
        |                        |                        |
        v                        v                        v
+------------------+     +------------------+     +------------------+
|   User           |     |  Browser         |     |  OpenVPN/        |
|   Dashboard      |     |  Traffic         |     |  WireGuard       |
+------------------+     +------------------+     +------------------+
```

## Features

- Free VPN service with 500MB daily bandwidth limit
- Server rotation with cooldown periods
- Web interface for connection management
- Browser extension for quick access
- Bandwidth monitoring
- Connection status tracking

## Prerequisites

- Python 3.8+
- OpenVPN or WireGuard installed
- Chrome or Firefox browser
- pip (Python package manager)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/FreeLimitVPN.git
cd FreeLimitVPN
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Install OpenVPN or WireGuard:
   - For Windows: Download from official websites
   - For Linux: `sudo apt-get install openvpn` or `sudo apt-get install wireguard`

4. Install the browser extension:
   - Open Chrome/Edge: chrome://extensions/
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `extension` directory

## Configuration

1. Create a `servers.json` file in the root directory:
```json
{
    "free_servers": [
        {
            "name": "US-East",
            "host": "vpn.example.com",
            "port": 1194
        },
        {
            "name": "EU-West",
            "host": "vpn2.example.com",
            "port": 1194
        }
    ]
}
```

2. Configure your VPN credentials in a `.env` file:
```
VPN_USERNAME=your_username
VPN_PASSWORD=your_password
```

## Usage

1. Start the VPN manager:
```bash
python vpn_manager.py
```

2. Access the web interface at `http://localhost:5000`

3. Use the browser extension:
   - Click the extension icon
   - Click "Connect" to start VPN
   - Monitor bandwidth usage
   - Click "Disconnect" to stop VPN

## Security Considerations

⚠️ **Important Security Notice:**
- This is a free VPN service with limited security guarantees
- Bandwidth is limited to 500MB per day
- No logging is implemented, but use at your own risk
- For sensitive activities, consider using a paid VPN service

## Limitations

- 500MB daily bandwidth limit
- Server switching cooldown period
- Basic security features only
- No guaranteed uptime
- Limited server locations

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository.