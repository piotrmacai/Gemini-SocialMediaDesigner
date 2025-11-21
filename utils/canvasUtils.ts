import { AspectRatio } from "../types";

export const getCanvasDimensions = (ratio: AspectRatio) => {
  const baseHeight = 1350; // High res vertical base
  const baseWidth = 1080;  // High res width base

  switch (ratio) {
    case AspectRatio.RATIO_4_5:
      return { width: 1080, height: 1350 };
    case AspectRatio.RATIO_5_4:
      return { width: 1350, height: 1080 };
    case AspectRatio.RATIO_1_1:
      return { width: 1080, height: 1080 };
    case AspectRatio.RATIO_9_16:
      return { width: 1080, height: 1920 };
    case AspectRatio.RATIO_16_9:
      return { width: 1920, height: 1080 };
    default:
      return { width: 1080, height: 1080 };
  }
};

export const wrapText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) => {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY; // Return last Y position
};

// Draws a decorative "plus" pattern often seen in tech designs
export const drawTechAccents = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    const padding = 40;
    
    // Top Left
    ctx.fillText('+', padding, padding);
    // Top Right
    ctx.fillText('+', width - padding - 20, padding);
    // Bottom Left
    ctx.fillText('+', padding, height - padding);
    // Bottom Right
    ctx.fillText('+', width - padding - 20, height - padding);
    
    // Optional: Brand line
    ctx.fillStyle = '#38bdf8'; // Cyan accent
    ctx.fillRect(padding, padding + 30, 5, 80); // Vertical bar
    
    ctx.restore();
}
