
import React, { useState, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { EditorPanel } from './components/EditorPanel';
import { CaptionPanel } from './components/CaptionPanel';
import { CanvasPreview } from './components/CanvasPreview';
import { AIStudioModal } from './components/AIStudioModal';
import { AppState, AspectRatio, PostType } from './types';
import { generateBackgroundStyle, generateSocialCaption, refineDescription } from './services/geminiService';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAIStudioOpen, setIsAIStudioOpen] = useState(false);
  
  const [state, setState] = useState<AppState>({
    themeMode: 'dark',

    title: 'Google Gemini 3 Pro',
    description: 'Experience the next generation of AI with Vibe Coding capabilities.',
    prompt: 'Abstract dark tech background with subtle constellation patterns',
    aspectRatio: AspectRatio.RATIO_4_5,
    postType: PostType.IMAGE,
    
    generatedCaption: '',

    uploadedFile: null,
    uploadedFileUrl: null,
    uploadedFileType: null,

    coverFile: null,
    coverFileUrl: null,
    coverFileType: null,

    generatedBackground: null,
    isGenerating: false,
    isGeneratingCaption: false,
    isOptimizingDescription: false,
    isExporting: false,
    
    // Style Defaults
    backgroundColor: '#0f172a',
    titleColor: '#ffffff',
    textColor: '#e2e8f0',
    
    titleFont: 'Inter',
    titleFontSize: 80,
    titleOffsetX: 0,
    titleOffsetY: 0,

    descriptionFont: 'Inter',
    descriptionFontSize: 40,
    descriptionOffsetX: 0,
    descriptionOffsetY: 0,

    mediaScale: 1.0,
    mediaOffsetY: 0,
    contentPadding: 80,
  });

  const handleStateChange = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const toggleTheme = () => {
    handleStateChange({ themeMode: state.themeMode === 'dark' ? 'light' : 'dark' });
  };

  const handleGenerateBackground = async () => {
    handleStateChange({ isGenerating: true });
    try {
      const promptToUse = state.prompt || state.title;
      const bgUrl = await generateBackgroundStyle(promptToUse, state.title, state.aspectRatio);
      handleStateChange({ generatedBackground: bgUrl, isGenerating: false });
    } catch (error) {
      console.error("Failed to generate background", error);
      handleStateChange({ isGenerating: false });
      alert("Failed to generate background. Check console for API errors.");
    }
  };

  const handleGenerateCaption = async () => {
    handleStateChange({ isGeneratingCaption: true });
    try {
      const caption = await generateSocialCaption(state.title, state.description);
      handleStateChange({ generatedCaption: caption || '', isGeneratingCaption: false });
    } catch (error) {
      console.error("Failed to generate caption", error);
      handleStateChange({ isGeneratingCaption: false });
    }
  };

  const handleOptimizeDescription = async () => {
    handleStateChange({ isOptimizingDescription: true });
    try {
      const optimized = await refineDescription(state.description, state.title);
      if (optimized) {
        handleStateChange({ description: optimized.trim() });
      }
      handleStateChange({ isOptimizingDescription: false });
    } catch (error) {
      console.error("Failed to optimize description", error);
      handleStateChange({ isOptimizingDescription: false });
    }
  };

  const handleDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handleStateChange({ isExporting: true });

    if (state.postType === PostType.IMAGE) {
      const link = document.createElement('a');
      link.download = `ainsider-post-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
      handleStateChange({ isExporting: false });
    } else {
      const stream = canvas.captureStream(30);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9'
      });

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ainsider-video-${Date.now()}.webm`;
        link.click();
        handleStateChange({ isExporting: false });
      };

      mediaRecorder.start();
      const videos = document.querySelectorAll('video');
      videos.forEach(v => {
          v.currentTime = 0;
          v.play();
      });

      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000);
    }
  };

  return (
    <div className={state.themeMode}>
      <div className="flex h-screen w-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-brand-accent selection:text-black transition-colors duration-300">
        
        {/* Left Sidebar */}
        <Sidebar 
          state={state} 
          onChange={handleStateChange} 
          onGenerateBackground={handleGenerateBackground}
          onDownload={handleDownload}
          onOptimizeDescription={handleOptimizeDescription}
        />

        {/* Main Center Area */}
        <div className="flex-1 flex flex-col h-full relative min-w-0 bg-gray-100 dark:bg-black/20">
          {/* Top Bar */}
          <div className="h-14 shrink-0 bg-white dark:bg-slate-950 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 z-10 transition-colors duration-300">
               <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">Canvas Preview</div>
               
               <div className="flex items-center gap-4">
                 <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 transition-colors"
                    title="Toggle Theme"
                 >
                    {state.themeMode === 'dark' ? '☀️' : '🌙'}
                 </button>
                 
                 <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>

                 <button 
                    onClick={() => setIsAIStudioOpen(true)}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-brand-accent transition-colors text-sm font-semibold"
                 >
                    <span>AI Studio Tools</span>
                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs border border-gray-200 dark:border-gray-700">Beta</span>
                 </button>
               </div>
          </div>

          {/* Workspace */}
          <div className="flex-1 flex overflow-hidden">
              <CaptionPanel 
                  state={state}
                  onChange={handleStateChange}
                  onGenerateCaption={handleGenerateCaption}
              />
              <CanvasPreview state={state} canvasRef={canvasRef} />
          </div>
        </div>

        {/* Right Sidebar */}
        <EditorPanel state={state} onChange={handleStateChange} />

        <AIStudioModal isOpen={isAIStudioOpen} onClose={() => setIsAIStudioOpen(false)} />
      </div>
    </div>
  );
};

export default App;