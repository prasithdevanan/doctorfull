import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router.jsx';
import AdminContextProvider from './context/AdminContext';
import AppContextProvider from './context/AppContent';
import DoctorContextProvider from './context/DoctorContext';

createRoot(document.getElementById('root')).render(

  <AdminContextProvider>
    <DoctorContextProvider>
      <AppContextProvider>
        <RouterProvider router={router} />
      </AppContextProvider>
    </DoctorContextProvider>
  </AdminContextProvider>
);
