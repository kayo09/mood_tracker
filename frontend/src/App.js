import logo from './logo.svg';
import './App.css';
import MoodCalendar from './Pages/MoodCalendar.jsx'
import MoodDistribution from './Pages/MoodDistribution.jsx';
import MoodJournal from './Pages/MoodJournal.jsx';



function App() {
  return (
     <div className='canvas'>
      <div className='mood-distribution box'>
      <MoodDistribution></MoodDistribution>
      <div className='resizer'></div>
      </div>
      <div className='mood-calendar box'>
      <MoodCalendar> </MoodCalendar>
      <div className='resizer'></div>
      </div>
      <div className='mood-journal box'>
      <MoodJournal></MoodJournal>
      <div className='resizer'></div>
      </div>
     </div>
  );

}

export default App;
