import "./auth.css"
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../contexts/AuthProvider'

const Login = () => {

    const navigate=useNavigate()

    const {authToken, setAuthToken}=useAuth()

    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")

    const handleSubmit=async(e: React.FocusEvent<HTMLFormElement>)=>{
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8009/user/login", {
                email,
                password
            });
            console.log(response);
            if(!response.data.token){
                alert("email or password didn't match")
            }
            setAuthToken(response.data.token)
            localStorage.setItem("token", response.data.token);
            // navigate("/")
            window.location.href="http://localhost:5173"
        } catch (error) {
                console.error("Error during login", error);
        }
    }
    
  return (
    <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor='email'>Email</label>
            <input name='email' id='email' type='text' value={email} onChange={(e)=>{setEmail(e.target.value)}} />
            <label htmlFor='password'>Password</label>
            <input name='password' id='password' type='text' value={password} onChange={(e)=>{setPassword(e.target.value)}} />
            <input type='submit' value="Login" />
        </form>
        <p>Not have an account, <Link to="/signup">Register</Link></p>
    </div>
  )
}

export default Login