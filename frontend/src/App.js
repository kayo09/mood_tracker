import "./App.css";
import MoodCalendar from "./Pages/MoodCalendar.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import { useSelector } from "react-redux";
import EmotionOverview from "./Pages/EmotionOverview.jsx";

function App() {
  const user = useSelector((state) => state.user.user);

  return (
    <div className="canvas">
      <EmotionOverview/>

    </div>
  );
  }
  ;

export default App;
