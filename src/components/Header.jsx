
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { 
  TrendingUp, 
  BarChart3, 
  Settings, 
  User, 
  Bell,
  Zap,
  Brain,
  Target as TargetIcon,
  Menu,
  X as CloseIcon,
  MessageSquare
} from 'lucide-react';

const Header = ({ 
  activeView, 
  setActiveView, 
  isBeginnerMode, 
  setIsBeginnerMode,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  toggleAIAssistant
}) => {
  const { toast } = useToast();

  const handleNotImplemented = (feature) => {
    toast({
      title: "🚧 Feature Coming Soon!",
      description: `${feature} isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`,
      duration: 3000,
    });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'signals', label: 'Signals', icon: TargetIcon },
    { id: 'charts', label: 'Charts', icon: TrendingUp },
    { id: 'strategy', label: 'Strategy Builder', icon: Brain },
  ];

  return (
    <header className="bg-black/30 backdrop-blur-md border-b border-gray-700/50 px-4 py-3 lg:px-6 lg:py-4">
      <div className="flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-2 lg:space-x-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
          <div>
            <p className="text-lg lg:text-xl font-bold gradient-text">AI Signals</p>
            <p className="hidden sm:block text-xs text-gray-400">Market Intelligence</p>
          </div>
        </motion.div>

        <nav aria-label="Main navigation" className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeView === item.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveView(item.id)}
                className={`flex items-center space-x-2 ${
                  activeView === item.id 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                }`}
                aria-current={activeView === item.id ? "page" : undefined}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>

        <div className="flex items-center space-x-2 lg:space-x-3">
          <div className="hidden sm:flex items-center bg-gray-800/50 rounded-lg p-1" role="radiogroup" aria-label="Trading mode">
            <Button
              size="sm"
              variant={isBeginnerMode ? "default" : "ghost"}
              onClick={() => setIsBeginnerMode(true)}
              className={`text-xs px-2 ${isBeginnerMode ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
              role="radio"
              aria-checked={isBeginnerMode}
            >
              Beginner
            </Button>
            <Button
              size="sm"
              variant={!isBeginnerMode ? "default" : "ghost"}
              onClick={() => setIsBeginnerMode(false)}
              className={`text-xs px-2 ${!isBeginnerMode ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
              role="radio"
              aria-checked={!isBeginnerMode}
            >
              Pro
            </Button>
          </div>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => handleNotImplemented('Notifications')}
            className="text-gray-300 hover:text-white lg:hidden"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
          </Button>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleAIAssistant}
            className="text-gray-300 hover:text-white lg:hidden"
            aria-label="Toggle AI Assistant"
          >
            <MessageSquare className="w-5 h-5" />
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-300 hover:text-white lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <CloseIcon className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
          
          <div className="hidden lg:flex items-center space-x-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleNotImplemented('Notifications')}
              className="text-gray-300 hover:text-white"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleNotImplemented('Settings')}
              className="text-gray-300 hover:text-white"
              aria-label="Open settings"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleNotImplemented('User Profile')}
              className="text-gray-300 hover:text-white"
              aria-label="User profile"
            >
              <User className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden mt-2 bg-black/50 rounded-md"
          >
            <nav aria-label="Mobile navigation" className="flex flex-col space-y-1 p-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeView === item.id ? "default" : "ghost"}
                    size="sm"
                    onClick={() => {
                      setActiveView(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center justify-start space-x-3 w-full p-3 ${
                      activeView === item.id 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                    }`}
                    aria-current={activeView === item.id ? "page" : undefined}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Button>
                );
              })}
              <div className="border-t border-gray-700/50 my-2"></div>
              <div className="flex items-center justify-center bg-gray-800/50 rounded-lg p-1 mx-2" role="radiogroup" aria-label="Trading mode">
                <Button
                  size="sm"
                  variant={isBeginnerMode ? "default" : "ghost"}
                  onClick={() => setIsBeginnerMode(true)}
                  className={`text-xs flex-1 ${isBeginnerMode ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
                  role="radio"
                  aria-checked={isBeginnerMode}
                >
                  Beginner
                </Button>
                <Button
                  size="sm"
                  variant={!isBeginnerMode ? "default" : "ghost"}
                  onClick={() => setIsBeginnerMode(false)}
                  className={`text-xs flex-1 ${!isBeginnerMode ? 'bg-purple-600 text-white' : 'text-gray-400'}`}
                  role="radio"
                  aria-checked={!isBeginnerMode}
                >
                  Pro
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { handleNotImplemented('Settings'); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-start space-x-3 w-full p-3 text-gray-300 hover:text-white hover:bg-gray-700/50"
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { handleNotImplemented('User Profile'); setIsMobileMenuOpen(false); }}
                className="flex items-center justify-start space-x-3 w-full p-3 text-gray-300 hover:text-white hover:bg-gray-700/50"
              >
                <User className="w-5 h-5" />
                <span>Profile</span>
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
