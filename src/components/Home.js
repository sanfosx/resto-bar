import React from 'react';
import Links from './Links';
import LinkForm from './LinkForm';
import '../firebaseConfig'
import 'react-toastify/dist/ReactToastify.css';
import {authContext, useAuth} from '../context/AuthContext'
import { Navigate, useNavigate } from 'react-router-dom';


function Home() {
    
    const {userLoged, logout, loading} = useAuth()
    console.log('Usuario logueado',userLoged)
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout()
    }

    if(loading) return <h1>Loading...</h1>

    return (
     <div className='container p-10'>
        <div className='row'>
        {userLoged &&
            <div>
              <h1 className='text-center p-2'>HI {userLoged.email}</h1>
              <button onClick={handleLogout}> <i className='material-icons text-info'>close</i></button>
            </div>
              }
          <Links>
            <LinkForm/>
          </Links>
        
        
        </div>
     </div>
       
    
    );
}

export default Home