import React, { useState } from 'react';
import { useToolbarStore } from '../../stores/toolbarStore';
import * as Icons from 'lucide-react';
import { Tooltip } from '../ui/Tooltip';

export const ToolPanel = () => {
  const {
    selectedBrush,
    setSelectedBrush,
  } = useToolbarStore();

  const [toolSettings, setToolSettings] = useState({
    opacity: 100,
    flow: 100,
    smoothing: 50
  });

  const canUndo = false;
  const canRedo = false;

  /* const drawingTools = [
    { id: 'pen', name: 'Pen', icon: Icons.Pen, description: 'Freehand drawing' },
    { id: 'brush', name: 'Brush', icon: Icons.Pen, description: 'Soft brush strokes' },
    { id: 'eraser', name: 'Eraser', icon: Icons.Eraser, description: 'Erase content' },
    { id: 'text', name: 'Text', icon: Icons.Type, description: 'Add text' }
  ]; */

  const drawingTools = [
    { id: 'pen', name: 'Pen', icon: Icons.Pen, description: 'Freehand drawing' },
    { id: 'brush', name: 'Brush', icon: Icons.Brush || Icons.Pen, description: 'Soft brush strokes' },
    { id: 'eraser', name: 'Eraser', icon: Icons.Eraser, description: 'Erase content' },
    { id: 'text', name: 'Text', icon: Icons.Type, description: 'Add text' },
  ];

  const shapeTools = [
    { id: 'rectangle', name: 'Rectangle', icon: Icons.Square, description: 'Draw rectangles' },
    { id: 'circle', name: 'Circle', icon: Icons.Circle, description: 'Draw circles' },
    { id: 'triangle', name: 'Triangle', icon: Icons.Triangle, description: 'Draw triangles' }
  ];

  /*const transformTools = [
    { id: 'move', name: 'Move', icon: Icons.Move, description: 'Move objects' },
    { id: 'rotate', name: 'Rotate', icon: Icons.RotateCw, description: 'Rotate objects' },
    { id: 'hand', name: 'Hand', icon: Icons.Hand, description: 'Pan canvas' }
  ]; */

  const transformTools = [
    { id: 'move', name: 'Move', icon: Icons.Move, description: 'Move objects' },
    { id: 'rotate', name: 'Rotate', icon: Icons.RotateCw, description: 'Rotate objects' },
    { id: 'hand', name: 'Hand', icon: Icons.Hand, description: 'Pan canvas' },
  ];

  const handleToolClick = (toolId) => {
    setSelectedBrush(toolId);
  };

  const handleClearCanvas = () => console.log('Canvas cleared');
  const handleSave = () => console.log('Save functionality');
  const handleUndo = () => console.log('Undo action');
  const handleRedo = () => console.log('Redo action');
  const handleUpload = () => console.log('Upload functionality');
  const handleDownload = () => console.log('Download functionality');

  const handleSettingChange = (setting, value) => {
    setToolSettings((prev) => ({ ...prev, [setting]: value }));
  };

  return (
    <div className="space-y-4">
      {/* Drawing Tools */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Drawing</h3>
        <div className="grid grid-cols-2 gap-2">
          {drawingTools.map((tool) => (
            <Tooltip key={tool.id} content={tool.description}>
              <button
                title={tool.description}
                onClick={() => handleToolClick(tool.id)}
                className={`
                  p-3 rounded-lg border-2 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1
                  ${selectedBrush === tool.id
                    ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/30'
                    : 'border-white/20 hover:border-white/40 bg-white/5'
                  }
                `}
              >
                <tool.icon size={16} />
                <span className="text-xs text-white/80">{tool.name}</span>
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Shape Tools */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Shapes</h3>
        <div className="grid grid-cols-3 gap-2">
          {shapeTools.map((tool) => (
            <Tooltip key={tool.id} content={tool.description}>
              <button
                title={tool.description}
                onClick={() => handleToolClick(tool.id)}
                className={`
                  p-3 rounded-lg border-2 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1
                  ${selectedBrush === tool.id
                    ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/30'
                    : 'border-white/20 hover:border-white/40 bg-white/5'
                  }
                `}
              >
                <tool.icon size={14} />
                <span className="text-[10px] text-white/80">{tool.name}</span>
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Transform Tools */}
      <div className="mb-4">
        <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Transform</h3>
        <div className="grid grid-cols-3 gap-2">
          {transformTools.map((tool) => (
            <Tooltip key={tool.id} content={tool.description}>
              <button
                title={tool.description}
                onClick={() => handleToolClick(tool.id)}
                className={`
                  p-3 rounded-lg border-2 transition-all hover:scale-105 active:scale-95 flex flex-col items-center gap-1
                  ${selectedBrush === tool.id
                    ? 'border-indigo-500 bg-indigo-500/20 shadow-lg shadow-indigo-500/30'
                    : 'border-white/20 hover:border-white/40 bg-white/5'
                  }
                `}
              >
                <tool.icon size={14} />
                <span className="text-[10px] text-white/80">{tool.name}</span>
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      {/* Tool Settings */}
      <div className="mb-4 space-y-3">
        <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Settings</h3>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-white/60">Opacity</label>
            <span className="text-xs text-white/40">{toolSettings.opacity}%</span>
          </div>
          <Tooltip content="Adjust tool opacity">
            <input
              type="range"
              min="0"
              max="100"
              value={toolSettings.opacity}
              onChange={(e) => handleSettingChange('opacity', parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </Tooltip>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-white/60">Flow</label>
            <span className="text-xs text-white/40">{toolSettings.flow}%</span>
          </div>
          <Tooltip content="Adjust paint flow rate">
            <input
              type="range"
              min="0"
              max="100"
              value={toolSettings.flow}
              onChange={(e) => handleSettingChange('flow', parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </Tooltip>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-white/60">Smoothing</label>
            <span className="text-xs text-white/40">{toolSettings.smoothing}%</span>
          </div>
          <Tooltip content="Adjust tool smoothing">
            <input
              type="range"
              min="0"
              max="100"
              value={toolSettings.smoothing}
              onChange={(e) => handleSettingChange('smoothing', parseInt(e.target.value))}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </Tooltip>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Actions</h3>
        
        <div className="grid grid-cols-2 gap-2">
          <Tooltip content="Undo last action">
            <button
              title="Undo last action"
              onClick={handleUndo}
              disabled={!canUndo}
              className={`
                p-2 rounded-lg border-2 transition-all flex items-center justify-center gap-1 text-xs
                ${canUndo
                  ? 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10'
                  : 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                }
              `}
            >
              <Icons.Undo size={12} />
              Undo
            </button>
          </Tooltip>
          
          <Tooltip content="Redo last action">
            <button
              title="Redo last action"
              onClick={handleRedo}
              disabled={!canRedo}
              className={
                `p-2 rounded-lg border-2 transition-all flex items-center justify-center gap-1 text-xs
                ${canRedo
                  ? 'border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10'
                  : 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed'
                }`
              }
            >
              <Icons.RotateCw size={12} />
              Redo
            </button>
          </Tooltip>
        </div>

        <Tooltip content="Clear entire canvas">
          <button
            title="Clear entire canvas"
            onClick={handleClearCanvas}
            className="w-full p-2 rounded-lg border-2 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2 text-xs text-red-400"
          >
            <Icons.Trash2 size={14} />
            Clear Canvas
          </button>
        </Tooltip>
      </div>
    </div>
  );
};
