import React, { createContext, useContext } from 'react';

const CanvasContext = createContext(null);

export const CanvasProvider = ({ children, canvasRef }) => {
  return (
    <CanvasContext.Provider value={canvasRef}>
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  return context;
};
