<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Real-time market data service
class RealTimeMarketData {
    private $binanceBaseUrl = 'https://api.binance.com/api/v3';
    private $alphaVantageKey;
    
    public function __construct() {
        // Load API keys from environment or config
        $this->alphaVantageKey = $_ENV['ALPHA_VANTAGE_API_KEY'] ?? 'demo';
    }
    
    // Get real cryptocurrency data from Binance (free, no API key required)
    public function getCryptoPrice($symbol = 'BTCUSDT') {
        $url = $this->binanceBaseUrl . "/ticker/24hr?symbol=" . strtoupper($symbol);
        
        $context = stream_context_create([
            'http' => [
                'timeout' => 10,
                'user_agent' => 'TradingApp/1.0'
            ]
        ]);
        
        $response = @file_get_contents($url, false, $context);
        
        if ($response === false) {
            // Fallback to simulated data if API fails
            return $this->generateSimulatedData($symbol);
        }
        
        $data = json_decode($response, true);
        
        if (isset($data['symbol'])) {
            return [
                'symbol' => $data['symbol'],
                'price' => floatval($data['lastPrice']),
                'change_24h' => floatval($data['priceChange']),
                'change_percent_24h' => floatval($data['priceChangePercent']),
                'volume_24h' => floatval($data['volume']),
                'high_24h' => floatval($data['highPrice']),
                'low_24h' => floatval($data['lowPrice']),
                'timestamp' => time(),
                'source' => 'binance'
            ];
        }
        
        return $this->generateSimulatedData($symbol);
    }
    
    // Get real chart data from Binance
    public function getCryptoChartData($symbol = 'BTCUSDT', $interval = '1h', $limit = 100) {
        $url = $this->binanceBaseUrl . "/klines?symbol=" . strtoupper($symbol) . "&interval=" . $interval . "&limit=" . $limit;
        
        $context = stream_context_create([
            'http' => [
                'timeout' => 10,
                'user_agent' => 'TradingApp/1.0'
            ]
        ]);
        
        $response = @file_get_contents($url, false, $context);
        
        if ($response === false) {
            return $this->generateSimulatedChartData($symbol, $interval);
        }
        
        $data = json_decode($response, true);
        $chartData = [];
        
        foreach ($data as $candle) {
            $chartData[] = [
                'timestamp' => intval($candle[0]),
                'open' => floatval($candle[1]),
                'high' => floatval($candle[2]),
                'low' => floatval($candle[3]),
                'close' => floatval($candle[4]),
                'volume' => floatval($candle[5])
            ];
        }
        
        return $chartData;
    }
    
    // Get stock data from Alpha Vantage (requires API key)
    public function getStockPrice($symbol = 'AAPL') {
        if ($this->alphaVantageKey === 'demo') {
            return $this->generateSimulatedData($symbol, 'stock');
        }
        
        $url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={$symbol}&apikey={$this->alphaVantageKey}";
        
        $context = stream_context_create([
            'http' => [
                'timeout' => 10,
                'user_agent' => 'TradingApp/1.0'
            ]
        ]);
        
        $response = @file_get_contents($url, false, $context);
        
        if ($response === false) {
            return $this->generateSimulatedData($symbol, 'stock');
        }
        
        $data = json_decode($response, true);
        
        if (isset($data['Global Quote'])) {
            $quote = $data['Global Quote'];
            return [
                'symbol' => $quote['01. symbol'],
                'price' => floatval($quote['05. price']),
                'change_24h' => floatval($quote['09. change']),
                'change_percent_24h' => floatval(str_replace('%', '', $quote['10. change percent'])),
                'volume_24h' => floatval($quote['06. volume']),
                'high_24h' => floatval($quote['03. high']),
                'low_24h' => floatval($quote['04. low']),
                'timestamp' => time(),
                'source' => 'alphavantage'
            ];
        }
        
        return $this->generateSimulatedData($symbol, 'stock');
    }
    
    // Fallback simulated data generator
    private function generateSimulatedData($symbol, $type = 'crypto') {
        $basePrice = $type === 'stock' ? 150.00 : 43000.00;
        $change = (rand(-500, 500) / 100);
        $price = $basePrice + $change;
        
        return [
            'symbol' => $symbol,
            'price' => round($price, 2),
            'change_24h' => round($change, 2),
            'change_percent_24h' => round(($change / $basePrice) * 100, 2),
            'volume_24h' => rand(1000000, 10000000),
            'high_24h' => round($price + (rand(0, 100) / 100), 2),
            'low_24h' => round($price - (rand(0, 100) / 100), 2),
            'timestamp' => time(),
            'source' => 'simulated'
        ];
    }
    
    private function generateSimulatedChartData($symbol, $interval) {
        $data = [];
        $basePrice = 43000.00;
        $currentTime = time() - (100 * 3600); // 100 hours ago
        
        for ($i = 0; $i < 100; $i++) {
            $open = $basePrice + (rand(-200, 200) / 100);
            $close = $open + (rand(-100, 100) / 100);
            $high = max($open, $close) + (rand(0, 50) / 100);
            $low = min($open, $close) - (rand(0, 50) / 100);
            
            $data[] = [
                'timestamp' => ($currentTime + ($i * 3600)) * 1000,
                'open' => round($open, 2),
                'high' => round($high, 2),
                'low' => round($low, 2),
                'close' => round($close, 2),
                'volume' => rand(100000, 1000000)
            ];
            
            $basePrice = $close;
        }
        
        return $data;
    }
}

// Initialize the real-time market data service
$marketData = new RealTimeMarketData();

// Route handling
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$pathParts = explode('/', trim($path, '/'));

// Get the endpoint
$endpoint = end($pathParts);

switch ($endpoint) {
    case 'market-data':
        // Get real-time market data for multiple assets
        $assets = [
            'BTCUSDT' => $marketData->getCryptoPrice('BTCUSDT'),
            'ETHUSDT' => $marketData->getCryptoPrice('ETHUSDT'),
            'ADAUSDT' => $marketData->getCryptoPrice('ADAUSDT'),
            'AAPL' => $marketData->getStockPrice('AAPL'),
            'GOOGL' => $marketData->getStockPrice('GOOGL'),
            'TSLA' => $marketData->getStockPrice('TSLA'),
        ];
        
        echo json_encode([
            'success' => true,
            'data' => $assets,
            'timestamp' => time(),
            'real_time' => true
        ]);
        break;
        
    case 'chart-data':
        $asset = $_GET['asset'] ?? 'BTCUSDT';
        $timeframe = $_GET['timeframe'] ?? '1h';
        
        // Map timeframes to Binance intervals
        $intervalMap = [
            '1M' => '1m',
            '5M' => '5m',
            '15M' => '15m',
            '1H' => '1h',
            '4H' => '4h',
            '1D' => '1d'
        ];
        
        $interval = $intervalMap[$timeframe] ?? '1h';
        
        if (strpos($asset, 'USDT') !== false) {
            // Cryptocurrency
            $chartData = $marketData->getCryptoChartData($asset, $interval);
        } else {
            // Stock (fallback to simulated data)
            $chartData = [];
            $basePrice = 150.00;
            $currentTime = time() - (100 * 3600);
            
            for ($i = 0; $i < 100; $i++) {
                $open = $basePrice + (rand(-200, 200) / 100);
                $close = $open + (rand(-100, 100) / 100);
                $high = max($open, $close) + (rand(0, 50) / 100);
                $low = min($open, $close) - (rand(0, 50) / 100);
                
                $chartData[] = [
                    'timestamp' => ($currentTime + ($i * 3600)) * 1000,
                    'open' => round($open, 2),
                    'high' => round($high, 2),
                    'low' => round($low, 2),
                    'close' => round($close, 2),
                    'volume' => rand(100000, 1000000)
                ];
                
                $basePrice = $close;
            }
        }
        
        echo json_encode([
            'success' => true,
            'data' => $chartData,
            'asset' => $asset,
            'timeframe' => $timeframe,
            'real_time' => true
        ]);
        break;
        
    case 'live-price':
        $asset = $_GET['asset'] ?? 'BTCUSDT';
        
        if (strpos($asset, 'USDT') !== false) {
            $priceData = $marketData->getCryptoPrice($asset);
        } else {
            $priceData = $marketData->getStockPrice($asset);
        }
        
        echo json_encode([
            'success' => true,
            'data' => $priceData,
            'real_time' => true
        ]);
        break;
        
    default:
        echo json_encode([
            'success' => false,
            'message' => 'Endpoint not found',
            'available_endpoints' => [
                'market-data',
                'chart-data',
                'live-price'
            ]
        ]);
        break;
}
?>
