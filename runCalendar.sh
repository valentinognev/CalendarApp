#!/bin/bash
echo "Starting Calendar App..."

# Function to check for required commands
check_command() {
    if ! command -v "$1" &> /dev/null; then
        echo "Error: $1 could not be found. Please install it."
        exit 1
    fi
}

check_command node
check_command npm

# Check if node_modules exists, if not, install dependencies
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/vite" ]; then
    echo "Dependencies not found or incomplete. Installing..."
    npm install
    if [ $? -ne 0 ]; then
        echo "Failed to install dependencies. Please check your internet connection or package.json."
        exit 1
    fi
fi

# Run the app
echo "Running application..."
npm run dev
