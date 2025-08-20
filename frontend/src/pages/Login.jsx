import {useState} from "react";
import {useAuth} from "../components/Auth.jsx";


export default function LoginPage() {
    const {login} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            await login(email, password);
        } catch {
            alert("Login failed");
        }
    };

    return (
        <>
            <h2>Login</h2>
            <input placeholder="Email" value={email} type="email" onChange={(e) => setEmail(e.target.value)}/>
            <input placeholder="Password" value={password} type="password"
                   onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={handleLogin}>Login</button>
        </>
    );
};