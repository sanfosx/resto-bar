import {React, useState} from 'react'
import { useAuth, userCredential } from '../context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';


function Login() {

    const {login} = useAuth();
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
        } catch (error) {

            console.log(error)
        }
        

        setUser({...inicialStateValues})
      };


    const handleInputChange = e =>{// maneja los cambios de los inputs

        const {name, value} = e.target
        setUser({...user, [name]: value})
        console.log(name, value)
    }
   
    return (

    <form className="card card-body col-md-4 p-2" onSubmit={handleSubmit}> 
      <h1 className="text-center">Login</h1>
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
      <button className="btn btn-outline-success btn-block"  onClick={handleSubmit}>login</button>
      
      <button className="btn btn-outline-danger btn-block mt-2">Cancel</button>

    </form>
  )
}

export default Login