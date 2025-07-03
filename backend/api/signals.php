<?php

namespace App\Http\Controllers;

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
        ];

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'data' => $signals,
        ]);
    }

    public function store()
    {
        // Simulate creating a new signal
        $signal = [
            'id' => rand(100, 999),
            'asset' => $_POST['asset'] ?? 'BTC/USDT',
            'type' => $_POST['type'] ?? 'BUY',
            'confidence' => rand(70, 95),
            'entry' => floatval($_POST['entry'] ?? 43000),
            'target' => floatval($_POST['target'] ?? 45000),
            'stop_loss' => floatval($_POST['stop_loss'] ?? 42000),
            'pattern' => $_POST['pattern'] ?? 'AI Pattern',
            'timeframe' => $_POST['timeframe'] ?? '4H',
            'risk' => $_POST['risk'] ?? 'Medium',
            'status' => 'active',
            'created_at' => date('Y-m-d H:i:s'),
        ];

        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => 'Signal created successfully',
            'data' => $signal,
        ]);
    }
}
