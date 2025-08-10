import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [priceData, setPriceData] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoin, setSelectedCoin] = useState('bitcoin');
  const [timeRange, setTimeRange] = useState('7');

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  useEffect(() => {
    fetchChartData();
    fetchPortfolioData();
    fetchMarketData();
  }, [selectedCoin, timeRange]);

  const fetchChartData = async () => {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${selectedCoin}/market_chart`,
        {
          params: {
            vs_currency: 'usd',
            days: timeRange
          }
        }
      );

      const formattedData = response.data.prices.map((price, index) => ({
        date: new Date(price[0]).toLocaleDateString(),
        price: price[1],
        volume: response.data.total_volumes[index] ? response.data.total_volumes[index][1] : 0
      }));

      setPriceData(formattedData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    }
  };

  const fetchPortfolioData = async () => {
    // Mock portfolio data - in real app, this would come from user's portfolio
    const mockPortfolio = [
      { name: 'Bitcoin', value: 45000, percentage: 45 },
      { name: 'Ethereum', value: 25000, percentage: 25 },
      { name: 'Cardano', value: 15000, percentage: 15 },
      { name: 'Solana', value: 10000, percentage: 10 },
      { name: 'Others', value: 5000, percentage: 5 }
    ];
    setPortfolioData(mockPortfolio);
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

      const formattedData = response.data.map(coin => ({
        name: coin.symbol.toUpperCase(),
        price: coin.current_price,
        change: coin.price_change_percentage_24h,
        volume: coin.total_volume
      }));

      setMarketData(formattedData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching market data:', error);
      setLoading(false);
    }
  };

  const coins = [
    { id: 'bitcoin', name: 'Bitcoin' },
    { id: 'ethereum', name: 'Ethereum' },
    { id: 'cardano', name: 'Cardano' },
    { id: 'solana', name: 'Solana' },
    { id: 'polkadot', name: 'Polkadot' }
  ];

  const timeRanges = [
    { value: '1', label: '1D' },
    { value: '7', label: '7D' },
    { value: '30', label: '30D' },
    { value: '90', label: '90D' },
    { value: '365', label: '1Y' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-gray-100 mb-2">
          📊 Dashboard
        </h1>
        <p className="text-slate-600 dark:text-gray-400">
          Interactive charts and portfolio analytics
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
            Coin:
          </label>
          <select
            value={selectedCoin}
            onChange={(e) => setSelectedCoin(e.target.value)}
            className="input-field"
          >
            {coins.map(coin => (
              <option key={coin.id} value={coin.id}>
                {coin.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-slate-700 dark:text-gray-300">
            Time Range:
          </label>
          <div className="flex space-x-1">
            {timeRanges.map(range => (
              <button
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  timeRange === range.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-800 text-slate-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Price Chart */}
        <div className="card p-6 animate-slide-up">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-4">
            Price Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#3B82F6"
                fill="#3B82F6"
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Volume Chart */}
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-4">
            Trading Volume
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => `$${(value / 1000000).toFixed(0)}M`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value) => [`$${(value / 1000000).toFixed(2)}M`, 'Volume']}
              />
              <Bar dataKey="volume" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Portfolio Distribution */}
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-4">
            Portfolio Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={portfolioData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {portfolioData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Value']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Market Comparison */}
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-4">
            Top Coins Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={marketData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: '#F59E0B', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;