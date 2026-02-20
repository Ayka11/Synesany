import { useState } from "react";
import { toast } from "sonner";

export const useSoundGeneration = (canvasRef, ctxRef, user) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const base64ToBlob = (base64, mimeType) => {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: mimeType });
  };

  const generateSound = async () => {
    if (isGenerating) return;
    const canvas = canvasRef?.current;
    const ctx = ctxRef?.current;

    if (!canvas || !ctx) {
      toast.error("Canvas not ready yet");
      return;
    }

    setIsGenerating(true);
    const imageData = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: Array.from(imageData.data),
          width: canvas.width,
          height: canvas.height,
          isPro: user?.tier === "pro",
        }),
      });

      if (!res.ok) {
        let details = "";
        try {
          const maybeJson = await res.json();
          if (maybeJson?.error) details = `: ${maybeJson.error}`;
        } catch {
          // ignore
        }
        throw new Error(`Generate failed: ${res.status}${details}`);
      }

      const data = await res.json();

      if (!data?.audio) {
        throw new Error("No audio returned");
      }

      // Download WAV
      const blob = base64ToBlob(data.audio, "audio/wav");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `synesthetica_${Date.now()}.wav`;
      a.click();
      URL.revokeObjectURL(url);

      if (data.midi) {
        const midiBlob = base64ToBlob(data.midi, "audio/midi");
        const midiUrl = URL.createObjectURL(midiBlob);
        const ma = document.createElement("a");
        ma.href = midiUrl;
        ma.download = `synesthetica_${Date.now()}.mid`;
        ma.click();
        URL.revokeObjectURL(midiUrl);
      }

      toast.success("Soundscape generated!");
    } catch (err) {
      toast.error(err?.message || "Failed to generate soundscape");
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, generateSound };
};
