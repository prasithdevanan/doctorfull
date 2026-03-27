import React, { useContext } from 'react';
import AdminContextProvider from './context/AdminContext';
import AppContextProvider from './context/AppContent';
import DoctorContextProvider from './context/DoctorContext';
import MainConnet from './MainConnet';


function App() {
  return (
    <AdminContextProvider>
      <DoctorContextProvider>
        <AppContextProvider>
          <MainConnet />
        </AppContextProvider>
      </DoctorContextProvider>
    </AdminContextProvider>

  )
}

export default App