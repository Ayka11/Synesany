import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useClipboard = () => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      
      return true;
    } catch (error) {
      console.error('Failed to copy text: ', error);
      return false;
    }
  }, []);

  const copyColor = useCallback(async (color) => {
    const hex = color.hex || color;
    const success = await copyToClipboard(hex);
    
    if (success) {
      toast.success(`Color ${hex.toUpperCase()} copied to clipboard!`);
    } else {
      toast.error('Failed to copy color');
    }
    
    return success;
  }, [copyToClipboard]);

  return {
    isCopied,
    copyToClipboard,
    copyColor
  };
};
