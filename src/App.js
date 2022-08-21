import './App.scss';
import Control from "./components/Control/control.js"
import Clock from "./components/Clock/clock.js"
function App() {
  return (
    <section className="App">
      <Clock />
      <Control />
    </section>
  );
}

export default App;
