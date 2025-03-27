import React, { useEffect, useRef } from 'react';
import './Charts.css';

const TradingViewChart = () => {
  const widgetContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Dynamically load TradingView script
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.TradingView && widgetContainerRef.current) {
        new window.TradingView.widget({
          container_id: "tradingview",
          width: "100%",
          height: "100%",
          symbol: "NASDAQ:AAPL",
          interval: "D",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "#121212",
          enable_publishing: false,
          hide_side_toolbar: false,
          allow_symbol_change: true,
          save_image: false,
          studies: ["MACD@tv-basicstudies", "RSI@tv-basicstudies"]
        });
      }
    };

    // Cleanup function
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="app-container">
      <header className="app-header">Met-AI - Real-Time Charts</header>
      <div className="chart-container">
        <div 
          ref={widgetContainerRef}
          id="tradingview" 
          className="tradingview-widget-container"
        >
          {/* TradingView widget will be rendered here */}
        </div>
      </div>
    </div>
  );
};

export default TradingViewChart;