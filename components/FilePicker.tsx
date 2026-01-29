
import React from 'react';
import { Upload, Video as VideoIcon, Plus } from 'lucide-react';

interface FilePickerProps {
  onFileSelect: (file: File) => void;
}

const FilePicker: React.FC<FilePickerProps> = ({ onFileSelect }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="w-full max-w-4xl">
      <label className="group relative block w-full aspect-video md:aspect-[21/9] rounded-3xl border-2 border-dashed border-slate-700 hover:border-indigo-500/50 bg-slate-900/50 transition-all cursor-pointer overflow-hidden shadow-2xl">
        <input 
          type="file" 
          accept="video/*" 
          className="hidden" 
          onChange={handleChange} 
        />
        
        {/* Animated background on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
          <div className="relative mb-6">
            <div className="bg-slate-800 p-6 rounded-3xl group-hover:scale-110 transition-transform duration-500 shadow-xl border border-slate-700">
              <Upload className="w-12 h-12 text-indigo-400 group-hover:text-indigo-300" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-indigo-600 p-2 rounded-full border-4 border-slate-900 shadow-lg">
              <Plus className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold mb-2 text-white group-hover:text-indigo-100 transition-colors">
            Select a Video to Trim
          </h3>
          <p className="text-slate-400 text-center max-w-sm">
            Drag and drop or click to browse. Supports MP4, WebM, and most modern video formats.
          </p>
          
          <div className="mt-8 flex gap-3">
            <div className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-400 border border-slate-700">MP4</div>
            <div className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-400 border border-slate-700">MOV</div>
            <div className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-400 border border-slate-700">WEBM</div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default FilePicker;
