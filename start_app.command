#!/bin/bash
# DocOPD One-Click macOS Launcher
# Double-click this file in Finder to launch the app!

cd "$(dirname "$0")" || exit 1

echo "============================================================"
echo "🩺 Starting DocOPD Doctor OPD & Prescription App..."
echo "============================================================"
echo ""

LOCAL_IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "127.0.0.1")

echo "💻 Opening app in your default browser..."
open "http://localhost:8085" &

echo ""
echo "📱 TO OPEN ON YOUR ANDROID PHONE (Same Wi-Fi):"
echo "👉 http://${LOCAL_IP}:8085"
echo ""
echo "Press Ctrl+C to stop the server."
echo "============================================================"

python3 server.py
