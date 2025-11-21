
import React, { useState, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { EditorPanel } from './components/EditorPanel';
import { CanvasPreview } from './components/CanvasPreview';
import { AIStudioModal } from './components/AIStudioModal';
import { AppState, AspectRatio, PostType } from './types';
import { generateBackgroundStyle } from './services/geminiService';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAIStudioOpen, setIsAIStudioOpen] = useState(false);
  
  const [state, setState] = useState<AppState>({
    title: 'Google Gemini 3 Pro',
    description: 'Experience the next generation of AI with Vibe Coding capabilities.',
    prompt: 'Abstract dark tech background with subtle constellation patterns',
    aspectRatio: AspectRatio.RATIO_4_5,
    postType: PostType.IMAGE,
    uploadedFile: null,
    uploadedFileUrl: null,
    uploadedFileType: null,
    generatedBackground: null,
    isGenerating: false,
    isExporting: false,
    
    // Style Defaults
    backgroundColor: '#0f172a',
    titleColor: '#ffffff',
    textColor: '#e2e8f0',
    
    titleFontSize: 80,
    titleOffsetX: 0,
    titleOffsetY: 0,

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

  const handleGenerateBackground = async () => {
    handleStateChange({ isGenerating: true });
    try {
      // Use current prompt or fallback to title
      const promptToUse = state.prompt || state.title;
      const bgUrl = await generateBackgroundStyle(promptToUse, state.title, state.aspectRatio);
      handleStateChange({ generatedBackground: bgUrl, isGenerating: false });
    } catch (error) {
      console.error("Failed to generate background", error);
      handleStateChange({ isGenerating: false });
      alert("Failed to generate background. Check console for API errors.");
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
      
      const videoEl = document.querySelector('video');
      if (videoEl) {
          videoEl.currentTime = 0;
          videoEl.play();
      }

      setTimeout(() => {
        mediaRecorder.stop();
      }, 5000); // 5 second clip
    }
  };

  return (
    <div className="flex h-screen w-screen bg-brand-dark overflow-hidden font-sans text-white selection:bg-brand-accent selection:text-black">
      
      {/* Left Sidebar (Content) */}
      <Sidebar 
        state={state} 
        onChange={handleStateChange} 
        onGenerateBackground={handleGenerateBackground}
        onDownload={handleDownload}
      />

      {/* Main Center Area */}
      <div className="flex-1 flex flex-col h-full relative min-w-0">
        {/* Top Bar */}
        <div className="h-14 shrink-0 bg-brand-dark border-b border-gray-800 flex items-center justify-between px-6 z-10">
             <div className="text-sm text-gray-500">Canvas Preview</div>
             <button 
                onClick={() => setIsAIStudioOpen(true)}
                className="flex items-center gap-2 text-gray-300 hover:text-brand-accent transition-colors text-sm font-semibold"
             >
                <span>AI Studio Tools</span>
                <span className="bg-gray-800 px-2 py-0.5 rounded text-xs border border-gray-700">Beta</span>
             </button>
        </div>

        {/* Canvas Preview */}
        <CanvasPreview state={state} canvasRef={canvasRef} />
      </div>

      {/* Right Sidebar (Editor/Style) */}
      <EditorPanel state={state} onChange={handleStateChange} />

      <AIStudioModal isOpen={isAIStudioOpen} onClose={() => setIsAIStudioOpen(false)} />
    </div>
  );
};

export default App;
