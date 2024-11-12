// import React, { useState } from 'react';
// import * as Tone from 'tone';

// const BassSynth = () => {
//   const [bassSynth] = useState(() => new Tone.Synth({
//     oscillator: {
//       type: 'sine'
//     },
//     envelope: {
//       attack: 0.01,
//       decay: 0.2,
//       sustain: 0.3,
//       release: 1
//     }
//   }).toDestination());

//   const playBassNote = (note, duration) => {
//     bassSynth.triggerAttackRelease(note, duration);
//   };

//   return (
//     <div>
//       <h2>Bass Synth</h2>
//       <button onClick={() => playBassNote("C2", "8n")}>Play C2</button>
//       <button onClick={() => playBassNote("G2", "8n")}>Play G2</button>
//     </div>
//   );
// };

// export default BassSynth;
