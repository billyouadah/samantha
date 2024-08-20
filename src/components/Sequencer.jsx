import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import Clap from "../assets/Clap.wav";
import Kick from "../assets/Kick.wav";
import OH from "../assets/Open-hat.wav";

const instruments = {
  Clap: Clap,
  Kick: Kick,
  OH: OH,
};

const Sequencer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [steps, setSteps] = useState(
    Array(16).fill({ Clap: false, Kick: false, OpenHat: false })
  );

  useEffect(() => {
    Tone.Transport.bpm.value = tempo;

    const players = {
      Clap: new Tone.Player(Clap).toDestination(),
      Kick: new Tone.Player(Kick).toDestination(),
      OH: new Tone.Player(OH).toDestination(),
    };

    const repeat = (time) => {
      steps.forEach((step, index) => {
        Object.keys(step).forEach((instrument) => {
          if (step[instrument]) {
            players[instrument].start(time + index * Tone.Time("16n"));
          }
        });
      });
    };

    const loop = new Tone.Loop(repeat, "1m").start(0);

    if (isPlaying) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
    }

    return () => {
      loop.dispose();
    };
  }, [isPlaying, steps, tempo]);

  const toggleInstrumentOnStep = (stepIndex, instrument) => {
    const newSteps = [...steps];
    newSteps[stepIndex] = {
      ...newSteps[stepIndex],
      [instrument]: !newSteps[stepIndex][instrument],
    };
    setSteps(newSteps);
  };

  return (
    <div>
      <h2>Séquenceur</h2>
      <div className="sequencer-grid">
        {steps.map((step, index) => (
          <div key={index} className="step-container">
            {Object.keys(instruments).map((instrument) => (
              <button
                key={instrument}
                className={`step ${step[instrument] ? "active" : ""}`}
                onClick={() => toggleInstrumentOnStep(index, instrument)}
              >
                {instrument}
              </button>
            ))}
          </div>
        ))}
      </div>
      <button className="play-button" onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "Stop" : "Play"}
      </button>
      <input
        type="range"
        min="60"
        max="180"
        value={tempo}
        onChange={(e) => setTempo(e.target.value)}
      />
    </div>
  );
};

export default Sequencer;
