@echo off
echo 🎯 TaskFlow AI - Setup Script
echo ==============================
echo.

REM Check if .env.local exists
if exist .env.local (
    echo ✓ .env.local file found
) else (
    echo ⚠️  .env.local file not found
    echo Creating from .env.example...
    copy .env.example .env.local
    echo ✓ Created .env.local - Please update with your actual credentials
)

echo.
echo Installing dependencies...
call npm install

echo.
echo Installing Firebase CLI globally...
call npm install -g firebase-tools

echo.
echo Installing function dependencies...
cd functions
call npm install
cd ..

echo.
echo ==============================
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Update .env.local with your Firebase and OpenAI credentials
echo 2. Run 'firebase login' to authenticate
echo 3. Run 'firebase init' to initialize Firebase
echo 4. Run 'npm run dev' to start the development server
echo.
echo For detailed setup instructions, see SETUP_GUIDE.md
echo.
pause

