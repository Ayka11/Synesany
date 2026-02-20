import { useState, useEffect, useRef, useCallback } from 'react';

export const useDrawingCompletion = (canvasRef, onDrawingComplete) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastDrawingTime, setLastDrawingTime] = useState(null);
  const [showGenerateButton, setShowGenerateButton] = useState(false);
  const completionTimeoutRef = useRef(null);
  const drawingStartTimeRef = useRef(null);

  // Clear completion timeout
  const clearCompletionTimeout = useCallback(() => {
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current);
      completionTimeoutRef.current = null;
    }
  }, []);

  // Set completion timeout
  const setCompletionTimeout = useCallback(() => {
    clearCompletionTimeout();
    completionTimeoutRef.current = setTimeout(() => {
      setShowGenerateButton(true);
    }, 2000); // Show generate button after 2 seconds of inactivity
  }, [clearCompletionTimeout]);

  // Handle drawing start
  const handleDrawingStart = useCallback(() => {
    setIsDrawing(true);
    setLastDrawingTime(Date.now());
    setShowGenerateButton(false);
    clearCompletionTimeout();
    
    if (!drawingStartTimeRef.current) {
      drawingStartTimeRef.current = Date.now();
    }
  }, [clearCompletionTimeout]);

  // Handle drawing activity
  const handleDrawingActivity = useCallback(() => {
    setLastDrawingTime(Date.now());
    setShowGenerateButton(false);
    clearCompletionTimeout();
  }, [clearCompletionTimeout]);

  // Handle drawing end
  const handleDrawingEnd = useCallback(() => {
    setIsDrawing(false);
    setCompletionTimeout();
  }, [setCompletionTimeout]);

  // Generate timeline from canvas
  const handleGenerateTimeline = useCallback(() => {
    if (!canvasRef?.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Get canvas data (base resolution for audio generation)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Calculate drawing statistics
    const pixels = imageData.data;
    let drawnPixels = 0;
    let totalPixels = canvas.width * canvas.height;
    
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] > 0) { // Alpha channel
        drawnPixels++;
      }
    }
    
    const drawingCoverage = (drawnPixels / totalPixels) * 100;
    const drawingDuration = drawingStartTimeRef.current 
      ? (Date.now() - drawingStartTimeRef.current) / 1000 
      : 0;

    // Call completion callback with canvas data
    if (onDrawingComplete) {
      onDrawingComplete({
        imageData,
        canvas,
        drawingStats: {
          coverage: drawingCoverage,
          duration: drawingDuration,
          pixelCount: drawnPixels,
          canvasSize: {
            width: canvas.width,
            height: canvas.height
          }
        }
      });
    }

    // Hide generate button after generation
    setShowGenerateButton(false);
  }, [canvasRef, onDrawingComplete]);

  // Reset drawing state
  const resetDrawing = useCallback(() => {
    setIsDrawing(false);
    setLastDrawingTime(null);
    setShowGenerateButton(false);
    clearCompletionTimeout();
    drawingStartTimeRef.current = null;
  }, [clearCompletionTimeout]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearCompletionTimeout();
    };
  }, [clearCompletionTimeout]);

  return {
    isDrawing,
    showGenerateButton,
    handleDrawingStart,
    handleDrawingActivity,
    handleDrawingEnd,
    handleGenerateTimeline,
    resetDrawing
  };
};
