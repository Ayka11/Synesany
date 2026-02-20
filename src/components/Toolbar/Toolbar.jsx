import { BrushSelector } from "./BrushSelector";
import { ColorAndSizeControls } from "./ColorAndSizeControls";
import { ADSRControls } from "./ADSRControls";
import { HistoryControls } from "./HistoryControls";

export function Toolbar({
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
  historyStep,
  historyLength,
}) {
  return (
    <div className="absolute left-6 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-4">
      <BrushSelector
        brushType={brushType}
        onBrushTypeChange={onBrushTypeChange}
      />

      <ColorAndSizeControls
        color={color}
        onColorChange={onColorChange}
        brushSize={brushSize}
        onBrushSizeChange={onBrushSizeChange}
        instrument={instrument}
        onInstrumentChange={onInstrumentChange}
      />

      <ADSRControls
        attack={attack}
        onAttackChange={onAttackChange}
        decay={decay}
        onDecayChange={onDecayChange}
        sustain={sustain}
        onSustainChange={onSustainChange}
        release={release}
        onReleaseChange={onReleaseChange}
      />

      <HistoryControls
        canUndo={canUndo}
        onUndo={onUndo}
        canRedo={canRedo}
        onRedo={onRedo}
        onClear={onClear}
        historyStep={historyStep}
        historyLength={historyLength}
      />
    </div>
  );
}
