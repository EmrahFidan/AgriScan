import type { AnalysisResult, Prediction } from '../types';

const ROBOFLOW_API_KEY = 'rf_0ENXup3QuBNfCPxSN2HcbVIZ1Tr2';
const ROBOFLOW_MODEL = 'tomato-leaf-disease-rxcft';
const ROBOFLOW_VERSION = '3';

interface RoboflowPrediction {
  class: string;
  confidence: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface RoboflowResponse {
  predictions: RoboflowPrediction[];
  time: number;
}

export async function analyzeImage(imageUrl: string): Promise<AnalysisResult> {
  const apiUrl = `https://detect.roboflow.com/${ROBOFLOW_MODEL}/${ROBOFLOW_VERSION}`;

  try {
    let response;

    // Base64 ise POST ile gonder, URL ise GET ile gonder
    if (imageUrl.startsWith('data:')) {
      // Base64 - sadece data kismini al
      const base64Data = imageUrl.split(',')[1];
      response = await fetch(`${apiUrl}?api_key=${ROBOFLOW_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: base64Data
      });
    } else {
      // URL
      response = await fetch(`${apiUrl}?api_key=${ROBOFLOW_API_KEY}&image=${encodeURIComponent(imageUrl)}`);
    }

    if (!response.ok) {
      throw new Error(`Roboflow API error: ${response.status}`);
    }

    const data: RoboflowResponse = await response.json();

    const predictions: Prediction[] = data.predictions.map(pred => ({
      class: pred.class,
      confidence: pred.confidence,
      bbox: [pred.x, pred.y, pred.width, pred.height] as [number, number, number, number]
    }));

    return {
      predictions,
      processedAt: new Date()
    };
  } catch (error) {
    console.error('Roboflow analysis error:', error);
    throw error;
  }
}

export async function analyzeImageFromBase64(base64Image: string): Promise<AnalysisResult> {
  const apiUrl = `https://detect.roboflow.com/${ROBOFLOW_MODEL}/${ROBOFLOW_VERSION}`;

  try {
    const response = await fetch(`${apiUrl}?api_key=${ROBOFLOW_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: base64Image
    });

    if (!response.ok) {
      throw new Error(`Roboflow API error: ${response.status}`);
    }

    const data: RoboflowResponse = await response.json();

    const predictions: Prediction[] = data.predictions.map(pred => ({
      class: pred.class,
      confidence: pred.confidence,
      bbox: [pred.x, pred.y, pred.width, pred.height] as [number, number, number, number]
    }));

    return {
      predictions,
      processedAt: new Date()
    };
  } catch (error) {
    console.error('Roboflow analysis error:', error);
    throw error;
  }
}

export const DISEASE_LABELS: Record<string, { tr: string; severity: 'healthy' | 'low' | 'medium' | 'high' }> = {
  'Healthy': { tr: 'Saglikli', severity: 'healthy' },
  'Early_Blight': { tr: 'Erken Yanikligi', severity: 'medium' },
  'Late_Blight': { tr: 'Gec Yanikligi', severity: 'high' },
  'Leaf_Miner': { tr: 'Yaprak Kurdu', severity: 'medium' },
  'Leaf_Mold': { tr: 'Yaprak Kufu', severity: 'medium' },
  'Mosaic_Virus': { tr: 'Mozaik Virusu', severity: 'high' },
  'Septoria': { tr: 'Septoria Yaprak Lekesi', severity: 'medium' },
  'Spider_Mites': { tr: 'Kirmizi Orumcek', severity: 'low' },
  'Yellow_Leaf_Curl_Virus': { tr: 'Sari Yaprak Kivircikligi', severity: 'high' }
};
