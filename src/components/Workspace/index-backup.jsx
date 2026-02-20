import React, { useState, useEffect } from 'react';
import { DrawingCanvas } from '../Canvas/DrawingCanvas';
import { DraggablePanel } from '../DraggablePanel';
import { DndContext } from '@dnd-kit/core';
import { SonificationModePanel } from '../Canvas/SonificationModePanel';
import { ColorPanel } from '../ProfessionalToolbar/ColorPanel';
import { BrushPanel } from '../ProfessionalToolbar/BrushPanel';
import { SoundPanel } from '../ProfessionalToolbar/SoundPanel';
import { ToolPanel } from '../ProfessionalToolbar/ToolPanel';
import { useToolbarStore } from '../../stores/toolbarStore';
import * as Icons from 'lucide-react';

export const Workspace = () => {
  const {
    panels,
    updatePanelPosition,
    updatePanelSize,
    togglePanelCollapsed,
    bringPanelToFront,
    resetAllPanels,
    currentColor,
    setCurrentColor,
    selectedBrush,
    setSelectedBrush,
    brushSize,
    setBrushSize,
    soundEnabled,
    toggleSoundEnabled,
    setSoundEnabled,
    masterVolume,
    setMasterVolume,
    sonificationMode,
    setSonificationMode,
    currentInstrument,
    setCurrentInstrument,
    adsr,
    setADSR,
  } = useToolbarStore();

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handlePanelClick = (panelId) => {
    bringPanelToFront(panelId);
  };

  const handleClearCanvas = () => console.log('Canvas cleared');
  const handleSave = () => console.log('Save functionality');
  const handleUndo = () => console.log('Undo action');
  const handleRedo = () => console.log('Redo action');
  const handleUpload = () => console.log('Upload functionality');
  const handleDownload = () => console.log('Download functionality');

  return (
    <DndContext>
      <div className="min-h-screen bg-gray-900 flex">
        {/* Canvas Area */}
        <div className="flex-1 relative">
          <DrawingCanvas
            scale={1}
            position={{ x: 0, y: 0 }}
            onScaleChange={() => {}}
            onPositionChange={() => {}}
          />
        
        {/* Floating Panels */}
        {!isMobile && (
          <>
            <DraggablePanel
              id="color"
              title="Colors"
              position={panels.color.position}
              size={panels.color.size}
              collapsed={panels.color.collapsed}
              zIndex={panels.color.zIndex}
              onPositionChange={(pos) => updatePanelPosition('color', pos)}
              onSizeChange={(size) => updatePanelSize('color', size)}
              onToggleCollapse={() => togglePanelCollapsed('color')}
              onClick={() => handlePanelClick('color')}
            >
              <ColorPanel />
            </DraggablePanel>

            <DraggablePanel
              id="brush"
              title="Brushes"
              position={panels.brush.position}
              size={panels.brush.size}
              collapsed={panels.brush.collapsed}
              zIndex={panels.brush.zIndex}
              onPositionChange={(pos) => updatePanelPosition('brush', pos)}
              onSizeChange={(size) => updatePanelSize('brush', size)}
              onToggleCollapse={() => togglePanelCollapsed('brush')}
              onClick={() => handlePanelClick('brush')}
            >
              <BrushPanel />
            </DraggablePanel>

            <DraggablePanel
              id="sound"
              title="Sound"
              position={panels.sound.position}
              size={panels.sound.size}
              collapsed={panels.sound.collapsed}
              zIndex={panels.sound.zIndex}
              onPositionChange={(pos) => updatePanelPosition('sound', pos)}
              onSizeChange={(size) => updatePanelSize('sound', size)}
              onToggleCollapse={() => togglePanelCollapsed('sound')}
              onClick={() => handlePanelClick('sound')}
            >
              <SoundPanel />
            </DraggablePanel>

            <DraggablePanel
              id="tools"
              title="Tools"
              position={panels.tools.position}
              size={panels.tools.size}
              collapsed={panels.tools.collapsed}
              zIndex={panels.tools.zIndex}
              onPositionChange={(pos) => updatePanelPosition('tools', pos)}
              onSizeChange={(size) => updatePanelSize('tools', size)}
              onToggleCollapse={() => togglePanelCollapsed('tools')}
              onClick={() => handlePanelClick('tools')}
            >
              <ToolPanel
                selectedTool={selectedBrush}
                setSelectedTool={setSelectedBrush}
                canUndo={true}
                canRedo={false}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onClear={handleClearCanvas}
                onSave={handleSave}
                onUpload={handleUpload}
                onDownload={handleDownload}
              />
            </DraggablePanel>
          </>
        )}

        {/* Mobile Bottom Sheet */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-2 flex justify-around z-50">
            <button className="p-2 text-gray-300 hover:text-white">
              <Icons.Palette size={20} />
            </button>
            <button className="p-2 text-gray-300 hover:text-white">
              <Icons.Brush size={20} />
            </button>
            <button className="p-2 text-gray-300 hover:text-white">
              <Icons.Volume2 size={20} />
            </button>
            <button className="p-2 text-gray-300 hover:text-white">
              <Icons.Wrench size={20} />
            </button>
          </div>
        )}
      </div>
    </DndContext>
  );
};
