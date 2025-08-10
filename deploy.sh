#!/bin/bash

# MetAI Deployment Script for Vercel
echo "🚀 MetAI Deployment Helper Script"
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install terser if not present
echo "🔧 Installing terser for optimization..."
npm install terser --save-dev

# Test build
echo "🏗️ Testing build process..."
if npm run build; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Please fix errors before deploying."
    exit 1
fi

# Test preview
echo "🔍 Testing preview..."
npm run preview &
PREVIEW_PID=$!
sleep 3
kill $PREVIEW_PID 2>/dev/null || true
echo "✅ Preview test completed"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found. Creating from template..."
    cp .env.example .env
    echo "📝 Please edit .env file with your API keys before deploying"
fi

# Git status check
if command -v git &> /dev/null; then
    if [ -d ".git" ]; then
        echo "📊 Git repository status:"
        git status --porcelain
        if [ -n "$(git status --porcelain)" ]; then
            echo "📝 You have uncommitted changes. Consider committing them:"
            echo "   git add ."
            echo "   git commit -m 'Ready for deployment'"
            echo "   git push origin main"
        else
            echo "✅ Git repository is clean"
        fi
    else
        echo "⚠️  Not a git repository. Initialize with:"
        echo "   git init"
        echo "   git add ."
        echo "   git commit -m 'Initial commit'"
        echo "   git remote add origin https://github.com/YOUR_USERNAME/metai-crypto-app.git"
        echo "   git push -u origin main"
    fi
else
    echo "⚠️  Git not found. Please install Git for version control."
fi

echo ""
echo "🎉 Pre-deployment checks complete!"
echo "=================================="
echo ""
echo "📋 Next Steps:"
echo "1. ✅ Push code to GitHub (if not done)"
echo "2. ✅ Visit https://vercel.com and sign in"
echo "3. ✅ Click 'New Project' and import your repo"
echo "4. ✅ Set environment variables in Vercel:"
echo "   VITE_GEMINI_API_KEY=your_api_key"
echo "   VITE_COINGECKO_API_KEY=your_coingecko_key"
echo "5. ✅ Click Deploy!"
echo ""
echo "📚 Full guide available in: VERCEL_DEPLOYMENT_GUIDE.md"
echo "🌟 Happy deploying!"