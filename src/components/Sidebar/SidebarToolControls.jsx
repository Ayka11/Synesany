import { 
  Undo, 
  Redo, 
  Trash2, 
  Save, 
  Upload, 
  Play, 
  Volume2, 
  VolumeX,
  Download,
  RefreshCw,
  Image as ImageIcon
} from 'lucide-react';

export function SidebarToolControls({
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
  onNavigateToUpload
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider">
        Tools & Actions
      </h3>

      {/* History Controls */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-white/40">History</h4>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
              canUndo
                ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-white/90"
                : "bg-white/5 border-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            <Undo size={14} />
            <span className="text-xs">Undo</span>
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200 ${
              canRedo
                ? "bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-white/90"
                : "bg-white/5 border-white/5 text-white/20 cursor-not-allowed"
            }`}
          >
            <Redo size={14} />
            <span className="text-xs">Redo</span>
          </button>
        </div>
        <button
          onClick={onClear}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all duration-200"
        >
          <Trash2 size={14} />
          <span className="text-xs">Clear Canvas</span>
        </button>
      </div>

      {/* Audio Controls */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-white/40">Audio</h4>
        
        {/* Volume Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <button
              onClick={onToggleMute}
              className="flex items-center gap-2 text-white/60 hover:text-white/80 transition-colors"
            >
              {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span className="text-xs">Volume</span>
            </button>
            <span className="text-xs text-white/40 font-mono">
              {Math.round(volume * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={onVolumeChange}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%, rgba(255,255,255,0.1) 100%)`
            }}
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Play size={16} />
          <span>Generate Audio</span>
        </button>
      </div>

      {/* File Operations */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-white/40">File</h4>
        <div className="space-y-2">
          <button
            onClick={onSave}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 transition-all duration-200"
          >
            <Save size={14} />
            <span className="text-xs">Save Drawing</span>
          </button>
          
          <button
            onClick={onUpload}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 transition-all duration-200"
          >
            <Upload size={14} />
            <span className="text-xs">Upload Image</span>
          </button>

          <button
            onClick={onNavigateToUpload}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 transition-all duration-200"
          >
            <ImageIcon size={14} />
            <span className="text-xs">Sonify Image</span>
          </button>

          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={onUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 hover:text-orange-300 transition-all duration-200">
              <Download size={14} />
              <span className="text-xs">Export Audio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <h4 className="text-xs font-medium text-white/40">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white/80 transition-all duration-200">
            <RefreshCw size={12} />
            <span className="text-xs">Reset</span>
          </button>
          <button className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/60 hover:text-white/80 transition-all duration-200">
            <Download size={12} />
            <span className="text-xs">Export</span>
          </button>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
        }
        input[type="range"]::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #3b82f6;
          border-radius: 50%;
          cursor: pointer;
          border: 2px solid white;
        }
      `}</style>
    </div>
  );
}
