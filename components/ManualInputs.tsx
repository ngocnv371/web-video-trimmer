
import React, { useState, useEffect } from 'react';
import { TrimRange } from '../types';
import { formatTime, parseTime } from '../utils';

interface ManualInputsProps {
  trimRange: TrimRange;
  videoDuration: number;
  onRangeChange: (side: 'start' | 'end', val: number) => void;
}

const ManualInputs: React.FC<ManualInputsProps> = ({ trimRange, videoDuration, onRangeChange }) => {
  const [startInput, setStartInput] = useState(formatTime(trimRange.start));
  const [endInput, setEndInput] = useState(formatTime(trimRange.end));

  useEffect(() => {
    setStartInput(formatTime(trimRange.start));
  }, [trimRange.start]);

  useEffect(() => {
    setEndInput(formatTime(trimRange.end));
  }, [trimRange.end]);

  const handleInput = (side: 'start' | 'end', val: string) => {
    if (side === 'start') setStartInput(val);
    else setEndInput(val);

    const secs = parseTime(val);
    if (secs !== null) {
      if (side === 'start') {
        if (secs < trimRange.end && secs >= 0) {
          onRangeChange('start', secs);
        }
      } else {
        if (secs > trimRange.start && secs <= videoDuration) {
          onRangeChange('end', secs);
        }
      }
    }
  };

  return (
    <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-2xl border border-white/5">
      <div className="flex flex-col items-start px-3">
        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Start</span>
        <input 
          type="text"
          value={startInput}
          onChange={(e) => handleInput('start', e.target.value)}
          className="bg-transparent text-sm font-mono text-indigo-400 font-bold outline-none w-20 border-b border-transparent focus:border-indigo-500/50 transition-all"
          placeholder="0:00.00"
        />
      </div>
      <div className="w-px h-8 bg-white/5" />
      <div className="flex flex-col items-start px-3">
        <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">End</span>
        <input 
          type="text"
          value={endInput}
          onChange={(e) => handleInput('end', e.target.value)}
          className="bg-transparent text-sm font-mono text-indigo-400 font-bold outline-none w-20 border-b border-transparent focus:border-indigo-500/50 transition-all"
          placeholder="0:00.00"
        />
      </div>
    </div>
  );
};

export default ManualInputs;
