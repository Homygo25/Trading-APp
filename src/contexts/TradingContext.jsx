import React, { createContext, useContext, useState, useEffect } from 'react';
import { marketAPI, signalsAPI, strategiesAPI, portfolioAPI, aiAPI } from '@/services/api';
import realTimeService from '@/services/realtime';
import { useToast } from '@/components/ui/use-toast';

const TradingContext = createContext();

export const useTradingContext = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTradingContext must be used within a TradingProvider');
  }
  return context;
};

export const TradingProvider = ({ children }) => {
  // State management
  const [selectedMarket, setSelectedMarket] = useState('crypto');
  const [selectedAsset, setSelectedAsset] = useState('BTC/USDT');
  const [signals, setSignals] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [marketData, setMarketData] = useState({});
  const [chartData, setChartData] = useState({});
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [riskLevel, setRiskLevel] = useState('medium');
  const [strategies, setStrategies] = useState([]);
  const [portfolio, setPortfolio] = useState(null);
  const [tradingHistory, setTradingHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { toast } = useToast();

  // Initialize data on mount
  useEffect(() => {
    initializeData();
    
    // Start real-time service
    realTimeService.start();
    
    // Subscribe to real-time price updates
    const unsubscribe = realTimeService.subscribe('price_update', (priceData) => {
      setMarketData(prev => ({
        ...prev,
        [priceData.symbol]: {
          symbol: priceData.symbol,
          price: priceData.price,
          change_24h: priceData.change_24h,
          change_percent_24h: priceData.change_percent_24h,
          volume_24h: priceData.volume_24h,
          high_24h: priceData.high_24h,
          low_24h: priceData.low_24h,
          last_updated: new Date().toISOString(),
          real_time: true
        }
      }));
    });
    
    // Set up fallback polling for non-WebSocket data
    const fallbackInterval = setInterval(fetchMarketData, 30000);
    const signalsInterval = setInterval(fetchSignals, 10000);
    
    return () => {
      unsubscribe();
      realTimeService.disconnect();
      clearInterval(fallbackInterval);
      clearInterval(signalsInterval);
    };
  }, []);

  // Initialize watchlist
  useEffect(() => {
    setWatchlist(['BTC/USDT', 'ETH/USDT', 'EUR/USD', 'AAPL']);
  }, []);

  // Fetch AI analysis when asset changes
  useEffect(() => {
    if (selectedAsset) {
      fetchAIAnalysis(selectedAsset);
      fetchChartData(selectedAsset);
    }
  }, [selectedAsset]);

  // Initialize all data
  const initializeData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchMarketData(),
        fetchSignals(),
        fetchStrategies(),
        fetchPortfolio(),
        fetchTradingHistory(),
      ]);
    } catch (error) {
      console.error('Error initializing data:', error);
      setError('Failed to load initial data');
    } finally {
      setLoading(false);
    }
  };

  // Market Data Functions
  const fetchMarketData = async () => {
    try {
      const response = await marketAPI.getMarketData();
      if (response.success) {
        setMarketData(response.data);
      }
    } catch (error) {
      console.error('Error fetching market data:', error);
      // Fallback to mock data
      setMarketData({
        'BTC/USDT': { price: 43250.50, change: 2.45, volume: '1.2B' },
        'ETH/USDT': { price: 2650.75, change: -1.23, volume: '850M' },
        'EUR/USD': { price: 1.0875, change: 0.15, volume: '2.1B' },
        'GBP/USD': { price: 1.2650, change: -0.08, volume: '1.8B' },
        'AAPL': { price: 185.25, change: 1.85, volume: '45M' },
        'TSLA': { price: 248.50, change: -2.15, volume: '38M' },
      });
    }
  };

  const fetchChartData = async (asset, timeframe = '1H') => {
    try {
      const response = await marketAPI.getChartData(asset, timeframe);
      if (response.success) {
        setChartData(prev => ({
          ...prev,
          [`${asset}_${timeframe}`]: response.data,
        }));
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
      // Generate mock chart data
      const mockData = generateMockChartData(asset);
      setChartData(prev => ({
        ...prev,
        [`${asset}_${timeframe}`]: mockData,
      }));
    }
  };

  // Signals Functions
  const fetchSignals = async (filters = {}) => {
    try {
      const response = await signalsAPI.getSignals(filters);
      if (response.success) {
        setSignals(response.data);
      }
    } catch (error) {
      console.error('Error fetching signals:', error);
      // Fallback to existing mock signals
    }
  };

  const generateNewSignal = async (asset, type, options = {}) => {
    try {
      setLoading(true);
      const signalData = {
        asset,
        type,
        confidence: Math.floor(Math.random() * 30) + 70,
        entry: marketData[asset]?.price || 0,
        target: marketData[asset]?.price * (type === 'BUY' ? 1.05 : 0.95) || 0,
        stop_loss: marketData[asset]?.price * (type === 'BUY' ? 0.98 : 1.02) || 0,
        pattern: ['Bullish Engulfing', 'Head & Shoulders', 'Double Bottom', 'Triangle Breakout'][Math.floor(Math.random() * 4)],
        timeframe: ['1H', '4H', '1D'][Math.floor(Math.random() * 3)],
        risk: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        ...options,
      };

      const response = await signalsAPI.createSignal(signalData);
      if (response.success) {
        setSignals(prev => [response.data, ...prev.slice(0, 9)]);
        toast({
          title: `🎯 New ${type} Signal Generated!`,
          description: `AI detected a ${response.data.pattern} pattern on ${asset}`,
          duration: 4000,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Error generating signal:', error);
      // Fallback to local generation
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
    } finally {
      setLoading(false);
    }
  };

  const executeSignal = async (signal) => {
    try {
      setLoading(true);
      const response = await signalsAPI.executeSignal(signal.id);
      if (response.success) {
        // Update signal status
        setSignals(prev => prev.map(s => 
          s.id === signal.id 
            ? { ...s, status: 'executed', executed_at: new Date().toISOString() }
            : s
        ));
        
        toast({
          title: "🚀 Signal Executed!",
          description: `${signal.type} order for ${signal.asset} executed at ${response.data.execution_price}`,
          duration: 4000,
        });

        // Refresh portfolio and trading history
        fetchPortfolio();
        fetchTradingHistory();
        
        return response.data;
      }
    } catch (error) {
      console.error('Error executing signal:', error);
      toast({
        title: "❌ Execution Failed",
        description: "Unable to execute signal. Please try again.",
        duration: 3000,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Strategy Functions
  const fetchStrategies = async () => {
    try {
      const response = await strategiesAPI.getStrategies();
      if (response.success) {
        setStrategies(response.data);
      }
    } catch (error) {
      console.error('Error fetching strategies:', error);
      // Fallback to mock strategies
      setStrategies([
        {
          id: 1,
          name: 'Momentum Breakout',
          description: 'Trades breakouts with high momentum',
          win_rate: 72.5,
          profit_factor: 1.85,
          total_trades: 156,
          status: 'active',
        },
        {
          id: 2,
          name: 'Mean Reversion',
          description: 'Trades oversold/overbought conditions',
          win_rate: 68.2,
          profit_factor: 1.62,
          total_trades: 203,
          status: 'active',
        },
      ]);
    }
  };

  const createStrategy = async (strategyData) => {
    try {
      setLoading(true);
      const response = await strategiesAPI.createStrategy(strategyData);
      if (response.success) {
        setStrategies(prev => [response.data, ...prev]);
        toast({
          title: "✅ Strategy Created!",
          description: `Strategy "${response.data.name}" has been created successfully`,
          duration: 4000,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Error creating strategy:', error);
      toast({
        title: "❌ Creation Failed",
        description: "Unable to create strategy. Please try again.",
        duration: 3000,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const backtestStrategy = async (strategyId) => {
    try {
      setLoading(true);
      const response = await strategiesAPI.backtestStrategy(strategyId);
      if (response.success) {
        toast({
          title: "📊 Backtest Complete!",
          description: `Strategy backtest completed with ${response.data.win_rate.toFixed(1)}% win rate`,
          duration: 4000,
        });
        return response.data;
      }
    } catch (error) {
      console.error('Error backtesting strategy:', error);
      toast({
        title: "❌ Backtest Failed",
        description: "Unable to complete backtest. Please try again.",
        duration: 3000,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Portfolio Functions
  const fetchPortfolio = async () => {
    try {
      const response = await portfolioAPI.getPortfolio();
      if (response.success) {
        setPortfolio(response.data);
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const fetchTradingHistory = async (filters = {}) => {
    try {
      const response = await portfolioAPI.getTradingHistory(filters);
      if (response.success) {
        setTradingHistory(response.data);
      }
    } catch (error) {
      console.error('Error fetching trading history:', error);
    }
  };

  // AI Functions
  const fetchAIAnalysis = async (asset) => {
    try {
      const response = await aiAPI.getMarketAnalysis(asset);
      if (response.success) {
        setAiAnalysis(response.data);
      }
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
    }
  };

  const chatWithAI = async (message) => {
    try {
      const response = await aiAPI.chatWithAI(message, { asset: selectedAsset });
      if (response.success) {
        return response.data;
      }
    } catch (error) {
      console.error('Error chatting with AI:', error);
      // Return fallback response
      return {
        message: "I'm sorry, I'm having trouble processing your request right now. Please try again later.",
        timestamp: new Date().toISOString(),
        confidence: 50,
      };
    }
  };

  // Watchlist Functions
  const addToWatchlist = (asset) => {
    if (!watchlist.includes(asset)) {
      setWatchlist(prev => [...prev, asset]);
      toast({
        title: "📊 Added to Watchlist",
        description: `${asset} has been added to your watchlist`,
        duration: 2000,
      });
    }
  };

  const removeFromWatchlist = (asset) => {
    setWatchlist(prev => prev.filter(item => item !== asset));
    toast({
      title: "🗑️ Removed from Watchlist",
      description: `${asset} has been removed from your watchlist`,
      duration: 2000,
    });
  };

  // Utility Functions
  const generateMockChartData = (asset) => {
    const data = [];
    let price = marketData[asset]?.price || 43000;
    
    for (let i = 0; i < 50; i++) {
      const change = (Math.random() - 0.5) * (price * 0.01);
      price += change;
      data.push({
        time: Date.now() - (50 - i) * 3600000,
        open: price - Math.random() * (price * 0.005),
        high: price + Math.random() * (price * 0.005),
        low: price - Math.random() * (price * 0.005),
        close: price,
        volume: Math.random() * 1000000
      });
    }
    return data;
  };

  // Context value
  const value = {
    // State
    selectedMarket,
    setSelectedMarket,
    selectedAsset,
    setSelectedAsset,
    signals,
    setSignals,
    watchlist,
    marketData,
    chartData,
    aiAnalysis,
    setAiAnalysis,
    riskLevel,
    setRiskLevel,
    strategies,
    portfolio,
    tradingHistory,
    loading,
    error,

    // Functions
    generateNewSignal,
    executeSignal,
    addToWatchlist,
    removeFromWatchlist,
    fetchMarketData,
    fetchChartData,
    fetchSignals,
    fetchStrategies,
    createStrategy,
    backtestStrategy,
    fetchPortfolio,
    fetchTradingHistory,
    fetchAIAnalysis,
    chatWithAI,
  };

  return (
    <TradingContext.Provider value={value}>
      {children}
    </TradingContext.Provider>
  );
};
