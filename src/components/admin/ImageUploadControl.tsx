import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  X,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Database,
  Cloud,
  FileCheck,
} from 'lucide-react';
import {
  ImagePreset,
  ImageProcessingStats,
  uploadImage,
  validateImageFile,
} from '../../utils/imageConverter';

export interface ImageUploadControlProps {
  label: string;
  description?: string;
  imageUrl: string;
  imageAlt?: string;
  onImageChange: (url: string, alt?: string, stats?: ImageProcessingStats) => void;
  onRemove?: () => void;
  preset: ImagePreset;
  showAltField?: boolean;
  altPlaceholder?: string;
  compact?: boolean;
  aspectRatio?: 'video' | 'square' | 'portrait' | 'og' | 'auto';
  className?: string;
}

export const ImageUploadControl: React.FC<ImageUploadControlProps> = ({
  label,
  description,
  imageUrl,
  imageAlt = '',
  onImageChange,
  onRemove,
  preset,
  showAltField = true,
  altPlaceholder = 'Describe the image for accessibility & SEO...',
  compact = false,
  aspectRatio = 'auto',
  className = '',
}) => {
  const [altText, setAltText] = useState(imageAlt);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [lastStats, setLastStats] = useState<ImageProcessingStats | null>(null);
  const [storageMethod, setStorageMethod] = useState<'firebase_storage' | 'firestore_document' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showDirectUrlInput, setShowDirectUrlInput] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync internal alt text state if prop changes
  React.useEffect(() => {
    setAltText(imageAlt || '');
  }, [imageAlt]);

  const handleAltChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAlt = e.target.value;
    setAltText(newAlt);
    onImageChange(imageUrl, newAlt, lastStats || undefined);
  };

  const processFile = async (file: File) => {
    setError(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingStage('Optimizing & converting to WebP...');

      const result = await uploadImage(file, preset, (stage) => {
        setProcessingStage(stage);
      });

      setLastStats(result.stats);
      setStorageMethod(result.method);
      setIsProcessing(false);

      // Default alt text if none provided
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[_-]/g, ' ')
        .trim();
      const updatedAlt = altText || `${cleanName} - Emkay Visuals`;
      setAltText(updatedAlt);

      onImageChange(result.url, updatedAlt, result.stats);
    } catch (err: any) {
      console.error('Image upload failed:', err);
      setError(err?.message || 'Failed to process image');
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    // reset input so the same file can be re-selected if desired
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemove = () => {
    setAltText('');
    setLastStats(null);
    setStorageMethod(null);
    setError(null);
    if (onRemove) {
      onRemove();
    } else {
      onImageChange('', '', undefined);
    }
  };

  const getAspectClass = () => {
    if (aspectRatio === 'og') return 'aspect-[1200/630]';
    if (aspectRatio === 'video') return 'aspect-video';
    if (aspectRatio === 'square') return 'aspect-square';
    if (aspectRatio === 'portrait') return 'aspect-[3/4]';
    return 'aspect-video sm:aspect-[16/10]';
  };

  const hasImage = Boolean(imageUrl && imageUrl.trim().length > 0);

  return (
    <div
      className={`rounded-2xl border border-white/[0.08] bg-[#080808]/90 p-4 sm:p-5 transition-all duration-200 ${
        isDragging ? 'border-[#D0FF00] bg-[#D0FF00]/5 ring-1 ring-[#D0FF00]/30' : ''
      } ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {/* Header with Label & Preset Badge */}
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div>
          <label className="text-xs sm:text-sm font-semibold text-[#FEFFFC] flex items-center gap-2">
            <ImageIcon className="w-3.5 h-3.5 text-[#D0FF00]" />
            <span>{label}</span>
          </label>
          {description && (
            <p className="text-[11px] sm:text-xs text-white/50 mt-0.5">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-white/60">
            {preset}
          </span>
          <button
            type="button"
            onClick={() => setShowDirectUrlInput(!showDirectUrlInput)}
            className="text-[10px] text-white/40 hover:text-[#D0FF00] underline transition-colors px-1"
          >
            {showDirectUrlInput ? 'Hide URL' : 'Direct URL'}
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-200">Upload Rejected</p>
            <p className="text-[11px] mt-0.5 text-red-300/90">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-200 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Processing State Indicator */}
      {isProcessing && (
        <div className="mb-3 p-3.5 rounded-xl bg-[#D0FF00]/10 border border-[#D0FF00]/30 text-xs text-[#D0FF00] flex items-center gap-3 animate-pulse">
          <RefreshCw className="w-4 h-4 animate-spin text-[#D0FF00] shrink-0" />
          <div>
            <p className="font-bold text-[#D0FF00]">Converting to WebP & Optimizing...</p>
            <p className="text-[11px] text-white/70">{processingStage || 'Processing file...'}</p>
          </div>
        </div>
      )}

      {/* Direct URL Input Toggle */}
      {showDirectUrlInput && (
        <div className="mb-3 p-3 rounded-xl bg-black/60 border border-white/10 flex items-center gap-2">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => onImageChange(e.target.value, altText, lastStats || undefined)}
            placeholder="https://... or /media/:id"
            className="flex-1 bg-transparent text-xs text-white placeholder-white/30 outline-none px-2 py-1 font-mono"
          />
          {hasImage && (
            <button
              type="button"
              onClick={() => onImageChange('', altText, undefined)}
              className="text-xs text-white/50 hover:text-red-400 px-2"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Main Preview / Upload Surface */}
      {hasImage ? (
        <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/60">
          <div className={`w-full ${compact ? 'max-h-48' : 'max-h-72'} ${getAspectClass()} overflow-hidden flex items-center justify-center bg-[#050505]`}>
            <img
              src={imageUrl}
              alt={altText || label}
              width="800"
              height="600"
              loading="lazy"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
              }}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Quick Action Overlay on hover */}
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 p-4 backdrop-blur-xs">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-[#D0FF00] text-[#050505] text-xs font-bold flex items-center gap-1.5 shadow-lg hover:scale-105 transition-transform active:scale-95 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace Image</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3.5 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg hover:scale-105 transition-transform active:scale-95 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>

          {/* Bottom badge with URL and WebP indicator */}
          <div className="px-3 py-2 bg-black/85 border-t border-white/10 flex items-center justify-between gap-2 text-[11px]">
            <span className="truncate text-white/50 font-mono text-[10px] max-w-[200px] sm:max-w-xs">
              {imageUrl}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-[#D0FF00] hover:underline font-medium cursor-pointer"
              >
                Replace
              </button>
              <span className="text-white/20">|</span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs text-red-400 hover:text-red-300 font-medium cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Empty Upload Dropzone */
        <div
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl border-2 border-dashed border-white/15 hover:border-[#D0FF00]/60 bg-white/[0.02] hover:bg-white/[0.04] p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/[0.05] group-hover:bg-[#D0FF00]/10 border border-white/10 group-hover:border-[#D0FF00]/40 flex items-center justify-center mb-3 transition-colors">
            <UploadCloud className="w-6 h-6 text-white/60 group-hover:text-[#D0FF00] transition-colors" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-white/90 group-hover:text-[#FEFFFC]">
            Click to upload or drag & drop image
          </p>
          <p className="text-[11px] text-white/40 mt-1">
            Auto-converted to <span className="text-[#D0FF00] font-semibold">WebP (quality 0.8)</span> • Max 15 MB
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[10px] text-white/60 font-medium">
            <FileCheck className="w-3 h-3 text-[#D0FF00]" />
            Target: {preset} preset
          </span>
        </div>
      )}

      {/* WebP Compression Stats & Storage Method Report */}
      {lastStats && (
        <div className="mt-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 text-[11px] text-white/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#D0FF00] shrink-0" />
            <span>
              <strong className="text-[#FEFFFC]">Original:</strong> {lastStats.originalSizeFormatted} →{' '}
              <strong className="text-[#D0FF00]">WebP:</strong> {lastStats.newSizeFormatted} ({lastStats.compressionRatio})
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[10px]">
            {storageMethod === 'firebase_storage' ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#8116E0]/20 border border-[#8116E0]/40 text-[#FEFFFC] font-medium">
                <Cloud className="w-3 h-3 text-[#D0FF00]" />
                Firebase Storage (Public URL)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#D0FF00]/10 border border-[#D0FF00]/30 text-[#D0FF00] font-medium">
                <Database className="w-3 h-3 text-[#D0FF00]" />
                Firestore Media Doc (&lt;700KB, /media/:id)
              </span>
            )}
          </div>
        </div>
      )}

      {/* Alt Text Field */}
      {showAltField && (
        <div className="mt-3.5">
          <label className="block text-[11px] font-semibold text-white/70 mb-1">
            Alt Text (Accessibility & SEO)
          </label>
          <input
            type="text"
            value={altText}
            onChange={handleAltChange}
            placeholder={altPlaceholder}
            className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/10 focus:border-[#D0FF00]/50 text-xs text-white placeholder-white/30 outline-none transition-colors"
          />
        </div>
      )}
    </div>
  );
};
