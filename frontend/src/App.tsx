import './App.css'
import StorePage from "./pages/StorePage.tsx";
import {AuthProvider, useAuth} from "./components/Auth.tsx";
import LoginPage from "./pages/LoginPage.tsx";

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