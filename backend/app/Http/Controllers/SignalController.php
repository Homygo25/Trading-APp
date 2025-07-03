<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;

class SignalController
{
    private $signals = [];
    
    public function __construct()
    {
        // Initialize with mock signals for development
        $this->signals = [
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
                'created_at' => now(),
                'updated_at' => now(),
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
                'created_at' => now(),
                'updated_at' => now(),
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
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];
    }

    public function index(Request $request): JsonResponse
    {
        $asset = $request->get('asset');
        $status = $request->get('status', 'active');
        
        $filteredSignals = collect($this->signals);
        
        if ($asset) {
            $filteredSignals = $filteredSignals->where('asset', $asset);
        }
        
        if ($status) {
            $filteredSignals = $filteredSignals->where('status', $status);
        }
        
        return response()->json([
            'success' => true,
            'data' => $filteredSignals->values()->all(),
            'total' => $filteredSignals->count(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'asset' => 'required|string|max:20',
            'type' => 'required|in:BUY,SELL',
            'confidence' => 'required|integer|min:1|max:100',
            'entry' => 'required|numeric|min:0',
            'target' => 'required|numeric|min:0',
            'stop_loss' => 'required|numeric|min:0',
            'pattern' => 'required|string|max:50',
            'timeframe' => 'required|string|max:10',
            'risk' => 'required|in:Low,Medium,High',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $signal = array_merge($request->all(), [
            'id' => count($this->signals) + 1,
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $this->signals[] = $signal;

        return response()->json([
            'success' => true,
            'message' => 'Signal created successfully',
            'data' => $signal,
        ], 201);
    }

    public function show($id): JsonResponse
    {
        $signal = collect($this->signals)->firstWhere('id', (int)$id);
        
        if (!$signal) {
            return response()->json([
                'success' => false,
                'message' => 'Signal not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $signal,
        ]);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $signalIndex = collect($this->signals)->search(function ($signal) use ($id) {
            return $signal['id'] === (int)$id;
        });
        
        if ($signalIndex === false) {
            return response()->json([
                'success' => false,
                'message' => 'Signal not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'sometimes|in:active,executed,cancelled',
            'confidence' => 'sometimes|integer|min:1|max:100',
            'target' => 'sometimes|numeric|min:0',
            'stop_loss' => 'sometimes|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $this->signals[$signalIndex] = array_merge(
            $this->signals[$signalIndex],
            $request->all(),
            ['updated_at' => now()]
        );

        return response()->json([
            'success' => true,
            'message' => 'Signal updated successfully',
            'data' => $this->signals[$signalIndex],
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $signalIndex = collect($this->signals)->search(function ($signal) use ($id) {
            return $signal['id'] === (int)$id;
        });
        
        if ($signalIndex === false) {
            return response()->json([
                'success' => false,
                'message' => 'Signal not found',
            ], 404);
        }

        unset($this->signals[$signalIndex]);
        $this->signals = array_values($this->signals);

        return response()->json([
            'success' => true,
            'message' => 'Signal deleted successfully',
        ]);
    }

    public function execute(Request $request, $id): JsonResponse
    {
        $signalIndex = collect($this->signals)->search(function ($signal) use ($id) {
            return $signal['id'] === (int)$id;
        });
        
        if ($signalIndex === false) {
            return response()->json([
                'success' => false,
                'message' => 'Signal not found',
            ], 404);
        }

        $signal = $this->signals[$signalIndex];
        
        // Simulate trade execution
        $executionPrice = $signal['entry'] * (1 + (rand(-100, 100) / 10000)); // ±1% price variation
        
        $this->signals[$signalIndex]['status'] = 'executed';
        $this->signals[$signalIndex]['execution_price'] = $executionPrice;
        $this->signals[$signalIndex]['executed_at'] = now();
        $this->signals[$signalIndex]['updated_at'] = now();

        return response()->json([
            'success' => true,
            'message' => 'Signal executed successfully',
            'data' => [
                'signal' => $this->signals[$signalIndex],
                'execution_price' => $executionPrice,
                'execution_time' => now(),
            ],
        ]);
    }

    public function generate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'asset' => 'required|string|max:20',
            'timeframe' => 'sometimes|string|max:10',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Simulate AI signal generation
        $patterns = ['Bullish Engulfing', 'Head & Shoulders', 'Double Bottom', 'Triangle Breakout', 'Cup & Handle'];
        $timeframes = ['1H', '4H', '1D'];
        $risks = ['Low', 'Medium', 'High'];
        $types = ['BUY', 'SELL'];
        
        $asset = $request->input('asset');
        $type = $types[array_rand($types)];
        $basePrice = rand(100, 50000) / 100; // Random price between 1 and 500
        
        $signal = [
            'id' => count($this->signals) + 1,
            'asset' => $asset,
            'type' => $type,
            'confidence' => rand(70, 95),
            'entry' => $basePrice,
            'target' => $type === 'BUY' ? $basePrice * 1.05 : $basePrice * 0.95,
            'stop_loss' => $type === 'BUY' ? $basePrice * 0.98 : $basePrice * 1.02,
            'pattern' => $patterns[array_rand($patterns)],
            'timeframe' => $request->input('timeframe', $timeframes[array_rand($timeframes)]),
            'risk' => $risks[array_rand($risks)],
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ];

        $this->signals[] = $signal;

        return response()->json([
            'success' => true,
            'message' => 'Signal generated successfully',
            'data' => $signal,
        ], 201);
    }
}
