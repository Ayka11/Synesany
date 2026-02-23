import React from 'react';
import * as Icons from 'lucide-react';

export function SonificationModePanel() {
  const [sonificationMode, setSonificationMode] = React.useState('simple');
  const [compact, setCompact] = React.useState(false);

  const modes = [
    { id: 'simple', label: 'Simple', icon: Icons.Play, description: 'Basic audio-visual mapping' },
    { id: 'advanced', label: 'Advanced', icon: Icons.Settings, description: 'Complex audio synthesis with effects' },
    { id: 'musical', label: 'Musical', icon: Icons.Music, description: 'Note-based frequency mapping' },
  ];

  return (
    <div className="bg-white/10 border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">Sonification Mode</h3>
      <div className="space-y-2">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setSonificationMode(mode.id)}
            className={`w-full px-4 py-2 rounded-lg border-2 transition-all ${
              sonificationMode === mode.id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <mode.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{mode.label}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={compact}
            onChange={(e) => setCompact(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm text-gray-600">Compact View</span>
        </label>
      </div>
    </div>
  );
}
