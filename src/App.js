import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import Dashboard from './components/Dashboard.js';

const FinanceHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // State for dynamic data
  const [trendingCoins, setTrendingCoins] = useState([]);
  const [marketStats, setMarketStats] = useState([]);
  const [newsItems, setNewsItems] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cryptocurrency data on component mount
  useEffect(() => {
    fetchCryptoData();
    fetchMarketStats();
    fetchNewsData();
    
    // Set up interval for real-time updates (every 60 seconds)
    const intervalId = setInterval(() => {
      fetchCryptoData();
      fetchMarketStats();
    }, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to fetch cryptocurrency data
  const fetchCryptoData = async () => {
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
      
      const formattedData = response.data.map((coin, index) => ({
        id: index + 1,
        coinId: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        price: coin.current_price,
        change: coin.price_change_percentage_24h,
        image: coin.image,
        marketCap: coin.market_cap
      }));
      
      setTrendingCoins(formattedData);
      setDataLoading(false);
    } catch (err) {
      console.error('Error fetching crypto data:', err);
      setError('Failed to fetch cryptocurrency data. Please try again later.');
      setDataLoading(false);
    }
  };

  // Function to fetch market statistics
  const fetchMarketStats = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/global');
      const data = response.data.data;
      
      const stats = [
        { 
          label: 'Market Cap', 
          value: `$${formatNumber(data.total_market_cap.usd)}`
        },
        { 
          label: '24h Volume', 
          value: `$${formatNumber(data.total_volume.usd)}`
        },
        { 
          label: 'BTC Dominance', 
          value: `${data.market_cap_percentage.btc.toFixed(1)}%`
        },
        { 
          label: 'ETH Dominance', 
          value: `${data.market_cap_percentage.eth.toFixed(1)}%`
        }
      ];
      
      setMarketStats(stats);
    } catch (err) {
      console.error('Error fetching market stats:', err);
      // Use default stats if API fails
      setMarketStats([
        { label: 'Market Cap', value: 'Loading...' },
        { label: '24h Volume', value: 'Loading...' },
        { label: 'BTC Dominance', value: 'Loading...' },
        { label: 'ETH Dominance', value: 'Loading...' }
      ]);
    }
  };

  // Function to fetch news data
  const fetchNewsData = async () => {
    try {
      // Note: In a real application, you would use a crypto news API
      // For demo purposes, we'll use a mock API response
      // Example APIs: Crypto Compare News API, CryptoControl API
      
      // Simulating news API response with timeout
      /*setTimeout(() => {
        const mockNewsData = [
          { 
            id: 1, 
            title: 'Central Banks Signal Interest in CBDCs Amid Crypto Surge', 
            time: new Date(Date.now() - 7200000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          },
          { 
            id: 2, 
            title: 'New Regulatory Framework Expected to Boost Institutional Adoption', 
            time: new Date(Date.now() - 14400000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          },
          { 
            id: 3, 
            title: 'DeFi Total Value Locked Reaches All-Time High of $95 Billion', 
            time: new Date(Date.now() - 21600000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          }
        ];
        setNewsItems(mockNewsData);
      }, 1000);
      */
      // For production, you would use:
       const response = await axios.get('https://api.cryptonews.com/news');
       setNewsItems(response.data.news);
    } catch (err) {
      console.error('Error fetching news data:', err);
      setNewsItems([
        { id: 1, title: 'Failed to load news. Please try again later.', time: 'Now' }
      ]);
    }
  };

  // Format large numbers with appropriate suffixes (K, M, B, T)
  const formatNumber = (num) => {
    if (num >= 1000000000000) return `${(num / 1000000000000).toFixed(2)}T`;
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toFixed(2);
  };

  // Handle search form submission
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/search`,
        {
          params: { query: searchQuery }
        }
      );
      
      // Process and display search results (top 5)
      if (response.data.coins.length > 0) {
        const searchResults = response.data.coins.slice(0, 5).map((coin, index) => ({
          id: index + 1,
          coinId: coin.id,
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          // We'd need to make another API call to get prices for these coins
          image: coin.large
        }));
        
        // In a real app, you would update UI to show search results
        console.log('Search results:', searchResults);
        alert(`Found ${searchResults.length} results for "${searchQuery}"`);
      } else {
        alert(`No results found for "${searchQuery}"`);
      }
    } catch (err) {
      console.error('Error searching:', err);
      alert('Search failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle AI query submission
  const handleAiRequest = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    
    setIsAiLoading(true);
    setAiResponse('');
    
    try {
      // In a real application, you would connect to an AI API
      // Example: OpenAI, Anthropic, or a custom financial AI service
      
      // Simulating AI API call with timeout
      setTimeout(() => {
        // Generate contextual response based on query
        let response = '';
        const query = aiPrompt.toLowerCase();
        
        if (query.includes('bitcoin') || query.includes('btc')) {
          const btcData = trendingCoins.find(coin => coin.symbol === 'BTC');
          if (btcData) {
            response = `Based on current market data, Bitcoin (BTC) is currently trading at $${btcData.price.toLocaleString()} with a 24-hour change of ${btcData.change.toFixed(2)}%. The overall market sentiment for Bitcoin appears to be ${btcData.change >= 0 ? 'positive' : 'negative'} in the short term.`;
          } else {
            response = `Bitcoin shows strong resistance levels around $62,500 with increasing institutional interest. Market indicators suggest moderate bullish sentiment in the coming weeks, though volatility remains a factor to watch.`;
          }
        } else if (query.includes('ethereum') || query.includes('eth')) {
          const ethData = trendingCoins.find(coin => coin.symbol === 'ETH');
          if (ethData) {
            response = `Ethereum (ETH) is currently valued at $${ethData.price.toLocaleString()} with a ${ethData.change.toFixed(2)}% change in the last 24 hours. Recent network upgrades and increasing DeFi activity suggest continued growth potential.`;
          } else {
            response = `Ethereum's recent network upgrades have strengthened its position in the smart contract space. Technical analysis indicates a potential support level at $2,800 with resistance around $3,200.`;
          }
        } else if (query.includes('market') || query.includes('trend')) {
          response = `The overall crypto market currently has a total capitalization of ${marketStats[0]?.value || '$2.3T'}, with a 24-hour volume of ${marketStats[1]?.value || '$95B'}. Bitcoin dominance is at ${marketStats[2]?.value || '52.4%'}, indicating ${parseFloat(marketStats[2]?.value) > 50 ? 'strong Bitcoin performance' : 'growing altcoin interest'}. The market is showing ${trendingCoins.filter(c => c.change > 0).length > trendingCoins.length/2 ? 'bullish' : 'bearish'} signals overall.`;
        } else {
          response = `Based on current market trends and advanced predictive models, the crypto markets are showing mixed signals with ${trendingCoins.filter(c => c.change > 0).length > trendingCoins.length/2 ? 'positive' : 'negative'} momentum in the short term. Key factors to watch include regulatory developments, institutional adoption rates, and macroeconomic indicators.`;
        }
        
        setAiResponse(response);
        setIsAiLoading(false);
      }, 2000);
      
      // For production, you would use:
      // const response = await axios.post('https://api.yourai.com/query', { prompt: aiPrompt });
      // setAiResponse(response.data.answer);
    } catch (err) {
      console.error('Error getting AI response:', err);
      setAiResponse('Sorry, I encountered an issue processing your request. Please try again later.');
      setIsAiLoading(false);
    }
  };

  return (
    <div className="finance-home">
      <header className="header">
        <div className="logo">MetAI</div>
        <nav className="nav">
          <ul>
            <li><a href="#" className="active">Home</a></li>
            <li><a href="http://localhost:3003">Dashbord</a></li>
            <li><a href="#">Portfolio</a></li>
            <li><a href="http://localhost:3001">MetAI-assistant</a></li>
          </ul>
        </nav>
        <div className="header-actions">
          <form onSubmit={handleSearch} className="search-form">
            <input 
              type="text" 
              placeholder="Search coins..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </form>
          <button className="login-btn">Log In</button>
          <button className="signup-btn">Sign Up</button>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-content">
            <h1>Track Crypto Markets with AI-Powered Insights</h1>
            <p>Get real-time data, personalized analysis, and market predictions all in one place</p>
            <div className="market-stats">
              {dataLoading ? (
                <div className="loading-stats">Loading market data...</div>
              ) : (
                marketStats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-value">{stat.value}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        
        <section className="trending-section">
          <h2>Trending Cryptocurrencies</h2>
          {dataLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading cryptocurrency data...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p>{error}</p>
              <button onClick={fetchCryptoData} className="retry-btn">Retry</button>
            </div>
          ) : (
            <>
              <div className="coins-table">
                <div className="table-header">
                  <div className="col">#</div>
                  <div className="col">Name</div>
                  <div className="col">Price</div>
                  <div className="col">24h Change</div>
                  <div className="col">Actions</div>
                </div>
                {trendingCoins.map((coin) => (
                  <div key={coin.id} className="table-row">
                    <div className="col">{coin.id}</div>
                    <div className="col coin-name">
                      <div className="coin-info">
                        <img src={coin.image} alt={coin.name} className="coin-icon" />
                        <div>
                          <span className="symbol">{coin.symbol}</span>
                          <span>{coin.name}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col">${coin.price.toLocaleString()}</div>
                    <div className={`col ${coin.change >= 0 ? 'positive' : 'negative'}`}>                      {coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%
                    </div>
                    <div className="col">
                      <button className="action-btn">Trade</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="last-updated">
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
                <button onClick={fetchCryptoData} className="refresh-btn">
                  Refresh
                </button>
              </div>
              <div className="view-all-container">
                <button className="view-all-btn">View All Coins</button>
              </div>
            </>
          )}
        </section>

        <section className="news-section">
          <h2>Latest Financial News</h2>
          <div className="news-grid">
            {newsItems.map((item) => (
              <div key={item.id} className="news-card">
                <h3>{item.title}</h3>
                <p className="news-time">{item.time}</p>
              </div>
            ))}
          </div>
          <div className="view-all-container">
            <button className="view-all-btn">More News</button>
          </div>
        </section>

        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>AI-Powered Analysis</h3>
              <p>Get personalized market insights and predictions based on advanced AI models</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Real-Time Tracking</h3>
              <p>Monitor your portfolio and market movements in real-time with accurate data</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Smart Alerts</h3>
              <p>Receive intelligent notifications about price movements and market opportunities</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🧠</div>
              <h3>Learning Resources</h3>
              <p>Access AI-curated educational content tailored to your investment experience</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>MetAI</h3>
            <p>Your AI-powered finance companion for informed investment decisions</p>
            <div className="social-links">
              <a href="http://localhost:3006" className="social-icon">Twitter</a>
              <a href="http://localhost:3006" className="social-icon">Discord</a>
              <a href="http://localhost:3006" className="social-icon">Telegram</a>
            </div>
          </div>
          <div className="footer-section">
            <h3>Resources</h3>
            <ul>
              <li><a href="http://localhost:3006">API Documentation</a></li>
              <li><a href="http://localhost:3006">Help Center</a></li>
              <li><a href="http://localhost:3006">Blog</a></li>
              <li><a href="http://localhost:3006">Press Kit</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>MetaAI</h3>
            <ul>
              <li><a href="http://localhost:3006">About Us</a></li>
              <li><a href="http://localhost:3006">Careers</a></li>
              <li><a href="http://localhost:3006">Terms of Service</a></li>
              <li><a href="http://localhost:3006">Privacy Policy</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Subscribe to Updates</h3>
            <form className="subscribe-form">
              <input type="email" placeholder="Your email address" />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>
        <div className="copyright">
          &copy; {new Date().getFullYear()} FinAI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default FinanceHome;