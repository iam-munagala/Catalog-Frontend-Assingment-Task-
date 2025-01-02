import React from "react";

const Header = ({ currentPrice, percentageChange }) => {
  // Format the currentPrice with commas
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(currentPrice);

  // Format the percentage change
  const formattedPercentageChange = new Intl.NumberFormat("en-US", {
    style: "decimal",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(percentageChange);

  return (
    <div className="price-container">
      <div className="price-header">
        <div className="price-value">{formattedPrice}</div>
        <div className="price-currency">USD</div>
      </div>
      <div
        className="price-change"
        style={{ color: percentageChange > 0 ? "green" : "red" }}
      >
        {percentageChange > 0
          ? `+${formattedPercentageChange}`
          : `-${formattedPercentageChange}`}
        %
      </div>
    </div>
  );
};

export default Header;
