import React, { useState, useRef } from 'react';
import { 
  Video, 
  Upload, 
  Play, 
  Loader2, 
  Download, 
  Zap, 
  Box,
  MonitorPlay,
  Camera,
  Search,
  CheckCircle2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { generateListingVideo, type MotionStyle, type Duration } from '../../lib/falai';

const VideoGenerator: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [motionStyle, setMotionStyle] = useState<MotionStyle>('drone');
  const [duration, setDuration] = useState<Duration>('5');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setVideoUrl(null);
      setError(null);
    } else {
      toast.error('Please upload a valid JPG or PNG image');
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleGenerate = async () => {
    if (!selectedImage) {
      toast.error('Please upload an image first');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      const base64Image = await convertToBase64(selectedImage);
      const url = await generateListingVideo(base64Image, motionStyle, duration);
      setVideoUrl(url);
      toast.success('Video generated successfully!');
    } catch (err: any) {
      const msg = err.message || 'Failed to generate video';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsGenerating(false);
    }
  };

  const costEstimate = duration === '5' ? '$0.35' : '$0.70';

  const styles = [
    { 
      id: 'drone' as MotionStyle, 
      label: 'Drone Reveal', 
      icon: <Box className="w-6 h-6" />, 
      description: 'Cinematic aerial sweeping shot' 
    },
    { 
      id: 'cinematic_pan' as MotionStyle, 
      label: 'Cinematic Pan', 
      icon: <MonitorPlay className="w-6 h-6" />, 
      description: 'Smooth indoor walking motion' 
    },
    { 
      id: 'slow_zoom' as MotionStyle, 
      label: 'Slow Zoom', 
      icon: <Search className="w-6 h-6" />, 
      description: 'Dramatic pull-back reveal' 
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Input Selection */}
        <div className="space-y-6">
          <div className="bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 border border-white/5 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Camera size={20} className="text-indigo-400" />
              1. Upload High-Res Image
            </h3>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-2xl p-4 transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[240px] ${
                imagePreview ? 'border-indigo-500/40' : 'border-white/10 hover:border-indigo-500/40 hover:bg-white/5'
              }`}
            >
              {imagePreview ? (
                <div className="w-full h-full relative group">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-xl shadow-lg" 
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <p className="text-white text-sm font-medium">Change Image</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                    <Upload size={28} className="text-indigo-400" />
                  </div>
                  <p className="text-white/60 text-sm mb-1 font-medium">Click or drag to upload</p>
                  <p className="text-white/30 text-xs uppercase tracking-widest font-bold">JPG / PNG only</p>
                </>
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
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Play size={20} className="text-purple-400" />
              2. Select Transformation
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {styles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setMotionStyle(style.id)}
                  className={`flex items-center gap-4 p-5 rounded-2xl border transition-all text-left group ${
                    motionStyle === style.id 
                      ? 'bg-indigo-500/10 border-indigo-500/40 ring-1 ring-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                      : 'bg-slate-900/40 border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className={`p-3 rounded-xl transition-colors ${
                    motionStyle === style.id ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-white/40 group-hover:text-white/60'
                  }`}>
                    {style.icon}
                  </div>
                  <div>
                    <p className={`font-bold ${motionStyle === style.id ? 'text-white' : 'text-white/60'}`}>
                      {style.label}
                    </p>
                    <p className="text-xs text-white/30 font-medium">{style.description}</p>
                  </div>
                  {motionStyle === style.id && (
                    <div className="ml-auto">
                      <CheckCircle2 size={20} className="text-indigo-400" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-900/40 rounded-3xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black uppercase text-white/40 tracking-widest">Video Duration</h3>
              <div className="flex bg-slate-800 p-1 rounded-xl border border-white/5">
                {(['5', '10'] as Duration[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                      duration === d 
                        ? 'bg-indigo-500 text-white shadow-lg' 
                        : 'text-white/30 hover:text-white/60'
                    }`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/30 font-bold">
              <Zap size={14} className="text-amber-400" />
              Estimated cost: <span className="text-white/60">{costEstimate}</span>
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !selectedImage}
            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all overflow-hidden relative group shadow-2xl ${
              isGenerating || !selectedImage
                ? 'bg-slate-800 text-white/20 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isGenerating ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Generating Video...
                </>
              ) : (
                'Generate Video'
              )}
            </span>
          </button>
        </div>

        {/* Right: Output Preview */}
        <div className="flex flex-col h-full">
          <div className="bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] border border-white/10 overflow-hidden flex-1 min-h-[500px] flex flex-col relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            <div className="absolute top-8 left-8 z-10">
              <div className="px-4 py-2 bg-indigo-500/20 backdrop-blur-md border border-indigo-500/30 rounded-xl flex items-center gap-2 shadow-lg">
                <Video size={16} className="text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">9:16 Reality Vertical</span>
              </div>
            </div>

            {isGenerating && (
              <div className="absolute inset-0 z-20 bg-slate-950/80 backdrop-blur-lg flex flex-col items-center justify-center p-12 text-center animate-in fade-in duration-500">
                <div className="relative w-32 h-32 mb-8">
                  <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-indigo-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-4 bg-indigo-500/10 rounded-full flex items-center justify-center overflow-hidden">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      <Zap size={40} className="text-indigo-400 fill-indigo-400/20" />
                    </motion.div>
                  </div>
                </div>
                <h4 className="text-2xl font-bold text-white mb-4">Rendering Video</h4>
                <p className="text-white/40 max-w-xs text-sm leading-relaxed">This typically takes 60–90 seconds.</p>
              </div>
            )}

            {!isGenerating && !videoUrl && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <MonitorPlay size={40} className="text-white/20" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Ready to Render</h4>
                <p className="text-white/30 text-sm max-w-[240px]">Upload an image and select a style to begin video generation.</p>
              </div>
            )}

            {error && !isGenerating && (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-12 animate-in slide-in-from-bottom duration-500">
                <div className="w-20 h-20 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                  <X size={32} className="text-red-400" />
                </div>
                <h4 className="text-xl font-bold text-red-400 mb-2">Generation Failed</h4>
                <p className="text-white/40 text-sm max-w-sm mb-8">{error}</p>
                <button 
                  onClick={handleGenerate}
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-bold hover:bg-white/10 transition-all"
                >
                  Try Again
                </button>
              </div>
            )}

            <AnimatePresence>
              {videoUrl && !isGenerating && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1 flex flex-col"
                >
                  <video 
                    src={videoUrl} 
                    controls 
                    autoPlay 
                    loop 
                    className="flex-1 w-full h-full object-cover"
                  />
                  <div className="p-6 bg-slate-900 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">Generation Complete</p>
                      <p className="text-[10px] text-white/30 truncate max-w-[200px] font-medium tracking-wide">Video • {duration}s MP4</p>
                    </div>
                    <a 
                      href={videoUrl} 
                      download="listing-video.mp4"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg"
                    >
                      <Download size={18} />
                      Download MP4
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
