import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { audioEngine } from '@/lib/audioEngine';
import { BrushType, DrawingStroke } from '@/data/pianoKeys';

const DrawingCanvas: React.FC = () => {
  const {
    currentColor, brushType, brushSize, strokes, addStroke,
    zoom, canvasRef, muted, sonificationMode, canvasDuration
  } = useAppContext();
  // --- Time Axis & Mode Overlay Logic ---
  // Mode-specific time scale and overlay text
  let axisMax = 10;
  let axisLabel = '';
  let tickStep = 1;
  switch (sonificationMode) {
    case 'simple':
      axisMax = Math.max(2, Math.ceil(canvasDuration || 2));
      axisLabel = 'Simple: Real-time (0.5–2s per stroke)';
      tickStep = 0.5;
      break;
    case 'timeline':
      axisMax = Math.max(10, Math.ceil(canvasDuration || 10));
      axisLabel = 'Timeline: X = Time (1–3s/stroke, total 10–60s)';
      tickStep = 2;
      break;
    case 'colorfield':
      axisMax = Math.max(30, Math.ceil(canvasDuration || 30));
      axisLabel = 'Colorfield: Ambient (30–300s, generative)';
      tickStep = 30;
      break;
    case 'harmonic':
      axisMax = Math.max(20, Math.ceil(canvasDuration || 20));
      axisLabel = 'Harmonic: Layered harmony (2–6s/chord, total 20–120s)';
      tickStep = 5;
      break;
    default:
      axisMax = Math.max(10, Math.ceil(canvasDuration || 10));
      axisLabel = sonificationMode;
      tickStep = 1;
  }

  // Helper: Generate tick positions
  const ticks = [];
  for (let t = 0; t <= axisMax; t += tickStep) {
    ticks.push(Number(t.toFixed(2)));
  }

  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const currentStroke = useRef<{ x: number; y: number }[]>([]);
  const lastSoundTime = useRef(0);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);
  const animFrameRef = useRef<number>(0);

  // Canvas dimensions
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 900 });

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const w = Math.min(rect.width - 16, 1400);
        const h = Math.min(rect.height - 16, w * 0.75);
        setCanvasSize({ width: Math.round(w), height: Math.round(h) });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Redraw all strokes
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paper texture background
    ctx.fillStyle = document.documentElement.classList.contains('dark')
      ? '#1a1a2e' : '#fafaf8';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid pattern
    ctx.strokeStyle = document.documentElement.classList.contains('dark')
      ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw all completed strokes
    for (const stroke of strokes) {
      drawStroke(ctx, stroke.points, stroke.color, stroke.brush, stroke.size);
    }

    // Draw current in-progress stroke
    if (isDrawing.current && currentStroke.current.length > 0) {
      drawStroke(ctx, currentStroke.current, currentColor, brushType, brushSize);
    }
  }, [strokes, currentColor, brushType, brushSize, canvasRef]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas, canvasSize]);

  const drawStroke = (
    ctx: CanvasRenderingContext2D,
    points: { x: number; y: number }[],
    color: string,
    brush: BrushType,
    size: number
  ) => {
    if (points.length === 0) return;

    ctx.save();

    switch (brush) {
      case 'round':
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        break;

      case 'square':
        ctx.fillStyle = color;
        for (const p of points) {
          ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
        }
        break;

      case 'spray':
        ctx.fillStyle = color;
        for (const p of points) {
          for (let i = 0; i < size * 2; i++) {
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * size;
            ctx.globalAlpha = 0.3 + Math.random() * 0.4;
            ctx.beginPath();
            ctx.arc(
              p.x + Math.cos(angle) * radius,
              p.y + Math.sin(angle) * radius,
              0.5 + Math.random(),
              0, Math.PI * 2
            );
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
        break;

      case 'star':
        ctx.fillStyle = color;
        for (const p of points) {
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x = p.x + Math.cos(angle) * (size / 2);
            const y = p.y + Math.sin(angle) * (size / 2);
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
        }
        break;

      case 'calligraphy':
        ctx.strokeStyle = color;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        for (let i = 1; i < points.length; i++) {
          const dx = points[i].x - points[i - 1].x;
          const dy = points[i].y - points[i - 1].y;
          const angle = Math.atan2(dy, dx);
          ctx.lineWidth = size * (0.3 + Math.abs(Math.sin(angle)) * 0.7);
          ctx.beginPath();
          ctx.moveTo(points[i - 1].x, points[i - 1].y);
          ctx.lineTo(points[i].x, points[i].y);
          ctx.stroke();
        }
        break;

      case 'pencil':
        ctx.strokeStyle = color;
        ctx.lineWidth = Math.max(1, size * 0.3);
        ctx.lineCap = 'round';
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(
            points[i].x + (Math.random() - 0.5) * 1.5,
            points[i].y + (Math.random() - 0.5) * 1.5
          );
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
        break;

      case 'marker':
        ctx.strokeStyle = color;
        ctx.lineWidth = size * 1.5;
        ctx.lineCap = 'square';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
        break;
    }

    ctx.restore();
  };

  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const playDrawSound = (x: number, y: number) => {
    const now = Date.now();
    if (now - lastSoundTime.current < 50) return; // Throttle to 20 sounds/sec
    lastSoundTime.current = now;

    const canvas = canvasRef.current;
    if (!canvas) return;
    audioEngine.playNote(currentColor, x, y, canvas.width, canvas.height);
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const point = getCanvasPoint(e);
    if (!point) return;

    isDrawing.current = true;
    currentStroke.current = [point];
    lastPoint.current = point;
    playDrawSound(point.x, point.y);
    redrawCanvas();
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    const point = getCanvasPoint(e);
    if (!point) return;

    currentStroke.current.push(point);
    lastPoint.current = point;
    playDrawSound(point.x, point.y);

    cancelAnimationFrame(animFrameRef.current);
    animFrameRef.current = requestAnimationFrame(redrawCanvas);
  };

  const handleEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing.current) return;
    isDrawing.current = false;

    if (currentStroke.current.length > 0) {
      const stroke: DrawingStroke = {
        points: [...currentStroke.current],
        color: currentColor,
        brush: brushType,
        size: brushSize,
        timestamp: Date.now(),
      };
      addStroke(stroke);
    }
    currentStroke.current = [];
    lastPoint.current = null;
  };

  return (
    <div
      ref={containerRef}
      className="flex-1 flex items-center justify-center p-2 overflow-hidden bg-gradient-to-br from-background via-background to-accent/20"
    >
      <div
        className="relative rounded-xl shadow-2xl overflow-hidden border border-border/30"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
          transition: 'transform 0.2s ease',
        }}
      >
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary/20 rounded-tl-xl pointer-events-none z-10" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary/20 rounded-tr-xl pointer-events-none z-10" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary/20 rounded-bl-xl pointer-events-none z-10" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary/20 rounded-br-xl pointer-events-none z-10" />

        <canvas
          ref={canvasRef}
          width={canvasSize.width}
          height={canvasSize.height}
          className="cursor-crosshair touch-none"
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
            maxWidth: 'min(92vw, 1400px)',
            maxHeight: '75vh',
          }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        />
        {/* Time Axis & Mode Overlay */}
        <div className="absolute left-0 right-0 bottom-0 z-20 pointer-events-none select-none">
          {/* Mode Overlay */}
          <div className="absolute left-3 bottom-8 bg-background/80 text-xs text-primary px-3 py-1 rounded-lg shadow border border-primary/20">
            {axisLabel}
          </div>
          {/* Time Axis */}
          <svg width={canvasSize.width} height={32} style={{ display: 'block' }}>
            {/* Axis line */}
            <line x1={32} y1={16} x2={canvasSize.width - 16} y2={16} stroke="#888" strokeWidth={1.5} />
            {/* Ticks and labels */}
            {ticks.map((t, i) => {
              const x = 32 + ((canvasSize.width - 48) * (t / axisMax));
              return (
                <g key={i}>
                  <line x1={x} y1={10} x2={x} y2={22} stroke="#888" strokeWidth={1} />
                  <text x={x} y={30} textAnchor="middle" fontSize="10" fill="#666">{t % 1 === 0 ? t : t.toFixed(1)}s</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas;
