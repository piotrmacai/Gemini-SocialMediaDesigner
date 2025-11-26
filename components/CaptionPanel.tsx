
import React from 'react';
import { AppState } from '../types';

interface CaptionPanelProps {
  state: AppState;
  onChange: (updates: Partial<AppState>) => void;
  onGenerateCaption: () => void;
}

export const CaptionPanel: React.FC<CaptionPanelProps> = ({ state, onChange, onGenerateCaption }) => {
  
  const handleCopy = () => {
    if (state.generatedCaption) {
      navigator.clipboard.writeText(state.generatedCaption);
    }
  };

  return (
    <div className="w-80 flex-shrink-0 bg-white dark:bg-slate-950/50 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full overflow-hidden transition-colors duration-300">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-slate-900">
        <h3 className="text-sm font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wide">Social Copy</h3>
        <p className="text-xs text-gray-500 mt-1">Generated caption & hashtags</p>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-4">
         <div className="flex-1 relative">
            <textarea
                value={state.generatedCaption}
                onChange={(e) => onChange({ generatedCaption: e.target.value })}
                placeholder="Your generated social media caption will appear here..."
                className="w-full h-full bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-gray-700 rounded-lg p-4 text-sm text-slate-900 dark:text-gray-300 focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none resize-none custom-scrollbar leading-relaxed transition-colors"
            />
            {!state.generatedCaption && !state.isGeneratingCaption && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-gray-400 dark:text-gray-600">
                    <span className="text-2xl mb-2">✍️</span>
                    <span className="text-xs text-center px-8">Use AI to generate the perfect caption based on your design.</span>
                </div>
            )}
         </div>
         
         <div className="flex flex-col gap-2">
            <button
                onClick={onGenerateCaption}
                disabled={state.isGeneratingCaption}
                className={`w-full py-3 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 shadow-lg
                    ${state.isGeneratingCaption
                        ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                        : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white'
                    }`}
            >
                {state.isGeneratingCaption ? (
                    <>
                      <span className="animate-spin">⚙️</span> Writing...
                    </>
                ) : (
                    <>
                      <span>✨</span> Generate Caption
                    </>
                )}
            </button>
            
            {state.generatedCaption && (
                <button
                    onClick={handleCopy}
                    className="w-full py-2.5 rounded-lg font-medium text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-slate-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 transition-all"
                >
                    Copy to Clipboard
                </button>
            )}
         </div>
      </div>
    </div>
  );
};