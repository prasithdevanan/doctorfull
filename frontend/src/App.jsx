import { createContext } from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../src/component/Navbar';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ScrollToUp from './component/ScrollToUp';

function App() {

  return (
    <>
      <Navbar />
      <ScrollToUp />
      <Outlet />
      <ToastContainer />
    </>
  )
}

export default App