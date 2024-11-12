import React, { useState, useEffect } from "react";
// import * as Tone from "tone";
// import Clap from "../../assets/Clap.wav";
// import Kick from "../../assets/Kick.wav";
// import OH from "../../assets/Open-hat.wav";
// import CH from "../../assets/Closed-hat.wav";
// import DrumPad from "../DrumPad/DrumPad";
// import BassSynth from "../BassSynth/BassSynth";  // Import du BassSynth

// const instruments = {
//   Clap: Clap,
//   Kick: Kick,
//   OH: OH,
//   CH: CH,
// };

// // Options de notes pour la basse (incluant les notes noires)
// const noteOptions = [
//   "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1",
//   "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2"
// ];

// const Sequencer = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [tempo, setTempo] = useState(120);
//   const [steps, setSteps] = useState(
//     Array(16).fill({
//       Clap: false,
//       Kick: false,
//       OH: false,
//       CH: false,
//       BassNote: "", // Chaque pas de basse commence avec une note vide
//     })
//   );
//   const [mutes, setMutes] = useState({
//     Clap: false,
//     Kick: false,
//     OH: false,
//     CH: false,
//     Bass: false,
//   });
//   const [effects, setEffects] = useState({
//     Clap: false,
//     Kick: false,
//     OH: false,
//     CH: false,
//     Bass: false,
//   });
//   const [bassVolume] = useState(() => new Tone.Volume(5).toDestination());

//   // Nouvel état pour l'enveloppe de la basse
//   const [envelope, setEnvelope] = useState({
//     attack: 0.01,
//     decay: 0.2,
//     sustain: 0.3,
//     release: 1,
//   });

//   useEffect(() => {
//     Tone.Transport.bpm.value = tempo;

//     const reverb = new Tone.Reverb({ decay: 2, wet: 0.5 }).toDestination();
//     const delay = new Tone.FeedbackDelay({ delayTime: "8n", feedback: 0.4, wet: 0.5 }).toDestination();

//     const players = {
//       Clap: new Tone.Player(Clap).connect(effects.Clap ? reverb : Tone.Destination),
//       Kick: new Tone.Player(Kick).connect(effects.Kick ? delay : Tone.Destination),
//       OH: new Tone.Player(OH).connect(effects.OH ? delay : Tone.Destination),
//       CH: new Tone.Player(CH).connect(effects.CH ? delay : Tone.Destination),
//     };

//     const bassSynth = new Tone.Synth({
//       oscillator: { type: 'sine' },
//       envelope: {
//         attack: envelope.attack,
//         decay: envelope.decay,
//         sustain: envelope.sustain,
//         release: envelope.release,
//       },
//     }).connect(bassVolume);

//     const repeat = (time) => {
//       steps.forEach((step, index) => {
//         Object.keys(step).forEach((instrument) => {
//           if (instrument === "BassNote" && step.BassNote) {
//             // Ne joue pas la note de basse si elle est muette
//             if (!mutes.Bass) {
//               bassSynth.triggerAttackRelease(step.BassNote, "8n", time + index * Tone.Time("16n"));
//             }
//           } else if (step[instrument] && !mutes[instrument]) {
//             players[instrument].start(time + index * Tone.Time("16n"));
//           }
//         });
//       });
//     };

//     const loop = new Tone.Loop(repeat, "1m").start(0);

//     if (isPlaying) {
//       Tone.Transport.start();
//     } else {
//       Tone.Transport.stop();
//     }

//     return () => {
//       loop.dispose();
//     };
//   }, [isPlaying, steps, tempo, mutes, effects, envelope, bassVolume]); // Ajouter bassVolume et envelope comme dépendance

//   // Fonction pour modifier les instruments (Kick, Clap, etc.)
//   const toggleInstrumentOnStep = (stepIndex, instrument) => {
//     const newSteps = [...steps];
//     newSteps[stepIndex] = {
//       ...newSteps[stepIndex],
//       [instrument]: !newSteps[stepIndex][instrument],
//     };
//     setSteps(newSteps);
//   };

//   // Fonction pour changer la note de basse sur un pas
//   const handleBassNoteChange = (stepIndex, note) => {
//     const newSteps = [...steps];
//     newSteps[stepIndex] = { ...newSteps[stepIndex], BassNote: note }; // Mettre à jour la note spécifique du pas
//     setSteps(newSteps);
//   };

//   const toggleEffect = (instrument) => {
//     setEffects((prevEffects) => ({
//       ...prevEffects,
//       [instrument]: !prevEffects[instrument],
//     }));
//   };

//   const toggleMute = (instrument) => {
//     setMutes((prevMutes) => ({
//       ...prevMutes,
//       [instrument]: !prevMutes[instrument],
//     }));
//   };

//   const changeBassVolume = (e) => {
//     bassVolume.volume.value = e.target.value;
//   };

//   // Fonctions pour changer les valeurs de l'enveloppe
//   const handleEnvelopeChange = (param) => (e) => {
//     setEnvelope({ ...envelope, [param]: parseFloat(e.target.value) });
//   };

//   return (
//     <div>
//       <h2 className="h2">Drum Machine + Bass Synth</h2>
//       <div className="sequencer-grid">
//         {Object.keys(instruments).map((instrument) => (
//           <div key={instrument} className="step-row">
//             <div className="drum-pad-container">
//               {instrument !== "Bass" && <DrumPad sound={instruments[instrument]} label={instrument} />}
//             </div>
//             {steps.map((step, index) => (
//               <button
//                 key={index}
//                 className={`step ${step[instrument] ? "active" : ""}`}
//                 onClick={() => toggleInstrumentOnStep(index, instrument)}
//               >
//                 {index + 1}
//               </button>
//             ))}
//             <button className="effect-toggle" onClick={() => toggleEffect(instrument)}>
//               {effects[instrument] ? "Disable Effect" : "Enable Effect"}
//             </button>
//             <button className="mute-toggle" onClick={() => toggleMute(instrument)}>
//               {mutes[instrument] ? "Unmute" : "Mute"}
//             </button>
//           </div>
//         ))}

//         {/* Ligne unique pour les notes de basse */}
//         <div className="step-row">
//           <div className="drum-pad-container">
//             <span>Bass</span>
//           </div>
//           {steps.map((step, index) => (
//             <div key={index}>
//               <select
//                 value={step.BassNote || ""}
//                 onChange={(e) => handleBassNoteChange(index, e.target.value)}
//               >
//                 <option value="">--</option> {/* Option vide pour désactiver une note */}
//                 {noteOptions.map((note) => (
//                   <option key={note} value={note}>
//                     {note}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           ))}
//           <button className="mute-toggle" onClick={() => toggleMute("Bass")}>
//             {mutes.Bass ? "Unmute" : "Mute"}
//           </button>
//         </div>
//       </div>

//       <button className="play-button" onClick={() => setIsPlaying(!isPlaying)}>
//         {isPlaying ? "Stop" : "Play"}
//       </button>

//       <div className="tempo-control">
//         <input
//           type="range"
//           min="60"
//           max="180"
//           value={tempo}
//           onChange={(e) => setTempo(e.target.value)}
//         />
//         <span className="tempo-value">{tempo} BPM</span>
//       </div>

//       <div className="bass-volume-control">
//         <label htmlFor="bass-volume">Bass Volume</label>
//         <input
//           id="bass-volume"
//           type="range"
//           min="-30"
//           max="10"
//           defaultValue="5"
//           onChange={changeBassVolume}
//         />
//       </div>

//       {/* Section d'enveloppe pour la basse */}
//       <div className="envelope-control">
//         <h3>Envelope Control</h3>
//         <div>
//           <label htmlFor="attack">Attack</label>
//           <input
//             id="attack"
//             type="range"
//             min="0"
//             max="1"
//             step="0.01"
//             value={envelope.attack}
//             onChange={handleEnvelopeChange("attack")}
//           />
//         </div>
//         <div>
//           <label htmlFor="decay">Decay</label>
//           <input
//             id="decay"
//             type="range"
//             min="0"
//             max="1"
//             step="0.01"
//             value={envelope.decay}
//             onChange={handleEnvelopeChange("decay")}
//           />
//         </div>
//         <div>
//           <label htmlFor="sustain">Sustain</label>
//           <input
//             id="sustain"
//             type="range"
//             min="0"
//             max="1"
//             step="0.01"
//             value={envelope.sustain}
//             onChange={handleEnvelopeChange("sustain")}
//           />
//         </div>
//         <div>
//           <label htmlFor="release">Release</label>
//           <input
//             id="release"
//             type="range"
//             min="0"
//             max="2"
//             step="0.01"
//             value={envelope.release}
//             onChange={handleEnvelopeChange("release")}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Sequencer;
// import React, { useState, useEffect } from "react";
// import * as Tone from "tone";
// import Clap from "../../assets/Clap.wav";
// import Kick from "../../assets/Kick.wav";
// import OH from "../../assets/Open-hat.wav";
// import CH from "../../assets/Closed-hat.wav";
// import DrumPad from "../DrumPad/DrumPad";
// import BassSynth from "../BassSynth/BassSynth";

// const instruments = {
//   Clap: Clap,
//   Kick: Kick,
//   OH: OH,
//   CH: CH,
// };

// // Options de notes pour la basse
// const noteOptions = [
//   "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1",
//   "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2"
// ];

// const Sequencer = () => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [tempo, setTempo] = useState(120);
//   const [steps, setSteps] = useState(
//     Array(16).fill({
//       Clap: false,
//       Kick: false,
//       OH: false,
//       CH: false,
//       BassNote: "", // Note vide pour chaque pas
//     })
//   );
//   const [mutes, setMutes] = useState({
//     Clap: false,
//     Kick: false,
//     OH: false,
//     CH: false,
//     Bass: false,
//   });
//   const [effects, setEffects] = useState({
//     Clap: false,
//     Kick: false,
//     OH: false,
//     CH: false,
//     BassDelay: false, // Effet Delay pour la basse
//     BassChorus: false, // Effet Chorus pour la basse
//   });
//   const [bassVolume] = useState(() => new Tone.Volume(5).toDestination());

//   const [envelope, setEnvelope] = useState({
//     attack: 0.01,
//     decay: 0.2,
//     sustain: 0.3,
//     release: 1,
//   });

//   useEffect(() => {
//     Tone.Transport.bpm.value = tempo;

//     const reverb = new Tone.Reverb({ decay: 2, wet: 0.5 }).toDestination();
//     const delay = new Tone.FeedbackDelay({ delayTime: "8n", feedback: 0.4, wet: 0.5 }).toDestination();
//     const chorus = new Tone.Chorus(4, 2.5, 0.5).toDestination(); // Effet Chorus

//     const players = {
//       Clap: new Tone.Player(Clap).connect(effects.Clap ? reverb : Tone.Destination),
//       Kick: new Tone.Player(Kick).connect(effects.Kick ? delay : Tone.Destination),
//       OH: new Tone.Player(OH).connect(effects.OH ? delay : Tone.Destination),
//       CH: new Tone.Player(CH).connect(effects.CH ? delay : Tone.Destination),
//     };

//     const bassSynth = new Tone.Synth({
//       oscillator: { type: 'sine' },
//       envelope: {
//         attack: envelope.attack,
//         decay: envelope.decay,
//         sustain: envelope.sustain,
//         release: envelope.release,
//       },
//     }).connect(bassVolume);

//     // Applique les effets de delay et chorus à la basse
//     if (effects.BassDelay) {
//       bassSynth.connect(delay);
//     }
//     if (effects.BassChorus) {
//       bassSynth.connect(chorus);
//     }

//     const repeat = (time) => {
//       steps.forEach((step, index) => {
//         Object.keys(step).forEach((instrument) => {
//           if (instrument === "BassNote" && step.BassNote) {
//             // Ne joue pas la note de basse si elle est muette
//             if (!mutes.Bass) {
//               bassSynth.triggerAttackRelease(step.BassNote, "8n", time + index * Tone.Time("16n"));
//             }
//           } else if (step[instrument] && !mutes[instrument]) {
//             players[instrument].start(time + index * Tone.Time("16n"));
//           }
//         });
//       });
//     };

//     const loop = new Tone.Loop(repeat, "1m").start(0);

//     if (isPlaying) {
//       Tone.Transport.start();
//     } else {
//       Tone.Transport.stop();
//     }

//     return () => {
//       loop.dispose();
//     };
//   }, [isPlaying, steps, tempo, mutes, effects, envelope, bassVolume]);

//   const toggleEffect = (instrument) => {
//     setEffects((prevEffects) => ({
//       ...prevEffects,
//       [instrument]: !prevEffects[instrument],
//     }));
//   };

//   const toggleMute = (instrument) => {
//     setMutes((prevMutes) => ({
//       ...prevMutes,
//       [instrument]: !prevMutes[instrument],
//     }));
//   };

//   const changeBassVolume = (e) => {
//     bassVolume.volume.value = e.target.value;
//   };

//   const handleEnvelopeChange = (param) => (e) => {
//     setEnvelope({ ...envelope, [param]: parseFloat(e.target.value) });
//   };

//   const handleBassNoteChange = (stepIndex, note) => {
//     const newSteps = [...steps];
//     newSteps[stepIndex] = { ...newSteps[stepIndex], BassNote: note };
//     setSteps(newSteps);
//   };

//   return (
//     <div>
//       <h2 className="h2">Drum Machine + Bass Synth</h2>
//       <div className="sequencer-grid">
//         {Object.keys(instruments).map((instrument) => (
//           <div key={instrument} className="step-row">
//             <div className="drum-pad-container">
//               {instrument !== "Bass" && <DrumPad sound={instruments[instrument]} label={instrument} />}
//             </div>
//             {steps.map((step, index) => (
//               <button
//                 key={index}
//                 className={`step ${step[instrument] ? "active" : ""}`}
//                 onClick={() => toggleInstrumentOnStep(index, instrument)}
//               >
//                 {index + 1}
//               </button>
//             ))}
//             <button className="effect-toggle" onClick={() => toggleEffect(instrument)}>
//               {effects[instrument] ? "Disable Effect" : "Enable Effect"}
//             </button>
//             <button className="mute-toggle" onClick={() => toggleMute(instrument)}>
//               {mutes[instrument] ? "Unmute" : "Mute"}
//             </button>
//           </div>
//         ))}

//         {/* Ligne unique pour les notes de basse */}
//         <div className="step-row">
//           <div className="drum-pad-container">
//             <span>Bass</span>
//           </div>
//           {steps.map((step, index) => (
//             <div key={index}>
//               <select
//                 value={step.BassNote || ""}
//                 onChange={(e) => handleBassNoteChange(index, e.target.value)}
//               >
//                 <option value="">--</option>
//                 {noteOptions.map((note) => (
//                   <option key={note} value={note}>
//                     {note}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           ))}
//           <button className="mute-toggle" onClick={() => toggleMute("Bass")}>
//             {mutes.Bass ? "Unmute" : "Mute"}
//           </button>
//           <button className="effect-toggle" onClick={() => toggleEffect("BassDelay")}>
//             {effects.BassDelay ? "Disable Delay" : "Enable Delay"}
//           </button>
//           <button className="effect-toggle" onClick={() => toggleEffect("BassChorus")}>
//             {effects.BassChorus ? "Disable Chorus" : "Enable Chorus"}
//           </button>
//         </div>
//       </div>

//       <button className="play-button" onClick={() => setIsPlaying(!isPlaying)}>
//         {isPlaying ? "Stop" : "Play"}
//       </button>

//       <div className="tempo-control">
//         <input
//           type="range"
//           min="60"
//           max="180"
//           value={tempo}
//           onChange={(e) => setTempo(e.target.value)}
//         />
//         <span className="tempo-value">{tempo} BPM</span>
//       </div>

//       <div className="bass-volume-control">
//         <label htmlFor="bass-volume">Bass Volume</label>
//         <input
//           id="bass-volume"
//           type="range"
//           min="-60"
//           max="0"
//           value={bassVolume.volume.value}
//           onChange={changeBassVolume}
//         />
//         <span>{bassVolume.volume.value.toFixed(1)} dB</span>
//       </div>

//       <div className="envelope-controls">
//         <label htmlFor="attack">Attack</label>
//         <input
//           id="attack"
//           type="range"
//           min="0.01"
//           max="1"
//           step="0.01"
//           value={envelope.attack}
//           onChange={handleEnvelopeChange("attack")}
//         />
//         <span>{envelope.attack}s</span>
//       </div>
//     </div>
//   );
// };

// export default Sequencer;
import * as Tone from "tone";
import Clap from "../../assets/Clap.wav";
import Kick from "../../assets/Kick.wav";
import OH from "../../assets/Open-hat.wav";
import CH from "../../assets/Closed-hat.wav";
import DrumPad from "../DrumPad/DrumPad";
// import BassSynth from "../BassSynth/BassSynth";  // Import du BassSynth

const instruments = {
  Clap: Clap,
  Kick: Kick,
  OH: OH,
  CH: CH,
};

const noteOptions = [
  "C1", "C#1", "D1", "D#1", "E1", "F1", "F#1", "G1", "G#1", "A1", "A#1", "B1",
  "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2"
];

const Sequencer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);
  const [steps, setSteps] = useState(
    Array(16).fill({
      Clap: false,
      Kick: false,
      OH: false,
      CH: false,
      BassNote: "",
    })
  );
  const [mutes, setMutes] = useState({
    Clap: false,
    Kick: false,
    OH: false,
    CH: false,
    Bass: false,
  });
  const [effects, setEffects] = useState({
    Clap: false,
    Kick: false,
    OH: false,
    CH: false,
    Bass: false,  // Ajout d'un effet pour la basse
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
          if (instrument === "BassNote" && step.BassNote) {
            // Ne joue pas la note de basse si elle est muette
            if (!mutes.Bass) {
              bassSynth.triggerAttackRelease(step.BassNote, "8n", time + index * Tone.Time("16n"));
            }
          } else if (step[instrument] && !mutes[instrument]) {
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
  }, [isPlaying, steps, tempo, mutes, effects, envelope, bassVolume]); // Ajouter bassVolume et envelope comme dépendance

  const toggleInstrumentOnStep = (stepIndex, instrument) => {
    const newSteps = [...steps];
    newSteps[stepIndex] = {
      ...newSteps[stepIndex],
      [instrument]: !newSteps[stepIndex][instrument],
    };
    setSteps(newSteps);
  };

  const handleBassNoteChange = (stepIndex, note) => {
    const newSteps = [...steps];
    newSteps[stepIndex] = { ...newSteps[stepIndex], BassNote: note }; // Mettre à jour la note spécifique du pas
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

        {/* Ligne unique pour les notes de basse */}
        <div className="step-row">
          <div className="drum-pad-container">
            <span>Bass</span>
          </div>
          {steps.map((step, index) => (
            <div key={index}>
              <select
                value={step.BassNote || ""}
                onChange={(e) => handleBassNoteChange(index, e.target.value)}
              >
                <option value="">--</option> {/* Option vide pour désactiver une note */}
                {noteOptions.map((note) => (
                  <option key={note} value={note}>
                    {note}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button className="effect-toggle" onClick={() => toggleEffect("Bass")}>
            {effects.Bass ? "Disable Effect" : "Enable Effect"}
          </button>
          <button className="mute-toggle" onClick={() => toggleMute("Bass")}>
            {mutes.Bass ? "Unmute" : "Mute"}
          </button>
        </div>
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
            max="1"
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
