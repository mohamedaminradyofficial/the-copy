#!/bin/bash
# Production Deployment Checklist

echo "🔍 Production Readiness Checklist for The Copy"
echo "=============================================="

# Check Frontend Environment
echo "📱 Frontend Environment Check:"
if [ -f "frontend/.env.local" ]; then
    echo "✅ .env.local exists"
    
    if grep -q "GEMINI_API_KEY_PROD=" frontend/.env.local; then
        echo "✅ Gemini API Key configured"
    else
        echo "❌ GEMINI_API_KEY_PROD missing"
    fi
    
    if grep -q "NODE_ENV=production" frontend/.env.local; then
        echo "✅ Production environment set"
    else
        echo "⚠️  NODE_ENV not set to production"
    fi
else
    echo "❌ frontend/.env.local missing"
fi

# Check Backend Environment
echo ""
echo "🖥️  Backend Environment Check:"
if [ -f "backend/.env" ]; then
    echo "✅ .env exists"
    
    if grep -q "JWT_SECRET=" backend/.env; then
        echo "✅ JWT Secret configured"
    else
        echo "❌ JWT_SECRET missing"
    fi
    
    if grep -q "DATABASE_URL=" backend/.env; then
        echo "✅ Database URL configured"
    else
        echo "❌ DATABASE_URL missing"
    fi
    
    if grep -q "GOOGLE_GENAI_API_KEY=" backend/.env; then
        echo "✅ Gemini API Key configured"
    else
        echo "❌ GOOGLE_GENAI_API_KEY missing"
    fi
else
    echo "❌ backend/.env missing"
fi

echo ""
echo "🚀 Next Steps:"
echo "1. Set all missing environment variables"
echo "2. Test with: pnpm build (frontend) and pnpm start (backend)"
echo "3. Run security audit: pnpm audit"
echo "4. Deploy to staging first"