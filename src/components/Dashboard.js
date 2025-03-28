import React, { useState } from 'react';
import './App.css';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

function FinanceDashboard() {
  // State for interactive features
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Sample financial data
  const financialData = {
    overview: {
      totalBalance: 58762.45,
      monthlyIncome: 7500,
      monthlyExpenses: 5200,
      savingsRate: 30.5
    },
    incomeData: [
      { month: 'Jan', income: 7200, expenses: 5100 },
      { month: 'Feb', income: 7500, expenses: 5200 },
      { month: 'Mar', income: 7800, expenses: 5300 },
      { month: 'Apr', income: 7600, expenses: 5250 },
      { month: 'May', income: 7900, expenses: 5400 }
    ],
    investmentData: [
      { name: 'Stocks', value: 35000, color: '#4CAF50', change: '+5.2%' },
      { name: 'Bonds', value: 15000, color: '#2196F3', change: '+2.1%' },
      { name: 'Crypto', value: 8762, color: '#FF9800', change: '-1.5%' }
    ],
    recentTransactions: [
      { 
        id: 1, 
        name: 'Salary Deposit', 
        amount: '+$7,500', 
        type: 'income',
        date: '2024-05-15' 
      },
      { 
        id: 2, 
        name: 'Rent Payment', 
        amount: '-$2,500', 
        type: 'expense',
        date: '2024-05-10' 
      },
      { 
        id: 3, 
        name: 'Stock Investment', 
        amount: '-$5,000', 
        type: 'investment',
        date: '2024-05-05' 
      }
    ]
  };

  // Interactive handlers
  const toggleDetailedView = () => {
    setShowDetailedView(!showDetailedView);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="finance-dashboard">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Financial Pulse</h1>
          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-label">Savings Rate</span>
              <span className="stat-value">{financialData.overview.savingsRate}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Balance</span>
              <span className="stat-value">${financialData.overview.totalBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <button 
          className="detailed-view-toggle"
          onClick={toggleDetailedView}
        >
          {showDetailedView ? 'Simple View' : 'Detailed View'}
        </button>
      </header>

      <div className="dashboard-container">
        <div className="dashboard-grid">
          {/* Financial Summary Cards */}
          <div className="dashboard-card interactive-card">
            <div className="card-header">
              <h3>Monthly Breakdown</h3>
              <div className="card-actions">
                <button 
                  onClick={() => handleCategorySelect('income')}
                  className={selectedCategory === 'income' ? 'active' : ''}
                >
                  Income
                </button>
                <button 
                  onClick={() => handleCategorySelect('expenses')}
                  className={selectedCategory === 'expenses' ? 'active' : ''}
                >
                  Expenses
                </button>
              </div>
            </div>
            <div className="card-content">
              <div className="financial-summary">
                <div className="summary-item income">
                  <h4>Monthly Income</h4>
                  <span>${financialData.overview.monthlyIncome.toLocaleString()}</span>
                </div>
                <div className="summary-item expenses">
                  <h4>Monthly Expenses</h4>
                  <span>${financialData.overview.monthlyExpenses.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Income vs Expenses Chart */}
          <div className="dashboard-card chart-card">
            <div className="card-header">
              <h3>Income vs Expenses Trend</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={financialData.incomeData}>
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      color: 'white' 
                    }} 
                  />
                  <Bar dataKey="income" fill="#4CAF50" />
                  <Bar dataKey="expenses" fill="#F44336" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Investment Portfolio */}
          <div className="dashboard-card investment-card">
            <div className="card-header">
              <h3>Investment Portfolio</h3>
              <div className="investment-performance">
                {financialData.investmentData.map((investment) => (
                  <div 
                    key={investment.name} 
                    className="performance-item"
                    style={{ color: investment.color }}
                  >
                    <span>{investment.name}</span>
                    <span className={investment.change.startsWith('+') ? 'positive' : 'negative'}>
                      {investment.change}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={financialData.investmentData}>
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.8)', 
                      color: 'white' 
                    }} 
                  />
                  {financialData.investmentData.map((entry, index) => (
                    <Line
                      key={index}
                      type="monotone"
                      dataKey="value"
                      stroke={entry.color}
                      strokeWidth={3}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="dashboard-card transactions-card">
            <div className="card-header">
              <h3>Recent Transactions</h3>
              {showDetailedView && (
                <div className="transaction-filters">
                  <button>All</button>
                  <button>Income</button>
                  <button>Expenses</button>
                </div>
              )}
            </div>
            <div className="transactions-list">
              {financialData.recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className={`transaction-item ${transaction.type}`}
                >
                  <div className="transaction-details">
                    <h4 className="transaction-name">{transaction.name}</h4>
                    <p className="transaction-date">{transaction.date}</p>
                  </div>
                  <span className={`transaction-amount ${transaction.type}`}>
                    {transaction.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinanceDashboard;