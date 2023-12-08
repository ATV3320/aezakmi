import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css'; // Use the correct path for your project
import './index.scss';
import { Provider } from 'react-redux';
import store from './Redux/store';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AnonAadhaarProvider } from 'anon-aadhaar-react';
import SocketTest from './Components/SocketTest';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const app_id: any = BigInt(parseInt("1fdd97b9d4fcd5eb682b465f9be492628a71c288", 16)); // random value.
console.log("sds", app_id);

root.render(

  <AnonAadhaarProvider _appId={app_id}>


  <Provider store={store}>
    {/* <Entry /> */}
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/paymaster" element={<SocketTest />} />

       
      </Routes>
    </BrowserRouter>

  </Provider>
  </AnonAadhaarProvider>


);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
