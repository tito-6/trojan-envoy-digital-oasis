import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Report web vitals metrics
const reportMetrics = ({ name, delta, id }) => {
  // Analytics can be added here
  console.log({ name, delta, id });
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Performance monitoring
getCLS(reportMetrics);
getFID(reportMetrics);
getFCP(reportMetrics);
getLCP(reportMetrics);
getTTFB(reportMetrics);
