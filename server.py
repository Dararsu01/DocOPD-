#!/usr/bin/env python3
"""
DocOPD Development Server
Serves the mobile web app with CORS, JSON API endpoints, and mobile network accessibility.
"""

import http.server
import socketserver
import os
import sys
import json

PORT = 8085
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class DocOPDHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable CORS and caching headers for mobile testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def run_server():
    os.chdir(DIRECTORY)
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), DocOPDHandler) as httpd:
        print(f"============================================================")
        print(f"🏥 DocOPD Doctor OPD App Server Running!")
        print(f"📱 Local Access:   http://localhost:{PORT}")
        print(f"📂 Root Directory: {DIRECTORY}")
        print(f"============================================================")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

if __name__ == '__main__':
    run_server()
