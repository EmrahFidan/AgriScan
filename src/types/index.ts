export interface ImageData {
  id: string;
  fileName: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: Date;
  analyzed: boolean;
  analysisResult?: AnalysisResult;
}

export interface AnalysisResult {
  predictions: Prediction[];
  processedAt: Date;
}

export interface Prediction {
  class: string;
  confidence: number;
  bbox: [number, number, number, number]; // x, y, width, height
}

export interface UploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}
