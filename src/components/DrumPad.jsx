import React from 'react';
import * as Tone from 'tone';

const DrumPad = ({ sound, label }) => {
  const handleClick = () => {
    const player = new Tone.Player(sound).toDestination();
    player.autostart = true;
  };

  return (
    <button className="drum-pad" onClick={handleClick}>
      {label}
    </button>
  );
};

export default DrumPad;