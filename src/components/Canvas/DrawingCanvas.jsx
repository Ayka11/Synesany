import React, { useRef, useState, useEffect, useCallback } from 'react';
import { TimeScale } from './TimeScale';
import { useDrawing } from '../../hooks/useDrawing';
import { useAudioEngine } from '../../hooks/useAudioEngine';

export const DrawingCanvas = ({ 
  currentColor = '#ff0000',
  brushSize = 5,
  selectedBrush = 'round',
  onColorChange,
  onBrushSizeChange,
  onBrushChange,
  soundEnabled = true,
  volume = 0.5,
  sonificationMode = 'simple',
  currentInstrument = 'piano',
  adsr = { attack: 0.1, decay: 0.2, sustain: 0.7, release: 0.3 },
  externalCanvasRef,
  externalCtxRef,
  width = 800,
  height = 600,
  visualZoom = 1,
  duration = 180, // Default 3 minutes
  currentTime = 0,
  onTimeSeek
}) => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  
  // Audio engine for real-time sound
  const { playTone } = useAudioEngine();
  
  useEffect(() => {
    if (!externalCanvasRef) return;
    externalCanvasRef.current = canvasRef.current;
  }, [externalCanvasRef]);

  useEffect(() => {
    if (!externalCtxRef) return;
    const ctx = canvasRef.current?.getContext?.('2d') ?? null;
    externalCtxRef.current = ctx;
    ctxRef.current = ctx;
  }, [externalCtxRef]);

  // Get mouse position relative to canvas
  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  // Get touch position relative to canvas
  const getTouchPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
  };

  // Drawing functions using useDrawing hook
  const {
    startDrawing,
    draw,
    stopDrawing
  } = useDrawing({
    canvasRef,
    ctxRef,
    isDrawing: { current: isDrawing },
    color: currentColor,
    brushSize,
    brushType: selectedBrush,
    instrument: currentInstrument,
    attack: adsr.attack,
    decay: adsr.decay,
    sustain: adsr.sustain,
    release: adsr.release,
    playTone,
    saveHistory: () => {}, // Placeholder
    getCoords: getMousePos,
    sonificationMode,
    onDrawingStart: () => setIsDrawing(true),
    onDrawingActivity: () => {},
    onDrawingEnd: () => setIsDrawing(false)
  });

  // Handle mouse events
  const handleMouseDown = (e) => {
    const pos = getMousePos(e);
    startDrawing(e);
  };

  const handleMouseMove = (e) => {
    draw(e);
  };

  const handleMouseUp = () => {
    stopDrawing();
  };

  // Handle touch events for mobile
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousedown', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    startDrawing(mouseEvent);
  };

  const handleTouchMove = (e) => {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    draw(mouseEvent);
  };

  const handleTouchEnd = () => {
    stopDrawing();
  };

  // Clear canvas
  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, width, height);
  };

  return (
    <div className="relative bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
      {/* Canvas with Visual Zoom */}
      <div 
        style={{ 
          transform: `scale(${visualZoom})`,
          transformOrigin: 'center',
          transition: 'transform 0.2s ease'
        }}
      >
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="border border-gray-700 cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={stopDrawing}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
      
      {/* Time Scale */}
      <TimeScale
        sonificationMode={sonificationMode}
        duration={duration}
        currentTime={currentTime}
        visualZoom={visualZoom}
        onSeek={onTimeSeek}
      />
    </div>
  );
};
