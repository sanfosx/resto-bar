import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({children}) {

    const {userLoged, loading} = useAuth()

    if(loading) return <h1>Loading...</h1>

    if(!userLoged) return <Navigate to='/login'/>

  return (
    <>{children}</>
  )
}

export default ProtectedRoute