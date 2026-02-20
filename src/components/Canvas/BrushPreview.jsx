import React from 'react';

export const BrushPreview = ({ 
  brushType = 'round', 
  brushSize = 5, 
  color = '#ff0000',
  className = ''
}) => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set drawing properties
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = brushSize;

    // Draw brush preview based on type
    if (brushType === "spray") {
      for (let i = 0; i < brushSize * 2; i++) {
        const offset = Math.random() * brushSize - brushSize / 2;
        const angle = Math.random() * Math.PI * 2;
        ctx.fillRect(
          centerX + Math.cos(angle) * offset,
          centerY + Math.sin(angle) * offset,
          1,
          1,
        );
      }
    } else if (brushType === "square") {
      ctx.lineCap = "butt";
      ctx.lineJoin = "miter";
      ctx.fillRect(centerX - brushSize/2, centerY - brushSize/2, brushSize, brushSize);
    } else if (brushType === "triangle") {
      const size = brushSize / 2;
      ctx.beginPath();
      ctx.moveTo(centerX - size, centerY + size);
      ctx.lineTo(centerX + size, centerY + size);
      ctx.lineTo(centerX, centerY - size);
      ctx.closePath();
      ctx.fill();
    } else if (brushType === "star") {
      const spikes = 5;
      const outerRadius = brushSize / 2;
      const innerRadius = brushSize / 4;
      let rotation = Math.PI / 2 * 3;
      let xPoint = centerX;
      let yPoint = centerY;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY - outerRadius);
      for (let i = 0; i < spikes; i++) {
        xPoint = centerX + Math.cos(rotation) * outerRadius;
        yPoint = centerY + Math.sin(rotation) * outerRadius;
        ctx.lineTo(xPoint, yPoint);
        rotation += step;

        xPoint = centerX + Math.cos(rotation) * innerRadius;
        yPoint = centerY + Math.sin(rotation) * innerRadius;
        ctx.lineTo(xPoint, yPoint);
        rotation += step;
      }
      ctx.lineTo(centerX, centerY - outerRadius);
      ctx.closePath();
      ctx.fill();
    } else if (brushType === "cross") {
      const size = brushSize / 2;
      ctx.fillRect(centerX - 1, centerY - size, 2, size * 2);
      ctx.fillRect(centerX - size, centerY - 1, size * 2, 2);
    } else if (brushType === "sawtooth") {
      ctx.lineCap = "butt";
      ctx.lineJoin = "miter";
      const teeth = Math.floor(brushSize / 4);
      const toothSize = brushSize / teeth;
      
      ctx.beginPath();
      for (let i = 0; i < teeth; i++) {
        const offset = i * toothSize;
        ctx.moveTo(centerX - brushSize/2 + offset, centerY + (i % 2 === 0 ? toothSize : -toothSize));
        ctx.lineTo(centerX - brushSize/2 + offset + toothSize, centerY + (i % 2 === 0 ? -toothSize : toothSize));
      }
      ctx.stroke();
    } else if (brushType === "calligraphy") {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = brushSize;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(centerX - brushSize, centerY);
      ctx.lineTo(centerX + brushSize, centerY);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    } else if (brushType === "marker") {
      ctx.lineCap = "square";
      ctx.lineJoin = "miter";
      ctx.lineWidth = brushSize * 1.5;
      ctx.globalAlpha = 0.9;
      ctx.beginPath();
      ctx.moveTo(centerX - brushSize, centerY);
      ctx.lineTo(centerX + brushSize, centerY);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    } else if (brushType === "pencil") {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = brushSize * 0.7;
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.moveTo(centerX - brushSize, centerY);
      ctx.lineTo(centerX + brushSize, centerY);
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    } else {
      // Default round brush
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.arc(centerX, centerY, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [brushType, brushSize, color]);

  return (
    <div className={`bg-gray-800 rounded-lg p-2 ${className}`}>
      <canvas
        ref={canvasRef}
        width={60}
        height={60}
        className="border border-gray-600 rounded"
      />
      <div className="text-xs text-white/60 text-center mt-1 capitalize">
        {brushType}
      </div>
    </div>
  );
};
