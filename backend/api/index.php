<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Market data API
class MarketDataController 
{
    public function getMarketData()
    {
        $marketData = [
            'BTC/USDT' => [
                'price' => 43250.50 + (rand(-1000, 1000) / 100),
                'change' => rand(-500, 500) / 100,
                'volume' => '1.2B',
                'high_24h' => 44500.00,
                'low_24h' => 42800.00,
            ],
            'ETH/USDT' => [
                'price' => 2650.75 + (rand(-100, 100) / 10),
                'change' => rand(-300, 300) / 100,
                'volume' => '850M',
                'high_24h' => 2720.00,
                'low_24h' => 2580.00,
            ],
            'EUR/USD' => [
                'price' => 1.0875 + (rand(-50, 50) / 10000),
                'change' => rand(-20, 20) / 100,
                'volume' => '2.1B',
                'high_24h' => 1.0890,
                'low_24h' => 1.0860,
            ],
            'GBP/USD' => [
                'price' => 1.2650 + (rand(-30, 30) / 10000),
                'change' => rand(-15, 15) / 100,
                'volume' => '1.8B',
                'high_24h' => 1.2680,
                'low_24h' => 1.2620,
            ],
            'AAPL' => [
                'price' => 185.25 + (rand(-500, 500) / 100),
                'change' => rand(-300, 300) / 100,
                'volume' => '45M',
                'high_24h' => 188.50,
                'low_24h' => 182.00,
            ],
            'TSLA' => [
                'price' => 248.50 + (rand(-800, 800) / 100),
                'change' => rand(-400, 400) / 100,
                'volume' => '38M',
                'high_24h' => 255.00,
                'low_24h' => 240.00,
            ],
        ];

        echo json_encode([
            'success' => true,
            'data' => $marketData,
            'timestamp' => time(),
        ]);
    }

    public function getChartData($asset, $timeframe = '1H')
    {
        $data = [];
        $basePrice = $this->getBasePrice($asset);
        
        for ($i = 0; $i < 50; $i++) {
            $timestamp = time() - (50 - $i) * 3600; // 1 hour intervals
            $change = (rand(-100, 100) / 1000) * $basePrice;
            $open = $basePrice + $change;
            $close = $open + (rand(-50, 50) / 1000) * $basePrice;
            $high = max($open, $close) + (rand(0, 20) / 1000) * $basePrice;
            $low = min($open, $close) - (rand(0, 20) / 1000) * $basePrice;
            
            $data[] = [
                'timestamp' => $timestamp,
                'open' => round($open, 2),
                'high' => round($high, 2),
                'low' => round($low, 2),
                'close' => round($close, 2),
                'volume' => rand(100000, 1000000),
            ];
            
            $basePrice = $close;
        }

        echo json_encode([
            'success' => true,
            'data' => $data,
            'asset' => $asset,
            'timeframe' => $timeframe,
        ]);
    }

    private function getBasePrice($asset)
    {
        $prices = [
            'BTC/USDT' => 43250,
            'ETH/USDT' => 2650,
            'EUR/USD' => 1.0875,
            'GBP/USD' => 1.2650,
            'AAPL' => 185.25,
            'TSLA' => 248.50,
        ];

        return $prices[$asset] ?? 100;
    }
}

// Signal API
class SignalController
{
    public function index()
    {
        $signals = [
            [
                'id' => 1,
                'asset' => 'BTC/USDT',
                'type' => 'BUY',
                'confidence' => 85,
                'entry' => 43200.50,
                'target' => 45000.00,
                'stop_loss' => 42000.00,
                'pattern' => 'Bullish Engulfing',
                'timeframe' => '4H',
                'risk' => 'Medium',
                'status' => 'active',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 2,
                'asset' => 'EUR/USD',
                'type' => 'SELL',
                'confidence' => 78,
                'entry' => 1.0880,
                'target' => 1.0820,
                'stop_loss' => 1.0920,
                'pattern' => 'Head & Shoulders',
                'timeframe' => '1H',
                'risk' => 'Low',
                'status' => 'active',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'id' => 3,
                'asset' => 'AAPL',
                'type' => 'BUY',
                'confidence' => 92,
                'entry' => 185.00,
                'target' => 195.00,
                'stop_loss' => 180.00,
                'pattern' => 'Double Bottom',
                'timeframe' => '1D',
                'risk' => 'High',
                'status' => 'active',
                'created_at' => date('Y-m-d H:i:s'),
            ],
        ];

        echo json_encode([
            'success' => true,
            'data' => $signals,
        ]);
    }

    public function store()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $signal = [
            'id' => rand(100, 999),
            'asset' => $input['asset'] ?? 'BTC/USDT',
            'type' => $input['type'] ?? 'BUY',
            'confidence' => rand(70, 95),
            'entry' => floatval($input['entry'] ?? 43000),
            'target' => floatval($input['target'] ?? 45000),
            'stop_loss' => floatval($input['stop_loss'] ?? 42000),
            'pattern' => $input['pattern'] ?? 'AI Pattern',
            'timeframe' => $input['timeframe'] ?? '4H',
            'risk' => $input['risk'] ?? 'Medium',
            'status' => 'active',
            'created_at' => date('Y-m-d H:i:s'),
        ];

        echo json_encode([
            'success' => true,
            'message' => 'Signal created successfully',
            'data' => $signal,
        ]);
    }

    public function execute($id)
    {
        $executionPrice = rand(42000, 44000) / 100;
        
        echo json_encode([
            'success' => true,
            'message' => 'Signal executed successfully',
            'data' => [
                'signal_id' => $id,
                'execution_price' => $executionPrice,
                'execution_time' => date('Y-m-d H:i:s'),
                'status' => 'executed',
            ],
        ]);
    }
}

// Strategy API
class StrategyController
{
    public function index()
    {
        $strategies = [
            [
                'id' => 1,
                'name' => 'Momentum Breakout',
                'description' => 'Trades breakouts with high momentum',
                'win_rate' => 72.5,
                'profit_factor' => 1.85,
                'total_trades' => 156,
                'status' => 'active',
            ],
            [
                'id' => 2,
                'name' => 'Mean Reversion',
                'description' => 'Trades oversold/overbought conditions',
                'win_rate' => 68.2,
                'profit_factor' => 1.62,
                'total_trades' => 203,
                'status' => 'active',
            ],
        ];

        echo json_encode([
            'success' => true,
            'data' => $strategies,
        ]);
    }

    public function store()
    {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $strategy = [
            'id' => rand(100, 999),
            'name' => $input['name'] ?? 'New Strategy',
            'description' => $input['description'] ?? 'Custom trading strategy',
            'win_rate' => rand(50, 80) + (rand(0, 99) / 100),
            'profit_factor' => rand(100, 250) / 100,
            'total_trades' => 0,
            'status' => 'inactive',
            'created_at' => date('Y-m-d H:i:s'),
        ];

        echo json_encode([
            'success' => true,
            'message' => 'Strategy created successfully',
            'data' => $strategy,
        ]);
    }

    public function backtest($id)
    {
        $results = [
            'strategy_id' => $id,
            'total_trades' => rand(50, 200),
            'winning_trades' => rand(30, 140),
            'losing_trades' => rand(10, 70),
            'win_rate' => rand(60, 85) + (rand(0, 99) / 100),
            'profit_factor' => rand(120, 300) / 100,
            'total_return' => rand(15, 85) + (rand(0, 99) / 100),
            'max_drawdown' => rand(5, 25) + (rand(0, 99) / 100),
            'sharpe_ratio' => rand(80, 220) / 100,
            'period' => '6 months',
        ];

        echo json_encode([
            'success' => true,
            'message' => 'Backtest completed successfully',
            'data' => $results,
        ]);
    }
}

// Router
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Remove base path if needed
$path = str_replace('/Homygo/Homygo/Trading-APp/backend/api', '', $path);

switch ($path) {
    case '/market-data':
        $controller = new MarketDataController();
        $controller->getMarketData();
        break;
        
    case '/chart-data':
        $controller = new MarketDataController();
        $asset = $_GET['asset'] ?? 'BTC/USDT';
        $timeframe = $_GET['timeframe'] ?? '1H';
        $controller->getChartData($asset, $timeframe);
        break;
        
    case '/signals':
        $controller = new SignalController();
        if ($method === 'GET') {
            $controller->index();
        } elseif ($method === 'POST') {
            $controller->store();
        }
        break;
        
    case (preg_match('/\/signals\/(\d+)\/execute/', $path, $matches) ? true : false):
        $controller = new SignalController();
        $controller->execute($matches[1]);
        break;
        
    case '/strategies':
        $controller = new StrategyController();
        if ($method === 'GET') {
            $controller->index();
        } elseif ($method === 'POST') {
            $controller->store();
        }
        break;
        
    case (preg_match('/\/strategies\/(\d+)\/backtest/', $path, $matches) ? true : false):
        $controller = new StrategyController();
        $controller->backtest($matches[1]);
        break;
        
    default:
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Endpoint not found',
        ]);
        break;
}
?>
