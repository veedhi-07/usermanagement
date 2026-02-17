import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // required CSS
import { Provider } from "react-redux";
import { store } from "./redux/store";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
 <BrowserRouter>
 <Provider store={store}>
    <App />
  </Provider>
  </BrowserRouter>
  <ToastContainer/>
  </StrictMode>
);