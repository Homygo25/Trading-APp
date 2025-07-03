import axios from 'axios';

// Configure axios base URL - adjust this based on your backend setup
const API_BASE_URL = 'http://localhost/Homygo/Homygo/Trading-APp/backend/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication (when implemented)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      // Redirect to login if needed
    }
    return Promise.reject(error);
  }
);

// Market Data API
export const marketAPI = {
  // Get real-time market data
  getMarketData: async () => {
    try {
      const response = await api.get('/market-data');
      return response.data;
    } catch (error) {
      console.error('Error fetching market data:', error);
      throw error;
    }
  },

  // Get chart data for a specific asset
  getChartData: async (asset, timeframe = '1H') => {
    try {
      const response = await api.get('/chart-data', {
        params: { asset, timeframe }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching chart data:', error);
      throw error;
    }
  },

  // Get available assets
  getAssets: async () => {
    try {
      // Mock data for now
      return {
        success: true,
        data: [
          { symbol: 'BTC/USDT', name: 'Bitcoin', type: 'crypto' },
          { symbol: 'ETH/USDT', name: 'Ethereum', type: 'crypto' },
          { symbol: 'EUR/USD', name: 'Euro to USD', type: 'forex' },
          { symbol: 'GBP/USD', name: 'Pound to USD', type: 'forex' },
          { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock' },
          { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stock' },
        ]
      };
    } catch (error) {
      console.error('Error fetching assets:', error);
      throw error;
    }
  },
};

// Signals API
export const signalsAPI = {
  // Get all signals
  getSignals: async (filters = {}) => {
    try {
      const response = await api.get('/signals', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching signals:', error);
      throw error;
    }
  },

  // Create a new signal
  createSignal: async (signalData) => {
    try {
      const response = await api.post('/signals', signalData);
      return response.data;
    } catch (error) {
      console.error('Error creating signal:', error);
      throw error;
    }
  },

  // Execute a signal
  executeSignal: async (signalId) => {
    try {
      const response = await api.post(`/signals/${signalId}/execute`);
      return response.data;
    } catch (error) {
      console.error('Error executing signal:', error);
      throw error;
    }
  },

  // Update signal status
  updateSignal: async (signalId, updateData) => {
    try {
      const response = await api.put(`/signals/${signalId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating signal:', error);
      throw error;
    }
  },

  // Delete a signal
  deleteSignal: async (signalId) => {
    try {
      const response = await api.delete(`/signals/${signalId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting signal:', error);
      throw error;
    }
  },

  // Generate AI signal
  generateSignal: async (asset, options = {}) => {
    try {
      const response = await api.post('/signals', {
        asset,
        type: Math.random() > 0.5 ? 'BUY' : 'SELL',
        ...options
      });
      return response.data;
    } catch (error) {
      console.error('Error generating signal:', error);
      throw error;
    }
  },
};

// Strategies API
export const strategiesAPI = {
  // Get all strategies
  getStrategies: async () => {
    try {
      const response = await api.get('/strategies');
      return response.data;
    } catch (error) {
      console.error('Error fetching strategies:', error);
      throw error;
    }
  },

  // Create a new strategy
  createStrategy: async (strategyData) => {
    try {
      const response = await api.post('/strategies', strategyData);
      return response.data;
    } catch (error) {
      console.error('Error creating strategy:', error);
      throw error;
    }
  },

  // Update a strategy
  updateStrategy: async (strategyId, updateData) => {
    try {
      const response = await api.put(`/strategies/${strategyId}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating strategy:', error);
      throw error;
    }
  },

  // Delete a strategy
  deleteStrategy: async (strategyId) => {
    try {
      const response = await api.delete(`/strategies/${strategyId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting strategy:', error);
      throw error;
    }
  },

  // Backtest a strategy
  backtestStrategy: async (strategyId, parameters = {}) => {
    try {
      const response = await api.post(`/strategies/${strategyId}/backtest`, parameters);
      return response.data;
    } catch (error) {
      console.error('Error backtesting strategy:', error);
      throw error;
    }
  },
};

// Portfolio API
export const portfolioAPI = {
  // Get portfolio overview
  getPortfolio: async () => {
    try {
      // Mock data for now
      return {
        success: true,
        data: {
          total_value: 125000.50,
          day_change: 2850.75,
          day_change_percent: 2.33,
          positions: [
            {
              asset: 'BTC/USDT',
              quantity: 2.5,
              avg_price: 41200.00,
              current_price: 43250.50,
              unrealized_pnl: 5126.25,
              unrealized_pnl_percent: 4.97,
            },
            {
              asset: 'ETH/USDT',
              quantity: 15.0,
              avg_price: 2580.00,
              current_price: 2650.75,
              unrealized_pnl: 1061.25,
              unrealized_pnl_percent: 2.74,
            },
          ],
          performance: {
            total_return: 18.45,
            win_rate: 72.3,
            total_trades: 156,
            winning_trades: 113,
          }
        }
      };
    } catch (error) {
      console.error('Error fetching portfolio:', error);
      throw error;
    }
  },

  // Get trading history
  getTradingHistory: async (filters = {}) => {
    try {
      // Mock data for now
      return {
        success: true,
        data: [
          {
            id: 1,
            asset: 'BTC/USDT',
            type: 'BUY',
            quantity: 0.5,
            entry_price: 42800.00,
            exit_price: 44200.00,
            pnl: 700.00,
            pnl_percent: 3.27,
            executed_at: new Date().toISOString(),
          },
          {
            id: 2,
            asset: 'ETH/USDT',
            type: 'SELL',
            quantity: 2.0,
            entry_price: 2680.00,
            exit_price: 2620.00,
            pnl: -120.00,
            pnl_percent: -2.24,
            executed_at: new Date().toISOString(),
          },
        ]
      };
    } catch (error) {
      console.error('Error fetching trading history:', error);
      throw error;
    }
  },
};

// AI Analysis API
export const aiAPI = {
  // Get AI market analysis
  getMarketAnalysis: async (asset) => {
    try {
      // Mock AI analysis
      const analyses = [
        {
          asset,
          analysis: `Strong bullish momentum detected for ${asset}. Technical indicators suggest a potential breakout above key resistance levels.`,
          sentiment: 'bullish',
          confidence: 85,
          key_levels: {
            resistance: [44000, 45500],
            support: [42000, 41200],
          },
          indicators: {
            rsi: 68.5,
            macd: 'bullish_crossover',
            bollinger_position: 'upper_band',
          },
          recommendation: 'Consider long positions with tight stop-loss below 42000',
          risk_level: 'medium',
        }
      ];

      return {
        success: true,
        data: analyses[0],
      };
    } catch (error) {
      console.error('Error fetching AI analysis:', error);
      throw error;
    }
  },

  // Get trading recommendations
  getRecommendations: async () => {
    try {
      const recommendations = [
        {
          asset: 'BTC/USDT',
          action: 'BUY',
          confidence: 87,
          reason: 'Bullish breakout pattern detected',
          target: 45000,
          stop_loss: 42000,
        },
        {
          asset: 'EUR/USD',
          action: 'SELL',
          confidence: 73,
          reason: 'Bearish divergence on RSI',
          target: 1.0820,
          stop_loss: 1.0920,
        },
      ];

      return {
        success: true,
        data: recommendations,
      };
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  },

  // Advanced AI Chat Assistant
  chatWithAI: async (message, context = {}) => {
    try {
      const aiAssistant = new TradingAIAssistant();
      const response = await aiAssistant.processMessage(message, context);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Error chatting with AI:', error);
      throw error;
    }
  },
};

// Advanced AI Trading Assistant
class TradingAIAssistant {
  constructor() {
    this.conversationHistory = [];
    this.userProfile = {
      experience_level: 'intermediate',
      risk_tolerance: 'moderate',
      preferred_assets: ['BTC/USDT', 'ETH/USDT'],
      trading_style: 'swing_trading'
    };
    this.marketKnowledge = this.initializeMarketKnowledge();
    this.personalityTraits = {
      helpfulness: 0.9,
      confidence: 0.8,
      technical_depth: 0.7,
      humor: 0.3
    };
  }

  async processMessage(message, context = {}) {
    const userMessage = {
      text: message,
      timestamp: Date.now(),
      context: context,
      intent: this.analyzeIntent(message),
      entities: this.extractEntities(message)
    };

    this.conversationHistory.push(userMessage);

    // Generate contextual response
    const response = await this.generateResponse(userMessage);
    
    // Add response to history
    this.conversationHistory.push({
      text: response.message,
      timestamp: Date.now(),
      type: 'assistant',
      confidence: response.confidence
    });

    return response;
  }

  analyzeIntent(message) {
    const intents = {
      market_analysis: [
        'what do you think about', 'analyze', 'analysis', 'market view', 
        'opinion on', 'how is', 'trend', 'bullish', 'bearish', 'outlook'
      ],
      trading_advice: [
        'should i buy', 'should i sell', 'what to do', 'recommend', 'advice',
        'strategy', 'approach', 'when to enter', 'when to exit'
      ],
      risk_management: [
        'risk', 'stop loss', 'position size', 'how much', 'safe', 'protect',
        'loss', 'drawdown', 'manage risk'
      ],
      technical_analysis: [
        'support', 'resistance', 'rsi', 'macd', 'moving average', 'indicators',
        'fibonacci', 'pattern', 'chart', 'technical'
      ],
      portfolio_question: [
        'portfolio', 'positions', 'allocation', 'diversify', 'balance',
        'performance', 'returns', 'profit'
      ],
      general_question: [
        'how', 'what', 'why', 'when', 'where', 'explain', 'help', 'tell me'
      ],
      greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'thanks']
    };

    const lowerMessage = message.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(intents)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return intent;
      }
    }
    
    return 'general_question';
  }

  extractEntities(message) {
    const entities = {
      assets: [],
      timeframes: [],
      indicators: [],
      numbers: [],
      actions: []
    };

    const assetPatterns = [
      'BTC', 'ETH', 'ADA', 'SOL', 'AAPL', 'GOOGL', 'TSLA', 'EUR/USD', 'GBP/USD'
    ];
    
    const timeframePatterns = [
      '1m', '5m', '15m', '1h', '4h', '1d', 'daily', 'hourly', 'minute'
    ];

    const indicatorPatterns = [
      'RSI', 'MACD', 'MA', 'EMA', 'Bollinger', 'Stochastic', 'Volume'
    ];

    const actionPatterns = [
      'buy', 'sell', 'hold', 'enter', 'exit', 'close', 'open'
    ];

    // Extract entities using pattern matching
    assetPatterns.forEach(asset => {
      if (message.toUpperCase().includes(asset)) {
        entities.assets.push(asset);
      }
    });

    timeframePatterns.forEach(tf => {
      if (message.toLowerCase().includes(tf)) {
        entities.timeframes.push(tf);
      }
    });

    indicatorPatterns.forEach(indicator => {
      if (message.toUpperCase().includes(indicator)) {
        entities.indicators.push(indicator);
      }
    });

    actionPatterns.forEach(action => {
      if (message.toLowerCase().includes(action)) {
        entities.actions.push(action);
      }
    });

    // Extract numbers
    const numberMatches = message.match(/\d+(\.\d+)?/g);
    if (numberMatches) {
      entities.numbers = numberMatches.map(n => parseFloat(n));
    }

    return entities;
  }

  async generateResponse(userMessage) {
    const { intent, entities, context } = userMessage;
    const currentAsset = context.asset || entities.assets[0] || 'BTC/USDT';
    
    let response = '';
    let confidence = 85;

    switch (intent) {
      case 'market_analysis':
        response = this.generateMarketAnalysis(currentAsset, entities);
        confidence = 88;
        break;
        
      case 'trading_advice':
        response = this.generateTradingAdvice(currentAsset, entities);
        confidence = 82;
        break;
        
      case 'risk_management':
        response = this.generateRiskAdvice(entities);
        confidence = 90;
        break;
        
      case 'technical_analysis':
        response = this.generateTechnicalAnalysis(currentAsset, entities);
        confidence = 85;
        break;
        
      case 'portfolio_question':
        response = this.generatePortfolioAdvice(entities);
        confidence = 80;
        break;
        
      case 'greeting':
        response = this.generateGreeting();
        confidence = 95;
        break;
        
      default:
        response = this.generateContextualResponse(userMessage);
        confidence = 75;
    }

    // Add personality and context
    response = this.addPersonality(response, intent);
    
    return {
      message: response,
      timestamp: new Date().toISOString(),
      confidence: confidence,
      intent: intent,
      suggestions: this.generateSuggestions(intent, entities)
    };
  }

  generateMarketAnalysis(asset, entities) {
    const analyses = [
      `Looking at ${asset}, I'm seeing some interesting patterns. The current price action suggests ${this.getRandomTrend()} momentum, with key levels to watch around ${this.getRandomPrice(asset)}. ${this.getRandomInsight()}`,
      `${asset} is showing ${this.getRandomPattern()} formation on the charts. This typically indicates ${this.getRandomOutcome()}. I'd recommend watching for ${this.getRandomConfirmation()}.`,
      `Based on my analysis of ${asset}, the ${this.getRandomTimeframe()} trend is ${this.getRandomTrend()}. Volume patterns suggest ${this.getRandomVolumeInsight()}. Key resistance lies around ${this.getRandomPrice(asset)}.`,
      `My AI models are processing ${asset} data and I'm seeing ${this.getRandomStrength()} signals. The risk-reward ratio looks ${this.getRandomRatio()} for potential entries near current levels.`
    ];
    
    return this.getRandomElement(analyses);
  }

  generateTradingAdvice(asset, entities) {
    const hasNumbers = entities.numbers.length > 0;
    const advice = [
      `For ${asset}, I'd suggest waiting for a clear breakout above ${this.getRandomPrice(asset)} before considering a long position. Set your stop loss at ${this.getRandomPrice(asset, 0.97)} and target ${this.getRandomPrice(asset, 1.05)}.`,
      `Given the current market conditions, a conservative approach with ${asset} would be wise. Consider scaling into positions rather than going all-in. Risk no more than 2-3% per trade.`,
      `The setup on ${asset} looks promising. I'd recommend entering on a pullback to support around ${this.getRandomPrice(asset, 0.98)}. This offers a better risk-reward ratio.`,
      `My analysis suggests ${asset} is in a consolidation phase. Patience is key here - wait for a clear directional move before committing capital.`
    ];
    
    return this.getRandomElement(advice);
  }

  generateRiskAdvice(entities) {
    const riskAdvice = [
      `Risk management is crucial! Never risk more than 1-2% of your account on any single trade. Use proper position sizing and always set stop losses.`,
      `I recommend the 2% rule: never risk more than 2% of your portfolio on one trade. This way, you can survive a string of losses and stay in the game long-term.`,
      `Position sizing is everything. Calculate your risk before entering any trade. If you can't afford to lose the money, don't risk it. The market will always give you another opportunity.`,
      `Consider using a trailing stop loss to protect profits while letting winners run. This helps maximize gains while limiting downside risk.`
    ];
    
    return this.getRandomElement(riskAdvice);
  }

  generateTechnicalAnalysis(asset, entities) {
    const indicators = entities.indicators.length > 0 ? entities.indicators.join(', ') : 'RSI and MACD';
    
    const technicalAnalyses = [
      `Looking at the ${indicators} for ${asset}, I'm seeing ${this.getRandomSignal()} signals. The ${this.getRandomTimeframe()} chart shows ${this.getRandomPattern()} which typically resolves ${this.getRandomDirection()}.`,
      `The technical picture for ${asset} is mixed. While the ${indicators} shows ${this.getRandomSignal()}, we need to see confirmation from volume and price action.`,
      `${asset} is approaching a critical technical level. The ${indicators} readings suggest ${this.getRandomCondition()}, which could lead to ${this.getRandomOutcome()}.`,
      `From a technical standpoint, ${asset} is forming a ${this.getRandomPattern()}. This pattern has a ${this.getRandomSuccessRate()}% success rate historically.`
    ];
    
    return this.getRandomElement(technicalAnalyses);
  }

  generatePortfolioAdvice(entities) {
    const portfolioAdvice = [
      `Portfolio diversification is key to long-term success. I recommend spreading risk across different asset classes and not putting all eggs in one basket.`,
      `Your portfolio performance looks solid. Consider rebalancing if any position grows beyond 20% of your total allocation.`,
      `Based on current market conditions, a balanced approach with 60% growth assets and 40% defensive positions could work well.`,
      `Regular portfolio reviews are important. I suggest evaluating your positions monthly and adjusting based on market conditions and your goals.`
    ];
    
    return this.getRandomElement(portfolioAdvice);
  }

  generateGreeting() {
    const greetings = [
      `Hello! I'm your AI trading assistant. How can I help you navigate the markets today? 📈`,
      `Hi there! Ready to dive into some market analysis? I'm here to help with trading insights and strategies! 🚀`,
      `Hey! Great to see you. What would you like to explore in the markets today? I'm here to assist! 💡`,
      `Welcome back! I'm analyzing the latest market data. What questions do you have about trading today? 📊`
    ];
    
    return this.getRandomElement(greetings);
  }

  generateContextualResponse(userMessage) {
    const contextualResponses = [
      `That's an interesting question about "${userMessage.text}". Based on current market dynamics, I'd say the key is to stay focused on your strategy and risk management.`,
      `I understand you're asking about "${userMessage.text}". From my analysis, the best approach is usually to combine technical analysis with sound risk management principles.`,
      `Great question! When it comes to "${userMessage.text}", I always recommend taking a step back and looking at the bigger picture before making any decisions.`,
      `I appreciate your question about "${userMessage.text}". In my experience, the most successful traders focus on process over profits and always have a plan.`
    ];
    
    return this.getRandomElement(contextualResponses);
  }

  addPersonality(response, intent) {
    const personalityPhrases = {
      confident: ['I believe', 'My analysis shows', 'I\'m confident that', 'The data suggests'],
      helpful: ['Let me help you with that', 'Here\'s what I recommend', 'I\'d suggest', 'Consider this'],
      encouraging: ['You\'re on the right track', 'Great question', 'That\'s smart thinking', 'Keep it up'],
      cautious: ['Remember to be careful', 'Don\'t forget about risk', 'Stay disciplined', 'Patience is key']
    };
    
    // Randomly add personality elements
    if (Math.random() < 0.3) {
      const phrases = this.getRandomElement(Object.values(personalityPhrases));
      const phrase = this.getRandomElement(phrases);
      response = `${phrase}! ${response}`;
    }
    
    return response;
  }

  generateSuggestions(intent, entities) {
    const suggestions = {
      market_analysis: ['Check support levels', 'Review volume patterns', 'Analyze trend strength'],
      trading_advice: ['Set stop losses', 'Calculate position size', 'Plan entry strategy'],
      risk_management: ['Review portfolio allocation', 'Check correlation risks', 'Update stop losses'],
      technical_analysis: ['Check multiple timeframes', 'Confirm with volume', 'Look for divergences']
    };
    
    return suggestions[intent] || ['Ask about risk management', 'Check market conditions', 'Review your strategy'];
  }

  // Helper methods for generating varied responses
  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  getRandomTrend() {
    return this.getRandomElement(['bullish', 'bearish', 'sideways', 'consolidating']);
  }

  getRandomPattern() {
    return this.getRandomElement(['ascending triangle', 'head and shoulders', 'double bottom', 'flag pattern', 'cup and handle']);
  }

  getRandomOutcome() {
    return this.getRandomElement(['a breakout to the upside', 'a breakdown', 'continued consolidation', 'increased volatility']);
  }

  getRandomSignal() {
    return this.getRandomElement(['bullish', 'bearish', 'neutral', 'mixed']);
  }

  getRandomDirection() {
    return this.getRandomElement(['upward', 'downward', 'sideways']);
  }

  getRandomCondition() {
    return this.getRandomElement(['oversold conditions', 'overbought levels', 'neutral territory', 'divergence']);
  }

  getRandomTimeframe() {
    return this.getRandomElement(['4-hour', 'daily', 'weekly', 'hourly']);
  }

  getRandomPrice(asset, multiplier = 1) {
    const basePrices = {
      'BTC/USDT': 43000,
      'ETH/USDT': 2600,
      'AAPL': 150,
      'GOOGL': 140
    };
    
    const basePrice = basePrices[asset] || 100;
    return `$${(basePrice * multiplier).toFixed(2)}`;
  }

  getRandomSuccessRate() {
    return Math.floor(Math.random() * 30) + 60; // 60-90%
  }

  getRandomInsight() {
    return this.getRandomElement([
      'Volume confirms the move.',
      'Watch for any divergences.',
      'The trend remains your friend.',
      'Risk management is crucial here.'
    ]);
  }

  getRandomVolumeInsight() {
    return this.getRandomElement([
      'institutional interest',
      'retail participation',
      'accumulation patterns',
      'distribution signals'
    ]);
  }

  getRandomStrength() {
    return this.getRandomElement(['strong bullish', 'weak bearish', 'mixed', 'consolidation']);
  }

  getRandomRatio() {
    return this.getRandomElement(['favorable', 'acceptable', 'marginal', 'attractive']);
  }

  getRandomConfirmation() {
    return this.getRandomElement([
      'volume confirmation',
      'price action signals',
      'momentum shifts',
      'breakout patterns'
    ]);
  }

  initializeMarketKnowledge() {
    return {
      market_hours: 'Crypto: 24/7, Stocks: 9:30 AM - 4:00 PM EST',
      volatility_levels: { low: '<2%', medium: '2-5%', high: '>5%' },
      risk_levels: { conservative: '1%', moderate: '2%', aggressive: '3%+' }
    };
  }
}

export default api;
