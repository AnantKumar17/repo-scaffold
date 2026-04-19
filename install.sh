#!/bin/bash

# RepoScaffold Installer Script
# One-command installation for the RepoScaffold plugin

set -e

echo " RepoScaffold Installer"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[FAIL] Error: Node.js is not installed."
    echo "   Please install Node.js 18+ and try again."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "[WARN]  Warning: Node.js version $NODE_VERSION detected."
    echo "   RepoScaffold requires Node.js 18+."
    echo "   Please upgrade Node.js and try again."
    exit 1
fi

# Run the installer
node "$(dirname "$0")/scripts/install.js" "$@"
