
import React, { createContext, useContext, useState, useEffect } from 'react';

const TradingContext = createContext();

export const useTradingContext = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTradingContext must be used within a TradingProvider');
  }
  return context;
};

export const TradingProvider = ({ children }) => {
  const [selectedMarket, setSelectedMarket] = useState('crypto');
  const [selectedAsset, setSelectedAsset] = useState('BTC/USDT');
  const [signals, setSignals] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [riskLevel, setRiskLevel] = useState('medium');

  // Mock market data
  const mockMarketData = {
    'BTC/USDT': { price: 43250.50, change: 2.45, volume: '1.2B' },
    'ETH/USDT': { price: 2650.75, change: -1.23, volume: '850M' },
    'EUR/USD': { price: 1.0875, change: 0.15, volume: '2.1B' },
    'GBP/USD': { price: 1.2650, change: -0.08, volume: '1.8B' },
    'AAPL': { price: 185.25, change: 1.85, volume: '45M' },
    'TSLA': { price: 248.50, change: -2.15, volume: '38M' },
  };

  // Mock signals
  const mockSignals = [
    {
      id: 1,
      asset: 'BTC/USDT',
      type: 'BUY',
      confidence: 85,
      entry: 43200,
      target: 45000,
      stopLoss: 42000,
      pattern: 'Bullish Engulfing',
      timeframe: '4H',
      risk: 'Medium',
      timestamp: new Date().toISOString(),
    },
    {
      id: 2,
      asset: 'EUR/USD',
      type: 'SELL',
      confidence: 78,
      entry: 1.0880,
      target: 1.0820,
      stopLoss: 1.0920,
      pattern: 'Head & Shoulders',
      timeframe: '1H',
      risk: 'Low',
      timestamp: new Date().toISOString(),
    },
    {
      id: 3,
      asset: 'AAPL',
      type: 'BUY',
      confidence: 92,
      entry: 185.00,
      target: 195.00,
      stopLoss: 180.00,
      pattern: 'Double Bottom',
      timeframe: '1D',
      risk: 'High',
      timestamp: new Date().toISOString(),
    },
  ];

  useEffect(() => {
    // Initialize with mock data
    setMarketData(mockMarketData);
    setSignals(mockSignals);
    setWatchlist(['BTC/USDT', 'ETH/USDT', 'EUR/USD', 'AAPL']);

    // Simulate real-time updates
    const interval = setInterval(() => {
      setMarketData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(asset => {
          const change = (Math.random() - 0.5) * 2;
          updated[asset] = {
            ...updated[asset],
            price: updated[asset].price * (1 + change / 100),
            change: change,
          };
        });
        return updated;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addToWatchlist = (asset) => {
    if (!watchlist.includes(asset)) {
      setWatchlist(prev => [...prev, asset]);
    }
  };

  const removeFromWatchlist = (asset) => {
    setWatchlist(prev => prev.filter(item => item !== asset));
  };

  const generateNewSignal = (asset, type) => {
    const newSignal = {
      id: Date.now(),
      asset,
      type,
      confidence: Math.floor(Math.random() * 30) + 70,
      entry: marketData[asset]?.price || 0,
      target: marketData[asset]?.price * (type === 'BUY' ? 1.05 : 0.95) || 0,
      stopLoss: marketData[asset]?.price * (type === 'BUY' ? 0.98 : 1.02) || 0,
      pattern: ['Bullish Engulfing', 'Head & Shoulders', 'Double Bottom', 'Triangle Breakout'][Math.floor(Math.random() * 4)],
      timeframe: ['1H', '4H', '1D'][Math.floor(Math.random() * 3)],
      risk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
      timestamp: new Date().toISOString(),
    };
    
    setSignals(prev => [newSignal, ...prev.slice(0, 9)]);
    return newSignal;
  };

  const value = {
    selectedMarket,
    setSelectedMarket,
    selectedAsset,
    setSelectedAsset,
    signals,
    setSignals,
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    marketData,
    aiAnalysis,
    setAiAnalysis,
    riskLevel,
    setRiskLevel,
    generateNewSignal,
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
};
