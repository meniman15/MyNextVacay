#!/bin/bash

echo "🚀 Starting My Next Vacay production server..."

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ Build directory not found. Running build first..."
    ./scripts/build.sh
fi

# Start the server
echo "🌟 Server starting on port ${PORT:-3001}..."
npm start