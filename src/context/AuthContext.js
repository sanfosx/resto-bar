import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import {useNavigate } from "react-router-dom";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, deleteUser } from "firebase/auth";

export const authContext = createContext()

export const useAuth = () =>{
    const context = useContext(authContext)
    return context
}



export function AuthProvider({children}){

    const [userLoged, setUserLoged] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();
    const signup =(email, password, name) => {
        createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log('firebaseuser',user.uid)
            setUserLoged(user)
            
            setDoc(doc(db,"usuarios", user.uid), {
                password: password,
                name: name,
                email: email
            }) 
           
            // ...
        }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            // ..
            });
        
    }

    const login =(email, password) => {
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          setUserLoged(userCredential.user)
          console.log( 'user del login',userLoged)
          // ...
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
        });
      
        
    }

    const logout = () =>{
        signOut(auth)
        console.log('bye', userLoged)
        navigate('/login')
        setUserLoged('')
        setLoading(false)
    }

    useEffect( () => {
        const unSuscribe = onAuthStateChanged(auth, (currentUser) =>{

            setUserLoged(currentUser)
            setLoading(false)
            console.log('currentUser: ', currentUser)
        })
        return unSuscribe()
    }, [] )

    return (
        <authContext.Provider value={{signup, login, userLoged, logout, loading}}>
            {children}
        </authContext.Provider>
    )
}