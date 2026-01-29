
import React, { useState, useCallback } from 'react';
import { 
  RefreshCw, 
  Monitor,
  Download,
  Scissors
} from 'lucide-react';
import { AppStatus, VideoFile } from './types';
import VideoEditor from './components/VideoEditor';
import FilePicker from './components/FilePicker';

const App: React.FC = () => {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [videoFile, setVideoFile] = useState<VideoFile | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportedUrl, setExportedUrl] = useState<string | null>(null);

  const handleFileSelect = useCallback((file: File) => {
    setStatus(AppStatus.LOADING);
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      setVideoFile({
        file,
        url,
        duration: video.duration,
        width: video.videoWidth,
        height: video.videoHeight
      });
      setStatus(AppStatus.EDITING);
    };
    video.src = url;
  }, []);

  const handleReset = useCallback(() => {
    if (videoFile) URL.revokeObjectURL(videoFile.url);
    if (exportedUrl) URL.revokeObjectURL(exportedUrl);
    setVideoFile(null);
    setExportedUrl(null);
    setExportProgress(0);
    setStatus(AppStatus.IDLE);
  }, [videoFile, exportedUrl]);

  const handleExportStart = useCallback(() => {
    setStatus(AppStatus.EXPORTING);
    setExportProgress(0);
  }, []);

  const handleExportComplete = useCallback((url: string) => {
    setExportedUrl(url);
    setStatus(AppStatus.FINISHED);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8 bg-[#0f172a] text-slate-100">
      {/* Header */}
      <header className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-500/20">
            <Monitor className="text-white w-7 h-7" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Web Video Trimmer
            </h1>
            <p className="text-indigo-400 text-[10px] font-black tracking-[0.2em] uppercase opacity-80">
              Pure Browser Acceleration
            </p>
          </div>
        </div>
        
        {status !== AppStatus.IDLE && (
          <button 
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl glass-morphism hover:bg-white/5 transition-all text-slate-400 hover:text-white border border-white/10"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">New Project</span>
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-6xl flex-1 flex flex-col items-center justify-center">
        {status === AppStatus.IDLE && (
          <FilePicker onFileSelect={handleFileSelect} />
        )}

        {status === AppStatus.LOADING && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 animate-pulse font-medium">Analyzing video metadata...</p>
          </div>
        )}

        {status === AppStatus.EDITING && videoFile && (
          <VideoEditor 
            videoFile={videoFile} 
            onExportStart={handleExportStart}
            onExportComplete={handleExportComplete}
            setExportProgress={setExportProgress}
          />
        )}

        {(status === AppStatus.EXPORTING || status === AppStatus.FINISHED) && (
          <div className="w-full max-w-lg glass-morphism rounded-[2.5rem] p-10 md:p-14 flex flex-col items-center gap-8 shadow-2xl border border-white/5 text-center animate-in zoom-in-95 duration-500">
            <div className="relative w-44 h-44 flex items-center justify-center">
               <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90 overflow-visible">
                 <circle
                   cx="80"
                   cy="80"
                   r="70"
                   stroke="currentColor"
                   strokeWidth="10"
                   fill="transparent"
                   className="text-slate-800/80"
                 />
                 <circle
                   cx="80"
                   cy="80"
                   r="70"
                   stroke="currentColor"
                   strokeWidth="10"
                   fill="transparent"
                   strokeDasharray={440}
                   strokeDashoffset={440 - (440 * (status === AppStatus.FINISHED ? 100 : exportProgress)) / 100}
                   className="text-indigo-500 transition-all duration-300 drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]"
                   strokeLinecap="round"
                 />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-4xl font-black text-white tabular-nums tracking-tighter">
                   {status === AppStatus.FINISHED ? '100%' : `${Math.round(exportProgress)}%`}
                 </span>
                 <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.15em] mt-1">
                   {status === AppStatus.EXPORTING ? 'Rendering' : 'Finished'}
                 </span>
               </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl font-black text-white">
                {status === AppStatus.EXPORTING ? 'Baking Selection' : 'Cut Ready!'}
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
                {status === AppStatus.EXPORTING 
                  ? 'Your GPU is currently encoding the trimmed segment. Do not close this tab.' 
                  : 'Hardware accelerated render complete. Your video remains private on your device.'}
              </p>
            </div>

            {status === AppStatus.FINISHED && exportedUrl && (
              <div className="flex flex-col items-center gap-5 w-full">
                <a 
                  href={exportedUrl} 
                  download={`trimmed_${videoFile?.file.name || 'video'}.webm`}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 px-8 rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/30 transform hover:-translate-y-1 active:scale-95"
                >
                  <Download className="w-6 h-6" />
                  Download WebM Clip
                </a>
                <button 
                  onClick={handleReset}
                  className="text-slate-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest"
                >
                  <Scissors className="w-4 h-4" />
                  Trim another clip
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="mt-12 py-6 text-slate-600 text-xs flex flex-col items-center gap-3 border-t border-white/5 w-full max-w-4xl">
        <div className="flex gap-8 items-center">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="font-bold uppercase tracking-wider">Secure & Private</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
            <span className="font-bold uppercase tracking-wider">GPU Accelerated</span>
          </div>
        </div>
        <p className="font-medium opacity-50">WebCodecs API • Hardware Encoding • Chromium Optimized</p>
      </footer>
    </div>
  );
};

export default App;
