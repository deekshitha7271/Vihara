'use client'

import React from "react"
import { useState } from "react";
import styles from './RegisterForm.module.css'
import { registerAction } from "../serverActions/registerAction";
import Link from "next/link";
const RegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const registerHandler = async (e) => {
        e.preventDefault();
        const userRegisterDetails = {
            username,
            email,
            password
        };
        console.log(userRegisterDetails);
        try {
            const response = await registerAction(userRegisterDetails);
            if (response.success) {
                alert("Registration Successful");
            }

        }
        catch (e) {
            console.log(e);

        }
    }

    return (
        <div className={styles.formContainer}>
            <h1 className={styles.registerHead}>Create an Account</h1>
            <form onSubmit={registerHandler} className={styles.form}>

                <label className={styles.label} htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    className={styles.inputField}
                    name='username'
                    placeholder="Choose a username"
                    onChange={(e) => setUsername(e.target.value)}
                />

                <label className={styles.label} htmlFor="email">Email</label>
                <input
                    type="email"
                    id="email"
                    className={styles.inputField}
                    name='email'
                    placeholder="Enter your email"
                    onChange={(e) => setEmail(e.target.value)}
                />

                <label className={styles.label} htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    className={styles.inputField}
                    name='password'
                    placeholder="Create a password"
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button type="submit" className={styles.buttonElement}>Register</button>
                <Link href="/login" className={styles.loginLink}>Already have an account? Login</Link>
            </form>
        </div>
    );
}

export default RegisterForm;