import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  delay = 100,
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef(null);
  const tooltipRef = useRef(null);

  const showTooltip = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const tooltipRect = tooltipRef.current?.getBoundingClientRect();
    
    let x = rect.left + rect.width / 2;
    let y = rect.top;

    switch (position) {
      case 'top':
        y = rect.top - (tooltipRect?.height || 0) - 8;
        break;
      case 'bottom':
        y = rect.bottom + 8;
        break;
      case 'left':
        x = rect.left - (tooltipRect?.width || 0) - 8;
        y = rect.top + rect.height / 2;
        break;
      case 'right':
        x = rect.right + 8;
        y = rect.top + rect.height / 2;
        break;
    }

    setCoords({ x, y });
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const handleMouseEnter = (e) => {
    timeoutRef.current = setTimeout(() => {
      showTooltip(e);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    hideTooltip();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const tooltipContent = isVisible ? (
    <div
      ref={tooltipRef}
      className={`fixed z-50 px-2 py-1 text-xs text-white bg-gray-900/95 border border-white/20 rounded-md shadow-lg backdrop-blur-sm pointer-events-none transition-opacity duration-150 ${className}`}
      style={{
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
      {...props}
    >
      {content}
    </div>
  ) : null;

  return (
    <>
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="inline-block"
      >
        {children}
      </div>
      {createPortal(tooltipContent, document.body)}
    </>
  );
};
