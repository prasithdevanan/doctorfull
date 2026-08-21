import { createContext } from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../src/component/Navbar';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import ScrollToUp from './component/ScrollToUp';
import AppointmentBtn from './component/AppointmentBtn';

function App() {

  return (
    <>
      <Navbar />
      <ScrollToUp />
      <Outlet />
      <ToastContainer />
      <AppointmentBtn />
    </>
  )
}

export default App