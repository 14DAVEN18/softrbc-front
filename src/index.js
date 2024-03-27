import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from './auth/context/AuthProvider';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import chatbotReducer from './components/container/customer/chatbot/redux/chatbotReducer'

const store = createStore(chatbotReducer);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </Provider>
  </React.StrictMode>
);