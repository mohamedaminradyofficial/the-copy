#!/bin/bash

echo "🔍 Validating Firebase Studio setup for The Copy..."

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js not found"
fi

# Check npm
if command -v npm &> /dev/null; then
    echo "✅ npm: $(npm --version)"
else
    echo "❌ npm not found"
fi

# Check project structure
if [ -d "frontend" ] && [ -d "backend" ]; then
    echo "✅ Project structure valid"
else
    echo "❌ Missing frontend or backend directories"
fi

# Check package.json files
if [ -f "frontend/package.json" ] && [ -f "backend/package.json" ]; then
    echo "✅ Package.json files found"
else
    echo "❌ Missing package.json files"
fi

# Check environment files
if [ -f "frontend/.env" ] && [ -f "backend/.env" ]; then
    echo "✅ Environment files configured"
else
    echo "⚠️  Environment files missing (will be created on first run)"
fi

# Check start script
if [ -f "start-dev.sh" ] && [ -x "start-dev.sh" ]; then
    echo "✅ Development start script ready"
else
    echo "❌ start-dev.sh missing or not executable"
fi

echo ""
echo "🎭 The Copy Firebase Studio setup validation complete!"