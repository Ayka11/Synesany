import React from 'react';
import * as Icons from 'lucide-react';

export const CanvasStatusPanel = ({ 
  width, 
  height, 
  currentColor, 
  selectedBrush, 
  brushSize, 
  soundEnabled, 
  sonificationMode 
}) => {
  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-sm text-white">
          <span className="font-medium">Canvas:</span> {width}x{height}
        </div>
      </div>
      
      <div className="text-xs text-gray-400 space-y-1">
        <div>Current Color: <span className="text-white font-mono">{currentColor}</span></div>
        <div>Brush: <span className="text-white">{selectedBrush}</span></div>
        <div>Size: <span className="text-white">{brushSize}px</span></div>
        <div>Sound: <span className={soundEnabled ? 'text-green-400' : 'text-gray-500'}>{soundEnabled ? 'ON' : 'OFF'}</span></div>
        <div>Mode: <span className="text-blue-400">{sonificationMode}</span></div>
      </div>
    </div>
  );
};
