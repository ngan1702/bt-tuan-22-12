
import { useLocalContext } from '../context/context'
import { useNavigate } from 'react-router-dom'
import {useEffect} from 'react'

export default function AuthMiddleware({ children }) {

    const { authLogin } = useLocalContext();
    const navigate = useNavigate();

    useEffect(()=>{
        console.log("authLogin: ", authLogin)
        if (!authLogin) {
            navigate("/login")
        }
    }, [])

    return (
        <>
            {children}
          
        </>
    )
}