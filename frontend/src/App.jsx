import './App.css'
import StorePage from "./pages/MainPage.jsx";
import {AuthProvider, useAuth} from "./components/Auth.jsx";
import LoginPage from "./pages/LoginPage.jsx";
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