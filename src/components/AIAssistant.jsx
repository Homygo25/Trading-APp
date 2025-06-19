
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useTradingContext } from '@/contexts/TradingContext';
import { 
  Brain, 
  Mic, 
  MicOff, 
  Send, 
  TrendingUp,
  Target,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

const AIAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { selectedAsset, marketData, generateNewSignal } = useTradingContext();
  const { toast } = useToast();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setChatHistory([
      {
        id: 1,
        type: 'ai',
        message: `Hello! I'm Aladdin, your AI trading assistant. I can help you analyze ${selectedAsset} and generate trading signals. What would you like to know?`,
        timestamp: new Date().toISOString(),
      }
    ]);
  }, [selectedAsset]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleVoiceToggle = () => {
    if (!isListening) {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          setIsListening(true);
          toast({
            title: "🎤 Listening...",
            description: "Speak your trading question",
            duration: 2000,
          });
        };
        
        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setMessage(transcript);
          setIsListening(false);
        };
        
        recognition.onerror = () => {
          setIsListening(false);
          toast({
            title: "Voice Recognition Error",
            description: "Please try again or type your message",
            duration: 3000,
          });
        };
        
        recognition.onend = () => {
          setIsListening(false);
        };
        
        recognition.start();
      } else {
        toast({
          title: "Voice Not Supported",
          description: "Your browser doesn't support voice recognition",
          duration: 3000,
        });
      }
    } else {
      setIsListening(false);
    }
  };

  const generateAIResponse = (userMessage) => {
    const lowerUserMessage = userMessage.toLowerCase();
    const responses = [
      {
        condition: (msg) => msg.includes('signal') || msg.includes('trade'),
        response: () => {
          const signal = generateNewSignal(selectedAsset, Math.random() > 0.5 ? 'BUY' : 'SELL');
          return `I've generated a new ${signal.type} signal for ${selectedAsset}! Based on the ${signal.pattern} pattern, I recommend a ${signal.type} position with ${signal.confidence}% confidence. Entry at ${signal.entry.toFixed(2)}, target ${signal.target.toFixed(2)}.`;
        }
      },
      {
        condition: (msg) => msg.includes('analysis') || msg.includes('analyze'),
        response: () => `Analyzing ${selectedAsset}... Current price is ${marketData[selectedAsset]?.price?.toFixed(2)}. The market is showing ${marketData[selectedAsset]?.change >= 0 ? 'bullish' : 'bearish'} momentum with ${Math.abs(marketData[selectedAsset]?.change || 0).toFixed(2)}% movement. I detect potential support at ${(marketData[selectedAsset]?.price * 0.98)?.toFixed(2)} and resistance at ${(marketData[selectedAsset]?.price * 1.02)?.toFixed(2)}.`
      },
      {
        condition: (msg) => msg.includes('risk'),
        response: () => `Risk assessment for ${selectedAsset}: Current volatility is moderate. I recommend position sizing at 2-3% of portfolio for this trade. Consider setting stop-loss at 2% below entry for optimal risk management.`
      },
      {
        condition: (msg) => msg.includes('pattern'),
        response: () => {
          const patterns = ['Head & Shoulders', 'Double Bottom', 'Ascending Triangle', 'Bull Flag', 'Cup & Handle'];
          const pattern = patterns[Math.floor(Math.random() * patterns.length)];
          return `I'm detecting a potential ${pattern} pattern forming on ${selectedAsset}. This typically indicates ${Math.random() > 0.5 ? 'bullish' : 'bearish'} momentum. Watch for confirmation with volume increase.`;
        }
      },
      {
        condition: () => true,
        response: () => `I understand you're asking about ${selectedAsset}. Based on current market conditions, I recommend monitoring the key levels and waiting for clear signals. Would you like me to generate a specific trading signal or analyze a particular pattern?`
      }
    ];

    const matchedResponse = responses.find(r => r.condition(lowerUserMessage));
    return matchedResponse.response();
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessageEntry = {
      id: Date.now(),
      type: 'user',
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatHistory(prev => [...prev, userMessageEntry]);
    setMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponseEntry = {
        id: Date.now() + 1,
        type: 'ai',
        message: generateAIResponse(userMessageEntry.message),
        timestamp: new Date().toISOString(),
      };

      setChatHistory(prev => [...prev, aiResponseEntry]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'Analyze', icon: TrendingUp, action: () => { setMessage('Analyze the current market conditions'); handleSendMessage(); } },
    { label: 'Signal', icon: Target, action: () => { setMessage('Generate a trading signal'); handleSendMessage(); } },
    { label: 'Risk', icon: AlertCircle, action: () => { setMessage('What is the current risk level?'); handleSendMessage(); } },
    { label: 'Pattern', icon: Lightbulb, action: () => { setMessage('Detect chart patterns'); handleSendMessage(); } },
  ];

  return (
    <section aria-labelledby="ai-assistant-heading" className="ai-assistant h-full rounded-lg p-2 sm:p-4 flex flex-col">
      <header className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-700/50">
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <Brain className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div>
          <h2 id="ai-assistant-heading" className="font-semibold text-sm sm:text-base text-white">Aladdin AI</h2>
          <p className="text-xs text-gray-400">Trading Assistant</p>
        </div>
        <div className="ml-auto">
          <div className="w-2 h-2 bg-green-400 rounded-full pulse-animation" aria-label="AI Assistant Online"></div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-1 sm:gap-2 mb-3 sm:mb-4">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              size="xs"
              variant="ghost"
              onClick={action.action}
              className="text-[10px] sm:text-xs text-gray-300 hover:text-white hover:bg-gray-700/50 p-1 sm:p-2 h-auto flex flex-col items-center space-y-0.5 sm:space-y-1"
            >
              <Icon className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
              <span>{action.label}</span>
            </Button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide space-y-2 sm:space-y-3 mb-3 sm:mb-4" aria-live="polite">
        {chatHistory.map((chat) => (
          <motion.div
            key={chat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-2 sm:p-3 rounded-lg ${
              chat.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-100'
            }`}>
              <p className="text-xs sm:text-sm">{chat.message}</p>
              <p className="text-[10px] sm:text-xs opacity-70 mt-1">
                <time dateTime={chat.timestamp}>{new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</time>
              </p>
            </div>
          </motion.div>
        ))}
        
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex justify-start"
              aria-label="AI is typing"
            >
              <div className="bg-gray-800 p-2 sm:p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage();}} className="flex items-center space-x-1 sm:space-x-2">
        <div className="flex-1 relative">
          <label htmlFor="ai-message-input" className="sr-only">Message Aladdin AI</label>
          <textarea
            id="ai-message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask Aladdin..."
            className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white placeholder-gray-400 resize-none focus:outline-none focus:border-blue-500"
            rows="1"
          />
        </div>
        
        <div className="flex flex-col space-y-0.5 sm:space-y-1">
          <Button
            type="button"
            size="iconxs"
            variant="ghost"
            onClick={handleVoiceToggle}
            className={`p-1 sm:p-2 ${isListening ? 'text-red-400 hover:text-red-300' : 'text-gray-400 hover:text-white'}`}
            aria-label={isListening ? "Stop voice input" : "Start voice input"}
          >
            {isListening ? <MicOff className="w-3 h-3 sm:w-4 sm:h-4" /> : <Mic className="w-3 h-3 sm:w-4 sm:h-4" />}
          </Button>
          
          <Button
            type="submit"
            size="iconxs"
            disabled={!message.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-1 sm:p-2"
            aria-label="Send message"
          >
            <Send className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        </div>
      </form>
    </section>
  );
};

export default AIAssistant;
