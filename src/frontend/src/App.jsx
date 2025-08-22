import './App.css'
import StorePage from "./pages/Store.jsx";
import {AuthProvider, useAuth} from "./components/Auth.jsx";
import LoginPage from "./pages/Login.jsx";
import Loading from "./components/Loading.jsx";

function Main() {
    const { user, loading } = useAuth();
    if (loading) {
        return <Loading message={"Checking session..."} />;
    }
    return user ? <StorePage /> : <LoginPage />
}

export default function App() {
    return (
        <AuthProvider>
            <Main />
        </AuthProvider>
    )
}