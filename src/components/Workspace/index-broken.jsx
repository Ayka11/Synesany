import React, { useState, useEffect } from 'react';
import { DrawingCanvas } from '../Canvas/DrawingCanvas';
import { DraggablePanel } from '../DraggablePanel';
import { LayoutManager } from '../LayoutManager';
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
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Canvas Area */}
      <div className="flex-1 relative">
        <DrawingCanvas
          scale={canvasScale}
          position={canvasPosition}
          onScaleChange={setCanvasScale}
          onPositionChange={setCanvasPosition}
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
              <ColorPanel
                currentColor={currentColor}
                setCurrentColor={setCurrentColor}
                favoriteColors={[]}
                toggleFavoriteColor={() => {}}
              />
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
              <BrushPanel
                selectedBrush={selectedBrush}
                setSelectedBrush={setSelectedBrush}
                brushSize={brushSize}
                setBrushSize={setBrushSize}
                favoriteBrushes={[]}
                toggleFavoriteBrush={() => {}}
              />
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
              <SoundPanel
                soundEnabled={soundEnabled}
                toggleSoundEnabled={toggleSoundEnabled}
                masterVolume={masterVolume}
                setMasterVolume={setMasterVolume}
                sonificationMode={sonificationMode}
                setSonificationMode={setSonificationMode}
                currentInstrument={currentInstrument}
                setCurrentInstrument={setCurrentInstrument}
                adsr={adsr}
                setADSR={setADSR}
              />
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
    </div>
  );
          panelId="colorPanel"
          defaultPosition={panels.colorPanel?.position || { x: 20, y: 100 }}
          defaultSize={panels.colorPanel?.size || { width: 280, height: 400 }}
          onPositionChange={(id, position) => setPanelPosition(id, position)}
          onSizeChange={(id, size) => setPanelSize(id, size)}
          isResizable={true}
          isDraggable={true}
        >
          <ColorPanel onColorChange={setCurrentColor} currentColor={currentColor} />
        </DraggablePanel>

        {/* Brush Panel */}
        <DraggablePanel
          panelId="brushPanel"
          defaultPosition={panels.brushPanel?.position || { x: 20, y: 520 }}
          defaultSize={panels.brushPanel?.size || { width: 280, height: 200 }}
          onPositionChange={(id, position) => setPanelPosition(id, position)}
          onSizeChange={(id, size) => setPanelSize(id, size)}
          isResizable={true}
          isDraggable={true}
        >
          <BrushPanel
            currentBrush={selectedBrush}
            onBrushChange={setSelectedBrush}
            brushSize={brushSize}
            onBrushSizeChange={setBrushSize}
          />
        </DraggablePanel>

        {/* Sound Panel */}
        <DraggablePanel
          panelId="soundPanel"
          defaultPosition={panels.soundPanel?.position || { x: 20, y: 740 }}
          defaultSize={panels.soundPanel?.size || { width: 280, height: 300 }}
          onPositionChange={(id, position) => setPanelPosition(id, position)}
          onSizeChange={(id, size) => setPanelSize(id, size)}
          isResizable={true}
          isDraggable={true}
        >
          <SoundPanel
            soundEnabled={soundEnabled}
            onSoundToggle={() => setSoundEnabled(!soundEnabled)}
            volume={volume}
            onVolumeChange={setVolume}
            sonificationMode={sonificationMode}
            onSonificationModeChange={setSonificationMode}
            currentInstrument={currentInstrument}
            onInstrumentChange={setCurrentInstrument}
            attack={attack}
            onAttackChange={setAttack}
            decay={decay}
            onDecayChange={setDecay}
            sustain={sustain}
            onSustainChange={setSustain}
            release={release}
            onReleaseChange={setRelease}
          />
        </DraggablePanel>

        {/* Tool Panel */}
        <DraggablePanel
          panelId="toolPanel"
          defaultPosition={panels.toolPanel?.position || { x: typeof window !== 'undefined' ? window.innerWidth - 300 : 1000, y: 100 }}
          defaultSize={panels.toolPanel?.size || { width: 276, height: 400 }}
          onPositionChange={(id, position) => setPanelPosition(id, position)}
          onSizeChange={(id, size) => setPanelSize(id, size)}
          isResizable={true}
          isDraggable={true}
        >
          <ToolPanel
            selectedTool={selectedTool}
            onToolChange={setSelectedTool}
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClear={handleClearCanvas}
            onSave={handleSave}
            onUpload={handleUpload}
            onDownload={handleDownload}
          />
        </DraggablePanel>

        {/* Canvas Area - Now takes remaining space */}
        <div 
          className="flex-1 p-8"
          style={{
            marginLeft: '20px', // Space for panels
            marginRight: '20px', // Space for panels
            transition: 'margin-left 0.3s ease-in-out, margin-right 0.3s ease-in-out'
          }}
        >
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Synesthetica Studio
            </h1>
            <p className="text-gray-400">
              Professional Color-to-Sound Synesthesia Application
            </p>
          </div>

          {/* Canvas Area */}
          <div className="relative bg-gray-800 rounded-xl p-6 shadow-2xl">
            {/* Sonification Mode Panel */}
            <SonificationModePanel
              sonificationMode={sonificationMode}
              onSonificationModeChange={setSonificationMode}
              className="absolute top-4 right-4 z-10"
            />

            {/* Drawing Canvas */}
            <div className="flex justify-center">
              <DrawingCanvas
                currentColor={currentColor}
                brushSize={brushSize}
                selectedBrush={selectedBrush}
                onColorChange={setCurrentColor}
                onBrushChange={setSelectedBrush}
                onBrushSizeChange={setBrushSize}
                soundEnabled={soundEnabled}
                volume={volume}
                sonificationMode={sonificationMode}
                currentInstrument={currentInstrument}
                width={800}
                height={600}
              />
            </div>

            {/* Canvas Info */}
            <div className="mt-4 p-4 bg-gray-700/50 rounded-lg">
              <h3 className="text-white font-semibold mb-2">Canvas Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Current Color:</span>
                  <div 
                    className="w-6 h-6 rounded border-2 border-gray-600"
                    style={{ backgroundColor: currentColor }}
                  />
                </div>
                <div>
                  <span className="text-gray-400">Brush:</span>
                  <span className="text-white ml-2">{selectedBrush}</span>
                </div>
                <div>
                  <span className="text-gray-400">Size:</span>
                  <span className="text-white ml-2">{brushSize}px</span>
                </div>
                <div>
                  <span className="text-gray-400">Sound:</span>
                  <span className={`ml-2 ${soundEnabled ? 'text-green-400' : 'text-gray-500'}`}>
                    {soundEnabled ? 'ON' : 'OFF'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Mode:</span>
                  <span className="text-blue-400 ml-2">{sonificationMode}</span>
                </div>
                <div>
                  <span className="text-gray-400">Instrument:</span>
                  <span className="text-purple-400 ml-2">{currentInstrument}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <button
              onClick={() => setCanvasScale(prev => Math.min(prev * 1.2, 3))}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Zoom In
            </button>
            <button
              onClick={() => setCanvasScale(prev => Math.max(prev / 1.2, 0.5))}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Zoom Out
            </button>
            <button
              onClick={() => setCanvasScale(1)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Reset Zoom
            </button>
            <button
              onClick={handleClearCanvas}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Clear Canvas
            </button>
          </div>

          {/* Status Bar */}
          <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                Status: <span className="text-green-400 ml-2">Ready</span>
              </span>
              <span className="text-gray-400">
                Scale: <span className="text-white ml-2">{Math.round(canvasScale * 100)}%</span>
              </span>
            </div>
          </div>
        </div>
      </LayoutManager>
  </div>
  );
};
