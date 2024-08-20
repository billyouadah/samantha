import React, { useState, useEffect } from 'react';
import * as Tone from 'tone';

const Sequencer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(120);  // Le tempo de la boîte à rythmes
  const [steps, setSteps] = useState(new Array(16).fill(false));

  // Initialisation de Tone.js
  useEffect(() => {
    Tone.Transport.bpm.value = tempo;
    const synth = new Tone.Synth().toDestination();
    
    const repeat = (time) => {
      steps.forEach((step, index) => {
        if (step) {
          // Déclenche le son si le pas est activé
          synth.triggerAttackRelease('C4', '8n', time + index * Tone.Time('16n'));
        }
      });
    };

    const loop = new Tone.Loop(repeat, '1m').start(0);

    if (isPlaying) {
      Tone.Transport.start();
    } else {
      Tone.Transport.stop();
    }

    return () => {
      loop.dispose();
    };
  }, [isPlaying, steps, tempo]);

  // Pour activer/désactiver un pas
  const toggleStep = (index) => {
    const newSteps = [...steps];
    newSteps[index] = !newSteps[index];
    setSteps(newSteps);
  };

  return (
    <div>
      <h2>Séquenceur</h2>
      <div className="sequencer-grid">
        {steps.map((step, index) => (
          <button
            key={index}
            className={`step ${step ? 'active' : ''}`}
            onClick={() => toggleStep(index)}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <button onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? 'Stop' : 'Play'}
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