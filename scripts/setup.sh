#!/bin/bash

echo "🎯 TaskFlow AI - Setup Script"
echo "=============================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✓ .env.local file found"
else
    echo "⚠️  .env.local file not found"
    echo "Creating from .env.example..."
    cp .env.example .env.local
    echo "✓ Created .env.local - Please update with your actual credentials"
fi

echo ""
echo "Installing dependencies..."
npm install

echo ""
echo "Installing Firebase CLI globally (requires sudo)..."
npm install -g firebase-tools

echo ""
echo "Installing function dependencies..."
cd functions
npm install
cd ..

echo ""
echo "=============================="
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your Firebase and OpenAI credentials"
echo "2. Run 'firebase login' to authenticate"
echo "3. Run 'firebase init' to initialize Firebase"
echo "4. Run 'npm run dev' to start the development server"
echo ""
echo "For detailed setup instructions, see SETUP_GUIDE.md"
echo ""

