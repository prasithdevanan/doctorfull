import React, { useContext } from 'react'
import { AppContext } from '../component/CreateContext'

function Profile() {
  const { user } = useContext(AppContext);
  const useName = user?.email.split('@')[0];
  console.log(user);
  return (
    <>
    <section>
      <div>
        <p>Profile</p>
        <p>{useName}</p>
        <input type="text"  value={user?.email} className='bg-gray-100 px-3 py-2 focus:outline-none' readOnly/>
      </div>
    </section>
    </>
  )
}

export default Profile