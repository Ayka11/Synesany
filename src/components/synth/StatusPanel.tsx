import React from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { useTranslation } from '@/lib/i18n';
import { Volume2, VolumeX } from 'lucide-react';

const StatusPanel: React.FC = () => {
  const {
    currentColor, brushType, brushSize,
    muted, sonificationMode, canvasRef,
    canvasDuration,
  } = useAppContext();
  const { t } = useTranslation();

  const canvas = canvasRef.current;
  const w = canvas?.width || 1200;
  const h = canvas?.height || 900;

  return (
    <div className="absolute top-3 right-3 z-20 hidden lg:block">
      <div className="bg-background/70 backdrop-blur-xl border border-border/30 rounded-xl p-3 shadow-lg space-y-2 min-w-[180px]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-16">{t('status.canvasSize')}</span>
          <span className="text-[10px] font-mono">{w}x{h}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-16">{t('status.brush')}</span>
          <span className="text-[10px] font-medium capitalize">{brushType}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-16">{t('status.size')}</span>
          <span className="text-[10px] font-mono">{brushSize}px</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-16">Color</span>
          <div className="w-4 h-4 rounded-md border border-border/50" style={{ backgroundColor: currentColor }} />
          <span className="text-[10px] font-mono">{currentColor}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-16">{t('status.sound')}</span>
          {muted ? (
            <VolumeX className="w-3 h-3 text-destructive" />
          ) : (
            <Volume2 className="w-3 h-3 text-green-500" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground w-16">{t('status.mode')}</span>
          <span className="text-[10px] font-medium capitalize">{sonificationMode}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
