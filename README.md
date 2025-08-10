# MetAI - React 19 Cryptocurrency Portfolio Application

A modern, minimal cryptocurrency portfolio and AI assistant application built with React 19, Vite, and Tailwind CSS v4.

## 🚀 Features

### Navigation & Theme
- **Navbar**: Fixed navigation with MetAI branding, responsive design
- **Dark/Light Mode**: Toggle between themes with smooth animations
- **Theme Persistence**: Theme preference saved to localStorage
- **Mobile Responsive**: Hamburger menu for mobile devices
- **Search Functionality**: Real-time cryptocurrency search

### Pages
1. **Home**: Market statistics and trending cryptocurrencies
2. **Dashboard**: Interactive charts using Recharts for price trends and portfolio analytics
3. **Portfolio**: Track crypto holdings with profit/loss calculations
4. **MetAI Assistant**: AI-powered chatbot with speech recognition and market analysis

### Key Components
- **Theme Context**: Centralized dark/light mode management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Data**: Integration with CoinGecko API for live cryptocurrency data
- **Interactive Charts**: Portfolio distribution, price trends, and market comparison
- **Speech Recognition**: Voice input for the AI assistant

## 🛠️ Technology Stack

- **React 19**: Latest React version with modern features
- **Vite**: Fast build tool and development server
- **Tailwind CSS v4**: Latest utility-first CSS framework
- **React Router DOM**: Client-side routing
- **Recharts**: Interactive charts and data visualization
- **Lucide React**: Modern icon library
- **Axios**: HTTP client for API requests
- **CoinGecko API**: Cryptocurrency market data

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GDG
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000` (or the port shown in terminal)

## 🎨 Design Features

### Color Palette
- **Light Mode**: Clean white backgrounds with slate-800 text
- **Dark Mode**: Slate-900 backgrounds with gray-100 text
- **Accent Colors**: Blue gradients and subtle gray borders
- **Status Colors**: Green for positive changes, red for negative

### Animations
- **Theme Toggle**: Smooth scale and color transitions
- **Hover Effects**: Subtle background changes on interactive elements
- **Loading States**: Spinning animations for data fetching
- **Fade Animations**: Smooth content transitions

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Breakpoints**: Responsive grid layouts
- **Touch-Friendly**: Large tap targets for mobile interaction
- **Adaptive Navigation**: Hamburger menu on small screens

## 🔧 Configuration

### Tailwind CSS v4
The project uses the latest Tailwind CSS v4 with:
- ESM configuration (`tailwind.config.js`)
- PostCSS integration (`@tailwindcss/postcss`)
- Custom color schemes and animations
- Dark mode class strategy

### API Integration
- **CoinGecko API**: Free cryptocurrency data
- **Rate Limiting**: Handles API rate limits gracefully
- **Error Handling**: Fallback data when API is unavailable
- **Caching**: Efficient data fetching patterns

## 📁 Project Structure

```
src/
├── components/
│   └── Navbar.jsx          # Navigation component
├── contexts/
│   └── ThemeContext.jsx    # Theme management
├── pages/
│   ├── Home.jsx           # Market overview
│   ├── Dashboard.jsx      # Charts and analytics
│   ├── Portfolio.jsx      # Portfolio tracking
│   └── Assistant.jsx      # AI chatbot
├── App.jsx                # Main application
├── main.jsx              # Application entry point
└── index.css             # Global styles
```

## 🚀 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### GitHub Pages Deployment
```bash
npm run deploy
```

## 📊 Features in Detail

### Home Page
- Real-time market statistics (Market Cap, 24h Volume, BTC/ETH Dominance)
- Top 10 trending cryptocurrencies table
- Live price updates and 24h changes
- Responsive card layouts

### Dashboard
- Interactive price charts with multiple timeframes
- Portfolio distribution pie chart
- Trading volume bar charts
- Market comparison line charts
- Coin selection dropdown
- Time range filters (1D, 7D, 30D, 90D, 1Y)

### Portfolio
- Add/edit/delete cryptocurrency holdings
- Real-time profit/loss calculations
- Portfolio summary statistics
- Holdings table with current values
- Buy price vs current price comparison

### AI Assistant
- Natural language processing for crypto queries
- Speech recognition for voice input
- Contextual responses based on market data
- Quick action buttons for common queries
- Real-time market data integration
- Chat history with timestamps

## 🔐 Security & Performance

- **CSP Ready**: Content Security Policy compatible
- **Bundle Optimization**: Tree-shaking and code splitting
- **Fast Refresh**: Hot module replacement in development
- **Type Safety**: Prepared for TypeScript migration
- **Performance**: Optimized re-renders with React best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- **CoinGecko API** for cryptocurrency data
- **Tailwind CSS** for the utility-first CSS framework
- **React Team** for React 19 and modern development patterns
- **Vite Team** for the fast build tool
- **Recharts** for beautiful chart components

---

Built with ❤️ by the MetAI Team