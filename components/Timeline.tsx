
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TrimRange } from '../types';
import { formatTime } from '../utils';

interface TimelineProps {
  duration: number;
  currentTime: number;
  trimRange: TrimRange;
  onRangeChange: (side: 'start' | 'end', val: number) => void;
  onTimeClick: (time: number) => void;
}

const Timeline: React.FC<TimelineProps> = ({ 
  duration, 
  currentTime, 
  trimRange, 
  onRangeChange, 
  onTimeClick 
}) => {
  const [isHovering, setIsHovering] = useState(false);
  const [hoverTime, setHoverTime] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setHoverTime((x / rect.width) * duration);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    onTimeClick((x / rect.width) * duration);
  };

  return (
    <div className="relative pt-4 pb-2">
      <div 
        className="relative h-20 bg-slate-900/80 rounded-2xl border border-slate-700/50 overflow-hidden cursor-crosshair group/timeline"
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Waveform Visualization */}
        <div className="absolute inset-0 flex items-center justify-between px-1 opacity-20 pointer-events-none">
          {Array.from({ length: 180 }).map((_, i) => (
            <div 
              key={i} 
              className="w-[1.5px] bg-indigo-500 rounded-full transition-all duration-300" 
              style={{ height: `${20 + Math.sin(i * 0.2) * 30 + Math.random() * 40}%` }}
            />
          ))}
        </div>

        {/* Hover Indicator */}
        {isHovering && (
          <div 
            className="absolute top-0 bottom-0 w-px bg-white/40 z-30 pointer-events-none"
            style={{ left: `${(hoverTime / duration) * 100}%` }}
          >
            <div className="absolute top-0 -translate-x-1/2 -translate-y-full bg-slate-800 text-[10px] font-bold text-white px-2 py-1 rounded border border-white/10 mb-1">
              {formatTime(hoverTime)}
            </div>
          </div>
        )}

        {/* Playhead */}
        <div 
          className="absolute top-0 bottom-0 w-0.5 bg-white z-40 shadow-[0_0_15px_white] pointer-events-none"
          style={{ left: `${(currentTime / duration) * 100}%` }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full border-2 border-indigo-600 shadow-lg" />
        </div>

        {/* Selection Mask */}
        <div 
          className="absolute top-0 bottom-0 bg-indigo-500/10 border-x border-indigo-500/50 z-10"
          style={{ 
            left: `${(trimRange.start / duration) * 100}%`,
            right: `${100 - (trimRange.end / duration) * 100}%`
          }}
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -left-1.5 top-0 bottom-0 w-3 bg-indigo-500 rounded-sm shadow-[0_0_10px_rgba(99,102,241,0.5)] flex items-center justify-center">
              <ChevronLeft className="w-3 h-3 text-white" />
            </div>
            <div className="absolute -right-1.5 top-0 bottom-0 w-3 bg-indigo-500 rounded-sm shadow-[0_0_10px_rgba(99,102,241,0.5)] flex items-center justify-center">
              <ChevronRight className="w-3 h-3 text-white" />
            </div>
          </div>
        </div>

        {/* Interactive Sliders */}
        <div className="absolute inset-0 z-50">
          <input 
            type="range"
            min="0"
            max={duration}
            step="0.01"
            value={trimRange.start}
            onChange={(e) => onRangeChange('start', parseFloat(e.target.value))}
            className="absolute top-0 w-full h-1/2 opacity-0 cursor-ew-resize"
          />
          <input 
            type="range"
            min="0"
            max={duration}
            step="0.01"
            value={trimRange.end}
            onChange={(e) => onRangeChange('end', parseFloat(e.target.value))}
            className="absolute bottom-0 w-full h-1/2 opacity-0 cursor-ew-resize"
          />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
