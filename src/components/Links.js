import React, {useEffect, useState} from "react";
import LinkForm from "./LinkForm";
import { db } from "../firebaseConfig";
import { collection, doc, onSnapshot, addDoc, deleteDoc, setDoc} from "firebase/firestore"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dialogs from "./Dialogs";
import styled from 'styled-components';
import { useAuth } from "../context/AuthContext";


const Links = () =>{

   
    const [datos, setDatos] = useState([])

    const [currentId, setCurrentId] = useState("")

    const [stateDialog1, changeStateDialog1] = useState(false);

    const [userId, setUserId] = useState('');


    const addOrEditInDB = async (values_object)=>{//agrega en la bd
        console.log(values_object.url, "averla");

        if(currentId === ''){
        // Add a new document in collection "datos"
            await addDoc(collection(db, "datos"), {
            description: values_object.description,
            name: values_object.name,
            url: values_object.url
            }) 
            toast('Nuevo dato Agregado',{
                type: 'success',
                position: 'bottom-right',
                autoClose: 2000,
                theme: 'dark'
            });
            
        }else{

            // write a document in collection "datos"
            await setDoc(doc(db, "datos", currentId), {
                description: values_object.description,
                name: values_object.name,
                url: values_object.url
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

        onSnapshot(collection(db,'datos'),(doc)=>{
            
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
        await deleteDoc(doc(db, "datos", id));
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
            <LinkForm {...{addOrEditInDB, currentId, datos, setCurrentId}}/>
            </div>
        
            <div className="col-md-4 p-2">
                {datos.map((dato)=>(

                    <div className="card mb-1" key={dato.id}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <h4>{dato.name}</h4>
                                <div>
                                <i className='material-icons text-info' onClick={() => setCurrentId(dato.id)}>create</i>
                                <i className='material-icons text-danger' onClick={() => {changeStateDialog1(!stateDialog1); {setUserId(dato.id)}}}>close</i>
                                </div>
                            </div>
                            
                            <p>{dato.description}</p>
                            <a href="#">{dato.url}</a>
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
                            <button className="btn btn-danger m-2" onClick={() => {onDeleteInDB(userId); changeStateDialog1(!stateDialog1)}}>Borrar</button>
                        </div>
                    
                    </Contenido>
                    

                </Dialogs>
            </div>
            
        </div>
    )
}

export default Links

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