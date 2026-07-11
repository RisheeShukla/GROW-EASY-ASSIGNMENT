"use client";
import {useEffect} from 'react';
import {useFirebase} from './Firebase';
import { useRouter } from "next/navigation";
const ProtectedR=({children}: { children: React.ReactNode })=>{
    const router=useRouter();
    const firebase=useFirebase();
useEffect(()=>{
    if(!firebase.isLoggedIn){
        router.push("/login");
    }
},[firebase,router])

return children;
}
export default ProtectedR;