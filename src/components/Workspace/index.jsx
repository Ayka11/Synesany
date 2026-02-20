import React, { useState, useEffect, useRef } from 'react';
import { DrawingCanvas } from '../Canvas/DrawingCanvas';
import { DndContext } from '@dnd-kit/core';
import * as Icons from 'lucide-react';
import { Header } from '../Header/Header';
import { QuickActionsToolbar } from '../QuickActionsToolbar';
import { Panel } from '../ProfessionalToolbar/Panel';
import { ColorPanel } from '../ProfessionalToolbar/ColorPanel';
import { BrushPanel } from '../ProfessionalToolbar/BrushPanel';
import { SoundPanel } from '../ProfessionalToolbar/SoundPanel';
import { ToolPanel } from '../ProfessionalToolbar/ToolPanel';
import { CanvasStatusPanel } from '../Canvas/CanvasStatusPanel';
import { DraggablePanel } from '../DraggablePanel';
import { CanvasProvider } from '../../contexts/CanvasContext';
import { useCanvasHistory } from '../../hooks/useCanvasHistory';
import { useToolbarStore } from '../../stores/toolbarStore';
import { useUser } from '../../utils/useUser';
import { useSoundGeneration } from '../../hooks/useSoundGeneration';
import { Tooltip } from '../ui/Tooltip';

export const Workspace = () => {
  const {
    layoutMode,
    setLayoutMode,
    panels,
    updatePanelPosition,
    updatePanelSize,
    togglePanelCollapsed,
    bringPanelToFront,
    resetAllPanels,
    autoArrangePanels,
    currentColor,
    setCurrentColor,
    selectedBrush,
    setSelectedBrush,
    brushSize,
    setBrushSize,
    soundEnabled,
    toggleSoundEnabled,
    masterVolume,
    setMasterVolume,
    visualZoom,
    setVisualZoom,
    sonificationMode,
    setSonificationMode,
    currentInstrument,
    setCurrentInstrument,
    adsr,
    setADSR,
    sonificationDurations,
  } = useToolbarStore();

  const { data: user } = useUser();
  const canvasRef = useRef(null);
  const canvasCtxRef = useRef(null);
  const { isGenerating, generateSound } = useSoundGeneration(canvasRef, canvasCtxRef, user);
  
  // Canvas history for undo/redo functionality
  const {
    canUndo,
    canRedo,
    undo,
    redo,
    clearHistory
  } = useCanvasHistory();

  const [isMobile, setIsMobile] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 1000, height: 700 });
  const [currentTime, setCurrentTime] = useState(0);

  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [openSections, setOpenSections] = useState({
    color: true,
    brush: true,
    sound: true,
    tools: false,
  });

  const toggleSection = (key) => {
    setOpenSections((s) => ({ ...s, [key]: !s[key] }));
  };

  const handleTimeSeek = (time) => {
    setCurrentTime(time);
  };

  useEffect(() => {
    const check = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      setIsMobile(w < 768);

      // Leave more room for default panel positions on larger screens.
      const sideReserve = w < 1024 ? 80 : w < 1280 ? 520 : 760;
      const nextWidth = Math.max(640, Math.min(1200, w - sideReserve));
      const nextHeight = Math.max(480, Math.min(800, h - 200));
      setCanvasSize({ width: nextWidth, height: nextHeight });
    };

    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const anyOffscreen = Object.values(panels).some(
      (panel) =>
        panel.position.x < 0 ||
        panel.position.y < 0 ||
        panel.position.x > window.innerWidth ||
        panel.position.y > window.innerHeight
    );
    if (anyOffscreen) {
      autoArrangePanels({ width: window.innerWidth, height: window.innerHeight });
    }
  }, [autoArrangePanels, panels]);

  const handlePanelClick = (panelId) => {
    bringPanelToFront(panelId);
  };

  const handleClearCanvas = () => {
    if (canvasRef.current && canvasCtxRef.current) {
      // Save current state to history before clearing
      const imageData = canvasCtxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
      // Clear canvas
      canvasCtxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      // Save cleared state to history
      clearHistory();
    }
  };

  const handleSave = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `synesthetica-canvas-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const handleUndo = () => {
    const previousState = undo();
    if (previousState && canvasRef.current && canvasCtxRef.current) {
      canvasCtxRef.current.putImageData(previousState, 0, 0);
    }
  };

  const handleRedo = () => {
    const nextState = redo();
    if (nextState && canvasRef.current && canvasCtxRef.current) {
      canvasCtxRef.current.putImageData(nextState, 0, 0);
    }
  };

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file && canvasRef.current && canvasCtxRef.current) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            canvasCtxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            canvasCtxRef.current.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `synesthetica-canvas-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <DndContext>
      <CanvasProvider canvasRef={canvasRef}>
        <div className="min-h-screen bg-gray-900 flex flex-col">
          <Header
            user={user}
            isSaving={false}
            onSave={handleSave}
            volume={masterVolume}
            onVolumeChange={(e) => setMasterVolume(parseFloat(e.target.value))}
            isMuted={!soundEnabled}
            onToggleMute={toggleSoundEnabled}
          />

          {layoutMode === 'stacked' && !isMobile ? (
            <div className="flex-1 flex min-h-0">
              {/* Left Sidebar */}
              <aside
                className={
                  "shrink-0 border-r border-white/10 bg-gray-900/60 backdrop-blur-lg transition-all duration-200 " +
                  (leftCollapsed ? "w-14" : "w-80")
                }
              >
                <div className="h-full overflow-y-auto">
                  <div className="p-2 flex items-center justify-between border-b border-white/10">
                    <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">
                      {!leftCollapsed ? 'Panels' : ''}
                    </div>
                    <button
                      onClick={() => setLeftCollapsed((s) => !s)}
                      className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                      title={leftCollapsed ? 'Expand' : 'Collapse'}
                    >
                      {leftCollapsed ? <Icons.ChevronRight size={16} /> : <Icons.ChevronLeft size={16} />}
                    </button>
                  </div>

                  {!leftCollapsed && (
                    <div className="p-2 space-y-2">
                      <Tooltip content="Choose colors from palettes or save favorites">
                        <button
                          onClick={() => toggleSection('color')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <Icons.Palette size={16} />
                            Color
                          </div>
                          {openSections.color ? <Icons.ChevronDown size={14} /> : <Icons.ChevronRight size={14} />}
                        </button>
                      </Tooltip>
                      {openSections.color && (
                        <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                          <ColorPanel />
                        </div>
                      )}

                      <Tooltip content="Select brush types and adjust brush settings">
                        <button
                          onClick={() => toggleSection('brush')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <Icons.Brush size={16} />
                            Brush
                          </div>
                          {openSections.brush ? <Icons.ChevronDown size={14} /> : <Icons.ChevronRight size={14} />}
                        </button>
                      </Tooltip>
                      {openSections.brush && (
                        <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                          <BrushPanel />
                        </div>
                      )}

                      <Tooltip content="Configure sonification and audio settings">
                        <button
                          onClick={() => toggleSection('sound')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <Icons.Music size={16} />
                            Sound
                          </div>
                          {openSections.sound ? <Icons.ChevronDown size={14} /> : <Icons.ChevronRight size={14} />}
                        </button>
                      </Tooltip>
                      {openSections.sound && (
                        <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                          <SoundPanel />
                        </div>
                      )}

                      <Tooltip content="Access drawing tools and canvas controls">
                        <button
                          onClick={() => toggleSection('tools')}
                          className="w-full flex items-center justify-between px-3 py-2 rounded bg-white/5 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-center gap-2 text-sm text-white/80">
                            <Icons.Wrench size={16} />
                            Tools
                          </div>
                          {openSections.tools ? <Icons.ChevronDown size={14} /> : <Icons.ChevronRight size={14} />}
                        </button>
                      </Tooltip>
                      
                      {/* Canvas Status */}
                      <div className="mb-4">
                        <div className="rounded-lg border border-white/10 bg-white/5 p-2">
                          <CanvasStatusPanel
                            width={canvasSize.width}
                            height={canvasSize.height}
                            currentColor={currentColor}
                            selectedBrush={selectedBrush}
                            brushSize={brushSize}
                            soundEnabled={soundEnabled}
                            sonificationMode={sonificationMode}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </aside>

              {/* Main Canvas */}
              <main className="flex-1 relative flex items-start justify-center overflow-hidden">
                {/* Zoom Controls */}
                <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-lg rounded-lg p-2 border border-white/10">
                  <Tooltip content="Zoom Out">
                    <button
                      onClick={() => setVisualZoom(prev => Math.max(1, prev - 0.5))}
                      className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={visualZoom <= 1}
                    >
                      <Icons.ZoomOut size={16} />
                    </button>
                  </Tooltip>
                  
                  <div className="px-2 text-xs text-white/80 font-medium min-w-[3rem] text-center">
                    {Math.round(visualZoom * 100)}%
                  </div>
                  
                  <Tooltip content="Zoom In">
                    <button
                      onClick={() => setVisualZoom(prev => Math.min(3, prev + 0.5))}
                      className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={visualZoom >= 3}
                    >
                      <Icons.ZoomIn size={16} />
                    </button>
                  </Tooltip>
                  
                  <Tooltip content="Reset Zoom">
                    <button
                      onClick={() => setVisualZoom(1)}
                      className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                    >
                      <Icons.Maximize2 size={16} />
                    </button>
                  </Tooltip>
                </div>

                <DrawingCanvas
                  currentColor={currentColor}
                  brushSize={brushSize}
                  selectedBrush={selectedBrush}
                  soundEnabled={soundEnabled}
                  volume={masterVolume}
                  sonificationMode={sonificationMode}
                  currentInstrument={currentInstrument}
                  adsr={adsr}
                  externalCanvasRef={canvasRef}
                  externalCtxRef={canvasCtxRef}
                  width={canvasSize.width}
                  height={canvasSize.height}
                  visualZoom={visualZoom}
                  duration={sonificationDurations[sonificationMode]}
                  currentTime={currentTime}
                  onTimeSeek={handleTimeSeek}
                />
              </main>

              {/* Right Sidebar (placeholder, collapsed by default) */}
              <aside
                className={
                  "shrink-0 border-l border-white/10 bg-gray-900/60 backdrop-blur-lg transition-all duration-200 " +
                  (rightCollapsed ? "w-0" : "w-72")
                }
              >
                {!rightCollapsed && <div className="p-3 text-sm text-white/60">Right Panel</div>}
              </aside>
            </div>
          ) : (
            <div className="flex-1 relative flex items-start justify-center">
              {/* Zoom Controls for Floating Layout */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-lg rounded-lg p-2 border border-white/10">
                <Tooltip content="Zoom Out">
                  <button
                    onClick={() => setVisualZoom(prev => Math.max(1, prev - 0.5))}
                    className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={visualZoom <= 1}
                  >
                    <Icons.ZoomOut size={16} />
                  </button>
                </Tooltip>
                
                <div className="px-2 text-xs text-white/80 font-medium min-w-[3rem] text-center">
                  {Math.round(visualZoom * 100)}%
                </div>
                
                <Tooltip content="Zoom In">
                  <button
                    onClick={() => setVisualZoom(prev => Math.min(3, prev + 0.5))}
                    className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={visualZoom >= 3}
                  >
                    <Icons.ZoomIn size={16} />
                  </button>
                </Tooltip>
                
                <Tooltip content="Reset Zoom">
                  <button
                    onClick={() => setVisualZoom(1)}
                    className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    <Icons.Maximize2 size={16} />
                  </button>
                </Tooltip>
              </div>

              <DrawingCanvas
                currentColor={currentColor}
                brushSize={brushSize}
                selectedBrush={selectedBrush}
                soundEnabled={soundEnabled}
                volume={masterVolume}
                sonificationMode={sonificationMode}
                currentInstrument={currentInstrument}
                adsr={adsr}
                externalCanvasRef={canvasRef}
                externalCtxRef={canvasCtxRef}
                width={canvasSize.width}
                height={canvasSize.height}
                visualZoom={visualZoom}
                duration={sonificationDurations[sonificationMode]}
                currentTime={currentTime}
                onTimeSeek={handleTimeSeek}
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
                </>
              )}
            </div>
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

          <QuickActionsToolbar
            isGenerating={isGenerating}
            onUndo={undo}
            onRedo={redo}
            onClear={handleClearCanvas}
            onUpload={handleUpload}
            onDownload={handleDownload}
            onAutoArrange={autoArrangePanels}
            onGenerateSound={generateSound}
            onToggleLayout={() => setLayoutMode(layoutMode === 'floating' ? 'stacked' : 'floating')}
          />
        </div>
      </CanvasProvider>
    </DndContext>
  );
};
