import React, { useState, useEffect } from "react";
import * as Tone from "tone";
import Clap from "../../assets/Clap.wav";
import Kick from "../../assets/Kick.wav";
import OH from "../../assets/Open-hat.wav";
import CH from "../../assets/Closed-hat.wav";
import DrumPad from "../DrumPad/DrumPad";
import BassSynth from "../BassSynth/BassSynth";  // Import du BassSynth

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
    Array(16).fill({
      Clap: false,
      Kick: false,
      OH: false,
      CH: false,
      BassC: false,
      BassD: false,
      BassE: false,
      BassF: false,
      BassG: false,
      BassA: false,
    })
  );
  const [mutes, setMutes] = useState({
    Clap: false,
    Kick: false,
    OH: false,
    CH: false,
    BassC: false,
    BassD: false,
    BassE: false,
    BassF: false,
    BassG: false,
    BassA: false,
  });
  const [effects, setEffects] = useState({
    Clap: false,
    Kick: false,
    OH: false,
    CH: false,
    Bass: false,
  });
  const [bassVolume] = useState(() => new Tone.Volume(5).toDestination());
  
  // Nouvel état pour l'enveloppe de la basse
  const [envelope, setEnvelope] = useState({
    attack: 0.01,
    decay: 0.2,
    sustain: 0.3,
    release: 1,
  });

  useEffect(() => {
    Tone.Transport.bpm.value = tempo;

    const reverb = new Tone.Reverb({ decay: 2, wet: 0.5 }).toDestination();
    const delay = new Tone.FeedbackDelay({ delayTime: "8n", feedback: 0.4, wet: 0.5 }).toDestination();

    const players = {
      Clap: new Tone.Player(Clap).connect(effects.Clap ? reverb : Tone.Destination),
      Kick: new Tone.Player(Kick).connect(effects.Kick ? delay : Tone.Destination),
      OH: new Tone.Player(OH).connect(effects.OH ? delay : Tone.Destination),
      CH: new Tone.Player(CH).connect(effects.CH ? delay : Tone.Destination),
    };

    const bassSynth = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: {
        attack: envelope.attack,
        decay: envelope.decay,
        sustain: envelope.sustain,
        release: envelope.release,
      },
    }).connect(bassVolume);

    const repeat = (time) => {
      steps.forEach((step, index) => {
        Object.keys(step).forEach((instrument) => {
          if (step[instrument] && !mutes[instrument]) {
            if (instrument === "BassC") {
              bassSynth.triggerAttackRelease("C2", "8n", time + index * Tone.Time("16n"));
            } else if (instrument === "BassD") {
              bassSynth.triggerAttackRelease("D2", "8n", time + index * Tone.Time("16n"));
            } else if (instrument === "BassE") {
              bassSynth.triggerAttackRelease("E2", "8n", time + index * Tone.Time("16n"));
            } else if (instrument === "BassF") {
              bassSynth.triggerAttackRelease("F2", "8n", time + index * Tone.Time("16n"));
            } else if (instrument === "BassG") {
              bassSynth.triggerAttackRelease("G2", "8n", time + index * Tone.Time("16n"));
            } else if (instrument === "BassA") {
              bassSynth.triggerAttackRelease("A2", "8n", time + index * Tone.Time("16n"));
            } else {
              players[instrument].start(time + index * Tone.Time("16n"));
            }
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
  }, [isPlaying, steps, tempo, mutes, effects, envelope]); // Ajouter 'envelope' comme dépendance

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

  const changeBassVolume = (e) => {
    bassVolume.volume.value = e.target.value;
  };

  // Fonctions pour changer les valeurs de l'enveloppe
  const handleEnvelopeChange = (param) => (e) => {
    setEnvelope({ ...envelope, [param]: parseFloat(e.target.value) });
  };

  return (
    <div>
      <h2 className="h2">Drum Machine + Bass Synth</h2>
      <div className="sequencer-grid">
        {Object.keys(instruments).map((instrument) => (
          <div key={instrument} className="step-row">
            <div className="drum-pad-container">
              {instrument !== "Bass" && <DrumPad sound={instruments[instrument]} label={instrument} />}
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
            <button className="effect-toggle" onClick={() => toggleEffect(instrument)}>
              {effects[instrument] ? "Disable Effect" : "Enable Effect"}
            </button>
            <button className="mute-toggle" onClick={() => toggleMute(instrument)}>
              {mutes[instrument] ? "Unmute" : "Mute"}
            </button>
          </div>
        ))}
        {/* Lignes pour les notes de basse */}
        {["C", "D", "E", "F", "G", "A"].map((note) => (
          <div key={note} className="step-row">
            <div className="drum-pad-container">
              <span>{note}2</span>
            </div>
            {steps.map((step, index) => (
              <button
                key={index}
                className={`step ${step[`Bass${note}`] ? "active" : ""}`}
                onClick={() => toggleInstrumentOnStep(index, `Bass${note}`)}
              >
                {index + 1}
              </button>
            ))}
            <button className="effect-toggle" onClick={() => toggleEffect(`Bass${note}`)}>
              {effects.Bass ? "Disable Effect" : "Enable Effect"}
            </button>
            <button className="mute-toggle" onClick={() => toggleMute(`Bass${note}`)}>
              {mutes[`Bass${note}`] ? "Unmute" : "Mute"}
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
      <div className="bass-volume-control">
        <label htmlFor="bass-volume">Bass Volume</label>
        <input
          id="bass-volume"
          type="range"
          min="-30"
          max="10"
          defaultValue="5"
          onChange={changeBassVolume}
        />
      </div>
      {/* Section d'enveloppe pour la basse */}
      <div className="envelope-control">
        <h3>Envelope Control</h3>
        <div>
          <label htmlFor="attack">Attack</label>
          <input
            id="attack"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={envelope.attack}
            onChange={handleEnvelopeChange("attack")}
          />
        </div>
        <div>
          <label htmlFor="decay">Decay</label>
          <input
            id="decay"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={envelope.decay}
            onChange={handleEnvelopeChange("decay")}
          />
        </div>
        <div>
          <label htmlFor="sustain">Sustain</label>
          <input
            id="sustain"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={envelope.sustain}
            onChange={handleEnvelopeChange("sustain")}
          />
        </div>
        <div>
          <label htmlFor="release">Release</label>
          <input
            id="release"
            type="range"
            min="0"
            max="2"
            step="0.01"
            value={envelope.release}
            onChange={handleEnvelopeChange("release")}
          />
        </div>
      </div>
    </div>
  );
};

export default Sequencer;