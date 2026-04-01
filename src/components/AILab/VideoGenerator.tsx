import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Video as VideoIcon,
  Upload,
  Loader2,
  Download,
  Box,
  MonitorPlay,
  Camera,
  Search,
  CheckCircle2,
  X,
  Clapperboard,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { generateListingVideo, type MotionStyle, type Duration } from '../../lib/falai';

const STYLE_OPTIONS: Array<{
  id: MotionStyle
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}> = [
  {
    id: 'drone',
    label: 'Aerial Drone',
    icon: Box,
    description: 'Cinematic sweeping exterior',
  },
  {
    id: 'cinematic_pan',
    label: 'Interior Pan',
    icon: MonitorPlay,
    description: 'Smooth property walk-through',
  },
  {
    id: 'slow_zoom',
    label: 'Slow Reveal',
    icon: Search,
    description: 'Detailed focal point zoom',
  },
]

const VideoGenerator: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [motionStyle, setMotionStyle] = useState<MotionStyle>('drone');
  const [duration, setDuration] = useState<Duration>('5');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setVideoUrl(null);
      setError(null);
    } else {
      toast.error('Supported formats: JPG, PNG');
    }
  }, [imagePreview]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleGenerate = useCallback(async () => {
    if (!selectedImage) {
      toast.error('Source image required');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      const base64Image = await convertToBase64(selectedImage);
      const url = await generateListingVideo(base64Image, motionStyle, duration);
      setVideoUrl(url);
      toast.success('Production complete');
    } catch (err: any) {
      const msg = err.message || 'Video production failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  }, [selectedImage, motionStyle, duration]);


  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Left: Configuration */}
        <div className="space-y-8">
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <header className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                 <Camera size={20} className="text-indigo-400" />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-white tracking-tight">Source Media</h3>
                 <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">Base Asset Upload</p>
               </div>
            </header>

            <div
              onClick={() => fileInputRef.current?.click()}
              className={`relative border border-white/10 rounded-2xl p-4 transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[240px] ${imagePreview ? 'bg-indigo-500/5 border-indigo-500/20' : 'bg-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
            >
              {imagePreview ? (
                <div className="w-full h-full relative group">
                  <img
                    src={imagePreview}
                    alt="Source"
                    className="w-full h-48 object-cover rounded-xl shadow-lg border border-white/5"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl font-bold text-white text-xs uppercase tracking-widest">
                    Replace Asset
                  </div>
                </div>
              ) : (
                <div className="text-center group">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-4 transition-all group-hover:bg-indigo-500/20 mx-auto">
                    <Upload size={24} className="text-white/20 group-hover:text-indigo-400" />
                  </div>
                  <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Import Property Photo</p>
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/png"
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] ml-1">Cinematic Movement</label>
            <div className="grid grid-cols-1 gap-3">
              {STYLE_OPTIONS.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setMotionStyle(style.id)}
                  className={`flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group ${motionStyle === style.id
                    ? 'bg-indigo-500/10 border-indigo-500/30'
                    : 'bg-white/5 border-white/5 hover:border-white/10'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    motionStyle === style.id ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-800 text-white/40'
                  }`}>
                    <style.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${motionStyle === style.id ? 'text-white' : 'text-white/70'}`}>
                      {style.label}
                    </p>
                    <p className="text-[10px] text-white/30 font-medium tracking-wide mt-0.5">{style.description}</p>
                  </div>
                  {motionStyle === style.id && (
                    <div className="ml-auto">
                      <CheckCircle2 size={18} className="text-indigo-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[10px] font-black uppercase text-white/40 tracking-widest">Production Duration</h3>
              <div className="flex bg-slate-950 p-1.5 rounded-xl border border-white/5">
                {(['5', '10'] as Duration[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${duration === d
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'text-white/20 hover:text-white/40'
                      }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedImage}
            className={`w-full py-5 rounded-2xl font-bold uppercase tracking-widest transition-all overflow-hidden relative group shadow-2xl ${isGenerating || !selectedImage
              ? 'bg-slate-900 border border-white/5 text-white/20 cursor-not-allowed'
              : 'bg-indigo-600 text-white hover:bg-slate-950 hover:border-indigo-600 border border-transparent active:scale-[0.98]'
              }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isGenerating ? (
                <>
                  <Loader2 size={24} className="animate-spin text-white/40" />
                  Processing Video...
                </>
              ) : (
                <>
                  <Clapperboard size={20} />
                  Process Video
                </>
              )}
            </span>
          </button>
        </div>

        {/* Right: Production Viewport */}
        <div className="flex flex-col h-full">
          <div className="bg-slate-900 border border-white/10 rounded-[2.5rem] overflow-hidden flex-1 min-h-[500px] flex flex-col relative shadow-2xl">

            <div className="absolute top-8 left-8 z-10">
              <div className="px-4 py-2 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-2 shadow-lg">
                <VideoIcon size={14} className="text-white/40" />
                <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Export Target: 9:16 Vertical</span>
              </div>
            </div>

            {isGenerating && (
              <div className="absolute inset-0 z-20 bg-slate-950/95 flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
                <div className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mb-10" />
                <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Production in Progress</h4>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">Processing cinematic frames & movement...</p>
              </div>
            )}

            {!isGenerating && !videoUrl && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mb-6">
                  <MonitorPlay size={36} className="text-white/10" />
                </div>
                <h4 className="text-lg font-semibold text-white/20 lowercase tracking-tight">awaiting production</h4>
              </div>
            )}

            {error && !isGenerating && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 border border-rose-500/20">
                  <X size={28} className="text-rose-400" />
                </div>
                <h4 className="text-xl font-bold text-rose-400 mb-2">Production Failed</h4>
                <p className="text-white/30 text-xs font-bold uppercase tracking-widest mb-8">{error}</p>
                <button
                  onClick={handleGenerate}
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Retry Production
                </button>
              </div>
            )}

            <AnimatePresence>
              {videoUrl && !isGenerating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col h-full"
                >
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="flex-1 w-full h-full object-cover"
                  />
                  <div className="p-8 bg-slate-950 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-black text-white/80 uppercase tracking-widest">Asset Ready</p>
                      <p className="text-[9px] text-white/20 font-bold uppercase tracking-widest mt-1">{duration}s Cinema • MP4 Export</p>
                    </div>
                    <a
                      href={videoUrl}
                      download="listing-video.mp4"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-white text-slate-950 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-all shadow-xl"
                    >
                      <Download size={16} />
                      Export MP4
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoGenerator;

