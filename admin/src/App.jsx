import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminContextProvider from './context/AdminContext';
import AppContextProvider from './context/AppContent';
import DoctorContextProvider from './context/DoctorContext';

function App() {
  return (
    <AdminContextProvider>
      <DoctorContextProvider>
        <AppContextProvider>
          <Outlet />
        </AppContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>

  )
}

export default App