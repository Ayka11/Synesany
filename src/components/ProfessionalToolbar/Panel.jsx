import React, { useState, useRef } from 'react';
import * as Icons from 'lucide-react';

export const Panel = ({ 
  title, 
  children, 
  isCollapsed = false, 
  isCollapsible = true,
  isResizable = false,
  defaultWidth = 280,
  minWidth = 200,
  maxWidth = 400,
  onCollapse,
  onResize,
  className = '',
  ...props 
}) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(defaultWidth);
  const panelRef = useRef(null);
  const resizeRef = useRef(null);

  const handleCollapse = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  const handleMouseDown = (e) => {
    if (!isResizable) return;
    
    e.preventDefault();
    setIsResizing(true);
    
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (e) => {
      const newWidth = startWidth + (e.clientX - startX);
      const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      setWidth(clampedWidth);
      onResize?.(clampedWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      ref={panelRef}
      className={`
        relative
        bg-gradient-to-b from-[#0f0f11] via-[#1a1a1e] to-[#0f0f11]
        border border-white/10 rounded-lg shadow-2xl
        backdrop-blur-md transition-all duration-300
        ${collapsed ? 'w-16' : ''}
        ${!collapsed && isResizable ? 'resize-x' : ''}
        ${className}
      `}
      style={!collapsed ? { width: `${width}px` } : {}}
      {...props}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between p-3 border-b border-white/10">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isResizable && !collapsed && (
            <Icons.GripVertical 
              size={14} 
              className="text-white/30 cursor-move flex-shrink-0"
            />
          )}
          <h3 className={`
            text-xs font-semibold text-white/80 uppercase tracking-wider
            ${collapsed ? 'hidden' : 'truncate'}
          `}>
            {title}
          </h3>
        </div>
        
        <div className="flex items-center gap-1">
          {isCollapsible && (
            <button
              onClick={handleCollapse}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              title={collapsed ? 'Expand' : 'Collapse'}
            >
              {collapsed ? <Icons.ChevronRight size={14} /> : <Icons.ChevronDown size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Panel Content */}
      {!collapsed && (
        <div className="overflow-hidden">
          <div className="p-3 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            {children}
          </div>
        </div>
      )}

      {/* Resize Handle */}
      {isResizable && !collapsed && (
        <div
          ref={resizeRef}
          className="absolute right-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-indigo-500/50 transition-colors"
          onMouseDown={handleMouseDown}
        />
      )}
    </div>
  );
};
