'use client'

import React from "react"
import { useState } from "react";
import styles from './RegisterForm.module.css'
import { registerAction } from "../serverActions/registerAction";
import Link from "next/link";
const RegisterForm = () => {
    const [username,setUsername]=useState('');
     const [email,setEmail]=useState('');
     const [password,setPassword]=useState('');

     const registerHandler = async(e)=>{
        e.preventDefault();
        const userRegisterDetails={
            username,
            email,
            password
        };
        console.log(userRegisterDetails);
        try{
           const response =  await registerAction(userRegisterDetails);
           if(response.success){
            alert("Registration Successful");
           }

        }
        catch(e){
            console.log(e);
            
        }
     }
    
    return ( 
        <div className={styles.formContainer}>
            <h1 className={styles.registerHead}>Register Form</h1>
          <form onSubmit={registerHandler} className={styles.form}>
        <h1 className={styles.inputHeads}>Username</h1>
        <input type="text" className={styles.inputField} name='username' onChange={(e) => setUsername(e.target.value)} />
        <h1 className={styles.inputHeads}>Email</h1>
        <input type="email" className={styles.inputField} name='email' onChange={(e) => setEmail(e.target.value)} />
        <h1 className={styles.inputHeads}>Password</h1>
        <input type="text" className={styles.inputField} name='password' onChange={(e) => setPassword(e.target.value)} />
        <br/><br/>
        <button type="submit" className={styles.buttonElement}>Register</button>
        <Link href="/login" className={styles.loginLink}>Already have an account? Login</Link>
        </form> 
        </div>
    );
}
 
export default RegisterForm;