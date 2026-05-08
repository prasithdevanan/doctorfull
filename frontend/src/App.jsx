import { createContext } from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../src/component/Navbar';
import { AppProvider } from './component/CreateContext';
import { ToastContainer, toast } from 'react-toastify';

function App() {

  return (
    <>
        <Navbar />
        <Outlet />
        <ToastContainer />
    </>
  )
}

export default App