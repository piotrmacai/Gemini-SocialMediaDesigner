import React, { useState } from 'react';
import { GenerationModel } from '../types';
import { GoogleGenAI } from '@google/genai';

interface AIStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIStudioModal: React.FC<AIStudioModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'image' | 'video'>('image');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      if (mode === 'image') {
          // Image Generation using Nano Banana / Flash Image
          const response = await ai.models.generateContent({
              model: GenerationModel.NANO_BANANA,
              contents: {
                  parts: [{ text: prompt }]
              },
              config: {
                  imageConfig: {
                      imageSize: '1K',
                      aspectRatio: '1:1'
                  }
              }
          });
          
          const parts = response.candidates?.[0]?.content?.parts || [];
          const imagePart = parts.find(p => p.inlineData);
          
          if (imagePart && imagePart.inlineData) {
             setResultUrl(`data:image/png;base64,${imagePart.inlineData.data}`);
          }

      } else {
          // Video Generation using Veo (Simulation of flow)
          // Note: Actual Veo generation is async and long-running. 
          // For this UI demo, we will simulate the start and explain the flow
          // or attempt a call if the key supports it.
          
          // Checking key capability logic would go here.
          // Assuming user has a key that works with Veo:
          
          try {
            let operation = await ai.models.generateVideos({
                model: GenerationModel.VEO_FAST,
                prompt: prompt,
                config: {
                    numberOfVideos: 1,
                    aspectRatio: '16:9',
                    resolution: '720p'
                }
            });
            // In a real production app, we would poll operation.name here
            console.log("Video operation started:", operation);
            alert("Video generation started on backend (Veo). This takes minutes. Check console for operation object.");
          } catch(e) {
            console.error(e);
            alert("Veo generation requires a specific allowed project/key. Error logged.");
          }
      }

    } catch (error) {
      console.error(error);
      alert("Generation failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-brand-panel w-full max-w-2xl rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">AI Studio <span className="text-brand-accent text-sm font-normal ml-2">Powered by Nano Banana & Veo</span></h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">&times;</button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <button 
                onClick={() => setMode('image')}
                className={`px-4 py-2 rounded-lg border ${mode === 'image' ? 'bg-brand-accent text-black border-brand-accent' : 'border-gray-600 text-gray-300'}`}
            >
                Generate Image (Nano Banana)
            </button>
            <button 
                onClick={() => setMode('video')}
                className={`px-4 py-2 rounded-lg border ${mode === 'video' ? 'bg-brand-accent text-black border-brand-accent' : 'border-gray-600 text-gray-300'}`}
            >
                Generate Video (Veo)
            </button>
          </div>

          <textarea
            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-4 text-white focus:border-brand-accent outline-none"
            rows={4}
            placeholder={`Describe your ${mode}...`}
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-gradient-to-r from-brand-accent to-cyan-600 text-black font-bold py-3 rounded-lg hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Create Asset'}
          </button>

          {resultUrl && mode === 'image' && (
            <div className="mt-4 rounded-lg overflow-hidden border border-gray-700">
              <img src={resultUrl} alt="Result" className="w-full h-auto" />
              <a href={resultUrl} download="ai-studio-result.png" className="block w-full text-center bg-gray-800 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700">
                  Download Result
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
