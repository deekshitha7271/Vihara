'use client'

import { useState } from "react";
import styles from './UserLogin.module.css'
import { loginAction } from "../serverActions/loginAction";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const loginHandler = async (e) => {
        e.preventDefault();
        const loginDetails = { email, password };
        console.log(loginDetails);
        try {
            const response = await loginAction(loginDetails);
            if (response.success) {
                alert("Login Successful");
                router.push('/');
            }
            else {
                setError(response.message || 'Login failed');
            }

        } catch (e) {
            setError(e.message || 'An error occurred during login');
        }
    }

    return (
        <div>
            <div className={styles.formContainer}>
                <h1 className={styles.loginHead}>Login</h1>
                <form onSubmit={loginHandler} className={styles.form}>
                    {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

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
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit" className={styles.buttonElement}>Login</button>

                    <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: '10px' }}>
                        <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
                        <span style={{ color: '#666', fontSize: '0.9rem' }}>or</span>
                        <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
                    </div>

                    <button
                        type="button"
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className={styles.buttonElement}
                        style={{ background: 'white', color: '#333', border: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
                    >
                        <FcGoogle size={24} />
                        Sign in with Google
                    </button>

                    <Link href="/register" className={styles.registerLink}>Don&apos;t have an account? Register</Link>
                </form>
            </div>
        </div>);
}

export default UserLogin;