import "./login.css";
import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    return ( 
        <section className="login-container">
            <div className="login-title"> Log in</div>
            <form>
                <label>USERNAME</label>
                <input name="username" type="text" placeholder="Enter your username" onChange={(e) => setUsername(e.target.value)} />
                <label>PASSWORD</label>
                <input name="password" type="password" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Continue</button>
            </form>
            <div className="login-register"> Don't have an account yet? </div>
            <Link className="login-register-link" to="/register">Register one for free </Link>
        </section>
     );
}
 
export default Login;