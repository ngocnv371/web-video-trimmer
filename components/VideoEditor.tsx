
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Scissors, 
  Clock, 
  Monitor, 
  Zap, 
  Settings 
} from 'lucide-react';
import { VideoFile, TrimRange, OutputFormat } from '../types';
import { formatTime } from '../utils';
import PlayerFrame from './PlayerFrame';
import Timeline from './Timeline';
import ManualInputs from './ManualInputs';

interface VideoEditorProps {
  videoFile: VideoFile;
  onExportStart: () => void;
  onExportComplete: (url: string) => void;
  setExportProgress: (progress: number) => void;
}

const VideoEditor: React.FC<VideoEditorProps> = ({ 
  videoFile, 
  onExportStart, 
  onExportComplete, 
  setExportProgress 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [trimRange, setTrimRange] = useState<TrimRange>({ start: 0, end: videoFile.duration });
  const [selectedFormat, setSelectedFormat] = useState<OutputFormat>('video/webm;codecs=vp9');

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  // Sync playback within trim range
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.currentTime >= trimRange.end) {
        video.currentTime = trimRange.start;
        if (!isPlaying) video.pause();
      }
      if (video.currentTime < trimRange.start) {
        video.currentTime = trimRange.start;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [trimRange, isPlaying]);

  const handleRangeChange = (side: 'start' | 'end', val: number) => {
    const newRange = { ...trimRange };
    if (side === 'start') {
      newRange.start = Math.max(0, Math.min(val, trimRange.end - 0.2));
      if (videoRef.current) videoRef.current.currentTime = newRange.start;
    } else {
      newRange.end = Math.min(videoFile.duration, Math.max(val, trimRange.start + 0.2));
      if (videoRef.current) videoRef.current.currentTime = newRange.end - 0.05;
    }
    setTrimRange(newRange);
  };

  const handleTimeClick = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  /**
   * GPU-ACCELERATED EXPORT
   */
  const exportVideo = async () => {
    const video = videoRef.current;
    if (!video) return;

    onExportStart();
    video.pause();
    setIsPlaying(false);

    video.currentTime = trimRange.start;
    await new Promise(r => video.onseeked = r);

    const canvas = document.createElement('canvas');
    canvas.width = videoFile.width;
    canvas.height = videoFile.height;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const audioContext = new AudioContext();
    const source = audioContext.createMediaElementSource(video);
    const destination = audioContext.createMediaStreamDestination();
    source.connect(destination);
    source.connect(audioContext.destination);

    const stream = canvas.captureStream(30); 
    if (destination.stream.getAudioTracks().length > 0) {
      stream.addTrack(destination.stream.getAudioTracks()[0]);
    }

    const recorder = new MediaRecorder(stream, {
      mimeType: selectedFormat,
      videoBitsPerSecond: 8000000 
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: selectedFormat.split(';')[0] });
      onExportComplete(URL.createObjectURL(blob));
      audioContext.close();
    };

    const duration = trimRange.end - trimRange.start;
    let startTime: number | null = null;

    const renderLoop = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = (now - startTime) / 1000;
      const progress = (elapsed / duration) * 100;

      if (elapsed >= duration || video.currentTime >= trimRange.end) {
        recorder.stop();
        video.pause();
        return;
      }

      setExportProgress(Math.min(progress, 99.9));
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Watermark
      const watermarkText = "VIDEO TRIMMER";
      const fontSize = Math.max(16, canvas.height * 0.04);
      ctx.font = `bold ${fontSize}px Inter, sans-serif`;
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillText(watermarkText, canvas.width - (fontSize * 0.8) + 2, canvas.height - (fontSize * 0.8) + 2);
      ctx.fillStyle = "rgba(255,255,255,0.7)";
      ctx.fillText(watermarkText, canvas.width - (fontSize * 0.8), canvas.height - (fontSize * 0.8));
      
      if ('requestVideoFrameCallback' in video) {
        (video as any).requestVideoFrameCallback(() => requestAnimationFrame(renderLoop));
      } else {
        requestAnimationFrame(renderLoop);
      }
    };

    recorder.start();
    video.play();
    requestAnimationFrame(renderLoop);
  };

  return (
    <div className="w-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PlayerFrame 
        videoRef={videoRef}
        url={videoFile.url}
        isPlaying={isPlaying}
        isMuted={isMuted}
        currentTime={currentTime}
        totalDuration={videoFile.duration}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        onExport={exportVideo}
      />

      <div className="glass-morphism rounded-[2rem] p-6 md:p-8 shadow-2xl border border-white/5 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={togglePlay}
              className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all text-indigo-400"
              title="Toggle Playback (Space)"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-indigo-400" />}
            </button>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Timeline Controller</h3>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-6">
            <ManualInputs 
              trimRange={trimRange} 
              videoDuration={videoFile.duration} 
              onRangeChange={handleRangeChange} 
            />

            <div className="flex items-center gap-3 glass-morphism px-4 py-2 rounded-xl border border-white/5">
              <Settings className="w-4 h-4 text-slate-500" />
              <select 
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value as OutputFormat)}
                className="bg-transparent text-xs font-bold text-slate-300 outline-none cursor-pointer hover:text-white"
              >
                <option value="video/webm;codecs=vp9">WebM (VP9)</option>
                <option value="video/webm;codecs=vp8">WebM (VP8)</option>
              </select>
            </div>
            
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-slate-500 uppercase font-black">Selection Duration</span>
              <span className="text-sm font-mono text-white font-bold">{formatTime(trimRange.end - trimRange.start)}</span>
            </div>
          </div>
        </div>

        <Timeline 
          duration={videoFile.duration}
          currentTime={currentTime}
          trimRange={trimRange}
          onRangeChange={handleRangeChange}
          onTimeClick={handleTimeClick}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <Monitor className="w-4 h-4" />, label: "Resolution", val: `${videoFile.width}x${videoFile.height}` },
          { icon: <Zap className="w-4 h-4" />, label: "Codec", val: "Hardware WebM" },
          { icon: <Scissors className="w-4 h-4" />, label: "Precision", val: "Refactored Core" }
        ].map((card, i) => (
          <div key={i} className="glass-morphism rounded-2xl p-4 flex items-center gap-4 border border-white/5">
            <div className="p-2.5 bg-white/5 rounded-xl text-indigo-400">
              {card.icon}
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{card.label}</p>
              <p className="text-sm font-bold text-white">{card.val}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoEditor;
