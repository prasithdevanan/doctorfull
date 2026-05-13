import { createContext } from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../src/component/Navbar';
import { ToastContainer, toast } from 'react-toastify';
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