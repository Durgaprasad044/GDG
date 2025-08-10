import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from 'lucide-react';

const Home = () => {
  const [marketStats, setMarketStats] = useState([]);
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarketData();
    fetchTrendingCoins();
  }, []);

  const fetchMarketData = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/global');
      const data = response.data.data;
      
      const stats = [
        {
          label: 'Market Cap',
          value: `$${formatNumber(data.total_market_cap.usd)}`,
          icon: DollarSign,
          change: data.market_cap_change_percentage_24h_usd
        },
        {
          label: '24h Volume',
          value: `$${formatNumber(data.total_volume.usd)}`,
          icon: BarChart3,
          change: 0
        },
        {
          label: 'BTC Dominance',
          value: `${data.market_cap_percentage.btc.toFixed(1)}%`,
          icon: TrendingUp,
          change: 0
        },
        {
          label: 'ETH Dominance',
          value: `${data.market_cap_percentage.eth.toFixed(1)}%`,
          icon: TrendingUp,
          change: 0
        }
      ];
      
      setMarketStats(stats);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Failed to fetch market data');
    }
  };

  const fetchTrendingCoins = async () => {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 10,
            page: 1,
            sparkline: false,
            price_change_percentage: '24h'
          }
        }
      );
      
      setTrendingCoins(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching trending coins:', err);
      setError('Failed to fetch cryptocurrency data');
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000000000) return `${(num / 1000000000000).toFixed(2)}T`;
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent leading-tight">
          Track Crypto Markets
        </h1>
        <p className="text-xl text-slate-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          Get real-time data, AI-powered insights, and market predictions all in one place
        </p>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {marketStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="card card-hover p-6 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                {stat.change !== 0 && (
                  <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                    stat.change >= 0 
                      ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' 
                      : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                  }`}>
                    {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(2)}%
                  </span>
                )}
              </div>
              <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">
                {stat.label}
              </h3>
              <p className="text-2xl font-bold text-slate-900 dark:text-gray-100">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Trending Cryptocurrencies */}
      <div className="card animate-fade-in">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100">
            📈 Trending Cryptocurrencies
          </h2>
          <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
            Top performing cryptocurrencies by market cap
          </p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  24h Change
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  Market Cap
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {trendingCoins.map((coin, index) => (
                <tr key={coin.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-all duration-200 group">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-gray-100">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                      {index + 1}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <img className="h-8 w-8 rounded-full mr-3" src={coin.image} alt={coin.name} />
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-gray-100">
                          {coin.name}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-gray-400 uppercase">
                          {coin.symbol}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-gray-100">
                    ${coin.current_price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center text-sm font-medium ${
                      coin.price_change_percentage_24h >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {coin.price_change_percentage_24h >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                      {coin.price_change_percentage_24h.toFixed(2)}%
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-gray-100">
                    ${formatNumber(coin.market_cap)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-12 border-t border-gray-200 dark:border-slate-700 animate-fade-in">
        <div className="text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-gray-100 mb-4">
              MetAI - Your Crypto Companion
            </h3>
            <p className="text-slate-600 dark:text-gray-400 max-w-2xl mx-auto">
              Advanced cryptocurrency analytics powered by AI. Track markets, manage portfolios, 
              and get intelligent insights for better trading decisions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-3">
                🚀 Features
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-gray-400">
                <li>Real-time Market Data</li>
                <li>AI-Powered Analysis</li>
                <li>Portfolio Management</li>
                <li>Voice Assistant</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-3">
                📊 Analytics
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-gray-400">
                <li>Advanced Charts</li>
                <li>Technical Indicators</li>
                <li>Market Trends</li>
                <li>Performance Metrics</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-3">
                🤖 AI Assistant
              </h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-gray-400">
                <li>Smart Recommendations</li>
                <li>Market Insights</li>
                <li>Risk Assessment</li>
                <li>Trading Strategies</li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 dark:border-slate-700">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm text-slate-500 dark:text-gray-400">
                © {new Date().getFullYear()} All rights reserved by <span className="font-semibold text-blue-600 dark:text-blue-400">MetACoders</span>
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-sm text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-sm text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-sm text-slate-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;