import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { TempoJogoProvider } from './context/TempoJogoContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TempoJogoProvider>
        <App />
      </TempoJogoProvider>
    </BrowserRouter>
  </React.StrictMode>
);
