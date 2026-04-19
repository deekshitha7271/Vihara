'use client'

import { useState } from "react";
import styles from './UserLogin.module.css'
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
        setError('');
        
        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
                callbackUrl: '/'
            });

            if (result?.error) {
                setError("Invalid email or password");
            } else {
                router.push('/');
                router.refresh();
            }
        } catch (e) {
            setError("An error occurred during login");
        }
    }

    return (
        <div className={styles.loginWrapper}>
            <div className={styles.formContainer}>
                <h1 className={styles.loginHead}>Login</h1>
                <form onSubmit={loginHandler} className={styles.form}>
                    {error && <p className={styles.errorMsg}>{error}</p>}

                    <label className={styles.label} htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        required
                        className={styles.inputField}
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label className={styles.label} htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        required
                        className={styles.inputField}
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit" className={styles.buttonElement}>Login</button>

                    <div className={styles.dividerContainer}>
                        <div className={styles.dividerLine}></div>
                        <span className={styles.dividerText}>or</span>
                        <div className={styles.dividerLine}></div>
                    </div>

                    <button
                        type="button"
                        onClick={() => signIn('google', { callbackUrl: '/' })}
                        className={`${styles.buttonElement} ${styles.googleBtn}`}
                    >
                        <FcGoogle size={24} />
                        Sign in with Google
                    </button>

                    <Link href="/register" className={styles.registerLink}>Don&apos;t have an account? Register</Link>
                </form>
            </div>
        </div>
    );
}

export default UserLogin;