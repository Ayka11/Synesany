import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronRight, 
  Star, 
  Heart,
  Palette,
  Brush,
  Music,
  Settings,
  History,
  Save,
  Upload,
  Volume2,
  VolumeX,
  Undo,
  Redo,
  Trash2,
  Play
} from 'lucide-react';
import { BrushSelector } from './SidebarBrushSelector';
import { PaletteSelector } from './SidebarPaletteSelector';
import { ToolControls } from './SidebarToolControls';
import { InstrumentSelector } from './SidebarInstrumentSelector';
import { ADSRControls } from './SidebarADSRControls';
import { useNavigate } from 'react-router';

export function Sidebar({
  brushType,
  onBrushTypeChange,
  color,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  instrument,
  onInstrumentChange,
  attack,
  onAttackChange,
  decay,
  onDecayChange,
  sustain,
  onSustainChange,
  release,
  onReleaseChange,
  canUndo,
  onUndo,
  canRedo,
  onRedo,
  onClear,
  isMuted,
  onToggleMute,
  volume,
  onVolumeChange,
  onSave,
  onGenerate,
  onUpload,
  onSidebarToggle,
  sonificationMode,
  onSonificationModeChange
}) {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    palettes: true,
    brushes: true,
    instruments: false,
    tools: false,
    adsr: false
  });

  // Load collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('synesthetica_sidebar_collapsed');
    if (savedState !== null) {
      setIsCollapsed(JSON.parse(savedState));
    }
  }, []);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('synesthetica_sidebar_collapsed', JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    onSidebarToggle?.(newState);
  };

  return (
    <>
      {/* Sidebar */}
      <div 
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-[#0f0f11] via-[#1a1a1e] to-[#0f0f11] border-r border-white/10 transition-all duration-300 ease-in-out z-50 ${
          isCollapsed ? 'w-16' : 'w-80'
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 w-6 h-6 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-200 hover:scale-110"
        >
          {isCollapsed ? <Menu size={14} /> : <X size={14} />}
        </button>

        {/* Content */}
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <h1 className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 ${
              isCollapsed ? 'text-xs text-center' : 'text-lg'
            }`}>
              {isCollapsed ? 'S' : 'Synesthetica'}
            </h1>
            {!isCollapsed && (
              <p className="text-xs text-white/40 mt-1">Color to Sound Synesthesia</p>
            )}
          </div>

          {/* Palettes Section */}
          {!isCollapsed && (
            <div className="border-b border-white/10">
              <button
                onClick={() => toggleSection('palettes')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Palette size={16} className="text-indigo-400" />
                  <span className="text-sm font-medium text-white/80">Palettes</span>
                </div>
                {expandedSections.palettes ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              
              {expandedSections.palettes && (
                <div className="px-4 pb-4">
                  <PaletteSelector
                    color={color}
                    onColorChange={onColorChange}
                    instrument={instrument}
                  />
                </div>
              )}
            </div>
          )}

          {/* Brushes Section */}
          {!isCollapsed && (
            <div className="border-b border-white/10">
              <button
                onClick={() => toggleSection('brushes')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Brush size={16} className="text-purple-400" />
                  <span className="text-sm font-medium text-white/80">Brushes</span>
                </div>
                {expandedSections.brushes ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              
              {expandedSections.brushes && (
                <div className="px-4 pb-4">
                  <BrushSelector
                    brushType={brushType}
                    onBrushTypeChange={onBrushTypeChange}
                    brushSize={brushSize}
                    onBrushSizeChange={onBrushSizeChange}
                  />
                </div>
              )}
            </div>
          )}

          {/* Instruments Section */}
          {!isCollapsed && (
            <div className="border-b border-white/10">
              <button
                onClick={() => toggleSection('instruments')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Music size={16} className="text-green-400" />
                  <span className="text-sm font-medium text-white/80">Instruments</span>
                </div>
                {expandedSections.instruments ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              
              {expandedSections.instruments && (
                <div className="px-4 pb-4">
                  <InstrumentSelector
                    instrument={instrument}
                    onInstrumentChange={onInstrumentChange}
                  />
                </div>
              )}
            </div>
          )}

          {/* ADSR Controls */}
          {!isCollapsed && (
            <div className="border-b border-white/10">
              <button
                onClick={() => toggleSection('adsr')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings size={16} className="text-orange-400" />
                  <span className="text-sm font-medium text-white/80">Sound Envelope</span>
                </div>
                {expandedSections.adsr ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              
              {expandedSections.adsr && (
                <div className="px-4 pb-4">
                  <ADSRControls
                    attack={attack}
                    onAttackChange={onAttackChange}
                    decay={decay}
                    onDecayChange={onDecayChange}
                    sustain={sustain}
                    onSustainChange={onSustainChange}
                    release={release}
                    onReleaseChange={onReleaseChange}
                    sonificationMode={sonificationMode}
                    onSonificationModeChange={onSonificationModeChange}
                  />
                </div>
              )}
            </div>
          )}

          {/* Tools Section */}
          {!isCollapsed && (
            <div className="border-b border-white/10">
              <button
                onClick={() => toggleSection('tools')}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Settings size={16} className="text-blue-400" />
                  <span className="text-sm font-medium text-white/80">Tools</span>
                </div>
                {expandedSections.tools ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              
              {expandedSections.tools && (
                <div className="px-4 pb-4">
                  <ToolControls
                    canUndo={canUndo}
                    onUndo={onUndo}
                    canRedo={canRedo}
                    onRedo={onRedo}
                    onClear={onClear}
                    isMuted={isMuted}
                    onToggleMute={onToggleMute}
                    onUpload={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                // Handle image upload logic here
                console.log('Image upload:', file);
              }
            }}
            onNavigateToUpload={() => navigate('/upload')}
                  />
                </div>
              )}
            </div>
          )}

          {/* Collapsed State Icons */}
          {isCollapsed && (
            <div className="flex flex-col items-center gap-6 py-6">
              <button
                onClick={() => toggleSection('palettes')}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
                title="Palettes"
              >
                <Palette size={18} className="text-indigo-400 group-hover:text-indigo-300" />
              </button>
              <button
                onClick={() => toggleSection('brushes')}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
                title="Brushes"
              >
                <Brush size={18} className="text-purple-400 group-hover:text-purple-300" />
              </button>
              <button
                onClick={() => toggleSection('instruments')}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
                title="Instruments"
              >
                <Music size={18} className="text-green-400 group-hover:text-green-300" />
              </button>
              <button
                onClick={onToggleMute}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX size={18} className="text-red-400 group-hover:text-red-300" />
                ) : (
                  <Volume2 size={18} className="text-blue-400 group-hover:text-blue-300" />
                )}
              </button>
              <button
                onClick={onGenerate}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
                title="Generate Audio"
              >
                <Play size={18} className="text-orange-400 group-hover:text-orange-300" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isCollapsed && window.innerWidth < 768 && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
