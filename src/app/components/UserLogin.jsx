'use client'

import { useState } from "react";
import styles from './UserLogin.module.css'
import { loginAction } from "../serverActions/loginAction";
import { useRouter } from "next/navigation";
import Link from "next/link";
const UserLogin = () => {
         const [email,setEmail]=useState('');
         const [password,setPassword]=useState('');
         const [error,setError]=useState('');
         const router = useRouter();
         const loginHandler = async(e)=>{
            e.preventDefault();
            const loginDetails={email,password};
            console.log(loginDetails);
            try{
               const response =  await loginAction(loginDetails);
               if(response.success){
                alert("Login Successful");
                router.push('/');
               }
               else{
                setError(response.message || 'Login failed');
               }

            }catch(e){
                setError(e.message || 'An error occurred during login');
            }
         }
    
    return ( 
    <div>
        <div className={styles.formContainer}>
            <h1 className={styles.loginHead}>Login Form</h1>
                  <form onSubmit={loginHandler} className={styles.form}>
                {error && <p style={{color:'red'}}>{error}</p>}
                <h1 className={styles.inputHeads}>Email</h1>
                <input type="email" className={styles.inputField} name='email' onChange={(e) => setEmail(e.target.value)} />
                <h1 className={styles.inputHeads}>Password</h1>
                <input type="text" className={styles.inputField} name='password' onChange={(e) => setPassword(e.target.value)} />
                <br/><br/>
                <button type="submit" className={styles.buttonElement}>Login</button>
                <Link href="/register" className={styles.registerLink}>Don&apos;t have an account? Register</Link>
                </form>  
                </div>
    </div> );
}
 
export default UserLogin;