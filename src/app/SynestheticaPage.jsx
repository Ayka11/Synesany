import { useState, useRef, useEffect } from "react";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import { LanguageProvider, useLanguage } from "@/contexts/LanguageContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

// Import constants
import { PALETTES } from "@/constants/palettes";
import { BRUSHES } from "@/constants/brushes";

function AppContent() {
  const { toggleTheme, currentTheme } = useTheme();
  const { language, setLanguage, translate } = useLanguage();
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const [color, setColor] = useState("#8b5cf6");
  const [brushSize, setBrushSize] = useState(16);
  const [selectedBrush, setSelectedBrush] = useState("round");
  const [instrument, setInstrument] = useState("piano");
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    palettes: true,
    brushes: true,
    instruments: false,
    tools: false,
    adsr: false
  });

  // Simple translation function
  const t = (key) => {
    const translations = {
      synesthetica: { en: 'Synesthetica', az: 'Sineşteziya', ru: 'Синестезия', tr: 'Sineştezi', ar: 'سينستيزيا', zh: '联觉' },
      palettes: { en: 'Palettes', az: 'Palitralar', ru: 'Палитры', tr: 'Paletler', ar: 'لوحات الألوان', zh: '调色板' },
      brushes: { en: 'Brushes', az: 'Fırçalar', ru: 'Кисти', tr: 'Fırçalar', ar: 'الفرش', zh: '画笔' },
      instruments: { en: 'Instruments', az: 'Alətlər', ru: 'Инструменты', tr: 'Enstrümanlar', ar: 'الأدوات', zh: '乐器' },
      color: { en: 'Color', az: 'Rəng', ru: 'Цвет', tr: 'Renk', ar: 'اللون', zh: '颜色' },
      brushSize: { en: 'Brush Size', az: 'Fırça Ölçüsü', ru: 'Размер кисти', tr: 'Fırça Boyutu', ar: 'حجم الفرشاة', zh: '画笔大小' },
      clearCanvas: { en: 'Clear Canvas', az: 'Kanvası Təmizlə', ru: 'Очистить холст', tr: 'Tuvali Temizle', ar: 'مسح اللوحة', zh: '清除画布' },
      soundEnabled: { en: 'Sound Enabled', az: 'Səs Aktiv', ru: 'Звук включен', tr: 'Ses Aktif', ar: 'الصوت مفعل', zh: '声音已启用' },
      soundDisabled: { en: 'Sound Disabled', az: 'Səs Söndürülüb', ru: 'Звук выключен', tr: 'Ses Kapalı', ar: 'الصوت معطل', zh: '声音已禁用' },
      volume: { en: 'Volume', az: 'Səs Səviyyəsi', ru: 'Громкость', tr: 'Ses Seviyesi', ar: 'مستوى الصوت', zh: '音量' },
      generateSound: { en: 'Generate Sound', az: 'Səs Yarat', ru: 'Создать звук', tr: 'Ses Oluştur', ar: 'إنشاء صوت', zh: '生成声音' }
    };
    return translations[key]?.[language] || key;
  };

  // Initialize audio context
  useEffect(() => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;
    
    // Clear canvas with background
    ctx.fillStyle = currentTheme.name === 'dark' ? '#2a2a2a' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [currentTheme]);

  // Convert hex color to frequency
  const colorToFrequency = (hexColor) => {
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Map RGB values to frequency range (200Hz - 800Hz)
    const brightness = (r + g + b) / 3;
    return 200 + (brightness / 255) * 600;
  };

  // Play sound when drawing
  const playSound = (x, y) => {
    if (!isSoundEnabled || !audioContextRef.current) return;
    
    const audioContext = audioContextRef.current;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    // Calculate frequency based on color and position
    const baseFrequency = colorToFrequency(color);
    const positionModulation = (x / 600) * 200; // Modulate by X position
    const frequency = baseFrequency + positionModulation;
    
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    // Set volume and create envelope
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(volume * 0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Play sound
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  // Drawing functions
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    
    // Play sound at start of drawing
    playSound(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
    
    // Play sound while drawing (throttled)
    if (Math.random() > 0.7) { // Play sound ~30% of the time to avoid too much sound
      playSound(x, y);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleClearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.fillStyle = currentTheme.name === 'dark' ? '#2a2a2a' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const toggleSound = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  const generateSound = () => {
    setIsGenerating(true);
    // Simulate sound generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  const handleVolumeChange = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
  };

  const handleToggleMute = () => {
    setIsSoundEnabled(!isSoundEnabled);
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div style={{ 
      padding: '0', 
      background: currentTheme.name === 'dark' ? '#1a1a1a' : '#f5f5f5', 
      color: currentTheme.name === 'dark' ? 'white' : 'black', 
      minHeight: '100vh',
      direction: language === 'ar' ? 'rtl' : 'ltr'
    }}>
      {/* Header */}
      <div style={{
        height: '60px',
        background: currentTheme.name === 'dark' ? '#1f2937' : '#ffffff',
        borderBottom: `1px solid ${currentTheme.name === 'dark' ? '#374151' : '#e5e7eb'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h1 style={{ 
            color: currentTheme.name === 'dark' ? '#e5e7eb' : '#1f2937', 
            fontSize: '20px', 
            fontWeight: 'bold',
            margin: 0 
          }}>
            🎨 {t('synesthetica')}
          </h1>
          
          {/* Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{
              padding: '6px 12px',
              background: currentTheme.name === 'dark' ? '#374151' : '#f3f4f6',
              color: currentTheme.name === 'dark' ? '#e5e7eb' : '#1f2937',
              border: `1px solid ${currentTheme.name === 'dark' ? '#4b5563' : '#d1d5db'}`,
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            <option value="en">🇺🇸 English</option>
            <option value="az">🇦🇿 Azərbaycan</option>
            <option value="ru">🇷🇺 Русский</option>
            <option value="tr">🇹🇷 Türkçe</option>
            <option value="ar">🇸🇦 العربية</option>
            <option value="zh">🇨🇳 中文</option>
          </select>
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              padding: '8px 16px',
              background: currentTheme.name === 'dark' ? '#4f46e5' : '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            {currentTheme.name === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
        
        {/* Volume Control */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: currentTheme.name === 'dark' ? '#9ca3af' : '#6b7280', fontSize: '14px' }}>
            🔊
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            style={{ width: '100px' }}
          />
          <button
            onClick={handleToggleMute}
            style={{
              padding: '6px 12px',
              background: isSoundEnabled ? '#16a34a' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {isSoundEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        {/* Sidebar with ALL palettes and brushes */}
        <div style={{
          width: sidebarCollapsed ? '64px' : '320px',
          height: 'calc(100vh - 60px)',
          background: currentTheme.name === 'dark' ? '#1f2937' : '#f9fafb',
          borderRight: `1px solid ${currentTheme.name === 'dark' ? '#374151' : '#e5e7eb'}`,
          padding: sidebarCollapsed ? '8px' : '16px',
          transition: 'all 0.3s ease',
          overflow: 'hidden'
        }}>
          {/* Toggle Button */}
          <button
            onClick={toggleSidebar}
            style={{
              width: '32px',
              height: '32px',
              background: currentTheme.name === 'dark' ? '#4f46e5' : '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {sidebarCollapsed ? '☰' : '✕'}
          </button>

          {!sidebarCollapsed && (
            <>
              {/* Palettes Section - ALL 8 PALETTES */}
              <div style={{ marginBottom: '20px' }}>
                <button
                  onClick={() => toggleSection('palettes')}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'transparent',
                    color: currentTheme.name === 'dark' ? '#e5e7eb' : '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '12px'
                  }}
                >
                  🎨 {t('palettes')} {expandedSections.palettes ? '▼' : '▶'}
                </button>
                
                {expandedSections.palettes && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {PALETTES.map((palette, index) => (
                      <div key={index} style={{ marginBottom: '12px' }}>
                        <div style={{ 
                          fontSize: '12px', 
                          color: currentTheme.name === 'dark' ? '#9ca3af' : '#6b7280',
                          marginBottom: '6px',
                          fontWeight: '500'
                        }}>
                          {palette.name}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(24px, 1fr))', gap: '6px' }}>
                          {palette.colors.map((paletteColor, colorIndex) => (
                            <button
                              key={colorIndex}
                              onClick={() => setColor(paletteColor)}
                              style={{
                                width: '24px',
                                height: '24px',
                                background: paletteColor,
                                border: color === paletteColor ? '2px solid #4f46e5' : '1px solid #374151',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Brushes Section - ALL 6 BRUSHES */}
              <div style={{ marginBottom: '20px' }}>
                <button
                  onClick={() => toggleSection('brushes')}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'transparent',
                    color: currentTheme.name === 'dark' ? '#e5e7eb' : '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '12px'
                  }}
                >
                  🖌️ {t('brushes')} {expandedSections.brushes ? '▼' : '▶'}
                </button>
                
                {expandedSections.brushes && (
                  <div>
                    {/* Brush Type Selection */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ 
                        fontSize: '12px', 
                        color: currentTheme.name === 'dark' ? '#9ca3af' : '#6b7280',
                        marginBottom: '6px'
                      }}>
                        Brush Type
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                        {Object.entries(BRUSHES).map(([brushKey, brush]) => (
                          <button
                            key={brushKey}
                            onClick={() => setSelectedBrush(brushKey)}
                            style={{
                              padding: '6px',
                              background: selectedBrush === brushKey 
                                ? (currentTheme.name === 'dark' ? '#4f46e5' : '#6366f1')
                                : (currentTheme.name === 'dark' ? '#374151' : '#f3f4f6'),
                              color: currentTheme.name === 'dark' ? '#e5e7eb' : '#374151',
                              border: `1px solid ${currentTheme.name === 'dark' ? '#4b5563' : '#d1d5db'}`,
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '10px'
                            }}
                          >
                            {brush.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Picker */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ 
                        fontSize: '12px', 
                        color: currentTheme.name === 'dark' ? '#9ca3af' : '#6b7280',
                        marginBottom: '6px'
                      }}>
                        {t('color')}
                      </div>
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        style={{ 
                          width: '100%', 
                          height: '32px', 
                          border: `1px solid ${currentTheme.name === 'dark' ? '#374151' : '#e5e7eb'}`, 
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      />
                    </div>

                    {/* Brush Size */}
                    <div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: currentTheme.name === 'dark' ? '#9ca3af' : '#6b7280',
                        marginBottom: '6px'
                      }}>
                        {t('brushSize')}: {brushSize}px
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="50"
                        value={brushSize}
                        onChange={(e) => setBrushSize(parseInt(e.target.value))}
                        style={{ width: '100%' }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Instruments Section */}
              <div style={{ marginBottom: '20px' }}>
                <button
                  onClick={() => toggleSection('instruments')}
                  style={{
                    width: '100%',
                    padding: '8px',
                    background: 'transparent',
                    color: currentTheme.name === 'dark' ? '#e5e7eb' : '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '12px'
                  }}
                >
                  🎵 {t('instruments')} {expandedSections.instruments ? '▼' : '▶'}
                </button>
                
                {expandedSections.instruments && (
                  <select
                    value={instrument}
                    onChange={(e) => setInstrument(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px',
                      background: currentTheme.name === 'dark' ? '#374151' : '#ffffff',
                      color: currentTheme.name === 'dark' ? '#e5e7eb' : '#374151',
                      border: `1px solid ${currentTheme.name === 'dark' ? '#4b5563' : '#d1d5db'}`,
                      borderRadius: '4px'
                    }}
                  >
                    <option value="piano">Piano</option>
                    <option value="guitar">Guitar</option>
                    <option value="strings">Strings</option>
                    <option value="bell">Bell</option>
                    <option value="sine">Sine Wave</option>
                    <option value="sawtooth">Sawtooth</option>
                    <option value="square">Square</option>
                    <option value="triangle">Triangle</option>
                  </select>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={handleClearCanvas}
                  style={{
                    padding: '8px 16px',
                    background: currentTheme.name === 'dark' ? '#dc2626' : '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {t('clearCanvas')}
                </button>
                
                <button
                  onClick={toggleSound}
                  style={{
                    padding: '8px 16px',
                    background: isSoundEnabled 
                      ? (currentTheme.name === 'dark' ? '#16a34a' : '#22c55e')
                      : (currentTheme.name === 'dark' ? '#6b7280' : '#9ca3af'),
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  {isSoundEnabled ? '🔊 ' + t('soundEnabled') : '🔇 ' + t('soundDisabled')}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Main Content */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          marginLeft: sidebarCollapsed ? '64px' : '320px',
          transition: 'margin-left 0.3s ease',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          {/* Canvas */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: '20px'
          }}>
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              style={{
                width: '600px',
                height: '400px',
                border: `2px solid ${currentTheme.name === 'dark' ? '#4f46e5' : '#6366f1'}`,
                borderRadius: '8px',
                background: currentTheme.name === 'dark' ? '#2a2a2a' : '#ffffff',
                cursor: 'crosshair'
              }}
            />
            
            {/* Generate Sound Button */}
            <button
              onClick={generateSound}
              disabled={isGenerating}
              style={{
                padding: '12px 24px',
                background: isGenerating 
                  ? (currentTheme.name === 'dark' ? '#6b7280' : '#9ca3af')
                  : (currentTheme.name === 'dark' ? '#16a34a' : '#22c55e'),
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {isGenerating ? '⏳ Generating...' : '🎵 ' + t('generateSound')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SynestheticaPage() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <SubscriptionProvider>
          <AppContent />
        </SubscriptionProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
