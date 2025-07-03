@echo off
echo 🚀 Setting up Trading App Development Environment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    exit /b 1
)

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
call npm install

REM Install additional production dependencies if not present
echo 📦 Installing additional dependencies...
call npm install axios recharts @tanstack/react-query socket.io-client date-fns

REM Check if backend directory exists
if not exist "backend" (
    echo ❌ Error: backend directory not found
    exit /b 1
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo 🔧 Creating .env file...
    (
        echo # Frontend Environment Variables
        echo VITE_API_BASE_URL=http://localhost/Homygo/Homygo/Trading-APp/backend/api
        echo VITE_APP_NAME=AI Trading Signals
        echo VITE_APP_VERSION=1.0.0
        echo.
        echo # API Keys ^(Replace with your own^)
        echo VITE_ALPHA_VANTAGE_API_KEY=your_api_key_here
        echo VITE_BINANCE_API_KEY=your_api_key_here
        echo VITE_BINANCE_SECRET_KEY=your_secret_key_here
        echo.
        echo # WebSocket Configuration
        echo VITE_WS_URL=ws://localhost:8080
    ) > .env
)

REM Build the application
echo 🏗️ Building the application...
call npm run build

echo ✅ Development environment setup complete!
echo.
echo 🚀 To start the development server:
echo    npm run dev
echo.
echo 🌐 To start the backend ^(if using XAMPP^):
echo    Start XAMPP and ensure Apache is running
echo    Access: http://localhost/Homygo/Homygo/Trading-APp/
echo.
echo 📊 Features available:
echo    ✅ Real-time market data simulation
echo    ✅ AI trading signal generation
echo    ✅ Interactive charts with multiple timeframes
echo    ✅ Portfolio management
echo    ✅ Strategy builder with backtesting
echo    ✅ AI assistant with voice recognition
echo    ✅ Risk management tools
echo    ✅ Mobile-responsive design
echo.
echo 🔧 Configuration:
echo    - Update API keys in .env files
echo    - Customize market data sources in src/services/api.js
echo    - Modify trading parameters in src/contexts/TradingContext.jsx

pause
