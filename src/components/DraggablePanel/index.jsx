import React, { useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import * as Icons from 'lucide-react';

export const DraggablePanel = ({ 
  children, 
  id,
  title,
  position = { x: 0, y: 0 },
  size = { width: 340, height: 'auto' },
  collapsed = false,
  zIndex = 1000,
  onPositionChange,
  onSizeChange,
  onToggleCollapse,
  onClick,
  className = '',
  ...props 
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState(null);
  const panelRef = useRef(null);
  const dragHandleRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id,
    disabled: false,
  });

  useEffect(() => {
    if (transform) {
      const newX = position.x + transform.x;
      const newY = position.y + transform.y;
      onPositionChange?.({ x: newX, y: newY });
    }
  }, [transform, position, onPositionChange]);

  const handleMouseDown = (e, direction) => {
    if (collapsed) return;
    e.preventDefault();
    setIsResizing(true);
    setResizeDirection(direction);
    
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = typeof size.height === 'number' ? size.height : 400;

    const handleMouseMove = (e) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      let newWidth = startWidth;
      let newHeight = startHeight;

      switch (direction) {
        case 'right':
          newWidth = Math.max(200, Math.min(600, startWidth + deltaX));
          break;
        case 'bottom':
          newHeight = Math.max(150, Math.min(800, startHeight + deltaY));
          break;
        case 'left':
          newWidth = Math.max(200, Math.min(600, startWidth - deltaX));
          break;
        case 'top':
          newHeight = Math.max(150, Math.min(800, startHeight - deltaY));
          break;
      }

      onSizeChange?.({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const style = {
    position: 'absolute',
    left: position.x + (transform?.x || 0),
    top: position.y + (transform?.y || 0),
    width: size.width,
    height: collapsed ? 40 : (size.height === 'auto' ? 'auto' : size.height),
    zIndex,
    minWidth: 200,
    minHeight: collapsed ? 40 : 150,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-800 border border-gray-700 rounded-lg shadow-xl ${className} ${isResizing ? 'select-none' : ''}`}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      {/* Header */}
      <div
        ref={dragHandleRef}
        className="flex items-center justify-between px-3 py-2 bg-gray-900 rounded-t-lg cursor-move border-b border-gray-700"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-medium text-gray-200">{title}</h3>
        <div className="flex gap-1">
          <button
            onClick={(e) => { e.stopPropagation(); onToggleCollapse?.(); }}
            className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
          >
            {collapsed ? <Icons.ChevronDown size={14} /> : <Icons.ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="p-3 overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {children}
        </div>
      )}

      {/* Resize Handles */}
      {!collapsed && (
        <>
          <div
            className="absolute top-0 left-0 w-2 h-full cursor-ew-resize hover:bg-blue-500/20"
            onMouseDown={(e) => handleMouseDown(e, 'left')}
          />
          <div
            className="absolute top-0 right-0 w-2 h-full cursor-ew-resize hover:bg-blue-500/20"
            onMouseDown={(e) => handleMouseDown(e, 'right')}
          />
          <div
            className="absolute top-0 left-0 w-full h-2 cursor-ns-resize hover:bg-blue-500/20"
            onMouseDown={(e) => handleMouseDown(e, 'top')}
          />
          <div
            className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize hover:bg-blue-500/20"
            onMouseDown={(e) => handleMouseDown(e, 'bottom')}
          />
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize hover:bg-blue-500/20"
            onMouseDown={(e) => handleMouseDown(e, 'top-left')}
          />
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize hover:bg-blue-500/20"
            onMouseDown={(e) => handleMouseDown(e, 'top-right')}
          />
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize hover:bg-blue-500/20"
            onMouseDown={(e) => handleMouseDown(e, 'bottom-left')}
          />
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize hover:bg-blue-500/20"
            onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
          />
        </>
      )}
    </div>
  );
};
