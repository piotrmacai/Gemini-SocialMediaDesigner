
export enum AspectRatio {
  RATIO_4_5 = '4:5',
  RATIO_5_4 = '5:4',
  RATIO_1_1 = '1:1',
  RATIO_9_16 = '9:16',
  RATIO_16_9 = '16:9',
}

export enum PostType {
  IMAGE = 'Image',
  VIDEO = 'Video',
}

export enum GenerationModel {
  NANO_BANANA = 'gemini-2.5-flash-image',
  NANO_BANANA_PRO = 'gemini-3-pro-image-preview',
  VEO_FAST = 'veo-3.1-fast-generate-preview',
}

export interface AppState {
  // Content
  title: string;
  description: string;
  prompt: string;
  aspectRatio: AspectRatio;
  postType: PostType;
  
  // Media
  uploadedFile: File | null;
  uploadedFileUrl: string | null;
  uploadedFileType: 'image' | 'video' | null;
  generatedBackground: string | null;

  // Styling & Layout
  backgroundColor: string;
  titleColor: string;
  textColor: string;
  
  // Typography & Positioning
  titleFontSize: number;
  titleOffsetX: number;
  titleOffsetY: number;
  
  descriptionFontSize: number;
  descriptionOffsetX: number;
  descriptionOffsetY: number;

  mediaScale: number; // 0.5 to 2.0
  mediaOffsetY: number; // vertical shift
  contentPadding: number;

  // Status
  isGenerating: boolean;
  isExporting: boolean;
}
