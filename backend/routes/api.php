<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SignalController;
use App\Http\Controllers\StrategyController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/signals', [SignalController::class, 'index']);
Route::post('/signals', [SignalController::class, 'store']);
Route::get('/strategies', [StrategyController::class, 'index']);
Route::post('/strategies', [StrategyController::class, 'store']);
