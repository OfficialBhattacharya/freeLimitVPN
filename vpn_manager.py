import subprocess
import psutil
import time
import json
import os
from datetime import datetime, timedelta
from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO

class VPNManager:
    def __init__(self):
        self.current_server = None
        self.connection_status = False
        self.bandwidth_limit = 500 * 1024 * 1024  # 500MB in bytes
        self.daily_usage = 0
        self.last_connection_time = None
        self.server_cooldown = 300  # 5 minutes cooldown
        self.servers = self._load_servers()
        
    def _load_servers(self):
        """Load available VPN servers from configuration"""
        try:
            with open('servers.json', 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return {
                "free_servers": [
                    {"name": "US-East", "host": "vpn.example.com", "port": 1194},
                    {"name": "EU-West", "host": "vpn2.example.com", "port": 1194}
                ]
            }

    def connect(self, server_name):
        """Connect to specified VPN server"""
        if self.connection_status:
            return {"status": "error", "message": "Already connected"}

        if self._check_cooldown():
            return {"status": "error", "message": "Server switching cooldown active"}

        server = next((s for s in self.servers["free_servers"] if s["name"] == server_name), None)
        if not server:
            return {"status": "error", "message": "Server not found"}

        try:
            # This is a placeholder for actual VPN connection logic
            # In production, this would use python-wireguard or OpenVPN
            subprocess.run(["wg-quick", "up", f"wg0"], check=True)
            self.current_server = server
            self.connection_status = True
            self.last_connection_time = datetime.now()
            return {"status": "success", "message": f"Connected to {server_name}"}
        except subprocess.CalledProcessError as e:
            return {"status": "error", "message": f"Connection failed: {str(e)}"}

    def disconnect(self):
        """Disconnect from current VPN server"""
        if not self.connection_status:
            return {"status": "error", "message": "Not connected"}

        try:
            subprocess.run(["wg-quick", "down", "wg0"], check=True)
            self.connection_status = False
            return {"status": "success", "message": "Disconnected"}
        except subprocess.CalledProcessError as e:
            return {"status": "error", "message": f"Disconnection failed: {str(e)}"}

    def get_bandwidth_usage(self):
        """Get current bandwidth usage"""
        return {
            "daily_usage": self.daily_usage,
            "limit": self.bandwidth_limit,
            "remaining": self.bandwidth_limit - self.daily_usage
        }

    def _check_cooldown(self):
        """Check if server switching cooldown is active"""
        if not self.last_connection_time:
            return False
        return (datetime.now() - self.last_connection_time).total_seconds() < self.server_cooldown

    def get_status(self):
        """Get current VPN status"""
        return {
            "connected": self.connection_status,
            "current_server": self.current_server,
            "bandwidth": self.get_bandwidth_usage(),
            "cooldown_active": self._check_cooldown()
        }

# Flask application setup
app = Flask(__name__)
socketio = SocketIO(app)
vpn_manager = VPNManager()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/status')
def status():
    return jsonify(vpn_manager.get_status())

@app.route('/api/connect/<server_name>')
def connect(server_name):
    return jsonify(vpn_manager.connect(server_name))

@app.route('/api/disconnect')
def disconnect():
    return jsonify(vpn_manager.disconnect())

if __name__ == '__main__':
    socketio.run(app, debug=True) 