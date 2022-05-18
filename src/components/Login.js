import {React, useState} from 'react'
import { useAuth, userCredential } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import Alerts from './Alerts';


function Login() {

    const [error, setError] = useState();
    const {login, loginWithGoogle, userLoged} = useAuth();
    const navigate = useNavigate();
    const inicialStateValues={
        userEmail:'',
        userPassword:''
    };
    const [user, setUser] = useState(inicialStateValues);

    const handleSubmit = async (e) => { // maneja el btn login

        e.preventDefault();
        //tengo que validar que tiene todo lo q necesita primero @valid_form(values)
        try {
            await login(user.userEmail, user.userPassword);  //loguea
            navigate('/')
            console.log('usuario logeado', userLoged)
        } catch (error) {
            setError(error.message)
            console.log(error.message)
        }
        

        setUser({...inicialStateValues})
      };


    const handleInputChange = e =>{// maneja los cambios de los inputs

        const {name, value} = e.target
        setUser({...user, [name]: value})
        console.log(name, value)
    }

    const handleGoogleSigIn = async () =>{

        try {
            await loginWithGoogle()
            navigate('/')
            console.log("goooooogle")
        } catch (error) {
            setError(error.message)
            console.log(error.message)
        }
        
    }
   
    return (
    <div className="">
        <form className="card card-body col-md-4 p-2" onSubmit={handleSubmit}> 
        <div>
            <h1 className="text-center">Login</h1>
            {error && <Alerts message={error}/>}
        </div>
        <div className="form-group input-group p-2">
            <div className="input-group-text bg-light">
                <i className="material-icons">email</i>
            </div>
            <input 
                type="email" 
                className="form-control" 
                placeholder="your email" 
                name="userEmail" 
                onChange={handleInputChange}
                value={user.userEmail}
            />
        </div>
        <div className="form-group input-group p-2">
            <div className="input-group-text bg-light">
                <i className="material-icons">lock</i>
            </div>
            <input 
                type="password" 
                className="form-control" 
                placeholder="your password" 
                name="userPassword" 
                onChange={handleInputChange}
                value={user.userPassword}
            />
        </div>
        <button className="btn btn-outline-success btn-block m-2"  onClick={handleSubmit}>login</button>
        
        <div className="form-group input-group p-2" onClick={handleGoogleSigIn}>
                <div className="input-group-text bg-light">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"/>
                </div>
                <div className="btn btn-outline-primary"> 
                <p className="text-center pt-3"><b>Sign in with google</b></p>
                </div>
        </div>

        
        </form>
     </div>
  )
}

export default Login