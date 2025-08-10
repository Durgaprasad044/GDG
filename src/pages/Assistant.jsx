import React, { useState, useEffect, useRef } from 'react';
import { Send, Mic, MicOff, Search, TrendingUp, BarChart3, DollarSign, Settings } from 'lucide-react';
import axios from 'axios';

const Assistant = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: 'Hello! I\'m MetAI, your advanced cryptocurrency assistant powered by Google Gemini AI. I can help you analyze markets, get real-time coin information, and provide trading insights. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [isApiKeySet, setIsApiKeySet] = useState(false);
  const messagesEndRef = useRef(null);

  // Speech recognition setup
  const recognition = useRef(null);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = 'en-US';

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.current.onerror = () => {
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };
    }

    fetchMarketData();
    scrollToBottom();
    loadApiKey();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load API key from environment or localStorage
  const loadApiKey = () => {
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const storedApiKey = localStorage.getItem('metai_gemini_api_key');
    
    if (envApiKey) {
      setGeminiApiKey(envApiKey);
      setIsApiKeySet(true);
    } else if (storedApiKey) {
      setGeminiApiKey(storedApiKey);
      setIsApiKeySet(true);
    } else {
      setShowSettings(true);
    }
  };

  // Save API key to localStorage
  const saveApiKey = () => {
    if (geminiApiKey.trim()) {
      localStorage.setItem('metai_gemini_api_key', geminiApiKey);
      setIsApiKeySet(true);
      setShowSettings(false);
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'assistant',
        content: '🔑 API key saved successfully! I\'m now powered by Google Gemini AI and ready to provide advanced cryptocurrency insights.',
        timestamp: new Date()
      }]);
    }
  };

  // Send message to Gemini API
  const sendToGeminiAPI = async (message) => {
    if (!isApiKeySet || !geminiApiKey) {
      return "Please set up your Gemini API key first to use AI features.";
    }

    try {
      const cryptoContext = `
You are MetAI, an advanced cryptocurrency assistant. You have access to real-time market data and provide expert analysis on:
- Cryptocurrency markets and trends
- Technical analysis and trading strategies  
- DeFi protocols and blockchain technology
- Portfolio management and risk assessment
- Market news and regulatory updates

Current market context: Bitcoin and major altcoins are showing volatility. Always provide data-driven insights and mention when information might need real-time verification.

User message: ${message}
`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: cryptoContext
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle different possible response formats
      if (data.candidates && data.candidates[0]) {
        const candidate = data.candidates[0];
        
        // Check for content.parts format
        if (candidate.content && candidate.content.parts && candidate.content.parts[0]) {
          return candidate.content.parts[0].text;
        }
        
        // Check for direct text format
        if (candidate.text) {
          return candidate.text;
        }
        
        // Check for output format
        if (candidate.output) {
          return candidate.output;
        }
      }
      
      // Handle error responses
      if (data.error) {
        throw new Error(data.error.message || 'API returned an error');
      }
      
      throw new Error('Invalid or empty response from Gemini API');
    } catch (error) {
      console.error('Gemini API error:', error);
      
      if (error.message.includes('API_KEY_INVALID') || error.message.includes('403')) {
        return '🔑 Invalid API key. Please check your Gemini API key in settings.';
      }
      
      if (error.message.includes('429')) {
        return '⏱️ Rate limit exceeded. Please wait a moment before trying again.';
      }
      
      if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
        return '🌐 Network error. Please check your internet connection and try again.';
      }
      
      return `❌ AI service temporarily unavailable: ${error.message}. Using fallback mode.`;
    }
  };

  const fetchMarketData = async () => {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 5,
            page: 1,
            sparkline: false,
            price_change_percentage: '24h'
          }
        }
      );
      setMarketData(response.data);
    } catch (error) {
      console.error('Error fetching market data:', error);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/search`,
        {
          params: { query: searchQuery }
        }
      );
      
      setSearchResults(response.data.coins.slice(0, 5));
    } catch (error) {
      console.error('Error searching coins:', error);
    }
  };

  const generateAIResponse = async (userMessage) => {
    // Validate input message
    if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
      return "I didn't receive your message properly. Please try typing your question again.";
    }

    // Try Gemini AI first, fall back to local responses if API not available
    if (isApiKeySet && geminiApiKey) {
      try {
        const aiResponse = await sendToGeminiAPI(userMessage);
        if (aiResponse && typeof aiResponse === 'string' && aiResponse.trim()) {
          return aiResponse;
        }
        console.warn('Empty or invalid AI response, using fallback');
      } catch (error) {
        console.error('Gemini API failed, using fallback:', error);
        // Continue to fallback logic below
      }
    }

    // Fallback logic for when API is not available
    const message = userMessage.toLowerCase();
    
    if (message.includes('bitcoin') || message.includes('btc')) {
      const btcData = marketData.find(coin => coin.symbol === 'btc');
      if (btcData) {
        return `🪙 **Bitcoin Analysis** (Basic Mode - Enable Gemini AI for advanced insights)

📊 **Current Data:**
• Price: $${btcData.current_price.toLocaleString()}
• 24h Change: ${btcData.price_change_percentage_24h.toFixed(2)}%
• Market Sentiment: ${btcData.price_change_percentage_24h >= 0 ? 'Bullish 📈' : 'Bearish 📉'}

💡 **Quick Insights:**
• Bitcoin remains the leading cryptocurrency by market cap
• Institutional adoption continues to grow globally  
• Consider monitoring regulatory developments

🔑 **Enable Gemini AI** for detailed technical analysis, trading strategies, and personalized recommendations!`;
      }
    } else if (message.includes('ethereum') || message.includes('eth')) {
      const ethData = marketData.find(coin => coin.symbol === 'eth');
      if (ethData) {
        return `⚡ **Ethereum Overview** (Basic Mode)

📊 **Current Stats:**
• Price: $${ethData.current_price.toLocaleString()}  
• 24h Change: ${ethData.price_change_percentage_24h.toFixed(2)}%

🔍 **Key Points:**
• Leading smart contract platform
• Strong DeFi ecosystem
• Layer 2 scaling solutions growing
• Proof of Stake consensus (energy efficient)

🚀 **Unlock advanced Ethereum analysis with Gemini AI integration!**`;
      }
    } else {
      return `🤖 **Enhanced AI Features Available!**

I can provide basic cryptocurrency information, but with Gemini AI integration, you'll get:

✨ **Advanced Features:**
• Real-time market sentiment analysis
• Personalized trading strategies  
• Complex technical analysis
• Portfolio optimization advice
• News impact assessment
• Risk management recommendations

🔧 **Setup Gemini AI:**
Click the settings button (⚙️) to add your API key and unlock the full power of MetAI!

📝 **Get your free API key:** https://makersuite.google.com/app/apikey`;
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const messageText = inputMessage.trim(); // Store the message before clearing
    console.log('Sending message:', messageText); // Debug log
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(messageText); // Use stored message
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if (recognition.current && !isListening) {
      setIsListening(true);
      recognition.current.start();
    }
  };

  const stopListening = () => {
    if (recognition.current && isListening) {
      recognition.current.stop();
      setIsListening(false);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-gray-100 mb-2">
            🤖 MetAI Assistant {isApiKeySet && <span className="text-green-500 text-sm">⚡ AI Enhanced</span>}
          </h1>
          <p className="text-slate-600 dark:text-gray-400">
            Your AI-powered cryptocurrency assistant with voice support
          </p>
        </div>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="btn-secondary p-3 rounded-full"
          title="AI Settings"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="card p-6 mb-8 animate-scale-in">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-4">
            🔧 AI Configuration
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Google Gemini API Key
              </label>
              <div className="flex space-x-2">
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key..."
                  className="input-field flex-1"
                />
                <button
                  onClick={saveApiKey}
                  className="btn-primary"
                  disabled={!geminiApiKey.trim()}
                >
                  Save
                </button>
              </div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">
                Get your free API key from{' '}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600 underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-gray-100">
                  AI Status: {isApiKeySet ? '🟢 Active' : '🔴 Inactive'}
                </p>
                <p className="text-xs text-slate-500 dark:text-gray-400">
                  {isApiKeySet ? 'Advanced AI features enabled' : 'Using basic responses'}
                </p>
              </div>
              {isApiKeySet && (
                <button
                  onClick={() => {
                    localStorage.removeItem('metai_gemini_api_key');
                    setGeminiApiKey('');
                    setIsApiKeySet(false);
                    setMessages(prev => [...prev, {
                      id: Date.now(),
                      type: 'assistant',
                      content: '🔓 API key removed. Switched to basic mode.',
                      timestamp: new Date()
                    }]);
                  }}
                  className="text-xs text-red-600 hover:text-red-700 underline"
                >
                  Remove Key
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-16rem)]">
        {/* Left Panel - Tools & Market Data */}
        <div className="lg:col-span-1 space-y-6">
          {/* Coin Search */}
          <div className="card p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-4">
              Coin Search
            </h3>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search cryptocurrencies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="input-field pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
              <button
                type="submit"
                className="w-full btn-primary"
              >
                Search
              </button>
            </form>
            
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-slate-700 dark:text-gray-300">Results:</h4>
                {searchResults.map((coin) => (
                  <div
                    key={coin.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                    onClick={() => setInputMessage(`Tell me about ${coin.name} (${coin.symbol})`)}
                  >
                    <img src={coin.large} alt={coin.name} className="h-6 w-6" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-gray-100">
                        {coin.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        {coin.symbol.toUpperCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Market Stats */}
          <div className="card p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-4">
              Top Cryptocurrencies
            </h3>
            <div className="space-y-3">
              {marketData.map((coin) => (
                <div
                  key={coin.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg cursor-pointer"
                  onClick={() => setInputMessage(`Analyze ${coin.name} for me`)}
                >
                  <div className="flex items-center space-x-3">
                    <img src={coin.image} alt={coin.name} className="h-8 w-8" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-gray-100">
                        {coin.symbol.toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        ${coin.current_price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6 animate-slide-up">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                { icon: TrendingUp, text: 'Market Analysis', query: 'Give me a market analysis' },
                { icon: BarChart3, text: 'Portfolio Review', query: 'Help me review my portfolio strategy' },
                { icon: DollarSign, text: 'Investment Tips', query: 'What are some good investment strategies?' }
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(action.query)}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <action.icon className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-slate-700 dark:text-gray-300">{action.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Chat Interface */}
        <div className="lg:col-span-2 card flex flex-col animate-fade-in">
          {/* Chat Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-gray-100">
              MetAI Assistant
            </h2>
            <p className="text-sm text-slate-600 dark:text-gray-400">
              Your AI-powered cryptocurrency advisor
            </p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-slate-900 dark:text-gray-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-slate-500 dark:text-gray-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                  placeholder="Ask me about cryptocurrencies, market trends, or investment strategies..."
                  className="input-field pr-12"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={isListening ? stopListening : startListening}
                  className={`absolute right-3 top-2.5 p-1 rounded ${
                    isListening 
                      ? 'text-red-600 hover:text-red-700' 
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  disabled={!recognition.current}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
              </div>
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="btn-primary disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assistant;