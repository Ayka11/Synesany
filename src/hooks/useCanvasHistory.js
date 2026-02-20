import { useState, useCallback, useRef } from 'react';

export const useCanvasHistory = () => {
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(0);
  const canvasRef = useRef(null);

  // Add new state to history
  const addToHistory = useCallback((canvasData) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyStep + 1);
      newHistory.push(canvasData);
      return newHistory;
    });
    setHistoryStep(prev => prev + 1);
  }, [historyStep]);

  // Undo to previous state
  const undo = useCallback(() => {
    if (historyStep > 0) {
      setHistoryStep(prev => prev - 1);
      return history[historyStep - 1];
    }
    return null;
  }, [history, historyStep]);

  // Redo to next state
  const redo = useCallback(() => {
    if (historyStep < history.length - 1) {
      setHistoryStep(prev => prev + 1);
      return history[historyStep + 1];
    }
    return null;
  }, [history, historyStep]);

  // Check if undo is possible
  const canUndo = historyStep > 0;

  // Check if redo is possible
  const canRedo = historyStep < history.length - 1;

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
    setHistoryStep(0);
  }, []);

  // Get current state
  const getCurrentState = useCallback(() => {
    return history[historyStep] || null;
  }, [history, historyStep]);

  return {
    history,
    historyStep,
    canUndo,
    canRedo,
    addToHistory,
    undo,
    redo,
    clearHistory,
    getCurrentState,
    canvasRef
  };
};
