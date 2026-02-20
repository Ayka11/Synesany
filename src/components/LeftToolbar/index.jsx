import React from 'react';
import { ToolPanel } from '../ProfessionalToolbar/ToolPanel';
import { 
  Square, 
  Circle, 
  Triangle, 
  Star, 
  Pen, 
  Eraser, 
  Move, 
  Hand,
  Type,
  Image as ImageIcon
} from 'lucide-react';

export const LeftToolbar = () => {
  const drawingTools = [
    { icon: Pen, name: 'Pen', id: 'pen' },
    { icon: Square, name: 'Rectangle', id: 'rectangle' },
    { icon: Circle, name: 'Circle', id: 'circle' },
    { icon: Triangle, name: 'Triangle', id: 'triangle' },
    { icon: Star, name: 'Star', id: 'star' },
    { icon: Eraser, name: 'Eraser', id: 'eraser' },
    { icon: Type, name: 'Text', id: 'text' },
    { icon: ImageIcon, name: 'Image', id: 'image' },
    { icon: Move, name: 'Move', id: 'move' },
    { icon: Hand, name: 'Hand', id: 'hand' },
  ];

  return (
    <div className="w-20 bg-gray-900/50 backdrop-blur-lg border-r border-white/10 flex flex-col items-center py-4 gap-2">
      {/* Logo */}
      <div className="mb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 shadow-lg shadow-purple-500/20">
          <span className="text-white font-bold text-lg">S</span>
        </div>
      </div>

      {/* Drawing Tools */}
      {drawingTools.map((tool) => (
        <button
          key={tool.id}
          className={`
            w-12 h-12 rounded-lg flex items-center justify-center
            transition-all duration-200 hover:bg-white/10
            text-white/60 hover:text-white
            group relative
          `}
          title={tool.name}
        >
          <tool.icon size={20} />
          
          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {tool.name}
          </div>
        </button>
      ))}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Tool Panel */}
      <div className="w-full px-2">
        <ToolPanel />
      </div>
    </div>
  );
};
