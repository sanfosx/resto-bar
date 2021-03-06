import {React, useState} from 'react'
import { useAuth} from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Alerts from './Alerts'




function RegisterForm(props) {

    
    const {signup, addUserInFirestore} = useAuth();
    const [error, setError] = useState();
    const navigate = useNavigate();
    const inicialStateValues={
        userName:'',
        userEmail:'',
        userPassword:'',
    
    };
    const [user, setUser] = useState(inicialStateValues);

    const handleSubmit = async (e) => { // maneja el btn save

        e.preventDefault();
        //tengo que validar que tiene todo lo q necesita primero @valid_form(values)
        try {
            await signup(user.userEmail, user.userPassword).then((userCredential) => {
                // Signed in
                const userDb = userCredential.user;
                console.log('USUARIO CREADO', userDb )
                addUserInFirestore(userDb.uid,user)
                navigate('/')
              })
        } catch (error) {
            setError(error.message)
            console.log(error.message)
        }
        
        setUser({...inicialStateValues})
      };


    const handleInputChange = e =>{// maneja los cambios del input

        const {name, value} = e.target
        setUser({...user, [name]: value})
        console.log(name, value)
    }
   
    
    return (

    <form className="card card-body col-md-4 p-2" onSubmit={handleSubmit}> 
            
            <h1 className="text-center">Register</h1>
            {error && <Alerts message={error}/>}
            <div className="form-group input-group p-2">
                <div className="input-group-text bg-light">
                    <i className="material-icons">person</i>
                </div>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="your name" 
                    name="userName" 
                    onChange={handleInputChange}
                    value={user.userName}    
                />
            </div>

            <div className="form-group input-group p-2">
                <div className="input-group-text bg-light">
                    <i className="material-icons">email</i>
                </div>
                <input 
                    type="text" 
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

            <button className="btn btn-outline-success btn-block" onClick={handleSubmit}>Register</button>
            
            <button className="btn btn-outline-danger btn-block mt-2">Cancel</button>

        </form>
  )
}

export default RegisterForm