import "./auth.css"
import React, { useState } from 'react'
import axios from "axios"
import { useAuth } from '../contexts/AuthProvider';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {

    const navigate=useNavigate()

    const { authToken, setAuthToken } = useAuth();

    const [username, setUsername]=useState("")
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:8009/user/signup", {
                username,
                email,
                password
            });
            console.log(response);
            setAuthToken(response.data.token)
            localStorage.setItem("token", response.data.token);
            // navigate("/")
            window.location.href="http://localhost:5173"
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                alert("Email already exists");
            } else {
                console.error("Error during signup", error);
            }
        }
    };
    
  return (
    <div>
        <h1>SignUp</h1>
        <form onSubmit={handleSubmit}>
            <label htmlFor='username'>Username</label>
            <input name='username' id='username' type='text' value={username} onChange={(e)=>{setUsername(e.target.value)}} />
            <label htmlFor='email'>Email</label>
            <input name='email' id='email' type='text' value={email} onChange={(e)=>{setEmail(e.target.value)}} />
            <label htmlFor='password'>Password</label>
            <input name='password' id='password' type='text' value={password} onChange={(e)=>{setPassword(e.target.value)}} />
            <input type='submit' value="SignUp" />
        </form>
        <p>Already have an account, <Link to="/login">Login</Link></p>
    </div>
  )
}

export default SignUp