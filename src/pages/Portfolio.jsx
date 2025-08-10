import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, TrendingUp, TrendingDown } from 'lucide-react';
import axios from 'axios';

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [isAddingCoin, setIsAddingCoin] = useState(false);
  const [editingCoin, setEditingCoin] = useState(null);
  const [newCoin, setNewCoin] = useState({
    symbol: '',
    amount: '',
    buyPrice: ''
  });
  const [totalValue, setTotalValue] = useState(0);
  const [totalGainLoss, setTotalGainLoss] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock portfolio data - in real app, this would come from user's saved portfolio
  const mockPortfolio = [
    {
      id: 1,
      symbol: 'BTC',
      name: 'Bitcoin',
      amount: 0.5,
      buyPrice: 45000,
      currentPrice: 0,
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png'
    },
    {
      id: 2,
      symbol: 'ETH',
      name: 'Ethereum',
      amount: 2.5,
      buyPrice: 2800,
      currentPrice: 0,
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png'
    },
    {
      id: 3,
      symbol: 'ADA',
      name: 'Cardano',
      amount: 1000,
      buyPrice: 1.2,
      currentPrice: 0,
      image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png'
    }
  ];

  useEffect(() => {
    initializePortfolio();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [portfolio]);

  const initializePortfolio = async () => {
    try {
      // Fetch current prices for portfolio coins
      const symbols = mockPortfolio.map(coin => coin.symbol.toLowerCase()).join(',');
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,cardano&vs_currencies=usd`
      );

      const priceMap = {
        'BTC': response.data.bitcoin?.usd || 0,
        'ETH': response.data.ethereum?.usd || 0,
        'ADA': response.data.cardano?.usd || 0
      };

      const updatedPortfolio = mockPortfolio.map(coin => ({
        ...coin,
        currentPrice: priceMap[coin.symbol] || coin.buyPrice
      }));

      setPortfolio(updatedPortfolio);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching prices:', error);
      setPortfolio(mockPortfolio);
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    let total = 0;
    let gainLoss = 0;

    portfolio.forEach(coin => {
      const currentValue = coin.amount * coin.currentPrice;
      const buyValue = coin.amount * coin.buyPrice;
      total += currentValue;
      gainLoss += (currentValue - buyValue);
    });

    setTotalValue(total);
    setTotalGainLoss(gainLoss);
  };

  const handleAddCoin = async () => {
    if (!newCoin.symbol || !newCoin.amount || !newCoin.buyPrice) return;

    try {
      // In real app, you'd fetch the coin data from API
      const newPortfolioCoin = {
        id: Date.now(),
        symbol: newCoin.symbol.toUpperCase(),
        name: newCoin.symbol,
        amount: parseFloat(newCoin.amount),
        buyPrice: parseFloat(newCoin.buyPrice),
        currentPrice: parseFloat(newCoin.buyPrice), // Would fetch real price
        image: 'https://via.placeholder.com/32'
      };

      setPortfolio([...portfolio, newPortfolioCoin]);
      setNewCoin({ symbol: '', amount: '', buyPrice: '' });
      setIsAddingCoin(false);
    } catch (error) {
      console.error('Error adding coin:', error);
    }
  };

  const handleEditCoin = (coin) => {
    setEditingCoin(coin.id);
    setNewCoin({
      symbol: coin.symbol,
      amount: coin.amount.toString(),
      buyPrice: coin.buyPrice.toString()
    });
  };

  const handleUpdateCoin = () => {
    setPortfolio(portfolio.map(coin => 
      coin.id === editingCoin 
        ? {
            ...coin,
            amount: parseFloat(newCoin.amount),
            buyPrice: parseFloat(newCoin.buyPrice)
          }
        : coin
    ));
    setEditingCoin(null);
    setNewCoin({ symbol: '', amount: '', buyPrice: '' });
  };

  const handleDeleteCoin = (id) => {
    setPortfolio(portfolio.filter(coin => coin.id !== id));
  };

  const calculateGainLoss = (coin) => {
    const currentValue = coin.amount * coin.currentPrice;
    const buyValue = coin.amount * coin.buyPrice;
    return currentValue - buyValue;
  };

  const calculateGainLossPercentage = (coin) => {
    const gainLoss = calculateGainLoss(coin);
    const buyValue = coin.amount * coin.buyPrice;
    return buyValue > 0 ? (gainLoss / buyValue) * 100 : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-gray-100 mb-2">
            Portfolio
          </h1>
          <p className="text-slate-600 dark:text-gray-400">
            Track your cryptocurrency investments
          </p>
        </div>
        <button
          onClick={() => setIsAddingCoin(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Coin</span>
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 animate-slide-up">
          <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">
            Total Portfolio Value
          </h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-gray-100">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        
        <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">
            Total Gain/Loss
          </h3>
          <div className={`flex items-center space-x-2 ${totalGainLoss >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {totalGainLoss >= 0 ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            <p className="text-3xl font-bold">
              {totalGainLoss >= 0 ? '+' : ''}${totalGainLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>

        <div className="card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">
            Total Coins
          </h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-gray-100">
            {portfolio.length}
          </p>
        </div>
      </div>

      {/* Add/Edit Coin Form */}
      {(isAddingCoin || editingCoin) && (
        <div className="card p-6 mb-8 animate-scale-in">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-gray-100 mb-4">
            {editingCoin ? 'Edit Coin' : 'Add New Coin'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Symbol
              </label>
              <input
                type="text"
                value={newCoin.symbol}
                onChange={(e) => setNewCoin({ ...newCoin, symbol: e.target.value })}
                placeholder="BTC, ETH, ADA..."
                className="input-field"
                disabled={editingCoin}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Amount
              </label>
              <input
                type="number"
                step="any"
                value={newCoin.amount}
                onChange={(e) => setNewCoin({ ...newCoin, amount: e.target.value })}
                placeholder="0.00"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Buy Price ($)
              </label>
              <input
                type="number"
                step="any"
                value={newCoin.buyPrice}
                onChange={(e) => setNewCoin({ ...newCoin, buyPrice: e.target.value })}
                placeholder="0.00"
                className="input-field"
              />
            </div>
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              onClick={editingCoin ? handleUpdateCoin : handleAddCoin}
              className="btn-primary"
            >
              {editingCoin ? 'Update' : 'Add'} Coin
            </button>
            <button
              onClick={() => {
                setIsAddingCoin(false);
                setEditingCoin(null);
                setNewCoin({ symbol: '', amount: '', buyPrice: '' });
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Portfolio Table */}
      <div className="card overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  Coin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  Holdings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  Buy Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  Current Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  Total Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  Gain/Loss
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {portfolio.map((coin) => {
                const gainLoss = calculateGainLoss(coin);
                const gainLossPercentage = calculateGainLossPercentage(coin);
                const totalValue = coin.amount * coin.currentPrice;

                return (
                  <tr key={coin.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img className="h-8 w-8 rounded-full mr-3" src={coin.image} alt={coin.name} />
                        <div>
                          <div className="text-sm font-medium text-slate-900 dark:text-gray-100">
                            {coin.name}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-gray-400">
                            {coin.symbol}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-gray-100">
                      {coin.amount.toLocaleString(undefined, { maximumFractionDigits: 8 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-gray-100">
                      ${coin.buyPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-gray-100">
                      ${coin.currentPrice.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-gray-100">
                      ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm font-medium ${gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {gainLoss >= 0 ? '+' : ''}${gainLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        <div className="text-xs">
                          ({gainLoss >= 0 ? '+' : ''}{gainLossPercentage.toFixed(2)}%)
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditCoin(coin)}
                          className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCoin(coin.id)}
                          className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {portfolio.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-gray-400 text-lg mb-4">
            Your portfolio is empty
          </p>
          <button
            onClick={() => setIsAddingCoin(true)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Add Your First Coin
          </button>
        </div>
      )}
    </div>
  );
};

export default Portfolio;