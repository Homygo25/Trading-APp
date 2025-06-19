
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTradingContext } from '@/contexts/TradingContext';
import { 
  Eye, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  X,
  Star
} from 'lucide-react';

const WatchlistWidget = () => {
  const { 
    watchlist, 
    marketData, 
    selectedAsset, 
    setSelectedAsset,
    removeFromWatchlist 
  } = useTradingContext();
  const { toast } = useToast();

  const handleAddToWatchlist = () => {
    toast({
      title: "🚧 Add Asset Coming Soon!",
      description: "Custom asset addition isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀",
      duration: 3000,
    });
  };

  const handleRemoveFromWatchlist = (asset) => {
    removeFromWatchlist(asset);
    toast({
      title: "Removed from Watchlist",
      description: `${asset} has been removed from your watchlist`,
      duration: 2000,
    });
  };

  return (
    <motion.section
      aria-labelledby="watchlist-heading"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="signal-card rounded-lg p-2 sm:p-4 h-full flex flex-col"
    >
      <header className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 id="watchlist-heading" className="text-base sm:text-lg font-semibold text-white flex items-center space-x-2">
          <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" aria-hidden="true" />
          <span>Watchlist</span>
        </h2>
        
        <Button
          size="iconxs"
          variant="ghost"
          onClick={handleAddToWatchlist}
          className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-1 sm:p-1.5"
          aria-label="Add asset to watchlist"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
        </Button>
      </header>

      <div className="flex-1 space-y-1.5 sm:space-y-2 overflow-y-auto scrollbar-hide">
        {watchlist.length === 0 ? (
          <div className="text-center py-4 sm:py-8 text-gray-400 flex flex-col items-center justify-center h-full">
            <Star className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" aria-hidden="true" />
            <p className="text-sm sm:text-base">No assets in watchlist</p>
            <p className="text-xs sm:text-sm">Add assets to track them</p>
          </div>
        ) : (
          <ul role="listbox" aria-label="Watchlist assets">
            {watchlist.map((asset) => {
              const data = marketData[asset];
              const isSelected = selectedAsset === asset;
              
              return (
                <motion.li
                  key={asset}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-2 sm:p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-green-600/20 border-green-400/50' 
                      : 'bg-black/40 border-gray-700/50 hover:border-blue-400/30'
                  }`}
                  onClick={() => setSelectedAsset(asset)}
                  role="option"
                  aria-selected={isSelected}
                  tabIndex={0}
                  onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedAsset(asset); }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                        <span className="font-medium text-white text-xs sm:text-sm">{asset}</span>
                        <Button
                          size="iconxs"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromWatchlist(asset);
                          }}
                          className="text-gray-400 hover:text-red-400 p-0.5 sm:p-1 h-auto"
                          aria-label={`Remove ${asset} from watchlist`}
                        >
                          <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
                        </Button>
                      </div>
                      
                      {data && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 text-xs sm:text-sm">
                            ${typeof data.price === 'number' ? data.price.toFixed(2) : data.price}
                          </span>
                          <div className={`flex items-center space-x-1 text-[10px] sm:text-xs ${
                            data.change >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {data.change >= 0 ? (
                              <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
                            ) : (
                              <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" aria-hidden="true" />
                            )}
                            <span>{data.change >= 0 ? '+' : ''}{data.change?.toFixed(2)}%</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </motion.section>
  );
};

export default WatchlistWidget;
