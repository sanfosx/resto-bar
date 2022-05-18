import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import {useNavigate } from "react-router-dom";
import { setDoc, doc, deleteDoc } from "firebase/firestore";
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut, 
    GoogleAuthProvider,
    signInWithPopup, 
    deleteUser,
    updateEmail,
    updatePassword
} 
from "firebase/auth";

export const authContext = createContext()

export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) throw new Error("There is no Auth provider");
    return context;
  };



export function AuthProvider({children}){

    const [userLoged, setUserLoged] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();

    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const login =(email, password) => {

       return signInWithEmailAndPassword(auth, email, password)
    }

    const loginWithGoogle =() =>{

        const googleProvider =new GoogleAuthProvider()

        return signInWithPopup(auth, googleProvider)

    }

    const logout = () =>{
        signOut(auth)
        console.log('bye', userLoged)
        navigate('/login')
        setUserLoged('')
        setLoading(false)
    }

    const addUserInFirestore = async (id, data)=>{

        await setDoc(doc(db, "usuarios", id), {
            password: data.password,
            name: data.name,
            email: data.email
        });
        
    }

    const clearUserInFirestore = (id) =>{

            return deleteDoc(doc(db, 'usuarios', id));     
    }
    
    const clearUser= () =>{

        return (deleteUser(auth.currentUser), console.log('borradookkkkkkk'))    
    }

    const changeEmailUser = (email)=>{

       return  updateEmail(auth.currentUser, email)
    }

    const changePasswordUser = (password)=>{
        
        return updatePassword(auth.currentUser, password)
    }
    useEffect(() => {
        const unsubuscribe = onAuthStateChanged(auth, (currentUser) => {
          console.log({ currentUser });
          setUserLoged(currentUser);
          setLoading(false);
        });
        return () => unsubuscribe();
      }, []);
    return (
        <authContext.Provider value={{
            signup, 
            login, 
            userLoged, 
            logout, 
            loading, 
            loginWithGoogle, 
            addUserInFirestore, 
            changeEmailUser,
            changePasswordUser,
            clearUser, 
            clearUserInFirestore}}>
            {children}
        </authContext.Provider>
    )
}