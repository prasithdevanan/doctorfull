import React, { useContext } from 'react';
import Header from './Home/Header';
import Speciality from './Home/Speciality';
import TopDoctor from './Home/TopDoctor';
import TrustCard from './Home/TrustCard';
import { AppContext } from '../component/CreateContext';
import { useEffect } from 'react';


function Home() {
  const { BackendUrl } = useContext(AppContext);
  useEffect(() => {
    const res = async () => {
      const doctor = await fetch(`${BackendUrl}/api/doctor/list`);
      const data = await doctor.json();
      console.log(data);
    }
    res();
  })

  return (
    <>

      <Header />
      <Speciality />
      <TopDoctor />
      <TrustCard />
    </>
  )
}

export default Home;