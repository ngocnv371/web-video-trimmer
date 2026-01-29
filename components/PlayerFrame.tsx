
import React from 'react';
import { Play, Pause, Volume2, VolumeX, Zap } from 'lucide-react';
import { formatTime } from '../utils';

interface PlayerFrameProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  url: string;
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  totalDuration: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onExport: () => void;
}

const PlayerFrame: React.FC<PlayerFrameProps> = ({
  videoRef,
  url,
  isPlaying,
  isMuted,
  currentTime,
  totalDuration,
  onTogglePlay,
  onToggleMute,
  onExport
}) => {
  return (
    <div className="relative group w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl border border-white/5">
      <video 
        ref={videoRef}
        src={url}
        className="w-full h-full object-contain"
        muted={isMuted}
        playsInline
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {!isPlaying && (
          <button 
            onClick={onTogglePlay}
            className="bg-white/10 backdrop-blur-md p-8 rounded-full border border-white/20 shadow-2xl transform scale-100 group-hover:scale-110 transition-all active:scale-90 pointer-events-auto"
          >
            <Play className="w-10 h-10 text-white fill-white" />
          </button>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 flex items-center justify-between pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex items-center gap-5">
           <button onClick={onTogglePlay} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors">
             {isPlaying ? <Pause className="text-white w-5 h-5" /> : <Play className="text-white w-5 h-5 fill-white" />}
           </button>
           <button onClick={onToggleMute} className="p-2.5 hover:bg-white/10 rounded-xl transition-colors">
             {isMuted ? <VolumeX className="text-white w-5 h-5" /> : <Volume2 className="text-white w-5 h-5" />}
           </button>
           <div className="flex flex-col">
             <span className="text-white font-mono text-xs font-bold tracking-wider tabular-nums">
               {formatTime(currentTime)}
             </span>
             <span className="text-slate-500 font-mono text-[10px] tracking-tighter tabular-nums">
               TOTAL: {formatTime(totalDuration)}
             </span>
           </div>
        </div>
        
        <button 
          onClick={onExport}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Zap className="w-4 h-4 fill-white" />
          EXPORT CLIP
        </button>
      </div>
    </div>
  );
};

export default PlayerFrame;
