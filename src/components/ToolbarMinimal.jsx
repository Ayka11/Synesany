import React from 'react';
import { useToolbarStore, COLOR_PALETTES, BRUSHES } from '../stores/toolbarStore';

const ToolbarMinimal = ({ onColorChange, onBrushChange, onClearCanvas, onSoundToggle, onSonificationModeChange }) => {
  const { favoritePalettes, toggleFavoritePalette, currentColor, selectedBrush, brushSize, soundEnabled, setBrushSize } = useToolbarStore();

  return (
    <div style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: '320px',
      height: '100vh',
      background: '#ffffff',
      borderRight: '1px solid #e5e7eb',
      padding: '16px',
      zIndex: 40,
      overflowY: 'auto',
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '16px' }}>Toolbar (Minimal)</h3>
      
      {/* Brushes */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Brushes</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {Object.entries(BRUSHES).map(([key, brush]) => (
            <button
              key={key}
              onClick={() => onBrushChange?.(key)}
              style={{
                padding: '6px 8px',
                fontSize: '12px',
                background: selectedBrush === key ? '#e0e7ff' : '#f9fafb',
                border: selectedBrush === key ? '1px solid #4f46e5' : '1px solid #e5e7eb',
                borderRadius: '4px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {brush.icon} {brush.name}
            </button>
          ))}
        </div>
        <div style={{ marginTop: '8px' }}>
          <label style={{ fontSize: '11px', color: '#6b7280' }}>Size: {brushSize}px</label>
          <input
            type="range"
            min="1"
            max="50"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={{ width: '100%', marginTop: '4px' }}
          />
        </div>
      </div>

      {/* Sound Controls */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Sound</h4>
        <button
          onClick={() => onSoundToggle?.(!soundEnabled)}
          style={{
            padding: '6px 8px',
            fontSize: '12px',
            background: soundEnabled ? '#dcfce7' : '#f3f4f6',
            border: soundEnabled ? '1px solid #16a34a' : '1px solid #d1d5db',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          {soundEnabled ? '🔊 Sound ON' : '🔇 Sound OFF'}
        </button>
      </div>

      {/* Actions */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Actions</h4>
        <button
          onClick={onClearCanvas}
          style={{
            padding: '6px 8px',
            fontSize: '12px',
            background: '#fef2f2',
            border: '1px solid #ef4444',
            borderRadius: '4px',
            cursor: 'pointer',
            width: '100%',
          }}
        >
          🗑️ Clear Canvas
        </button>
      </div>
      
      {/* Color Palettes */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', color: '#374151' }}>Color Palettes</h4>
        {Object.entries(COLOR_PALETTES).map(([name, palette]) => (
          <div key={name} style={{ marginBottom: '12px', padding: '8px', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
            <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>{name}</div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {palette.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => onColorChange?.(color)}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '4px',
                    border: currentColor === color ? '2px solid #4f46e5' : '1px solid #d1d5db',
                    backgroundColor: color,
                    cursor: 'pointer',
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder for future sections */}
      <p style={{ fontSize: '12px', color: '#6b7280' }}>Notes section will be added later...</p>
    </div>
  );
};

export default ToolbarMinimal;
