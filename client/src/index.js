import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import axios from 'axios';
import './styles/index.scss';
import AppRouter from './routers/AppRouter';
import Store from "./store/Store";
import { Update } from './actions/auth';


const root = ReactDOM.createRoot(document.getElementById('root'));

(async()=>{
  localStorage.getItem('token')?
  axios.get(`${process.env.REACT_APP_SERVER_URL}/auth`, {
    headers: {
      "Authorization": `Bearer ${localStorage.getItem('token')}`
    }
  }).then(res=>{
    Store.dispatch(Update(res.data.data))
    root.render(
      <React.StrictMode>
        <Provider store={Store}>
          <AppRouter />
        </Provider>
      </React.StrictMode>)
  }).catch(e=>{
    root.render(
      <React.StrictMode>
        <Provider store={Store}>
          <AppRouter />
        </Provider>
      </React.StrictMode>)
  })
  :
  root.render(
    <React.StrictMode>
      <Provider store={Store}>
        <AppRouter />
      </Provider>
    </React.StrictMode>
  )
})();


