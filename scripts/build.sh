#!/bin/bash
echo "🏗️  Building My Next Vacay..."

echo "📦 Installing dependencies..."
npm ci

echo "🎨 Building frontend..."
npm run build:frontend

echo "🖥️  Building backend..."
npm run build:backend

echo "✅ Build complete!"
echo "🚀 Run 'npm start' to start the production server"