import React, { useState } from 'react';
import Header from './components/Header';
import ChartComponent from './components/Chart';
import Tabs from './components/Tabs';
import './styles/styles.css';

const App = () => {
  const [currentPrice, setCurrentPrice] = useState('0.00');
  const [priceChange, setPriceChange] = useState('0.00');
  const [percentageChange, setPercentageChange] = useState('0.00');

  return (
    <div className="app-container">
      <div className="content-box">
        <Header 
          currentPrice={currentPrice} 
          priceChange={priceChange} 
          percentageChange={percentageChange} 
        />
        <Tabs />
        <ChartComponent
          setCurrentPrice={setCurrentPrice}
          setPriceChange={setPriceChange}
          setPercentageChange={setPercentageChange}
        />
      </div>
    </div>
  );
};

export default App;
