import React, { useRef, useEffect } from 'react';
import { useToolbarStore } from '../../stores/toolbarStore';
import * as Icons from 'lucide-react';

const StackedPanel = ({ 
  id, 
  title, 
  children, 
  dragOutEnabled = true,
  defaultCollapsed = false 
}) => {
  const {
    panels,
    updatePanelPosition,
    updatePanelSize,
    togglePanelCollapsed,
  } = useToolbarStore();

  const panelRef = useRef(null);
  const [isResizing, setIsResizing] = React.useState(false);
  const [resizeDirection, setResizeDirection] = React.useState(null);

  useEffect(() => {
    const panel = panels[id];
    if (panel && panelRef.current) {
      panelRef.current.style.height = panel.collapsed ? '48px' : 'auto';
    }
  }, [id, panels[id]?.collapsed]);

  const handleMouseDown = (e) => {
    if (resizeDirection) return; // Don't interfere with resize
    
    const startY = e.clientY;
    const startHeight = panelRef.current?.offsetHeight || 0;

    const handleMouseMove = (e) => {
      if (!isResizing) return;
      
      const deltaY = e.clientY - startY;
      const newHeight = Math.max(48, Math.min(600, startHeight + deltaY));
      
      if (panelRef.current) {
        panelRef.current.style.height = `${newHeight}px`;
        updatePanelSize(id, { 
          width: panels[id].size.width, 
          height: newHeight > 48 ? 'auto' : 48 
        });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    const startResize = (direction) => {
      setIsResizing(true);
      setResizeDirection(direction);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    };

    return (
      <div
        ref={panelRef}
        className={`
          relative bg-gray-900 border border-white/10 rounded-lg overflow-hidden
          ${panels[id]?.collapsed ? 'shadow-lg' : 'shadow-2xl shadow-indigo-500/20'}
          transition-all duration-300 ease-in-out
        `}
        style={{
          width: panels[id]?.size?.width || '340px',
        }}
      >
        {/* Resize Handle - Right */}
        <div
          className="absolute top-0 bottom-0 right-0 w-1 bg-gray-700 hover:bg-gray-600 cursor-ew-resize"
          onMouseDown={() => startResize('right')}
        />

        {/* Panel Content */}
        <div className="overflow-hidden" style={{ height: panels[id]?.collapsed ? '48px' : 'auto' }}>
          {children}
        </div>
      </div>
    );
  };
};

export default StackedPanel;
