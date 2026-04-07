import React, {useContext} from 'react'
import { Navigate } from 'react-router-dom'
import { AppContext } from '../../component/CreateContext'

function PubilcRouter({children}) {
  const {token} = useContext(AppContext);

  return token ? <Navigate to='/' /> : children;
}

export default PubilcRouter