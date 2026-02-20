import { useState, useRef, useCallback } from 'react';
import { Upload, X, Play, Download, Music, Image as ImageIcon, Loader2, Settings, Zap } from 'lucide-react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { UpgradeModal } from '@/components/UpgradeModal';
import { toast } from 'sonner';

export function ImageUpload({ onGenerateSound, brushType = 'sine', sonificationMode = 'timeline' }) {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState(null);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const [upgradeModal, setUpgradeModal] = useState({ isOpen: false, type: 'upload' });
  const [uploadCount, setUploadCount] = useState(0);
  
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);
  const { canSubmitDrawing, incrementDailySubmissions, userTier, getExportOptions } = useSubscription();

  // Check upload limits
  const checkUploadLimit = () => {
    const today = new Date().toDateString();
    const savedCount = localStorage.getItem('synesthetica_upload_count');
    const savedDate = localStorage.getItem('synesthetica_upload_date');
    
    let currentCount = 0;
    if (savedDate === today) {
      currentCount = parseInt(savedCount) || 0;
    }
    
    const dailyLimit = userTier === 'pro' ? Infinity : 5;
    return currentCount < dailyLimit;
  };

  const incrementUploadCount = () => {
    const today = new Date().toDateString();
    const currentCount = parseInt(localStorage.getItem('synesthetica_upload_count') || 0);
    localStorage.setItem('synesthetica_upload_count', (currentCount + 1).toString());
    localStorage.setItem('synesthetica_upload_date', today);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleImageFile(imageFile);
    } else {
      toast.error('Please upload an image file (JPG, PNG, or WEBP)');
    }
  }, []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageFile(file);
    }
  }, []);

  const handleImageFile = (file) => {
    // Check file size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      toast.error('Image size must be less than 8MB');
      return;
    }

    // Check file type
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      toast.error('Please upload a JPG, PNG, or WEBP image');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setUploadedImage({
        url: e.target.result,
        name: file.name,
        size: file.size,
        type: file.type
      });
      setGeneratedAudio(null); // Reset previous audio
      toast.success(`Image "${file.name}" uploaded successfully!`);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setUploadedImage(null);
    setGeneratedAudio(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Client-side quick preview
  const generateQuickPreview = async () => {
    if (!uploadedImage) return;

    setIsPreviewPlaying(true);
    toast.info('Generating quick preview...');

    try {
      // Create canvas to process image
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Downscale to 64x64 for quick processing
        const size = 64;
        canvas.width = size;
        canvas.height = size;
        ctx.drawImage(img, 0, 0, size, size);

        // Get image data
        const imageData = ctx.getImageData(0, 0, size, size);
        const pixels = imageData.data;

        // Extract colors and map to frequencies
        const frequencies = [];
        const step = sonificationMode === 'timeline' ? 4 : 8; // Sample every Nth pixel
        
        for (let i = 0; i < pixels.length; i += 4 * step) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];
          
          if (a > 0) { // Skip transparent pixels
            // Map RGB to frequency (200-1200 Hz range)
            const brightness = (r + g + b) / 3;
            const frequency = 200 + (brightness / 255) * 1000;
            frequencies.push(frequency);
          }
        }

        // Play preview using Web Audio API
        await playFrequencySequence(frequencies);
        setIsPreviewPlaying(false);
      };
      
      img.src = uploadedImage.url;
    } catch (error) {
      console.error('Preview generation error:', error);
      toast.error('Failed to generate preview');
      setIsPreviewPlaying(false);
    }
  };

  const playFrequencySequence = async (frequencies) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    for (let i = 0; i < Math.min(frequencies.length, 32); i++) { // Limit to 32 notes for preview
      const frequency = frequencies[i];
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.type = brushType === 'square' ? 'square' : 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.start(audioContext.currentTime + i * 0.1);
      oscillator.stop(audioContext.currentTime + i * 0.1 + 0.1);
      
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  };

  // Full generation (backend)
  const generateFullAudio = async () => {
    if (!uploadedImage) return;

    // Check upload limits for free users
    if (!checkUploadLimit()) {
      setUpgradeModal({ isOpen: true, type: 'upload' });
      return;
    }

    setIsProcessing(true);
    toast.info('Sending image to server for high-quality generation...');

    try {
      const formData = new FormData();
      formData.append('image', dataURLtoFile(uploadedImage.url, uploadedImage.name));
      formData.append('mode', sonificationMode);
      formData.append('brushType', brushType);

      const response = await fetch('/api/sonify-upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const result = await response.json();
      
      setGeneratedAudio({
        url: result.url,
        midiUrl: result.midiUrl,
        duration: result.duration
      });

      incrementUploadCount();
      toast.success('High-quality audio generated successfully!');
      
      // Auto-play the generated audio
      if (audioRef.current) {
        audioRef.current.src = result.url;
        audioRef.current.play();
      }
    } catch (error) {
      console.error('Full generation error:', error);
      toast.error('Failed to generate audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Apply generated audio to canvas
  const applyToCanvas = () => {
    if (!generatedAudio) {
      toast.error('Please generate audio first');
      return;
    }
    
    // This would integrate with canvas audio system
    toast.info('Audio settings applied to canvas');
    // TODO: Implement actual canvas audio parameter sync
  };

  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl">
              <ImageIcon size={24} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              Upload & Sonify Image
            </h1>
          </div>
          <p className="text-white/60">
            Transform any image into sound using advanced color-to-frequency mapping
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-white/5 rounded-xl p-1 border border-white/10">
            <button
              onClick={() => setSonificationMode('timeline')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                sonificationMode === 'timeline'
                  ? 'bg-indigo-500 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Music size={16} className="inline mr-2" />
              Timeline Mode
            </button>
            <button
              onClick={() => setSonificationMode('colorfield')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                sonificationMode === 'colorfield'
                  ? 'bg-indigo-500 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Zap size={16} className="inline mr-2" />
              Color Field Mode
            </button>
          </div>
        </div>

        {/* Upload Area */}
        {!uploadedImage ? (
          <div
            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
              isDragging
                ? 'border-indigo-400 bg-indigo-500/10'
                : 'border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/10'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <Upload size={48} className="mx-auto mb-4 text-white/40" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Drop your image here
            </h3>
            <p className="text-white/60 mb-4">
              or click to browse (JPG, PNG, WEBP • Max 8MB)
            </p>
            <button className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors">
              Choose File
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">
                    {uploadedImage.name}
                  </h3>
                  <p className="text-sm text-white/40">
                    {(uploadedImage.size / 1024 / 1024).toFixed(2)} MB • {uploadedImage.type}
                  </p>
                </div>
                <button
                  onClick={removeImage}
                  className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex justify-center">
                <img
                  src={uploadedImage.url}
                  alt="Uploaded"
                  className="max-h-96 max-w-full rounded-lg shadow-2xl"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={generateQuickPreview}
                disabled={isPreviewPlaying}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPreviewPlaying ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Play size={20} />
                )}
                Quick Preview
              </button>
              
              <button
                onClick={generateFullAudio}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isProcessing ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Download size={20} />
                )}
                Generate Full Audio
              </button>
              
              {generatedAudio && (
                <button
                  onClick={applyToCanvas}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all"
                >
                  <Settings size={20} />
                  Apply to Canvas
                </button>
              )}
            </div>

            {/* Generated Audio Player */}
            {generatedAudio && (
              <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">Generated Audio</h3>
                
                <audio
                  ref={audioRef}
                  controls
                  className="w-full mb-4"
                  src={generatedAudio.url}
                >
                  Your browser does not support the audio element.
                </audio>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={generatedAudio.url}
                    download="sonified-image.wav"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                  >
                    <Download size={16} />
                    Download WAV
                  </a>
                  
                  {generatedAudio.midiUrl && (
                    <a
                      href={generatedAudio.midiUrl}
                      download="sonified-image.mid"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                    >
                      <Music size={16} />
                      Download MIDI
                    </a>
                  )}
                </div>
                
                <p className="text-sm text-white/40 mt-3">
                  Duration: {generatedAudio.duration.toFixed(1)}s • Mode: {sonificationMode}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <UpgradeModal
        isOpen={upgradeModal.isOpen}
        onClose={() => setUpgradeModal({ isOpen: false, type: 'upload' })}
        type={upgradeModal.type}
      />
    </>
  );
}
