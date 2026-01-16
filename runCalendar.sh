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
# Also check if the correct architecture bindings are present
ARCH=$(uname -m)
ROLLUP_BINDING_PATH=""
ESBUILD_BINDING_PATH=""

if [ "$ARCH" = "x86_64" ]; then
    ROLLUP_BINDING_PATH="node_modules/@rollup/rollup-linux-x64-gnu"
    ESBUILD_BINDING_PATH="node_modules/@esbuild/linux-x64"
elif [ "$ARCH" = "aarch64" ]; then
    ROLLUP_BINDING_PATH="node_modules/@rollup/rollup-linux-arm64-gnu"
    ESBUILD_BINDING_PATH="node_modules/@esbuild/linux-arm64"
fi

# Basic check for node_modules and vite
if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/vite" ]; then
    MISSING_DEPS=true
else
    MISSING_DEPS=false
fi

# Check for rollup and esbuild bindings if path is known
if [ "$MISSING_DEPS" = "false" ]; then
    if [ -n "$ROLLUP_BINDING_PATH" ] && [ ! -d "$ROLLUP_BINDING_PATH" ]; then
        echo "Detected architecture mismatch: Missing rollup binding for $ARCH at $ROLLUP_BINDING_PATH"
        MISSING_DEPS=true
    elif [ -n "$ESBUILD_BINDING_PATH" ] && [ ! -d "$ESBUILD_BINDING_PATH" ]; then
        echo "Detected architecture mismatch: Missing esbuild binding for $ARCH at $ESBUILD_BINDING_PATH"
        MISSING_DEPS=true
    fi
fi

if [ "$MISSING_DEPS" = "true" ]; then
    echo "Dependencies not found, incomplete, or architecture mismatch detected. Installing..."
    # Remove existing modules to ensure clean install for new architecture
    rm -rf node_modules package-lock.json
    npm install
    if [ $? -ne 0 ]; then
        echo "Failed to install dependencies. Please check your internet connection or package.json."
        exit 1
    fi
fi

# Run the app
echo "Running application..."
npm run dev
