import React from 'react';
import { Tooltip } from './index';

export const ColorTooltip = ({ 
  color, 
  showNote = true, 
  showFrequency = true, 
  showHex = true,
  showOctave = true,
  children 
}) => {
  const getTooltipContent = () => {
    const lines = [];
    
    if (color.name) {
      lines.push(<div key="name" className="font-semibold">{color.name}</div>);
    }
    
    if (showHex && color.hex) {
      lines.push(<div key="hex" className="font-mono text-xs">{color.hex.toUpperCase()}</div>);
    }
    
    if (showNote && (color.name || color.closestNote)) {
      const noteName = color.closestNote || color.name?.split(' ')[0];
      if (noteName) {
        lines.push(<div key="note" className="text-xs">Note: {noteName}</div>);
      }
    }
    
    if (showFrequency && color.freq) {
      lines.push(<div key="freq" className="text-xs">{color.freq.toFixed(2)} Hz</div>);
    }
    
    if (showOctave && color.name && /\d/.test(color.name)) {
      const octave = color.name.match(/\d+/)?.[0];
      if (octave) {
        lines.push(<div key="octave" className="text-xs">Octave {octave}</div>);
      }
    }
    
    return lines;
  };

  return (
    <Tooltip 
      content={
        <div className="text-center">
          {getTooltipContent()}
        </div>
      }
      position="top"
      delay={100}
    >
      {children}
    </Tooltip>
  );
};
