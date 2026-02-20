import React, { useState, useRef, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
    left: position.x,
    top: position.y,
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

  useEffect(() => {
    onPositionChangeRef.current?.(panelId, position);
  }, [panelId, position]);

  useEffect(() => {
    onSizeChangeRef.current?.(panelId, size);
  }, [panelId, size]);

  return (
    <div
      ref={setNodeRef}
      className={`
        fixed bg-gradient-to-b from-[#0f0f11] via-[#1a1a1e] to-[#0f0f11]
        border border-white/10 rounded-lg shadow-2xl backdrop-blur-md
        transition-all duration-300 z-40
        ${isCollapsed ? 'opacity-60' : 'opacity-100'}
        ${isDocked ? 'border-indigo-500/30' : 'border-white/10'}
        ${className}
      `}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: isCollapsed ? '60px' : `${size.width}px`,
        height: isCollapsed ? '40px' : `${size.height}px`,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        zIndex: isDocked ? 20 : 30,
      }}
      {...props}
    >
      {/* Drag Handle */}
      {isDraggable && !isCollapsed && (
        <div
          ref={dragHandleRef}
          className="absolute top-2 left-2 w-4 h-4 bg-indigo-600 hover:bg-indigo-700 rounded cursor-move flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
          {...attributes}
          {...listeners}
        >
          <Icons.GripVertical size={12} className="text-white" />
        </div>
      )}

      {/* Panel Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">
              {panelId.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`
              text-xs font-semibold text-white/80 uppercase tracking-wider
              ${isCollapsed ? 'hidden' : 'truncate'}
            `}>
              {panelId}
            </h3>
            <p className="text-xs text-white/40 truncate">
              {isDocked ? 'Docked' : 'Floating'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Dock/Undock Button */}
          <button
            onClick={handleDockToggle}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            title={isDocked ? 'Undock' : 'Dock'}
          >
            {isDocked ? <Icons.PinOff size={14} /> : <Icons.Pin size={14} />}
          </button>
          
          {/* Collapse Button */}
          <button
            onClick={handleCollapse}
            className="p-1 rounded hover:bg-white/10 transition-colors"
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <Icons.Maximize2 size={14} /> : <Icons.Minimize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Panel Content */}
      {!isCollapsed && (
        <div className="overflow-hidden h-full">
          <div className="p-3 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {children}
          </div>
        </div>
      )}

      {/* Resize Handles */}
      {isResizable && !isCollapsed && (
        <>
          {/* Top */}
          <div
            className="absolute top-0 left-2 right-2 h-1 cursor-ns-resize hover:bg-indigo-500/50 transition-colors"
            onMouseDown={(e) => handleMouseDown(e, 'top')}
          />
          
          {/* Right */}
          <div
            className="absolute top-2 right-0 bottom-2 w-1 cursor-ew-resize hover:bg-indigo-500/50 transition-colors"
            onMouseDown={(e) => handleMouseDown(e, 'right')}
          />
          
          {/* Bottom */}
          <div
            className="absolute bottom-0 left-2 right-2 h-1 cursor-ns-resize hover:bg-indigo-500/50 transition-colors"
            onMouseDown={(e) => handleMouseDown(e, 'bottom')}
          />
          
          {/* Left */}
          <div
            className="absolute top-2 left-0 bottom-2 w-1 cursor-ew-resize hover:bg-indigo-500/50 transition-colors"
            onMouseDown={(e) => handleMouseDown(e, 'left')}
          />
        </>
      )}
    </div>
  );
};
