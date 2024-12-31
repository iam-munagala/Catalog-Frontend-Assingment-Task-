import React from 'react';

const Header = ({ currentPrice, percentageChange }) => {
  return (
    <header className="header">
      <div className="price-box">
        <div className="price">
          <span>{currentPrice}</span>
          <small>USD</small>
        </div>
        <div
          className="percentage-change"
          style={{ color: percentageChange > 0 ? 'green' : 'red' }}
        >
          {percentageChange > 0 ? `+${percentageChange}` : `${percentageChange}`}%  
        </div>
      </div>
    </header>
  );
};

export default Header;
