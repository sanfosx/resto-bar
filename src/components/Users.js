import React, {useEffect, useState} from "react";
import UserForm from "./UserForm";
import { db } from "../firebaseConfig";
import { collection, doc, onSnapshot, getDoc, setDoc} from "firebase/firestore"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dialogs from "./Dialogs";
import styled from 'styled-components';
import { useAuth } from "../context/AuthContext";
import Alerts from "./Alerts";
import { updateEmail, updatePassword } from "firebase/auth";



 const Users = () =>{

    const [error, setError] = useState();
    const [datos, setDatos] = useState([])

    const [currentId, setCurrentId] = useState("")

    const [stateDialog1, changeStateDialog1] = useState(false);

    const [user, setUser] = useState('');

    const {login, signup, addUserInFirestore, clearUser, clearUserInFirestore, changeEmailUser, changePasswordUser} = useAuth();

    

    const addUserInDB = async (values_object)=>{//agrega en la bd
        
        if(currentId === ''){// Add a new user
            try {
                 await signup(values_object.email, values_object.password).then((userCredential) => {
                    // Signed in
                    const userDb = userCredential.user;
                    console.log('USUARIO CREADO', userDb )
                    addUserInFirestore(userDb.uid,values_object)
                  })
                 
                toast('Nuevo Usuario Agregado',{
                    type: 'success',
                    position: 'bottom-right',
                    autoClose: 2000,
                    theme: 'dark'
                });

            } catch (error) {
                setError(error.message)
                console.log(error)
            }
        }else{//Modifica el usuario existente
            
            const docSnap= await getDoc(doc(db, "usuarios", currentId));
                if (docSnap.exists()) {
                    console.log("oldData:", docSnap.data(),'currenid',currentId);
                    if(docSnap.data().email!==values_object.email){
                        if(docSnap.data().password !== values_object.password){
                           await authUserUpdate(currentId, docSnap.data().email, docSnap.data().password, true)
                            updateEmail(values_object.email)
                            updatePassword(values_object.password)
                        }else{
                            authUserUpdate(currentId, docSnap.data().email, values_object.password, true)
                            updateEmail(values_object.email)
                        }
                    }else{
                        if(docSnap.data().password !== values_object.password){
                            updatePassword(values_object.password)
                        }
                    }
                } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
            
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

    const readDB= async ()=>{//lee en la bd y actualiza con cualquier cambio se usa en el useEffect

        onSnapshot(collection(db,'usuarios'),(doc)=>{
            
            const docs = []
            doc.forEach(element => {
                docs.push({...element.data(), id:element.id})
                
            });
            setDatos(docs)
            //console.log('Los Elementos',docs)
        })   
    }

    const updateEmail= async (email)=>{
        try {
            
            await changeEmailUser(email)
            console.log('cambio el mail?????')
        } catch (error) {
            setError(error.message)
        }
    }
    const onDeleteInDB = async (id) =>{
        try {
            await clearUserInFirestore(id)
            try {
                await clearUser()
            } catch (error) {
                setError(error.message)
            }
            toast('Dato Eliminado',{
                type: 'error',
                position: 'bottom-right',
                autoClose: 2000,
                theme: 'dark'
            });
        } catch (error) {
            setError(error.message)
        }   
    }

    const updatePassword = async (password)=>{
       
        try {
            await changePasswordUser(password)
            console.log('cambio el password?????')
        } catch (error) {
            setError(error.message)
        }
    }
    const authUserUpdate = async(id, email, password, flagForUpdateOrDelete) => {
        try {
            await login(email, password).then((userCredential) =>{
                console.log('que tiene userCredentialsssssssssssss', userCredential.user.email )
                if(!flagForUpdateOrDelete){
                    onDeleteInDB(id)
                }//borro el usuario     
            })
        } catch (error) {
            setError(error.message)
            console.log(error.message)
        }
    }    

    useEffect(()=>{
        readDB()
        console.log("reading.....")

    },[]);

    return (
        <div className="container">
            <div className="col-md-4 p-2">
                <UserForm {...{addUserInDB, currentId, datos, setCurrentId, error, setError}}/>
            </div>
            <div className="col-md-4 p-2">
                {datos.map((dato)=>(
                    <div className="card mb-1" key={dato.id}>
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <h4>{dato.name}</h4>
                                <div>
                                <i className='material-icons text-info' onClick={() => {setCurrentId(dato.id)}}>create</i>
                                <i className='material-icons text-danger' onClick={() => {changeStateDialog1(!stateDialog1); setUser(dato)}}>close</i>
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
                            <button className="btn btn-danger m-2" onClick={() => {authUserUpdate(user.id, user.email, user.password, false); changeStateDialog1(!stateDialog1)}}>Borrar</button>
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