// import { useState } from 'react'
import "./App.css";
// import { Button } from 'react-bootstrap';
import React from "react";
import Sequencer from "./components/Sequencer/Sequencer";
import Header from "./components/Header/Header";
// import Todo from "./components/Todo";
import Footer from "./components/Footer/Footer";
import { Container } from "react-bootstrap";

function App() {
  return (
    <div className="App">
      <Header />
      <Container>
      {/* <Todo/> */}

        <div className="App-body">

          <h1 className="h1">Samantha</h1>
          <Sequencer />
        </div>
      </Container>
      <Footer />
    </div>
  );
}

export default App;
