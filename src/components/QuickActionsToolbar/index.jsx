import React, { useState } from 'react';
import { Save, Undo, Redo, Trash2, Download, Upload, Grid, Settings, LayoutGrid, LayoutDashboard, CreditCard, HelpCircle, AudioWaveform } from 'lucide-react';

export const QuickActionsToolbar = ({ 
  onSave, 
  onUndo, 
  onRedo, 
  onClear, 
  onUpload, 
  onDownload,
  onAutoArrange,
  onGenerateSound,
  onToggleLayout
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`
        bg-gray-800/90 backdrop-blur-lg border border-white/10 rounded-lg
        transition-all duration-300 ease-in-out
        ${isExpanded ? 'p-2' : 'p-1'}
      `}>
        <div className="flex items-center gap-1">
          {/* Primary Actions - Always Visible */}
          <button
            onClick={onSave}
            className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Save"
          >
            <Save size={16} />
          </button>
          
          <button
            onClick={onUndo}
            className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Undo"
          >
            <Undo size={16} />
          </button>
          
          <button
            onClick={onRedo}
            className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title="Redo"
          >
            <Redo size={16} />
          </button>

          {/* Expand/Collapse Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            title={isExpanded ? "Collapse" : "More Actions"}
          >
            <Grid size={16} className={isExpanded ? 'rotate-45' : ''} />
          </button>

          {/* Secondary Actions - Visible When Expanded */}
          {isExpanded && (
            <>
              <div className="w-px h-6 bg-white/20 mx-1" />
              
              <button
                onClick={onClear}
                className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Clear Canvas"
              >
                <Trash2 size={16} />
              </button>
              
              <button
                onClick={onUpload}
                className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Upload"
              >
                <Upload size={16} />
              </button>
              
              <button
                onClick={onDownload}
                className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Download"
              >
                <Download size={16} />
              </button>
              
              <button
                onClick={onAutoArrange}
                className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Auto Arrange Panels"
              >
                <LayoutGrid size={16} />
              </button>

              {onToggleLayout && (
                <button
                  onClick={onToggleLayout}
                  className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                  title="Toggle Layout"
                >
                  <LayoutDashboard size={16} />
                </button>
              )}

              <button
                onClick={onGenerateSound}
                className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Generate Sound"
              >
                <AudioWaveform size={16} />
              </button>

              <div className="w-px h-6 bg-white/20 mx-1" />

              <a
                href="/dashboard"
                className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Dashboard"
              >
                <LayoutDashboard size={16} />
              </a>
              <a
                href="/pricing"
                className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Pricing"
              >
                <CreditCard size={16} />
              </a>
              <a
                href="/support"
                className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Support"
              >
                <HelpCircle size={16} />
              </a>
              
              <button
                className="p-2 rounded hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                title="Settings"
              >
                <Settings size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
