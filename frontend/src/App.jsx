import './App.css'
import StorePage from "./pages/Store.jsx";
import {AuthProvider, useAuth} from "./components/Auth.jsx";
import LoginPage from "./pages/Login.jsx";

function Main() {
    const { user } = useAuth();
    return user ? <StorePage /> : <LoginPage />
}

export default function App() {
    return (
        <AuthProvider>
            <Main />
        </AuthProvider>
    )
}