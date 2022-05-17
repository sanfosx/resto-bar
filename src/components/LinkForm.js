import {doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig";

const LinkForm = (props) => {
    
    const inicialStateValues={
        url:'',
        name:'',
        description:''
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
        props.addOrEditInDB(values) // agrego la propiedad
        console.log(values)

        setValues({...inicialStateValues})
      };

      const getDatoById =async(id) =>{

        const docRef = doc(db, "datos", id);
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
        
    },[props.currentId]);

    return (

        <form className="card card-body" onSubmit={handleSubmit}> 
            
            <h1 className="text-center">{props.currentId === '' ? 'Agregar Datos' : 'Modificar Dato'}</h1>
    
            <div className="form-group input-group p-2">
                <div className="input-group-text bg-light">
                    <i className="material-icons">insert_link</i>
                </div>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="https//:someurl.com" 
                    name="url" 
                    onChange={handleInputChange}
                    value={values.url}    
                />
            </div>

            <div className="form-group input-group p-2">
                <div className="input-group-text bg-light">
                    <i className="material-icons">create</i>
                </div>
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="web site name" 
                    name="name" 
                    onChange={handleInputChange}
                    value={values.name}
                />
            </div>

            <div className="form-group p-2">
            <textarea 
                    name="description" 
                    rows="3" 
                    className="form-control" 
                    placeholder="write a description" 
                    onChange={handleInputChange}
                    value={values.description}
                />
            </div>
                <button className="btn btn-success btn-block">{props.currentId === '' ? 'Save' : 'Update'}</button>
            
            {props.currentId === '' ? '' : <button className="btn btn-outline-danger btn-block mt-2" onClick={() =>{props.setCurrentId('')}}>Cancel</button>}

        </form>
    )
}
export default LinkForm