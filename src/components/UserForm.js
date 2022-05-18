import {doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import Alerts from "./Alerts";

const UserForm = (props) => {
    const inicialStateValues={
        name:'',
        email:'',
        password:''
    }
    const [values, setValues] = useState(inicialStateValues);
    
    const handleInputChange = e =>{// maneja los cambios del input
        const {name, value} = e.target
        setValues({...values, [name]: value})
        console.log(name, value)
    }

    const handleSubmit = e => { // maneja el btn save
        e.preventDefault();
        //tengo que validar que tiene todo lo q necesita primero @valid_form(values)
        props.addUserInDB(values) // agrego la propiedad
        console.log(values)
        props.setError(null)
        setValues({...inicialStateValues})
      };

      const getDatoById =async(id) =>{ // busca en la bd el dato con el id dado
        const docRef = doc(db, "usuarios", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setValues({...docSnap.data()})
            console.log("Document data:", docSnap.data());
        }else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        }       
      }
    useEffect(() => {
        if(props.currentId === ""){
            console.log("vacio?")
            setValues({...inicialStateValues})
        }else{
            getDatoById(props.currentId)
            console.log(props.currentId)   
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[props.currentId]);

    return (

        <form className="card card-body" onSubmit={handleSubmit}> 
            
            <h1 className="text-center">{props.currentId === '' ? 'Agregar Usuario' : 'Modificar Usuario'}</h1>
            {props.error && <Alerts message={props.error}/>}
            <div className="form-group input-group p-2">
                <div className="input-group-text bg-light">
                    <i className="material-icons">person</i>
                </div>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="your name" 
                    name="name" 
                    onChange={handleInputChange}
                    value={values.name}    
                />
            </div>

            <div className="form-group input-group p-2">
                <div className="input-group-text bg-light">
                    <i className="material-icons">email</i>
                </div>
                <input 
                    type="email" 
                    className="form-control" 
                    placeholder="your email" 
                    name="email" 
                    onChange={handleInputChange}
                    value={values.email}
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
                    name="password" 
                    onChange={handleInputChange}
                    value={values.password}
                />
            </div>

                <button className="btn btn-success btn-block">{props.currentId === '' ? 'Save' : 'Update'}</button>
            
            {props.currentId === '' ? '' : <button className="btn btn-outline-danger btn-block mt-2" onClick={() =>{props.setCurrentId('')}}>Cancel</button>}

        </form>
    )
}
export default UserForm