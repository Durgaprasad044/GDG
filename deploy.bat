@echo off
title MetAI Deployment Helper

echo.
echo 🚀 MetAI Deployment Helper Script
echo ==================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm
    pause
    exit /b 1
)

echo ✅ Node.js and npm are installed
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Install terser
echo 🔧 Installing terser for optimization...
call npm install terser --save-dev

REM Test build
echo 🏗️ Testing build process...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed! Please fix errors before deploying.
    pause
    exit /b 1
) else (
    echo ✅ Build successful!
)

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  No .env file found. Creating from template...
    copy .env.example .env
    echo 📝 Please edit .env file with your API keys before deploying
)

REM Check git
where git >nul 2>nul
if %errorlevel% equ 0 (
    if exist ".git" (
        echo 📊 Git repository detected
        git status --porcelain > temp_status.txt
        for %%A in (temp_status.txt) do if %%~zA gtr 0 (
            echo 📝 You have uncommitted changes. Consider committing them:
            echo    git add .
            echo    git commit -m "Ready for deployment"
            echo    git push origin main
        ) else (
            echo ✅ Git repository is clean
        )
        del temp_status.txt
    ) else (
        echo ⚠️  Not a git repository. Initialize with:
        echo    git init
        echo    git add .
        echo    git commit -m "Initial commit"
        echo    git remote add origin https://github.com/YOUR_USERNAME/metai-crypto-app.git
        echo    git push -u origin main
    )
) else (
    echo ⚠️  Git not found. Please install Git for version control.
)

echo.
echo 🎉 Pre-deployment checks complete!
echo ==================================
echo.
echo 📋 Next Steps:
echo 1. ✅ Push code to GitHub ^(if not done^)
echo 2. ✅ Visit https://vercel.com and sign in
echo 3. ✅ Click 'New Project' and import your repo
echo 4. ✅ Set environment variables in Vercel:
echo    VITE_GEMINI_API_KEY=your_api_key
echo    VITE_COINGECKO_API_KEY=your_coingecko_key
echo 5. ✅ Click Deploy!
echo.
echo 📚 Full guide available in: VERCEL_DEPLOYMENT_GUIDE.md
echo 🌟 Happy deploying!
echo.

pause