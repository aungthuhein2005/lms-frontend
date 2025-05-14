import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'boxicons/css/boxicons.min.css';
import { Provider } from 'react-redux';

import store from './store.js';

createRoot(document.getElementById('root')).render(

  


  <StrictMode>
     <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
