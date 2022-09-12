import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import './styles/index.css';
import AppRouter from './routers/AppRouter';
import Store from "./store/Store";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <AppRouter />
    </Provider>
  </React.StrictMode>
);

