import React, {useEffect, useState} from "react";
import LinkForm from "./LinkForm";
import { db } from "../firebaseConfig";
import { toast } from "react-toastify";
import { getFirestore, collection, getDocs, doc, onSnapshot, addDoc, deleteDoc, setDoc} from "firebase/firestore"



const Links = () =>{

    const [datos, setDatos] = useState([])

    const [currentId, setCurrentId] = useState("")

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
                type: 'success'
            });
        }else{

            // Add a new document in collection "cities"
            await setDoc(doc(db, "datos", currentId), {
                description: values_object.description,
                name: values_object.name,
                url: values_object.url
            });
            setCurrentId('')
            toast('Dato Modificado',{
                type: 'success'
            });
        }


        toast('Nuevo dato Agregado',{
            type: 'success'
        });
    }

    const readDB= async ()=>{//lee en la bd

        onSnapshot(collection(db,'datos'),(doc)=>{
            
            const docs = []
            doc.forEach(element => {
                docs.push({...element.data(), id:element.id})
                
            });
            setDatos(docs)
            console.log(docs)

            toast('Nuevo dato Agregado',{
                type: 'success'
            });
        })   
    }

    const onDeleteInDB = async (id) =>{
       if(window.confirm("esta seguro?")){

        await deleteDoc(doc(db, "datos", id));
       }

        console.log("borrando: ",id)


    }

    useEffect(()=>{
        readDB()
        console.log("reading.....")

    },[]);

    return (
    <div className="container">

        <div className="col-md-4 p-2">
        <LinkForm {...{addOrEditInDB, currentId, datos}}/>
        </div>
        
        <div className="col-md-4 p-2">
            {datos.map((dato)=>(

                <div className="card mb-1" key={dato.id}>
                    <div className="card-body">
                        <div className="d-flex justify-content-between">
                            <h4>{dato.name}</h4>
                            <div>
                            <i className='material-icons text-danger' onClick={() => onDeleteInDB(dato.id)}>close</i>
                            <i className='material-icons text-succes' onClick={() => setCurrentId(dato.id)}>create</i>
                            </div>
                        </div>
                        
                        <p>{dato.description}</p>
                        <a href="#">{dato.url}</a>
                    </div>
                </div>
            
            ))}
        </div>
           
    </div>
    )
}

export default Links