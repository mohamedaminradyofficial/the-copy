#!/bin/bash

echo "🎭 Setting up The Copy - Arabic Drama Analysis Platform"

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
REQUIRED_VERSION="20.11.0"

if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]; then
    echo "❌ Node.js version $NODE_VERSION is below required $REQUIRED_VERSION"
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION"

# Setup backend environment
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating backend .env file..."
    cat > backend/.env << EOF
# Google AI Configuration
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:9002
EOF
    echo "✅ Backend .env created"
else
    echo "✅ Backend .env already exists"
fi

# Setup frontend environment
if [ ! -f "frontend/.env" ]; then
    echo "📝 Creating frontend .env file..."
    cat > frontend/.env << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Firebase Configuration (optional)
# NEXT_PUBLIC_FIREBASE_API_KEY=
# NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
# NEXT_PUBLIC_FIREBASE_PROJECT_ID=

# Sentry Configuration (optional)
# SENTRY_ORG=
# SENTRY_PROJECT=
EOF
    echo "✅ Frontend .env created"
else
    echo "✅ Frontend .env already exists"
fi

echo "🚀 Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Add your Google AI API key to backend/.env"
echo "2. Run ./start-dev.sh to start development servers"
echo "3. Frontend: http://localhost:9002"
echo "4. Backend: http://localhost:3001"