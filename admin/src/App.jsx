import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminContextProvider from './context/AdminContext';
import AppContextProvider from './context/AppContent';
import DoctorContextProvider from './context/DoctorContext';
import { ToastContainer, toast } from 'react-toastify';


function App() {
  return (
    <AdminContextProvider>
      <DoctorContextProvider>
        <AppContextProvider>
          <Outlet />
          <ToastContainer />
        </AppContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>

  )
}

export default App