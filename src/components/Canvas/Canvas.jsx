export function Canvas({
  canvasRef,
  onMouseDown,
  onMouseMove,
  onMouseUp,
  onMouseOut,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  className = "",
}) {
  return (
    <div className={`relative flex-1 cursor-crosshair ${className}`}>
      <canvas
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseOut={onMouseOut}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="h-full w-full bg-gradient-to-br from-[#0a0a0c] via-[#111115] to-[#0a0a0c]"
      />
    </div>
  );
}
