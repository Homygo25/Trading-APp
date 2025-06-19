
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import MarketTicker from '@/components/MarketTicker';
import AIAssistant from '@/components/AIAssistant';
import SignalPanel from '@/components/SignalPanel';
import ChartWidget from '@/components/ChartWidget';
import StrategyBuilder from '@/components/StrategyBuilder';
import { TradingProvider } from '@/contexts/TradingContext';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isBeginnerMode, setIsBeginnerMode] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setTimeout(() => {
      toast({
        title: "🚀 Welcome to AI Trading Signals!",
        description: "Your advanced trading companion is ready to analyze markets and generate signals.",
        duration: 5000,
      });
    }, 1000);
  }, [toast]);

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard isBeginnerMode={isBeginnerMode} />;
      case 'signals':
        return <SignalPanel />;
      case 'charts':
        return <ChartWidget fullScreen={true} />;
      case 'strategy':
        return <StrategyBuilder />;
      default:
        return <Dashboard isBeginnerMode={isBeginnerMode} />;
    }
  };

  const toggleAIAssistant = () => setIsAIAssistantOpen(!isAIAssistantOpen);

  return (
    <TradingProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
        <Helmet>
          <title>AI Trading Signals - Advanced Market Analysis Platform</title>
          <meta name="description" content="Professional AI-powered trading signals for stocks, forex, and crypto. Real-time market analysis with advanced pattern recognition." />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Helmet>

        <div className="trading-grid min-h-screen flex flex-col">
          <Header 
            activeView={activeView} 
            setActiveView={setActiveView}
            isBeginnerMode={isBeginnerMode}
            setIsBeginnerMode={setIsBeginnerMode}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            toggleAIAssistant={toggleAIAssistant}
          />
          
          <MarketTicker />
          
          <div className="flex flex-1 flex-col lg:flex-row h-[calc(100vh-81px-48px)] lg:h-[calc(100vh-81px)]">
            <div className="flex-1 p-2 sm:p-4 overflow-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {renderMainContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            <aside className={`
              fixed inset-0 z-40 bg-black/50 backdrop-blur-sm
              lg:static lg:z-auto lg:bg-transparent lg:backdrop-blur-none
              lg:w-80 lg:border-l lg:border-gray-700/50 lg:bg-black/20 lg:backdrop-blur-sm
              transform transition-transform duration-300 ease-in-out
              ${isAIAssistantOpen ? 'translate-x-0' : 'translate-x-full'}
              lg:translate-x-0
            `}>
              <div className="h-full flex flex-col">
                <div className="p-2 lg:hidden">
                  <Button variant="ghost" size="icon" onClick={toggleAIAssistant} className="text-white">
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <AIAssistant />
              </div>
            </aside>
          </div>
        </div>
        <Toaster />
      </div>
    </TradingProvider>
  );
}

export default App;
