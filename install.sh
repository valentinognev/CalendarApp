#!/bin/bash

# Calendar App - Raspberry Pi Installation Script
# This script installs Node.js and all necessary dependencies for the Calendar App.

# Exit on error
set -e

echo "------------------------------------------------"
echo "  Calendar App Installer for Raspberry Pi"
echo "------------------------------------------------"

# 1. Update System
echo "[1/4] Updating system packages..."
sudo apt update
sudo apt upgrade -y

# 2. Install Node.js (NodeSource)
# We use Node 20 LTS
if ! command -v node &> /dev/null; then
    echo "[2/4] Installing Node.js (Node 20 LTS)..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo "[2/4] Node.js is already installed ($(node -v))."
fi

# 3. Install System Dependencies
echo "[3/4] Installing system dependencies (git, build-essential)..."
sudo apt install -y git build-essential curl

# 4. Install Project Dependencies
echo "[4/4] Installing project dependencies..."
if [ -f "package.json" ]; then
    npm install
else
    echo "Warning: package.json not found in current directory. Please run this script from the project root."
    exit 1
fi

# 5. Final Setup
echo "------------------------------------------------"
echo "Setting permissions..."
chmod +x start.sh

echo "Installation complete!"
echo "To start the application, run: ./start.sh"
echo "------------------------------------------------"
