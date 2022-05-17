import React, {useEffect, useState} from "react";
import UserForm from "./UserForm";
import { db } from "../firebaseConfig";
import { collection, doc, onSnapshot, deleteDoc, setDoc} from "firebase/firestore"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dialogs from "./Dialogs";
import styled from 'styled-components';
import { useAuth } from "../context/AuthContext";



 const Users = () =>{

   
    const [datos, setDatos] = useState([])

    const [currentId, setCurrentId] = useState("")

    const [stateDialog1, changeStateDialog1] = useState(false);

    const [userId, setUserId] = useState('');

    const {signup, deleteUser} = useAuth();


    const addOrEditInDB = async (values_object)=>{//agrega en la bd
        
        if(currentId === ''){
        // Add a new document in collection "datos
            try {
                 await signup(values_object.email, values_object.password, values_object.name)  //crea el user en la bd
                
                console.log('USUARIO CREADO' )

            } catch (error) {

                console.log(error)
            }

            toast('Nuevo dato Agregado',{
                type: 'success',
                position: 'bottom-right',
                autoClose: 2000,
                theme: 'dark'
            });
         //add user
           
         
        }else{

            // write a document in collection "datos"
            await setDoc(doc(db, "usuarios", currentId), {
                password: values_object.password,
                name: values_object.name,
                email: values_object.email
            });
            setCurrentId('')
            toast('Dato Modificado',{
                type: 'warning',
                position: 'bottom-right',
                autoClose: 2000,
                theme: 'dark'
            });
        }
    }

    const readDB= async ()=>{//lee en la bd y actualiza con cualquier cambio

        onSnapshot(collection(db,'usuarios'),(doc)=>{
            
            const docs = []
            doc.forEach(element => {
                docs.push({...element.data(), id:element.id})
                
            });
            setDatos(docs)
            console.log('Los Elementos',docs)
        })   
    }

    
    const onDeleteInDB = async (id) =>{
        console.log("a ver q tiene el id", id)
         deleteUser(currentId)
        await deleteDoc(doc(db, "usuarios", id));
        console.log("borrando: ",id)
        toast('Dato Eliminado',{
            type: 'error',
            position: 'bottom-right',
            autoClose: 2000,
            theme: 'dark'
        });
    }
    

    useEffect(()=>{
        readDB()
        console.log("reading.....")

    },[]);

    return (
        <div className="container">
            <div className="col-md-4 p-2">
            <UserForm {...{addOrEditInDB, currentId, datos, setCurrentId}}/>
            </div>
        
            <div className="col-md-4 p-2">
                {datos.map((dato)=>(

                    <div className="card mb-1" key={dato.id}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <h4>{dato.name}</h4>
                                <div>
                                <i className='material-icons text-info' onClick={() => setCurrentId(dato.id)}>create</i>
                                <i className='material-icons text-danger' onClick={() => {changeStateDialog1(!stateDialog1); {setUserId(dato.id)}; console.log("guauaua",userId)}}>close</i>
                                </div>
                            </div>
                            
                            <p>{dato.email}</p>
                            <p>{dato.password}</p>
                        </div>
                    </div>
                
                ))}
                <Dialogs
                state = {stateDialog1} 
                changeStateDialog = {changeStateDialog1}
                paddingDialog = {'20px'}
                positionDialog = {'center'}
                showHeaderDialog ={false}
                showOverlayDialog = {true}
                showCloseBtn= {false}
                titleDialog = 'is a title'
                > 
                    <Contenido>
                        <h1 className="text-danger"> <span>Esta seguro de Eliminar</span></h1>
                        <p className=" text-center text-danger m-2">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odit, sint.</p>
                        <div>
                            <button className="btn btn-outline-primary m-2" onClick={() => {changeStateDialog1(!stateDialog1)}}>cancel</button>
                            <button className="btn btn-danger m-2" onClick={() => {onDeleteInDB(userId); console.log(userId, "porque no tienen nada?"); changeStateDialog1(!stateDialog1)}}>Borrar</button>
                        </div>
                    
                    </Contenido>
                    

                </Dialogs>
            </div>
            
        </div>
    )
}

export default Users

const Contenido=styled.div` display: flex;
flex-direction: column;
align-items: center;
z-index:99;

h1 {
	font-size: 42px;
	font-weight: 700;
	margin-bottom: 10px;
}

p {
	font-size: 18px;
	margin-bottom: 20px;
}

img {
	width: 100%;
	vertical-align: top;
	border-radius: 3px;
}

`;