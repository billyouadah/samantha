// import { useState } from 'react'
import './App.css'
// import { Button } from 'react-bootstrap';
import Sequencer from './components/Sequencer';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Boîte à rythmes Samantha</h1>
        <Sequencer />
      </header>
    </div>
  );
}

export default App
