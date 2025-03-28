import React from 'react';
import { FileText, BarChart2, TrendingUp, Layers } from 'lucide-react';

const PortfolioSection = ({ title, description, icon: Icon }) => (
  <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 group transition-all duration-300 hover:bg-gray-800">
    <div className="flex items-center mb-4">
      <Icon className="w-10 h-10 text-white opacity-80 group-hover:opacity-100 transition-opacity mr-4" />
      <h3 className="text-xl font-semibold text-white">{title}</h3>
    </div>
    <p className="text-gray-300">{description}</p>
  </div>
);

const PortfolioPage = () => {
  const portfolioSections = [
    {
      title: "Comprehensive Financial Analysis",
      description: "Advanced AI-powered analysis of investment portfolios, providing deep insights into asset performance, risk assessment, and potential opportunities.",
      icon: BarChart2
    },
    {
      title: "Personalized Investment Strategies",
      description: "Tailored investment recommendations based on individual financial goals, risk tolerance, and market conditions using sophisticated machine learning algorithms.",
      icon: TrendingUp
    },
    {
      title: "Detailed Financial Reporting",
      description: "Generate comprehensive financial reports with AI-driven insights, including portfolio composition, historical performance, and predictive forecasting.",
      icon: FileText
    },
    {
      title: "Multi-Asset Tracking",
      description: "Seamless tracking and analysis across stocks, bonds, cryptocurrencies, ETFs, and alternative investments with real-time market data integration.",
      icon: Layers
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Our AI Finance Portfolio Solutions</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Leveraging cutting-edge artificial intelligence to transform financial decision-making with precision, insight, and personalization.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {portfolioSections.map((section, index) => (
            <PortfolioSection 
              key={index} 
              title={section.title} 
              description={section.description} 
              icon={section.icon} 
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-3xl font-semibold text-white mb-6">Ready to Optimize Your Investments?</h2>
          <p className="text-lg text-gray-300 mb-8">
            Discover how our AI-powered financial assistant can transform your investment strategy.
          </p>
          <button className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;