
import React, { useEffect, useRef } from 'react';
import { AppState } from '../types';
import { getCanvasDimensions, wrapText, drawTechAccents } from '../utils/canvasUtils';

interface CanvasPreviewProps {
  state: AppState;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({ state, canvasRef }) => {
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const coverVideoElementRef = useRef<HTMLVideoElement | null>(null);
  
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const coverImageRef = useRef<HTMLImageElement | null>(null);
  const userImageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number>();

  // Load AI Generated Background Image
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

  // Load User Uploaded Cover Image
  useEffect(() => {
    if (state.coverFileUrl && state.coverFileType === 'image') {
      const img = new Image();
      img.src = state.coverFileUrl;
      img.onload = () => {
        coverImageRef.current = img;
      };
    } else {
      coverImageRef.current = null;
    }
  }, [state.coverFileUrl, state.coverFileType]);

   // Setup Cover Video Element
   useEffect(() => {
    if (state.coverFileUrl && state.coverFileType === 'video') {
      const video = document.createElement('video');
      video.src = state.coverFileUrl;
      video.muted = true; 
      video.loop = true;
      video.play().catch(e => console.error("Cover Video play failed", e));
      coverVideoElementRef.current = video;
    } else {
      if (coverVideoElementRef.current) {
        coverVideoElementRef.current.pause();
        coverVideoElementRef.current = null;
      }
    }
    return () => {
      if (coverVideoElementRef.current) {
        coverVideoElementRef.current.pause();
      }
    }
  }, [state.coverFileUrl, state.coverFileType]);

  // Load User Foreground Image
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

  // Setup Foreground Video Element
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

  // Helper to draw cover style images/videos
  const drawCover = (ctx: CanvasRenderingContext2D, source: HTMLImageElement | HTMLVideoElement, width: number, height: number) => {
      const sourceW = (source instanceof HTMLVideoElement) ? source.videoWidth : source.width;
      const sourceH = (source instanceof HTMLVideoElement) ? source.videoHeight : source.height;
      
      if (!sourceW || !sourceH) return;

      const sourceRatio = sourceW / sourceH;
      const canvasRatio = width / height;
      
      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (sourceRatio > canvasRatio) {
          drawWidth = height * sourceRatio;
          offsetX = (width - drawWidth) / 2;
      } else {
          drawHeight = width / sourceRatio;
          offsetY = (height - drawHeight) / 2;
      }
      
      ctx.drawImage(source, offsetX, offsetY, drawWidth, drawHeight);
  };

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

      // 1. Background Color (Base)
      ctx.fillStyle = state.backgroundColor || '#0f172a';
      ctx.fillRect(0, 0, width, height);

      // 2. Cover Layer (Priority: User Cover > AI Background)
      if (state.coverFileType === 'video' && coverVideoElementRef.current && coverVideoElementRef.current.readyState >= 2) {
         drawCover(ctx, coverVideoElementRef.current, width, height);
         ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
         ctx.fillRect(0, 0, width, height);
      } 
      else if (state.coverFileType === 'image' && coverImageRef.current) {
         drawCover(ctx, coverImageRef.current, width, height);
         ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
         ctx.fillRect(0, 0, width, height);
      }
      else if (bgImageRef.current) {
        drawCover(ctx, bgImageRef.current, width, height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, width, height);
      }

      // 3. Tech Accents
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = `40px ${state.titleFont}, Inter`;
      drawTechAccents(ctx, width, height);

      // 4. User Media (Centered Vertically by default + user offset)
      ctx.save();
      
      const maxMediaWidth = width - (state.contentPadding * 2); 
      const maxMediaHeight = height * 0.55; 

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
          const nativeW = (source instanceof HTMLVideoElement) ? source.videoWidth : source.width;
          const nativeH = (source instanceof HTMLVideoElement) ? source.videoHeight : source.height;
          const ratio = nativeW / nativeH;

          if (ratio > 1) { 
              mediaWidth = maxMediaWidth * state.mediaScale;
              mediaHeight = (mediaWidth / ratio);
          } else { 
              mediaHeight = maxMediaHeight * state.mediaScale;
              mediaWidth = (mediaHeight * ratio);
          }

          const x = centerX - (mediaWidth / 2);
          const y = centerY - (mediaHeight / 2);

          ctx.shadowColor = "rgba(0,0,0,0.5)";
          ctx.shadowBlur = 40;
          ctx.shadowOffsetY = 20;

          ctx.drawImage(source, x, y, mediaWidth, mediaHeight);
          
          ctx.shadowColor = "transparent";
          ctx.strokeStyle = "rgba(255,255,255,0.1)";
          ctx.lineWidth = 2;
          ctx.strokeRect(x, y, mediaWidth, mediaHeight);
      } else {
         if (!state.coverFileUrl && !state.generatedBackground) {
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
      }
      ctx.restore();

      // 5. Title
      ctx.save();
      ctx.fillStyle = state.titleColor;
      ctx.textAlign = 'center'; 
      ctx.textBaseline = 'top';
      ctx.font = `bold ${state.titleFontSize}px "${state.titleFont}", sans-serif`;
      
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

      // 6. Description
      ctx.save();
      ctx.fillStyle = state.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom'; 
      ctx.font = `${state.descriptionFontSize}px "${state.descriptionFont}", sans-serif`;
      
      const descX = (width / 2) + state.descriptionOffsetX;
      const descY = (height - state.contentPadding) + state.descriptionOffsetY;
      
      wrapText(
          ctx, 
          state.description || "Description goes here...", 
          descX, 
          descY - (state.descriptionFontSize * 2),
          width - (state.contentPadding * 2), 
          state.descriptionFontSize * 1.4
      );
      ctx.restore();

      if (state.uploadedFileType === 'video' || state.coverFileType === 'video') {
        animationRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [state]);

  return (
    <div className="flex-1 flex items-center justify-center p-8 overflow-hidden relative bg-gray-100 dark:bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-200 via-gray-300 to-gray-400 dark:from-gray-800 dark:via-gray-900 dark:to-black transition-colors duration-300">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 dark:opacity-20 pointer-events-none"></div>
        
        <div className="relative shadow-2xl shadow-black/20 dark:shadow-black/50 border border-gray-300 dark:border-gray-800 rounded-sm" 
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