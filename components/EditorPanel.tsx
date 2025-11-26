
import React from 'react';
import { AppState, FONT_OPTIONS } from '../types';

interface EditorPanelProps {
  state: AppState;
  onChange: (updates: Partial<AppState>) => void;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ state, onChange }) => {
  return (
    <div className="w-full md:w-80 bg-white dark:bg-slate-900 border-l border-gray-200 dark:border-gray-800 flex flex-col h-full overflow-y-auto z-20 shadow-xl custom-scrollbar transition-colors duration-300">
      <div className="p-5 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Design Editor</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Customize layout & appearance</p>
      </div>

      <div className="p-5 space-y-8 pb-20">
        
        {/* Colors */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-brand-accent uppercase tracking-wider">Colors</h3>
            
            <div className="flex items-center justify-between">
                <label className="text-sm text-slate-700 dark:text-gray-300">Background</label>
                <div className="flex items-center gap-2">
                    <input 
                        type="color" 
                        value={state.backgroundColor}
                        onChange={(e) => onChange({ backgroundColor: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer border-none p-0 bg-transparent"
                    />
                </div>
            </div>
            
            <div className="flex items-center justify-between">
                <label className="text-sm text-slate-700 dark:text-gray-300">Title</label>
                <input 
                    type="color" 
                    value={state.titleColor}
                    onChange={(e) => onChange({ titleColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-none p-0 bg-transparent"
                />
            </div>

            <div className="flex items-center justify-between">
                <label className="text-sm text-slate-700 dark:text-gray-300">Description</label>
                <input 
                    type="color" 
                    value={state.textColor}
                    onChange={(e) => onChange({ textColor: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-none p-0 bg-transparent"
                />
            </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Media Layout */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-brand-accent uppercase tracking-wider">Media Layout</h3>
            
            <div>
                <div className="flex justify-between mb-1">
                    <label className="text-sm text-slate-700 dark:text-gray-300">Scale</label>
                    <span className="text-xs text-gray-500">{state.mediaScale.toFixed(1)}x</span>
                </div>
                <input 
                    type="range" 
                    min="0.5" 
                    max="2.0" 
                    step="0.1"
                    value={state.mediaScale}
                    onChange={(e) => onChange({ mediaScale: Number(e.target.value) })}
                    className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
            </div>

            <div>
                <div className="flex justify-between mb-1">
                    <label className="text-sm text-slate-700 dark:text-gray-300">Vertical Shift</label>
                    <span className="text-xs text-gray-500">{state.mediaOffsetY}px</span>
                </div>
                <input 
                    type="range" 
                    min="-500" 
                    max="500" 
                    value={state.mediaOffsetY}
                    onChange={(e) => onChange({ mediaOffsetY: Number(e.target.value) })}
                    className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
            </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Title Settings */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-brand-accent uppercase tracking-wider">Title Settings</h3>
            
            <div>
                <label className="text-sm text-slate-700 dark:text-gray-300 block mb-2">Typography</label>
                <select 
                    value={state.titleFont}
                    onChange={(e) => onChange({ titleFont: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-brand-accent outline-none"
                >
                    {FONT_OPTIONS.map(font => (
                        <option key={font.value} value={font.value}>{font.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <div className="flex justify-between mb-1">
                    <label className="text-sm text-slate-700 dark:text-gray-300">Font Size</label>
                    <span className="text-xs text-gray-500">{state.titleFontSize}px</span>
                </div>
                <input 
                    type="range" 
                    min="40" 
                    max="150" 
                    value={state.titleFontSize}
                    onChange={(e) => onChange({ titleFontSize: Number(e.target.value) })}
                    className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
               <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Horiz. Pos</label>
                  <input 
                      type="range" 
                      min="-400" 
                      max="400" 
                      value={state.titleOffsetX}
                      onChange={(e) => onChange({ titleOffsetX: Number(e.target.value) })}
                      className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                  />
               </div>
               <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Vert. Pos</label>
                  <input 
                      type="range" 
                      min="-400" 
                      max="400" 
                      value={state.titleOffsetY}
                      onChange={(e) => onChange({ titleOffsetY: Number(e.target.value) })}
                      className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                  />
               </div>
            </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

        {/* Description Settings */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-brand-accent uppercase tracking-wider">Description Settings</h3>
            
             <div>
                <label className="text-sm text-slate-700 dark:text-gray-300 block mb-2">Typography</label>
                <select 
                    value={state.descriptionFont}
                    onChange={(e) => onChange({ descriptionFont: e.target.value })}
                    className="w-full bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-white focus:ring-brand-accent outline-none"
                >
                    {FONT_OPTIONS.map(font => (
                        <option key={font.value} value={font.value}>{font.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <div className="flex justify-between mb-1">
                    <label className="text-sm text-slate-700 dark:text-gray-300">Font Size</label>
                    <span className="text-xs text-gray-500">{state.descriptionFontSize}px</span>
                </div>
                <input 
                    type="range" 
                    min="20" 
                    max="80" 
                    value={state.descriptionFontSize}
                    onChange={(e) => onChange({ descriptionFontSize: Number(e.target.value) })}
                    className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
            </div>

            <div className="grid grid-cols-2 gap-2">
               <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Horiz. Pos</label>
                  <input 
                      type="range" 
                      min="-400" 
                      max="400" 
                      value={state.descriptionOffsetX}
                      onChange={(e) => onChange({ descriptionOffsetX: Number(e.target.value) })}
                      className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                  />
               </div>
               <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 block mb-1">Vert. Pos</label>
                  <input 
                      type="range" 
                      min="-400" 
                      max="400" 
                      value={state.descriptionOffsetY}
                      onChange={(e) => onChange({ descriptionOffsetY: Number(e.target.value) })}
                      className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-accent"
                  />
               </div>
            </div>
        </div>

        <hr className="border-gray-200 dark:border-gray-700" />

         {/* Global Padding */}
         <div>
            <div className="flex justify-between mb-1">
                <label className="text-sm text-slate-700 dark:text-gray-300">Safe Zone Padding</label>
                <span className="text-xs text-gray-500">{state.contentPadding}px</span>
            </div>
            <input 
                type="range" 
                min="20" 
                max="200" 
                value={state.contentPadding}
                onChange={(e) => onChange({ contentPadding: Number(e.target.value) })}
                className="w-full h-1 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-brand-accent"
            />
        </div>

      </div>
    </div>
  );
};