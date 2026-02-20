import { Palette } from "lucide-react";
import { INSTRUMENTS } from "@/constants/instruments";
import { PALETTES } from "@/constants/palettes";
import { toast } from "sonner";

export function ColorAndSizeControls({
  color,
  onColorChange,
  brushSize,
  onBrushSizeChange,
  instrument,
  onInstrumentChange,
}) {
  const handlePaletteClick = (paletteColor, palette) => {
    // Set the color
    onColorChange({ target: { value: paletteColor } });

    // Optional: Suggest instrument change if different from current
    if (palette.instrument && palette.instrument !== instrument) {
      toast.info(
        `Tip: Try "${INSTRUMENTS[palette.instrument].label}" with this palette!`,
        {
          duration: 2000,
        },
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-2xl shadow-2xl">
      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
          Color
        </label>
        <div className="relative group">
          <input
            type="color"
            value={color}
            onChange={onColorChange}
            className="h-10 w-10 cursor-pointer overflow-hidden rounded-xl border-none bg-transparent"
          />
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <Palette size={16} className="text-white/50" />
          </div>
        </div>
      </div>

      {/* Palette Bar */}
      <div className="flex flex-col gap-2 -mx-2 px-2">
        <label className="text-[9px] font-bold uppercase tracking-widest text-white/30">
          Palettes
        </label>
        <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-purple-500/50 scrollbar-track-white/5">
          <div className="flex gap-3 min-w-max">
            {PALETTES.map((palette, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center min-w-[120px] group"
              >
                <span className="text-[8px] font-medium text-white/40 mb-1.5 group-hover:text-white/60 transition-colors text-center">
                  {palette.name}
                </span>
                <div className="flex gap-1">
                  {palette.colors.map((paletteColor, colorIdx) => (
                    <button
                      key={colorIdx}
                      onClick={() => handlePaletteClick(paletteColor, palette)}
                      className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
                        color.toLowerCase() === paletteColor.toLowerCase()
                          ? "border-white shadow-lg shadow-white/30"
                          : "border-white/20 hover:border-white/40"
                      }`}
                      style={{ backgroundColor: paletteColor }}
                      title={paletteColor}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
          Size
        </label>
        <input
          type="range"
          min="4"
          max="64"
          value={brushSize}
          onChange={onBrushSizeChange}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-purple-500"
        />
        <div className="text-center text-[10px] text-white/40">
          {brushSize}px
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">
          Instrument
        </label>
        <select
          value={instrument}
          onChange={onInstrumentChange}
          className="w-full rounded-lg bg-white/5 px-2 py-2 text-xs text-white/80 border border-white/10 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 cursor-pointer"
        >
          {Object.entries(INSTRUMENTS).map(([key, { label, description }]) => (
            <option key={key} value={key} className="bg-[#1a1a1e] text-white">
              {label} - {description}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
