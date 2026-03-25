import { createContext } from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from '../src/component/Navbar';
import { AppProvider } from './component/CreateContext';

function App() {

  return (
    <>
      <AppProvider>
        <Navbar />
        <Outlet />
      </AppProvider>
    </>
  )
}

export default App