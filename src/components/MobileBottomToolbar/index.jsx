import React, { useState } from 'react';
import { ColorPanel } from '../ProfessionalToolbar/ColorPanel';
import { BrushPanel } from '../ProfessionalToolbar/BrushPanel';
import { SoundPanel } from '../ProfessionalToolbar/SoundPanel';
import { ToolPanel } from '../ProfessionalToolbar/ToolPanel';
import * as Icons from 'lucide-react';
import { useToolbarStore } from '../../stores/toolbarStore';

const MobileBottomToolbar = () => {
  const { panels, togglePanelCollapsed } = useToolbarStore();
  const [activePanel, setActivePanel] = useState(null);

  const panelOrder = [
    { id: 'color', icon: Icons.Palette, title: 'Colors' },
    { id: 'brush', icon: Icons.Brush, title: 'Brushes' },
    { id: 'sound', icon: Icons.Volume2, title: 'Sound' },
    { id: 'tools', icon: Icons.Wrench, title: 'Tools' }
  ];

  const handleTabClick = (panelId) => {
    if (activePanel === panelId) {
      setActivePanel(null);
    } else {
      setActivePanel(panelId);
      // Expand panel when opening
      if (panels[panelId]?.collapsed) {
        togglePanelCollapsed(panelId);
      }
    }
  };

  const handleSheetClose = () => {
    setActivePanel(null);
  };

  return (
    <>
      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900/90 backdrop-blur-lg border-t border-white/10 z-50">
        <div className="flex justify-around items-center h-16 px-4">
          {panelOrder.map(({ id, icon: Icon, title }) => (
            <button
              key={id}
              onClick={() => handleTabClick(id)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-lg
                transition-all duration-200
                ${activePanel === id 
                  ? 'bg-indigo-500 text-white' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                }
              `}
              title={title}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Slide-up Sheet */}
      {activePanel && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleSheetClose}
        >
          <div 
            className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-white/10 rounded-t-2xl max-h-[70vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: 'slideUp 0.3s ease-out'
            }}
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white">
                {panelOrder.find(p => p.id === activePanel)?.title}
              </h3>
              <button
                onClick={handleSheetClose}
                className="p-2 text-gray-400 hover:text-gray-200 rounded-lg"
              >
                <Icons.X size={20} />
              </button>
            </div>

            {/* Sheet Content */}
            <div className="p-4">
              {activePanel === 'color' && <ColorPanel />}
              {activePanel === 'brush' && <BrushPanel />}
              {activePanel === 'sound' && <SoundPanel />}
              {activePanel === 'tools' && <ToolPanel />}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default MobileBottomToolbar;
