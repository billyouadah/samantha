import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import Clap from "../assets/Clap.wav";
import Kick from "../assets/Kick.wav";
import OH from "../assets/Open-hat.wav";
import CH from "../assets/Closed-hat.wav";
import DrumPad from "./DrumPad";

const instruments = {
  Clap: Clap,
  Kick: Kick,
  OH: OH,
  CH: CH,
};

const Sequencer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [steps, setSteps] = useState(
    Array(16).fill({ Clap: false, Kick: false, OH: false, CH: false })
  );
  const [effects, setEffects] = useState({
    Clap: false,
    Kick: false,
    OH: false,
    CH: false,
  });
  const [mutes, setMutes] = useState({
    Clap: false,
    Kick: false,
    OH: false,
    CH: false,
  });

  useEffect(() => {
    Tone.Transport.bpm.value = tempo;

    // instances d'effets
    const reverb = new Tone.Reverb({
      decay: 1.5,
      wet: 0.5,
    }).toDestination();
    const delay = new Tone.FeedbackDelay({
      delayTime: "8n",
      feedback: 0.3,
      wet: 0.5,
    }).toDestination();

    const players = {
      Clap: new Tone.Player(Clap).connect(effects.Clap ? reverb : Tone.Destination),
      Kick: new Tone.Player(Kick).connect(effects.Kick ? delay : Tone.Destination),
      OH: new Tone.Player(OH).connect(effects.OH ? delay : Tone.Destination),
      CH: new Tone.Player(CH).connect(effects.CH ? delay : Tone.Destination),
    };

    // répéter les étapes
    const repeat = (time) => {
      steps.forEach((step, index) => {
        Object.keys(step).forEach((instrument) => {
          if (step[instrument] && !mutes[instrument]) {
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
  }, [isPlaying, steps, tempo, effects, mutes]);

  const toggleInstrumentOnStep = (stepIndex, instrument) => {
    const newSteps = [...steps];
    newSteps[stepIndex] = {
      ...newSteps[stepIndex],
      [instrument]: !newSteps[stepIndex][instrument],
    };
    setSteps(newSteps);
  };

  const toggleEffect = (instrument) => {
    setEffects((prevEffects) => ({
      ...prevEffects,
      [instrument]: !prevEffects[instrument],
    }));
  };

  const toggleMute = (instrument) => {
    setMutes((prevMutes) => ({
      ...prevMutes,
      [instrument]: !prevMutes[instrument],
    }));
  };

  return (
    <div>
      <h2 className="h2">Drum Machine</h2>
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
            <button
              className="effect-toggle"
              onClick={() => toggleEffect(instrument)}
            >
              {effects[instrument] ? "Disable Effect" : "Enable Effect"}
            </button>
            <button
              className="mute-toggle"
              onClick={() => toggleMute(instrument)}
            >
              {mutes[instrument] ? "Unmute" : "Mute"}
            </button>
          </div>
        ))}
      </div>
      <button className="play-button" onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? "Stop" : "Play"}
      </button>
      <div className="tempo-control">
        <input
          type="range"
          min="60"
          max="180"
          value={tempo}
          onChange={(e) => setTempo(e.target.value)}
        />
        <span className="tempo-value">{tempo} BPM</span>
      </div>
    </div>
  );
};

export default Sequencer;