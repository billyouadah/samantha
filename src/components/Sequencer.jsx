import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import Clap from "../assets/Clap.wav";
import Kick from "../assets/Kick.wav";
import OH from "../assets/Open-hat.wav";
import DrumPad from "./DrumPad";

const instruments = {
  Clap: Clap,
  Kick: Kick,
  OH: OH,
};

const Sequencer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [steps, setSteps] = useState(
    Array(16).fill({ Clap: false, Kick: false, OH: false })
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
      <h2>Drum Machine</h2>
      <div className="sequencer-grid">
        {Object.keys(instruments).map((instrument) => (
          <div key={instrument} className="step-row">
            <div className="drum-pad-container">
              <DrumPad sound={instruments[instrument]} label={instrument} />
            </div>
            {steps.map((step, index) => (
              <button
                key={index}
                className={`step ${step[instrument] ? "active" : ""}`}
                onClick={() => toggleInstrumentOnStep(index, instrument)}
              >
                {index + 1}
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
