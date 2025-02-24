import "./App.css";
import MoodCalendar from "./Pages/MoodCalendar.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import RegisterPage from "./Pages/RegisterPage.jsx";
import { useSelector } from "react-redux";
import { useState } from "react";

function App() {
  const user = useSelector((state) => state.user.user);
  const [showLogin, setShowLogin] = useState(true);
  
  const toggleAuthForm = () => {
    setShowLogin(!showLogin);
  };
  const handleAuthSuccess = (user) => {
    // The component will rerender when Redux state changes
    // No need for additional state updates here
  };
  return (
    <div className="canvas">
      {!user ? (
        <div className="auth-container">
          {showLogin ? (
            <>
              <LoginPage onLoginSuccess={handleAuthSuccess} />
              <p className="auth-toggle">
                Don't have an account?{" "}
                <button onClick={toggleAuthForm} className="text-button">
                  Register
                </button>
              </p>
            </>
          ) : (
            <>
              <RegisterPage onRegisterSuccess={handleAuthSuccess} />
              <p className="auth-toggle">
                Already have an account?{" "}
                <button onClick={toggleAuthForm} className="text-button">
                  Login
                </button>
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="mood-calendar-box">
          <MoodCalendar />
        </div>
      )}
    </div>
  );
}

export default App;