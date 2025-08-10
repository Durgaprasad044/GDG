# MetAI - Cryptocurrency Tracker with AI Insights

A modern React 19 + Vite + Tailwind CSS application for tracking cryptocurrency markets with AI-powered insights.

## Features

- 🌙 **Dark/Light Mode Toggle** - Persistent theme switching with smooth animations
- 📊 **Real-time Market Data** - Live cryptocurrency prices and market statistics
- 📈 **Interactive Charts** - Beautiful charts using Recharts for price trends and portfolio analytics
- 💼 **Portfolio Management** - Track your cryptocurrency investments with gain/loss calculations
- 🤖 **AI Assistant** - Gemini AI-powered chatbot with speech recognition for market analysis
- 📱 **Responsive Design** - Mobile-first design with hamburger menu
- 🔍 **Coin Search** - Search and analyze any cryptocurrency
- 🎨 **Minimal Design** - Clean, modern interface using Tailwind CSS

## Tech Stack

- **React 19** - Latest React with concurrent features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Recharts** - Composable charting library
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client for API calls
- **Google Generative AI** - Gemini AI integration

## Quick Start

1. **Clone and Install**
   ```bash
   cd c:\Users\Durga\OneDrive\Desktop\DRA\GDG
   npm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Add your API keys to `.env`:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_COINGECKO_API_KEY=your_coingecko_api_key_here
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   # or
   npm start
   ```

4. **Build for Production**
   ```bash
   npm run build
   npm run preview
   ```

## API Keys Setup

### Gemini AI API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `VITE_GEMINI_API_KEY`

### CoinGecko API (Optional)
1. Visit [CoinGecko API](https://www.coingecko.com/en/api)
2. Sign up for a free account
3. Get your API key and add it to `.env` as `VITE_COINGECKO_API_KEY`

## Project Structure

```
src/
├── components/
│   └── Navbar.jsx          # Navigation with theme toggle
├── contexts/
│   └── ThemeContext.jsx    # Theme management
├── pages/
│   ├── Home.jsx           # Market overview and trending coins
│   ├── Dashboard.jsx      # Interactive charts and analytics
│   ├── Portfolio.jsx      # Portfolio management
│   └── Assistant.jsx      # AI chatbot with speech recognition
├── App.jsx               # Main app with routing
├── main.jsx             # Vite entry point
└── index.css           # Tailwind CSS and custom styles
```

## Features Overview

### 🏠 Home Page
- Real-time market statistics (Market Cap, Volume, BTC/ETH dominance)
- Trending cryptocurrencies table with prices and 24h changes
- Responsive design with loading states and error handling

### 📊 Dashboard Page
- Interactive price and volume charts
- Portfolio distribution pie chart
- Market comparison charts
- Customizable time ranges and coin selection

### 💼 Portfolio Page
- Add/edit/remove cryptocurrency holdings
- Real-time profit/loss calculations
- Portfolio summary with total value and performance
- Persistent data storage

### 🤖 MetAI Assistant Page
- AI-powered cryptocurrency analysis
- Speech recognition for voice queries
- Real-time market data integration
- Coin search and quick actions
- Chat interface with message history

### 🎨 Theme System
- Light/Dark mode toggle with smooth transitions
- Persistent theme preference in localStorage
- System preference detection
- Consistent color palette across all components

## Available Scripts

- `npm run dev` - Start development server
- `npm start` - Start development server (alias)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run deploy` - Deploy to GitHub Pages

## Customization

### Colors
Edit `tailwind.config.js` to customize the color palette:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### API Endpoints
Update API endpoints in the respective page components to use different data sources.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue on GitHub or contact the development team.