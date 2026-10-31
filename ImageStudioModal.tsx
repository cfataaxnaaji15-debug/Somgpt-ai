import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Camera,
  Upload,
  Layers,
  Wand2,
  Check,
  Palette,
} from 'lucide-react';
import { AppLanguage, Attachment } from '../types';

interface ImageStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
  onGenerate: (prompt: string, style: string, aspectRatio: string, referenceImage?: Attachment | null) => void;
  initialAttachment?: Attachment | null;
}

export const ImageStudioModal: React.FC<ImageStudioModalProps> = ({
  isOpen,
  onClose,
  language,
  onGenerate,
  initialAttachment = null,
}) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('photorealistic');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [attachment, setAttachment] = useState<Attachment | null>(initialAttachment);

  if (!isOpen) return null;

  const isSomali = language === 'so';

  const styles = [
    { id: 'photorealistic', label: isSomali ? 'Sawir Dhab ah (Realistic)' : 'Photorealistic', icon: '📸' },
    { id: '3d', label: isSomali ? 'Nashqad 3D ah' : '3D Design', icon: '🧊' },
    { id: 'logo', label: isSomali ? 'Logo & Branding' : 'Logo & Brand', icon: '💎' },
    { id: 'cinematic', label: isSomali ? 'Filim & Cinematic' : 'Cinematic', icon: '🎬' },
    { id: 'minimalist', label: isSomali ? 'Minimalist & Modern' : 'Minimalist', icon: '✨' },
    { id: 'anime', label: isSomali ? 'Anime & Cartoon' : 'Anime / Art', icon: '🎨' },
  ];

  const aspectRatios = [
    { id: '1:1', label: '1:1 (Labajibbaar)', desc: 'Square' },
    { id: '16:9', label: '16:9 (Muuqaal Ballaaran)', desc: 'Landscape' },
    { id: '9:16', label: '9:16 (Story / Reel)', desc: 'Portrait' },
    { id: '4:3', label: '4:3 (Dhaqameed)', desc: 'Standard' },
  ];

  const quickPrompts = isSomali
    ? [
        'Naqshadee logo casri ah oo madow iyo dahab ah oo leh calaamadda SG iyo technology background.',
        'Guri raaxo leh oo casri ah oo ku yaalla xeeb qurux badan xilliga qorrax-dhaca (3D photorealistic).',
        'Sawir cajiib ah oo muujinaya magaalada Jigjiga mustaqbalka oo leh gaadiid duulaya iyo dhismayaal futuristic ah.',
        'Hagaaji iftiinka sawirkan, ka dhig mid 3D ah oo tayadiisu aad u sarreyso.',
      ]
    : [
        'Create a modern black and gold SomGPT AI logo with an SG symbol and a professional technology background.',
        'Generate a luxurious modern architectural villa with infinity pool and sunset lighting (photorealistic 3D).',
        'Create a futuristic smart city in Africa with green solar towers and high-speed transit.',
        'Enhance this image lighting, convert to 3D cinematic style, and sharpen all details.',
      ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() && !attachment) return;
    onGenerate(prompt.trim(), selectedStyle, aspectRatio, attachment);
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAttachment({
        id: Math.random().toString(36).slice(2),
        name: file.name,
        mimeType: file.type,
        data: result.split(',')[1],
        previewUrl: result,
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0c121e] border border-cyan-500/30 rounded-3xl shadow-2xl p-5 sm:p-7 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100">
                {attachment
                  ? isSomali ? 'Hagaajinta Sawirka (AI Image Studio)' : 'AI Image Editing Studio'
                  : isSomali ? 'Abuurista Sawirka (AI Image Generator)' : 'AI Image Generation Studio'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {attachment
                  ? isSomali ? 'Beddel asalka, hagaaji iftiinka ama u rog 3D' : 'Change background, enhance lighting, or convert to 3D'
                  : isSomali ? 'Qor waxa aad doonayso in AI-gu kuu sawiro' : 'Describe the exact image you want SomGPT AI to generate'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 text-xs sm:text-sm">
          {/* Reference Image Attachment if any */}
          {attachment ? (
            <div className="p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={attachment.previewUrl}
                  alt="Reference"
                  className="w-14 h-14 rounded-xl object-cover bg-black border border-slate-700"
                />
                <div className="min-w-0">
                  <span className="font-semibold text-slate-200 block truncate">
                    {attachment.name}
                  </span>
                  <span className="text-[11px] text-cyan-400 block">
                    {isSomali ? 'Sawirka tixraaca ee la hagaajinayo' : 'Reference image for editing'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAttachment(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                title="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-dashed border-slate-700 hover:border-cyan-500/50 bg-slate-900/50 hover:bg-slate-900 cursor-pointer text-xs text-slate-400 hover:text-cyan-300 transition-all">
                <Upload className="w-4 h-4" />
                <span>{isSomali ? 'Soo geli sawir aad doonayso inaad hagaajiso (Optional)' : 'Upload image to edit (Optional)'}</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Prompt Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>{isSomali ? 'Sharaxaadda Sawirka (Design Instructions):' : 'Image Description & Instructions:'}</span>
              <span className="text-[10px] text-slate-500 font-normal">
                {isSomali ? 'Faahfaahi midabada, qaabka iyo asalka' : 'Include colors, background, and lighting'}
              </span>
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                attachment
                  ? isSomali
                    ? 'Tusaale: Ka dhig mid casri ah, beddel asalka una yeel qorrax-dhac xeeb ah oo 3D ah...'
                    : 'E.g., Change the background to a sunset beach, improve lighting and make it 3D...'
                  : isSomali
                  ? 'Tusaale: Naqshadee logo casri ah oo madow iyo dahab ah oo leh calaamadda SG...'
                  : 'E.g., Create a modern black and gold SomGPT AI logo with an SG symbol...'
              }
              rows={3}
              className="w-full p-3 rounded-2xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500/70 text-slate-100 placeholder:text-slate-500 focus:outline-none resize-none text-xs sm:text-sm leading-relaxed"
            />
          </div>

          {/* Quick Prompts */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 block">
              {isSomali ? 'Fikrado degdeg ah (Inspirations):' : 'Inspirations & Quick Prompts:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {quickPrompts.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setPrompt(p)}
                  className="p-2 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 text-left text-[11px] text-slate-300 hover:text-cyan-300 transition-colors truncate"
                >
                  "{p}"
                </button>
              ))}
            </div>
          </div>

          {/* Style Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isSomali ? 'Qaabka & Dhadhanka (Visual Style):' : 'Visual Style:'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {styles.map((s) => {
                const isSelected = selectedStyle === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSelectedStyle(s.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span className="truncate">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>{isSomali ? 'Cabirka (Aspect Ratio):' : 'Aspect Ratio:'}</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {aspectRatios.map((ar) => {
                const isSelected = aspectRatio === ar.id;
                return (
                  <button
                    key={ar.id}
                    type="button"
                    onClick={() => setAspectRatio(ar.id)}
                    className={`p-2 rounded-xl border text-center text-xs transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500 text-cyan-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold">{ar.id}</div>
                    <div className="text-[10px] text-slate-500">{ar.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!prompt.trim() && !attachment}
              className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
                prompt.trim() || attachment
                  ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-sky-400 text-slate-950 shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:opacity-95 cursor-pointer'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              <span>
                {attachment
                  ? isSomali ? 'Hagaaji Sawirka Hadda' : 'Edit Image with AI'
                  : isSomali ? 'Abuur Sawirka Hadda' : 'Generate Image Now'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
