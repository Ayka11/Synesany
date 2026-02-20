import React from 'react';
import { ColorPanel } from '../ProfessionalToolbar/ColorPanel';
import { BrushPanel } from '../ProfessionalToolbar/BrushPanel';
import { SoundPanel } from '../ProfessionalToolbar/SoundPanel';
import { ToolPanel } from '../ProfessionalToolbar/ToolPanel';
import * as Icons from 'lucide-react';
import { useToolbarStore } from '../../stores/toolbarStore';

const LeftToolbarStack = () => {
  const {
    panels,
    togglePanelCollapsed,
  } = useToolbarStore();

  const panelOrder = ['color', 'brush', 'sound', 'tools'];
  const panelTitles = {
    color: 'Colors',
    brush: 'Brushes', 
    sound: 'Sound',
    tools: 'Tools'
  };

  return (
    <div className="fixed left-0 top-20 bottom-0 w-80 bg-gray-900/50 backdrop-blur-lg border-r border-white/10 p-4 overflow-y-auto">
      {panelOrder.map((panelId) => {
        const panel = panels[panelId];

        return (
          <div
            key={panelId}
            className={`
              relative mb-3 last:mb-0
              shadow-lg
              transition-all duration-300 ease-in-out
            `}
          >
            {/* Panel Header */}
            <div
              className={`
                flex items-center justify-between p-3 bg-gray-800 border-b border-white/10
                ${panel.collapsed ? 'rounded-t-lg' : 'rounded-t-lg'}
              `}
            >
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                {panelTitles[panelId]}
              </h3>
              
              {/* Collapse Button */}
              <button
                onClick={() => togglePanelCollapsed(panelId)}
                className={`
                  p-1 rounded-md 
                  ${panel.collapsed 
                    ? 'text-gray-400 hover:text-gray-200' 
                    : 'text-gray-300 hover:text-gray-100'
                  }
                  transition-colors duration-200
                `}
                title={panel.collapsed ? `Expand ${panelTitles[panelId]}` : `Collapse ${panelTitles[panelId]}`}
              >
                <Icons.ChevronDown 
                  size={16} 
                  className={`transition-transform duration-300 ${panel.collapsed ? 'rotate-180' : 'rotate-0'}`}
                />
              </button>
            </div>

            {/* Panel Content */}
            <div className="overflow-hidden transition-all duration-300 ease-in-out" style={{ height: panel.collapsed ? '0px' : 'auto' }}>
              <div className="p-4">
                {panelId === 'color' && <ColorPanel />}
                {panelId === 'brush' && <BrushPanel />}
                {panelId === 'sound' && <SoundPanel />}
                {panelId === 'tools' && <ToolPanel />}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeftToolbarStack;
