import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Entry from './Components/Entry';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css'; // Use the correct path for your project
import './index.scss';
import { Provider } from 'react-redux';
import store from './Redux/store';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DriverView from './Components/DriverView';
import SocketTest from './Components/SocketTest';
import AnonAdhar from './Components/AnonAdhar';
import { log } from '@web3auth/base';
import Huddle from './Components/Huddle';
import AppMe from './src/App';
import ChatComponent from './Components/ChatComponent';
import { AnonAadhaarProvider } from 'anon-aadhaar-react';
import Start from './Components/Start';
import Webauth from './Webauth';

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
        <Route path="/start" element={<Start />} />
        <Route path="/ride" element={<Entry />} />
        <Route path="/driverview" element={<DriverView />} />
        <Route path="/paymaster" element={<SocketTest />} />
        <Route path="/anon" element={<AnonAdhar />} />
        <Route path="/safe" element={<AppMe />} />
        <Route path="/test" element={<ChatComponent />} />
        <Route path="/huddle" element={<Huddle />} />
        <Route path="/register" element={<  Webauth />} />

      </Routes>
    </BrowserRouter>

  </Provider>
  </AnonAadhaarProvider>


);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
