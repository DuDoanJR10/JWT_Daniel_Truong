import "./register.css";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../redux/apiRequest'; 

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleRegister = (e) => {
        e.preventDefault();
        const newUser = { email, password, username };
        registerUser(newUser, dispatch, navigate);
    }

    return (
        <section className="register-container">
            <div className="register-title"> Sign up </div>
            <form onSubmit={handleRegister}>
                <label>EMAIL</label>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                <label>USERNAME</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
                <label>PASSWORD</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                <button type="submit"> Create account </button>
            </form>
        </section>
    );
}

export default Register;