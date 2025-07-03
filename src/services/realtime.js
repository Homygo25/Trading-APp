// Real-time WebSocket service for live market data
class RealTimeService {
  constructor() {
    this.connections = new Map();
    this.subscribers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
  }

  // Connect to Binance WebSocket for real-time crypto data
  connectToCrypto(symbols = ['BTCUSDT', 'ETHUSDT', 'ADAUSDT']) {
    const streams = symbols.map(symbol => `${symbol.toLowerCase()}@ticker`).join('/');
    const wsUrl = `wss://stream.binance.com:9443/ws/${streams}`;
    
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('📡 Connected to Binance WebSocket');
        this.reconnectAttempts = 0;
        this.connections.set('binance', ws);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleCryptoUpdate(data);
        } catch (error) {
          console.error('Error parsing WebSocket data:', error);
        }
      };
      
      ws.onclose = () => {
        console.log('📡 Binance WebSocket disconnected');
        this.connections.delete('binance');
        this.attemptReconnect('crypto', symbols);
      };
      
      ws.onerror = (error) => {
        console.error('📡 WebSocket error:', error);
      };
      
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
    }
  }

  // Handle real-time crypto price updates
  handleCryptoUpdate(data) {
    if (data.e === '24hrTicker') {
      const priceUpdate = {
        symbol: data.s,
        price: parseFloat(data.c),
        change_24h: parseFloat(data.P),
        volume_24h: parseFloat(data.v),
        high_24h: parseFloat(data.h),
        low_24h: parseFloat(data.l),
        timestamp: Date.now(),
        source: 'binance_websocket'
      };
      
      this.notifySubscribers('price_update', priceUpdate);
    }
  }

  // Subscribe to real-time updates
  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(callback);
    
    return () => {
      this.subscribers.get(event)?.delete(callback);
    };
  }

  // Notify all subscribers of an event
  notifySubscribers(event, data) {
    const callbacks = this.subscribers.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Error in subscriber callback:', error);
        }
      });
    }
  }

  // Attempt to reconnect
  attemptReconnect(type, params) {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      
      setTimeout(() => {
        if (type === 'crypto') {
          this.connectToCrypto(params);
        }
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Max reconnection attempts reached');
    }
  }

  // Start polling for data that doesn't have WebSocket support
  startPolling(interval = 5000) {
    this.pollingInterval = setInterval(async () => {
      try {
        // Poll for stock data since no free WebSocket available
        await this.pollStockData();
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, interval);
  }

  // Poll stock data from our API
  async pollStockData() {
    try {
      const response = await fetch('/backend/api/real-time.php/market-data');
      const data = await response.json();
      
      if (data.success) {
        Object.entries(data.data).forEach(([symbol, priceData]) => {
          if (!symbol.includes('USDT')) { // Stock symbols
            this.notifySubscribers('price_update', {
              ...priceData,
              real_time: true
            });
          }
        });
      }
    } catch (error) {
      console.error('Error polling stock data:', error);
    }
  }

  // Get current connection status
  getConnectionStatus() {
    return {
      binance: this.connections.has('binance') ? 'connected' : 'disconnected',
      polling: this.pollingInterval ? 'active' : 'inactive'
    };
  }

  // Disconnect all connections
  disconnect() {
    this.connections.forEach((ws, key) => {
      ws.close();
    });
    this.connections.clear();
    
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  // Start all real-time connections
  start() {
    console.log('🚀 Starting real-time market data service...');
    
    // Connect to crypto WebSocket
    this.connectToCrypto(['BTCUSDT', 'ETHUSDT', 'ADAUSDT', 'BNBUSDT', 'SOLUSDT']);
    
    // Start polling for stocks
    this.startPolling(5000);
    
    return this;
  }
}

// Create singleton instance
const realTimeService = new RealTimeService();

export default realTimeService;
