import React, { useState } from 'react';
import { X, Download, Edit2, ZoomIn, ZoomOut, Sparkles, Layers } from 'lucide-react';
import { GeneratedImage } from '../types';
import { downloadImage } from '../utils/imageUtils';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: GeneratedImage | null;
  onEditImage?: (image: GeneratedImage) => void;
  language?: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  onClose,
  image,
  onEditImage,
  language = 'so',
}) => {
  const [scale, setScale] = useState(1);
  const [showOriginal, setShowOriginal] = useState(false);

  if (!isOpen || !image) return null;

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 2.5));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.75));

  const displayUrl = showOriginal && image.originalImageUrl ? image.originalImageUrl : image.url;

  const isSomali = language === 'so';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[95vh] bg-[#0c121e] border border-cyan-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#080d16]">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-100 block truncate">
                {image.isEdited
                  ? isSomali ? 'Sawirka AI-ga Lagu Hagaajiyay' : 'AI Edited Image'
                  : isSomali ? 'Sawirka SomGPT AI Abuurtay' : 'SomGPT AI Generated Image'}
              </span>
              <span className="text-[10px] text-slate-400 block truncate max-w-md">
                {image.prompt}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Compare Original Toggle */}
            {image.originalImageUrl && (
              <button
                onClick={() => setShowOriginal(!showOriginal)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  showOriginal
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">
                  {showOriginal
                    ? isSomali ? 'Fiiri Midka Cusub' : 'View Edited'
                    : isSomali ? 'Fiiri Asalka (Original)' : 'Compare Original'}
                </span>
              </button>
            )}

            {/* Zoom Controls */}
            <button
              onClick={handleZoomOut}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Zoom out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomIn}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Zoom in"
            >
              <ZoomIn className="w-4 h-4" />
            </button>

            {/* Download */}
            <button
              onClick={() => downloadImage(image.url, `somgpt-${Date.now()}.png`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-colors shadow-sm"
              title="Download image"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">
                {isSomali ? 'Degso' : 'Download'}
              </span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Image Display Canvas */}
        <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-black/40 min-h-[350px]">
          <div
            className="transition-transform duration-200 origin-center max-w-full max-h-full"
            style={{ transform: `scale(${scale})` }}
          >
            <img
              src={displayUrl}
              alt={image.prompt}
              className="max-h-[70vh] max-w-full rounded-2xl object-contain shadow-2xl border border-slate-800 bg-[#05080f]"
            />
          </div>
        </div>

        {/* Footer with Edit Action */}
        <div className="p-3.5 border-t border-slate-800 bg-[#080d16] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            {image.style && (
              <span className="px-2 py-0.5 rounded-md bg-slate-800 text-[11px] text-cyan-300 border border-slate-700">
                Style: {image.style}
              </span>
            )}
            {image.isEdited && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 text-[11px] text-emerald-300 border border-emerald-500/30">
                {isSomali ? 'La Hagaajiyay' : 'Edited with AI'}
              </span>
            )}
          </div>

          {onEditImage && (
            <button
              onClick={() => {
                onEditImage(image);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-cyan-950/50 hover:border-cyan-500/50 border border-slate-700 text-cyan-300 font-semibold transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isSomali ? 'Hagaaji Sawirkan (Edit)' : 'Edit this image'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
