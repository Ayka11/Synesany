import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as Icons from 'lucide-react';

export const LayoutManager = ({ 
  children, 
  onLayoutChange,
  className = '',
  ...props 
}) => {
  const [panels, setPanels] = useState({});
  const [gridSize, setGridSize] = useState(8);
  const [showGrid, setShowGrid] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const containerRef = useRef(null);

  // Panel collision detection
  const checkCollision = useCallback((panel1, panel2) => {
    const p1 = { ...panel1, ...panel1.position };
    const p2 = { ...panel2, ...panel2.position };
    
    return !(
      p1.x + p1.size.width <= p2.x ||
      p1.x >= p2.x + p2.size.width ||
      p1.y + p1.size.height <= p2.y ||
      p1.y >= p2.y + p2.size.height
    );
  }, []);

  // Snap to grid
  const snapToGrid = useCallback((value) => {
    if (!showGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [gridSize, showGrid]);

  // Handle panel position update
  const handlePanelPositionChange = useCallback((panelId, newPosition) => {
    const updatedPanels = { ...panels };
    const panel = updatedPanels[panelId];
    
    if (!panel) return;

    // Apply grid snapping
    const snappedPosition = {
      x: snapToGrid(newPosition.x),
      y: snapToGrid(newPosition.y)
    };

    // Check collisions with other panels
    Object.entries(updatedPanels).forEach(([id, otherPanel]) => {
      if (id !== panelId && otherPanel && !otherPanel.isCollapsed) {
        const testPanel = { ...otherPanel, position: snappedPosition };
        if (checkCollision(testPanel, panel)) {
          // Simple collision resolution: push panel to the right
          snappedPosition.x = otherPanel.position.x + otherPanel.size.width + 10;
        }
      }
    });

    updatedPanels[panelId] = {
      ...panel,
      position: snappedPosition
    };

    setPanels(updatedPanels);
    onLayoutChange?.(updatedPanels);
  }, [panels, gridSize, showGrid, onLayoutChange]);

  // Handle panel resize
  const handlePanelResize = useCallback((panelId, newSize) => {
    const updatedPanels = { ...panels };
    const panel = updatedPanels[panelId];
    
    if (!panel) return;

    // Apply size constraints
    const constrainedSize = {
      width: Math.max(200, Math.min(600, newSize.width)),
      height: Math.max(150, Math.min(800, newSize.height))
    };

    updatedPanels[panelId] = {
      ...panel,
      size: constrainedSize
    };

    setPanels(updatedPanels);
    onLayoutChange?.(updatedPanels);
  }, [panels, onLayoutChange]);

  // Auto-arrange panels
  const autoArrange = useCallback(() => {
    const updatedPanels = { ...panels };
    const panelList = Object.values(updatedPanels).filter(p => !p.isCollapsed);
    
    // Simple grid layout
    const cols = Math.ceil(Math.sqrt(panelList.length));
    panelList.forEach((panel, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      updatedPanels[panel.id] = {
        ...panel,
        position: {
          x: col * (320 + 20), // panel width + gap
          y: row * (250 + 20)  // panel height + gap
        }
      };
    });

    setPanels(updatedPanels);
    onLayoutChange?.(updatedPanels);
  }, [panels, onLayoutChange]);

  // Reset layout
  const resetLayout = useCallback(() => {
    setPanels({});
    onLayoutChange?.({});
  }, [onLayoutChange]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-screen ${className}`}
      {...props}
    >
      {/* Grid Background */}
      {showGrid && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 24px 24px),
              repeating-linear-gradient(90deg, transparent, transparent 24px 24px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
            opacity: 0.1
          }}
        />
      )}

      {/* Control Panel */}
      <div className="absolute top-4 right-4 z-50 bg-white/10 backdrop-blur-md rounded-lg p-4 shadow-xl">
        <h3 className="text-sm font-semibold text-white mb-3">Layout Manager</h3>
        
        <div className="space-y-3">
          {/* Grid Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`p-2 rounded transition-colors ${
                showGrid 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              <Icons.Grid size={14} />
              <span className="ml-2 text-xs">Grid</span>
            </button>
            
            <button
              onClick={autoArrange}
              className="p-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
            >
              <Icons.Layout size={14} />
              <span className="ml-2 text-xs">Auto Arrange</span>
            </button>
            
            <button
              onClick={resetLayout}
              className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              <Icons.RotateCcw size={14} />
              <span className="ml-2 text-xs">Reset</span>
            </button>
          </div>

          {/* Grid Size */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-gray-300">Grid Size:</label>
            <input
              type="range"
              min="4"
              max="32"
              value={gridSize}
              onChange={(e) => setGridSize(parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-800 rounded"
            />
            <span className="text-xs text-gray-400 ml-2">{gridSize}px</span>
          </div>
        </div>
      </div>

      {/* Render children (panels) */}
      {children}
    </div>
  );
};
