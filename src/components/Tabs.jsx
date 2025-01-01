import React from 'react';

const Tabs = () => {
  return (
    <div className="tabs-container">
      <button className="inactive">Summary</button>
      <button className="active">Chart</button>
      <button className="inactive">Statistics</button>
      <button className="inactive">Analysis</button>
      <button className="inactive">Settings</button>
    </div>
  );
};

export default Tabs;
