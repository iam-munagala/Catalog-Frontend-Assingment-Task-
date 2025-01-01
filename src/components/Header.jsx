import React from "react";

const Header = ({ currentPrice, percentageChange }) => {
  return (
    <div className="price-container">
      <div className="price-header">
        <div className="price-value">{currentPrice}</div>
        <div className="price-currency">USD</div>
      </div>
      <div
        className="price-change"
        style={{ color: percentageChange > 0 ? "green" : "red" }}
      >
        {percentageChange > 0 ? `+${percentageChange}` : `${percentageChange}`}%
      </div>
    </div>
  );
};

export default Header;
