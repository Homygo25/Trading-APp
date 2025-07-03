#!/bin/bash

# Development Setup Script for Trading App
echo "🚀 Setting up Trading App Development Environment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install additional production dependencies if not present
echo "📦 Installing additional dependencies..."
npm install axios recharts @tanstack/react-query socket.io-client date-fns

# Check if backend directory exists
if [ ! -d "backend" ]; then
    echo "❌ Error: backend directory not found"
    exit 1
fi

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "🔧 Creating .env file..."
    cat > .env << EOL
# Frontend Environment Variables
VITE_API_BASE_URL=http://localhost/Homygo/Homygo/Trading-APp/backend/api
VITE_APP_NAME=AI Trading Signals
VITE_APP_VERSION=1.0.0

# API Keys (Replace with your own)
VITE_ALPHA_VANTAGE_API_KEY=your_api_key_here
VITE_BINANCE_API_KEY=your_api_key_here
VITE_BINANCE_SECRET_KEY=your_secret_key_here

# WebSocket Configuration
VITE_WS_URL=ws://localhost:8080
EOL
fi

# Create backend .env if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "🔧 Creating backend .env file..."
    # The .env file already exists as we created it earlier
    echo "✅ Backend .env file already exists"
fi

# Build the application
echo "🏗️ Building the application..."
npm run build

echo "✅ Development environment setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   npm run dev"
echo ""
echo "🌐 To start the backend (if using XAMPP):"
echo "   Start XAMPP and ensure Apache is running"
echo "   Access: http://localhost/Homygo/Homygo/Trading-APp/"
echo ""
echo "📊 Features available:"
echo "   ✅ Real-time market data simulation"
echo "   ✅ AI trading signal generation"
echo "   ✅ Interactive charts with multiple timeframes"
echo "   ✅ Portfolio management"
echo "   ✅ Strategy builder with backtesting"
echo "   ✅ AI assistant with voice recognition"
echo "   ✅ Risk management tools"
echo "   ✅ Mobile-responsive design"
echo ""
echo "🔧 Configuration:"
echo "   - Update API keys in .env files"
echo "   - Customize market data sources in src/services/api.js"
echo "   - Modify trading parameters in src/contexts/TradingContext.jsx"
