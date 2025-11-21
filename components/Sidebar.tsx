import React from 'react';
import { AppState, AspectRatio, PostType } from '../types';

interface SidebarProps {
  state: AppState;
  onChange: (updates: Partial<AppState>) => void;
  onGenerateBackground: () => void;
  onDownload: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ state, onChange, onGenerateBackground, onDownload }) => {
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileType = file.type.startsWith('video') ? 'video' : 'image';
      const url = URL.createObjectURL(file);
      onChange({ uploadedFile: file, uploadedFileUrl: url, uploadedFileType: fileType });
    }
  };

  return (
    <div className="w-full md:w-96 bg-brand-panel border-r border-gray-700 flex flex-col h-full p-6 overflow-y-auto z-20 relative shadow-xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          AInsider
        </h1>
        <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">Creator Studio</p>
      </div>

      <div className="space-y-6 flex-1">
        {/* Content Section */}
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-300 uppercase tracking-wide">Content Details</label>
            
            <input
              type="text"
              placeholder="Post Title"
              value={state.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full bg-brand-dark border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none text-white placeholder-gray-500 transition-all"
            />
            
            <textarea
              placeholder="Short Description"
              value={state.description}
              onChange={(e) => onChange({ description: e.target.value })}
              rows={3}
              className="w-full bg-brand-dark border border-gray-600 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none text-white placeholder-gray-500 transition-all resize-none"
            />
        </div>

        {/* Media Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-300 uppercase tracking-wide mb-2">Upload Media</label>
          <div className="relative group">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center group-hover:border-brand-accent transition-colors bg-brand-dark">
               {state.uploadedFile ? (
                 <span className="text-brand-accent truncate block">{state.uploadedFile.name}</span>
               ) : (
                 <span className="text-gray-400 text-sm">Drop image or video here</span>
               )}
            </div>
          </div>
        </div>

        {/* Format Settings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 uppercase tracking-wide mb-2">Output Type</label>
            <select
              value={state.postType}
              onChange={(e) => onChange({ postType: e.target.value as PostType })}
              className="w-full bg-brand-dark border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-brand-accent outline-none"
            >
              {Object.values(PostType).map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 uppercase tracking-wide mb-2">Aspect Ratio</label>
            <select
              value={state.aspectRatio}
              onChange={(e) => onChange({ aspectRatio: e.target.value as AspectRatio })}
              className="w-full bg-brand-dark border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-brand-accent outline-none"
            >
              {Object.values(AspectRatio).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* AI Section */}
        <div className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow-400">⚡</span>
                <label className="text-sm font-bold text-white">AI Background Style</label>
            </div>
            <textarea
              placeholder="Prompt: e.g., Futuristic cyber city with neon lights, blue and purple theme..."
              value={state.prompt}
              onChange={(e) => onChange({ prompt: e.target.value })}
              rows={3}
              className="w-full bg-brand-dark border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:ring-brand-accent outline-none resize-none mb-3"
            />
            <button
              onClick={onGenerateBackground}
              disabled={state.isGenerating}
              className={`w-full py-2 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2
                ${state.isGenerating 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-purple-900/20'
                }`}
            >
              {state.isGenerating ? 'Dreaming...' : 'Generate Style (Nano Banana)'}
            </button>
        </div>
      </div>

      {/* Footer Action */}
      <div className="pt-6 mt-4 border-t border-gray-700">
        <button
          onClick={onDownload}
          disabled={state.isExporting}
          className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-widest transition-all
            ${state.isExporting
                ? 'bg-gray-700 text-gray-400 animate-pulse'
                : 'bg-brand-accent hover:bg-cyan-400 text-brand-dark shadow-lg shadow-cyan-500/20'
            }`}
        >
          {state.isExporting ? 'Rendering...' : `Export ${state.postType}`}
        </button>
      </div>
    </div>
  );
};
