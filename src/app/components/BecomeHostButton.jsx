'use client';
import { useRouter } from "next/navigation";
import styles from '@/app/components/BecomeHostButton.module.css';
export default function BecomeHost({user}){
    const router = useRouter();

    const handleClick = () =>{
        if(!user){
            router.push("/login");
        } else if (user.role === "HOST"){
            router.push("/host/dashboard");
        }else{
            router.push("/host/onboarding");
        }
    };

    return (
        <button onClick={handleClick} className={styles.becomeHostButton}>
            Become a Host
        </button>
    )
}