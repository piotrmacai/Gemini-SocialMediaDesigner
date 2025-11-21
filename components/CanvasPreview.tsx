
import React, { useEffect, useRef } from 'react';
import { AppState } from '../types';
import { getCanvasDimensions, wrapText, drawTechAccents } from '../utils/canvasUtils';

interface CanvasPreviewProps {
  state: AppState;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({ state, canvasRef }) => {
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const userImageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number>();

  // Load Background Image
  useEffect(() => {
    if (state.generatedBackground) {
      const img = new Image();
      img.src = state.generatedBackground;
      img.onload = () => {
        bgImageRef.current = img;
      };
    } else {
      bgImageRef.current = null;
    }
  }, [state.generatedBackground]);

  // Load User Image
  useEffect(() => {
    if (state.uploadedFileUrl && state.uploadedFileType === 'image') {
      const img = new Image();
      img.src = state.uploadedFileUrl;
      img.onload = () => {
        userImageRef.current = img;
      };
    } else {
      userImageRef.current = null;
    }
  }, [state.uploadedFileUrl, state.uploadedFileType]);

  // Setup Video Element
  useEffect(() => {
    if (state.uploadedFileUrl && state.uploadedFileType === 'video') {
      const video = document.createElement('video');
      video.src = state.uploadedFileUrl;
      video.muted = true; 
      video.loop = true;
      video.play().catch(e => console.error("Video play failed", e));
      videoElementRef.current = video;
    } else {
      if (videoElementRef.current) {
        videoElementRef.current.pause();
        videoElementRef.current = null;
      }
    }
    return () => {
      if (videoElementRef.current) {
        videoElementRef.current.pause();
      }
    }
  }, [state.uploadedFileUrl, state.uploadedFileType]);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      const { width, height } = getCanvasDimensions(state.aspectRatio);
      
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;

      // 1. Background (Color or AI Image)
      ctx.fillStyle = state.backgroundColor || '#0f172a';
      ctx.fillRect(0, 0, width, height);

      if (bgImageRef.current) {
        // Cover mode for background
        const bgRatio = bgImageRef.current.width / bgImageRef.current.height;
        const canvasRatio = width / height;
        let drawWidth = width;
        let drawHeight = height;
        let offsetX = 0;
        let offsetY = 0;

        if (bgRatio > canvasRatio) {
           drawWidth = height * bgRatio;
           offsetX = (width - drawWidth) / 2;
        } else {
           drawHeight = width / bgRatio;
           offsetY = (height - drawHeight) / 2;
        }
        ctx.drawImage(bgImageRef.current, offsetX, offsetY, drawWidth, drawHeight);
        
        // Dark Overlay
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Tech Accents
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = '40px Inter';
      drawTechAccents(ctx, width, height);

      // 3. User Media (Centered Vertically by default + user offset)
      ctx.save();
      
      // Calculate base media dimensions (max 60% width to leave room for padding)
      const maxMediaWidth = width - (state.contentPadding * 2); 
      const maxMediaHeight = height * 0.55; // Slightly reduced to give more space to text

      let mediaWidth = 0;
      let mediaHeight = 0;
      let renderMedia = false;
      let source: HTMLVideoElement | HTMLImageElement | null = null;

      if (state.uploadedFileType === 'video' && videoElementRef.current && videoElementRef.current.readyState >= 2) {
        source = videoElementRef.current;
        renderMedia = true;
      } else if (state.uploadedFileType === 'image' && userImageRef.current) {
        source = userImageRef.current;
        renderMedia = true;
      }

      const centerY = height / 2 + state.mediaOffsetY;
      const centerX = width / 2;

      if (renderMedia && source) {
          // Determine native size
          const nativeW = (source instanceof HTMLVideoElement) ? source.videoWidth : source.width;
          const nativeH = (source instanceof HTMLVideoElement) ? source.videoHeight : source.height;
          const ratio = nativeW / nativeH;

          // Fit logic
          if (ratio > 1) { // Landscape
              mediaWidth = maxMediaWidth * state.mediaScale;
              mediaHeight = (mediaWidth / ratio);
          } else { // Portrait
              mediaHeight = maxMediaHeight * state.mediaScale;
              mediaWidth = (mediaHeight * ratio);
          }

          const x = centerX - (mediaWidth / 2);
          const y = centerY - (mediaHeight / 2);

          // Shadow
          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.shadowBlur = 40;
          ctx.shadowOffsetY = 20;

          ctx.drawImage(source, x, y, mediaWidth, mediaHeight);
          
          // Border
          ctx.shadowColor = "transparent";
          ctx.strokeStyle = "rgba(255,255,255,0.1)";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, mediaWidth, mediaHeight);
      } else {
         // Placeholder box
         const phSize = 300 * state.mediaScale;
         const x = centerX - phSize/2;
         const y = centerY - phSize/2;
         
         ctx.strokeStyle = '#475569';
         ctx.setLineDash([10, 10]);
         ctx.strokeRect(x, y, phSize, phSize);
         ctx.fillStyle = '#64748b';
         ctx.textAlign = 'center';
         ctx.font = '24px Inter';
         ctx.setLineDash([]);
         ctx.fillText("Media Area", centerX, centerY);
      }
      ctx.restore();

      // 4. Title (Positioned with offset)
      ctx.save();
      ctx.fillStyle = state.titleColor;
      ctx.textAlign = 'center'; 
      ctx.textBaseline = 'top';
      ctx.font = `bold ${state.titleFontSize}px Inter`;
      
      const titleX = (width / 2) + state.titleOffsetX;
      const titleY = state.contentPadding + state.titleOffsetY;
      
      wrapText(
          ctx, 
          state.title || "Title Here", 
          titleX, 
          titleY, 
          width - (state.contentPadding * 2), 
          state.titleFontSize * 1.2
      );
      ctx.restore();

      // 5. Description (Positioned with offset from bottom)
      ctx.save();
      ctx.fillStyle = state.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom'; 
      ctx.font = `${state.descriptionFontSize}px Inter`;
      
      const descX = (width / 2) + state.descriptionOffsetX;
      const descY = (height - state.contentPadding) + state.descriptionOffsetY;
      
      // For bottom alignment text wrapping, it's tricky. 
      // Simple wrapText draws down.
      // To support bottom align perfectly with multiple lines we usually measure first.
      // For this implementation, we assume the user adjusts Y offset to fit their lines if they wrap.
      
      wrapText(
          ctx, 
          state.description || "Description goes here...", 
          descX, 
          descY - (state.descriptionFontSize * 2), // Start a bit higher to account for multiline flow downwards
          width - (state.contentPadding * 2), 
          state.descriptionFontSize * 1.4
      );
      ctx.restore();

      if (state.uploadedFileType === 'video') {
        animationRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [state]);

  return (
    <div className="flex-1 bg-black flex items-center justify-center p-8 overflow-hidden relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        
        <div className="relative shadow-2xl shadow-black/50 border border-gray-800 rounded-sm" 
             style={{
                 maxHeight: '90%',
                 aspectRatio: getCanvasDimensions(state.aspectRatio).width / getCanvasDimensions(state.aspectRatio).height
             }}>
            <canvas 
                ref={canvasRef} 
                className="w-full h-full object-contain"
            />
        </div>
    </div>
  );
};
