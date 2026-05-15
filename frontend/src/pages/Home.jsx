import React, { useContext, useEffect, useState, useRef } from 'react';
import Header from './Home/Header';
import Speciality from './Home/Speciality';
import TopDoctor from './Home/TopDoctor';
import TrustCard from './Home/TrustCard';
import { AppContext } from '../component/CreateContext';
import { toast } from 'react-toastify';
import Footer from './Home/Footer';
import axios from 'axios';
import Choose from './Home/Choose';
import Flow from './Home/Flow';



function Home() {

  const { BackendUrl } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [messageStage, setMessageStage] = useState(0);


  useEffect(() => {
    const timer = [
      setTimeout(() => setMessageStage(1), 3000),
      setTimeout(() => setMessageStage(2), 6000),
      setTimeout(() => setMessageStage(3), 9000)
    ]
  })

  const messages = [
    "Backend Server Loading...",
    "This may take a few seconds. Please wait.",
    "If this is taking too long, please check your internet connection or try refreshing the page."
  ]


  const fetchWithRetry = async (url, retries = 3) => {
    try {
      return await fetch(url);
    } catch (err) {
      if (retries > 0) {
        await new Promise(r => setTimeout(r, 3000)); // wait 3 sec
        return fetchWithRetry(url, retries - 1);
      }
      throw err;
    }
  };



  /// Check if the backend server is running
  useEffect(() => {
    const alreadyChecked = sessionStorage.getItem('backendChecked');
    if (alreadyChecked) {
      setLoading(false);
      return;
    }
    const checkBackend = async () => {
      setLoading(true);
      try {
        const response = await fetchWithRetry(`${BackendUrl}/home`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        setLoading(false);
      } catch (error) {
        toast.error("Backend Server not responding.Try again later.");
      } finally {
        setLoading(false);
        sessionStorage.setItem('backendChecked', 'true');
      }
    }
    checkBackend();
  }, [])

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 flex flex-col items-center justify-center z-999 transition-opacity ${loading ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className='loader'>
        </div>
        <p className='font-medium text-xl text-white text-center px-3'>{messages[messageStage]}</p>
      </div>
      <Header />
      <Speciality />
      <TopDoctor />
      <Choose />
      <Flow />
      <TrustCard />
      <Footer />
    </>
  )
}

export default Home;