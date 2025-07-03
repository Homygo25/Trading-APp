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
  Lightbulb,
  User,
  Bot,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

const AIAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { selectedAsset, marketData, generateNewSignal, chatWithAI, aiAnalysis } = useTradingContext();
  const { toast } = useToast();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Initialize with welcome message
    setChatHistory([
      {
        id: 1,
        type: 'ai',
        message: `Hello! I'm Aladdin, your AI trading assistant. I can help you analyze ${selectedAsset} and generate trading signals. What would you like to know?`,
        timestamp: new Date().toISOString(),
        confidence: 95,
      }
    ]);
  }, [selectedAsset]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isTyping]);

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

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    setChatHistory(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);

    try {
      // Get AI response
      const aiResponse = await chatWithAI(message.trim());
      
      setTimeout(() => {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          message: aiResponse.message,
          timestamp: aiResponse.timestamp,
          confidence: aiResponse.confidence,
        };

        setChatHistory(prev => [...prev, aiMessage]);
        setIsTyping(false);
      }, 1000 + Math.random() * 2000); // Simulate thinking time

    } catch (error) {
      setIsTyping(false);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: "I'm sorry, I'm experiencing some difficulties right now. Please try again in a moment.",
        timestamp: new Date().toISOString(),
        confidence: 50,
        error: true,
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = async (action) => {
    let quickMessage = '';
    
    switch (action) {
      case 'analyze':
        quickMessage = `Please analyze ${selectedAsset} and provide trading insights`;
        break;
      case 'signals':
        quickMessage = 'Generate trading signals for current market conditions';
        break;
      case 'risk':
        quickMessage = 'What are the current risk factors I should consider?';
        break;
      case 'strategy':
        quickMessage = 'Suggest a trading strategy for the current market';
        break;
      default:
        return;
    }

    setMessage(quickMessage);
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay for UI
    handleSendMessage();
  };

  const copyMessage = (messageText) => {
    navigator.clipboard.writeText(messageText);
    toast({
      title: "Copied!",
      description: "Message copied to clipboard",
      duration: 2000,
    });
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-green-400';
    if (confidence >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceText = (confidence) => {
    if (confidence >= 80) return 'High confidence';
    if (confidence >= 60) return 'Medium confidence';
    return 'Low confidence';
  };

  // Smart suggestion prompts for better AI interactions
  const smartSuggestions = [
    "What's your analysis of BTC/USDT right now?",
    "Should I buy ETH at current levels?",
    "How should I manage risk on this trade?",
    "What technical indicators should I watch?",
    "Is this a good time to enter the market?",
    "What's your outlook for the next 4 hours?",
    "How do you read this chart pattern?",
    "What's the best strategy for beginners?",
    "Should I set a stop loss at 2%?",
    "Is my portfolio allocation balanced?"
  ];

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="ai-assistant h-full flex flex-col bg-black/20 backdrop-blur-sm rounded-lg border border-gray-700/50"
    >
      {/* Header */}
      <header className="p-3 sm:p-4 border-b border-gray-700/50 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-600 rounded-lg">
              <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm sm:text-base">AI Assistant</h3>
              <p className="text-xs text-gray-400">Aladdin • Online</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>
        </div>
      </header>

      {/* Quick Actions */}
      <div className="p-3 bg-black/20 border-b border-gray-700/50">
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => handleQuickAction('analyze')}
            className="text-xs text-gray-300 hover:text-white hover:bg-purple-600/20 border border-gray-600/50"
          >
            <Target className="w-3 h-3 mr-1" />
            Analyze
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => handleQuickAction('signals')}
            className="text-xs text-gray-300 hover:text-white hover:bg-blue-600/20 border border-gray-600/50"
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            Signals
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => handleQuickAction('risk')}
            className="text-xs text-gray-300 hover:text-white hover:bg-red-600/20 border border-gray-600/50"
          >
            <AlertCircle className="w-3 h-3 mr-1" />
            Risk
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => handleQuickAction('strategy')}
            className="text-xs text-gray-300 hover:text-white hover:bg-green-600/20 border border-gray-600/50"
          >
            <Lightbulb className="w-3 h-3 mr-1" />
            Strategy
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 scrollbar-hide">
        <AnimatePresence>
          {chatHistory.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] ${msg.type === 'user' ? 'order-2' : 'order-1'}`}>
                <div className={`flex items-start space-x-2 ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.type === 'user' 
                      ? 'bg-blue-600' 
                      : msg.error 
                        ? 'bg-red-600' 
                        : 'bg-purple-600'
                  }`}>
                    {msg.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`rounded-lg p-3 ${
                    msg.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : msg.error
                        ? 'bg-red-900/50 text-red-200 border border-red-600/50'
                        : 'bg-gray-800 text-gray-100 border border-gray-700/50'
                  }`}>
                    <p className="text-xs sm:text-sm leading-relaxed">{msg.message}</p>
                    
                    {msg.type === 'ai' && msg.confidence && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-600/50">
                        <span className={`text-[10px] ${getConfidenceColor(msg.confidence)}`}>
                          {getConfidenceText(msg.confidence)} ({msg.confidence}%)
                        </span>
                        <div className="flex items-center space-x-1">
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => copyMessage(msg.message)}
                            className="text-gray-400 hover:text-white p-1 h-auto"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="text-gray-400 hover:text-green-400 p-1 h-auto"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button
                            size="xs"
                            variant="ghost"
                            className="text-gray-400 hover:text-red-400 p-1 h-auto"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className={`text-[10px] text-gray-500 mt-1 ${msg.type === 'user' ? 'text-right' : 'text-left'} px-10`}>
                  {new Date(msg.timestamp).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700/50">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 sm:p-4 border-t border-gray-700/50 bg-black/20">
        {/* Smart Suggestions */}
        {chatHistory.length === 0 && (
          <div className="mb-3">
            <div className="text-xs text-gray-400 mb-2">💡 Try asking:</div>
            <div className="flex flex-wrap gap-1">
              {smartSuggestions.slice(0, 3).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-2 py-1 rounded transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? "Listening..." : "Ask me anything about trading..."}
              disabled={isListening || isTyping}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm resize-none focus:outline-none focus:border-purple-500 disabled:opacity-50"
              rows={1}
              style={{ maxHeight: '60px' }}
            />
          </div>
          
          <Button
            size="sm"
            variant="ghost"
            onClick={handleVoiceToggle}
            disabled={isTyping}
            className={`${isListening ? 'text-red-400 bg-red-400/10' : 'text-gray-400'} hover:text-white hover:bg-gray-700/50 p-2`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!message.trim() || isListening || isTyping}
            className="bg-purple-600 hover:bg-purple-700 text-white p-2"
          >
            {isTyping ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-[10px] text-gray-500">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>Powered by AI</span>
        </div>

        {/* Smart Suggestions */}
        <div className="mt-3">
          <p className="text-xs text-gray-400 mb-2">Smart Suggestions:</p>
          <div className="grid grid-cols-2 gap-2">
            {smartSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                size="xs"
                variant="outline"
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-gray-300 border-gray-600/50 hover:bg-purple-600/20"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default AIAssistant;
