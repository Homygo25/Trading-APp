import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import realTimeService from '@/services/realtime';
import { 
  Wifi, 
  WifiOff, 
  Radio,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

const RealTimeStatus = () => {
  const [connectionStatus, setConnectionStatus] = useState({
    binance: 'disconnected',
    polling: 'inactive'
  });
  const [lastUpdate, setLastUpdate] = useState(null);
  const [dataCount, setDataCount] = useState(0);

  useEffect(() => {
    // Subscribe to real-time updates
    const unsubscribe = realTimeService.subscribe('price_update', (data) => {
      setLastUpdate(new Date());
      setDataCount(prev => prev + 1);
    });

    // Check connection status periodically
    const statusInterval = setInterval(() => {
      setConnectionStatus(realTimeService.getConnectionStatus());
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(statusInterval);
    };
  }, []);

  const isConnected = connectionStatus.binance === 'connected' || connectionStatus.polling === 'active';
  const hasRealTimeData = connectionStatus.binance === 'connected';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center space-x-2 text-xs"
    >
      {/* Connection Status Icon */}
      <div className="flex items-center space-x-1">
        {hasRealTimeData ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-1 text-green-400"
          >
            <Radio className="w-3 h-3" />
            <span className="hidden sm:inline">Live</span>
          </motion.div>
        ) : isConnected ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-1 text-yellow-400"
          >
            <Wifi className="w-3 h-3" />
            <span className="hidden sm:inline">Polling</span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center space-x-1 text-red-400"
          >
            <WifiOff className="w-3 h-3" />
            <span className="hidden sm:inline">Offline</span>
          </motion.div>
        )}
      </div>

      {/* Data Indicator */}
      {lastUpdate && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center space-x-1 text-gray-400"
        >
          <Clock className="w-3 h-3" />
          <span className="hidden md:inline">
            {lastUpdate.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </span>
        </motion.div>
      )}

      {/* Update Count */}
      {dataCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-medium"
        >
          {dataCount}
        </motion.div>
      )}

      {/* Status Tooltip */}
      <div className="group relative">
        <AlertCircle className="w-3 h-3 text-gray-500 cursor-help" />
        <div className="invisible group-hover:visible absolute right-0 top-5 bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs whitespace-nowrap z-50">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Crypto (WebSocket):</span>
              <span className={connectionStatus.binance === 'connected' ? 'text-green-400' : 'text-red-400'}>
                {connectionStatus.binance}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Stocks (Polling):</span>
              <span className={connectionStatus.polling === 'active' ? 'text-green-400' : 'text-red-400'}>
                {connectionStatus.polling}
              </span>
            </div>
            {hasRealTimeData && (
              <div className="text-green-400 text-center pt-1 border-t border-gray-700">
                ✨ Real-time data active
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RealTimeStatus;
