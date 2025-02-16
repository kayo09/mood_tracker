import "./App.css";
import MoodCalendar from "./Pages/MoodCalendar.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import { useSelector } from "react-redux";

function App() {
  const user = useSelector((state) => state.user.user);

  return (
    <div className="canvas">
      {/* {!user ? (
          // Render the login page if there is no user in Redux state
          <LoginPage />
        ) : ( 
       <div className="mood-calendar-box">
            <MoodCalendar/>
            <div className="resizer"></div>
          </div> 
      )} */}
      {!user?(<LoginPage/>):(
        <div className="mood-distribution-box">
          <div className="mood-calendar-box">
          <MoodCalendar/>
          </div>
        </div>
  )
}
    </div>
  );
  }
  ;

export default App;
