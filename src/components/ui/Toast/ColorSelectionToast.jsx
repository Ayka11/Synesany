import React from 'react';

export const ColorSelectionToast = ({ 
  color, 
  id, 
  onClose,
  duration = 3000 
}) => {
  const title = `${color.name || 'Color'} Selected`;
  
  const message = (
    <div className="flex items-center gap-2">
      <div 
        className="w-4 h-4 rounded-full border border-white/30 flex-shrink-0"
        style={{ backgroundColor: color.hex }}
      />
      <div className="flex flex-col">
        <span className="font-mono text-xs">{color.hex?.toUpperCase()}</span>
        {(color.closestNote || color.name) && (
          <span className="text-xs opacity-75">
            {color.closestNote || color.name} • {color.freq?.toFixed(2)} Hz
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div
      className={`
        fixed bottom-4 right-4 z-50 max-w-sm p-4 rounded-lg border
        bg-indigo-500/10 border-indigo-500/30 text-indigo-400
        backdrop-blur-md shadow-2xl transition-all duration-300
        transform translate-y-0 opacity-0
        animate-slide-up
      `}
      style={{
        animation: 'slideUp 0.3s ease-out forwards'
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm mb-1">{title}</div>
          <div className="text-xs opacity-90">{message}</div>
          <div className="text-xs mt-1 opacity-75">Copied to clipboard!</div>
        </div>
        <button
          onClick={() => onClose?.(id)}
          className="flex-shrink-0 p-1 rounded hover:bg-white/10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
