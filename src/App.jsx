// import { useState } from 'react'
import "./App.css";
// import { Button } from 'react-bootstrap';
import React from "react";
import Sequencer from "./components/Sequencer";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Container } from "react-bootstrap";

function App() {
  return (
    <div className="App">
      <Header />
      <Container>
        <header className="App-header">
          <h1>Samantha</h1>
          <Sequencer />
        </header>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
