import { useState, useRef, useEffect, useCallback } from "react";

export const useCanvas = () => {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const isDrawing = useRef(false);
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;

    // Save initial blank state to history
    const initialState = canvas.toDataURL();
    setHistory([initialState]);
    setHistoryStep(0);
  }, []);

  // Auto-save logic
  useEffect(() => {
    const timer = setInterval(() => {
      if (canvasRef.current) {
        const data = canvasRef.current.toDataURL();
        localStorage.setItem("synesthetica_draft", data);
        console.log("Draft auto-saved");
      }
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Restore draft
  useEffect(() => {
    const draft = localStorage.getItem("synesthetica_draft");
    if (draft && canvasRef.current) {
      const img = new Image();
      img.src = draft;
      img.onload = () => ctxRef.current.drawImage(img, 0, 0);
    }
  }, []);

  // Save to History
  const saveHistory = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL();

    // Avoid saving duplicate states
    if (history[historyStep] === data) return;

    // Remove any future states if we're not at the end
    const newHistory = [...history.slice(0, historyStep + 1), data].slice(-100);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  }, [historyStep, history]);

  // Undo/Redo
  const undo = useCallback(() => {
    if (historyStep <= 0) return; // Can't undo beyond the first state

    const step = historyStep - 1;
    const img = new Image();
    img.src = history[step];
    img.onload = () => {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      ctxRef.current.drawImage(img, 0, 0);
      setHistoryStep(step);
    };
  }, [historyStep, history]);

  const redo = useCallback(() => {
    if (historyStep >= history.length - 1) return; // Can't redo beyond the last state

    const step = historyStep + 1;
    const img = new Image();
    img.src = history[step];
    img.onload = () => {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height,
      );
      ctxRef.current.drawImage(img, 0, 0);
      setHistoryStep(step);
    };
  }, [historyStep, history]);

  const clearCanvas = useCallback(() => {
    ctxRef.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );
    saveHistory();
  }, [saveHistory]);

  const getCoords = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
    return { x, y };
  };

  // Check if undo/redo are available
  const canUndo = historyStep > 0;
  const canRedo = historyStep < history.length - 1;

  return {
    canvasRef,
    ctxRef,
    isDrawing,
    history,
    historyStep,
    saveHistory,
    undo,
    redo,
    clearCanvas,
    getCoords,
    canUndo,
    canRedo,
  };
};
