import React, { useState } from 'react';
import { 
  Layers, 
  Settings, 
  Download, 
  Share2, 
  Eye, 
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export const RightPanel = () => {
  const [activeTab, setActiveTab] = useState('layers');
  const [expandedSections, setExpandedSections] = useState({
    layers: true,
    properties: true,
    export: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Mock layers data
  const layers = [
    { id: 1, name: 'Background', visible: true, locked: false, opacity: 100 },
    { id: 2, name: 'Drawing Layer 1', visible: true, locked: false, opacity: 100 },
    { id: 3, name: 'Text Layer', visible: true, locked: true, opacity: 80 },
  ];

  return (
    <div className="w-80 bg-gray-900/50 backdrop-blur-lg border-l border-white/10 flex flex-col">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h2 className="text-sm font-semibold text-white/80">Panels</h2>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('layers')}
            className={`p-1.5 rounded ${activeTab === 'layers' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            <Layers size={16} />
          </button>
          <button
            onClick={() => setActiveTab('properties')}
            className={`p-1.5 rounded ${activeTab === 'properties' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            <Settings size={16} />
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`p-1.5 rounded ${activeTab === 'export' ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'}`}
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Layers Panel */}
        {activeTab === 'layers' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Layers</h3>
              <button className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white">
                <Plus size={14} />
              </button>
            </div>
            
            <div className="space-y-2">
              {layers.map((layer) => (
                <div key={layer.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                  <button className="text-white/60 hover:text-white">
                    {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button className="text-white/60 hover:text-white">
                    {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
                  </button>
                  <span className="flex-1 text-sm text-white/80">{layer.name}</span>
                  <span className="text-xs text-white/50">{layer.opacity}%</span>
                  <button className="text-white/60 hover:text-white">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Properties Panel */}
        {activeTab === 'properties' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Properties</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/60 block mb-1">Opacity</label>
                <input type="range" min="0" max="100" defaultValue="100" className="w-full accent-purple-500" />
              </div>
              
              <div>
                <label className="text-xs text-white/60 block mb-1">Blend Mode</label>
                <select className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white">
                  <option>Normal</option>
                  <option>Multiply</option>
                  <option>Screen</option>
                  <option>Overlay</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs text-white/60 block mb-1">Size</label>
                <input type="number" defaultValue="100" className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm text-white" />
              </div>
            </div>
          </div>
        )}

        {/* Export Panel */}
        {activeTab === 'export' && (
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider">Export</h3>
            </div>
            
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 px-4 transition-colors">
                <Download size={16} />
                <span className="text-sm font-medium">Export as PNG</span>
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 px-4 transition-colors">
                <Download size={16} />
                <span className="text-sm font-medium">Export as JPG</span>
              </button>
              
              <button className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg py-2 px-4 transition-colors">
                <Share2 size={16} />
                <span className="text-sm font-medium">Share Link</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
