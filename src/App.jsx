import GameContainer from './components/GameContainer';
import './App.css'; // Hier kommt später unser maritimes Styling rein

function App() {
  return (
    <div className="app-layout">
      <header>
        <h1>⚓ Kap Arkona Explorer</h1>
      </header>
      <main>
        <GameContainer />
      </main>
    </div>
  );
}

export default App;