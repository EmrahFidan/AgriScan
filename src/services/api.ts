import type { AnalysisResult, Prediction } from '../types';

// Backend URL - deployment sonrasi guncellenecek
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function analyzeImage(imageUrl: string): Promise<AnalysisResult> {
  try {
    const response = await fetch(`${API_URL}/analyze-base64`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image: imageUrl })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.detail || `API error: ${response.status}`);
    }

    const data = await response.json();

    const predictions: Prediction[] = (data.predictions || []).map((pred: any) => ({
      class: pred.class,
      confidence: pred.confidence,
      bbox: pred.bbox as [number, number, number, number]
    }));

    return {
      predictions,
      processedAt: new Date(),
      allClasses: data.all_classes || []
    };
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
}

// Detayli hastalik bilgileri - Modelin 9 sinifi
export interface DiseaseInfo {
  tr: string;
  en: string;
  severity: 'healthy' | 'low' | 'medium' | 'high';
  description: string;
  symptoms: string[];
  treatment: string[];
  icon: string;
}

// MODEL SINIFLARI (KESIN LISTE):
// 'Early Blight', 'Healthy', 'Late Blight', 'Leaf Miner', 'Leaf Mold',
// 'Mosaic Virus', 'Septoria', 'Spider Mites', 'Yellow Leaf Curl Virus'

export const DISEASE_INFO: Record<string, DiseaseInfo> = {
  'Early Blight': {
    tr: 'Early Blight',
    en: 'Early Blight',
    severity: 'medium',
    icon: '🍂',
    description: 'Common leaf disease caused by Alternaria solani fungus.',
    symptoms: [
      'Brown spots with concentric rings',
      'Starts from lower leaves and spreads upward',
      'Leaf yellowing and premature dropping',
      'Yellow halo formation around spots'
    ],
    treatment: [
      'Apply fungicide containing Chlorothalonil or Mancozeb',
      'Remove and destroy infected leaves immediately',
      'Clean up plant debris',
      'Use mulch to prevent soil splashing',
      'Use drip irrigation, avoid wetting leaves'
    ]
  },
  'Healthy': {
    tr: 'Healthy',
    en: 'Healthy',
    severity: 'healthy',
    icon: '✅',
    description: 'No disease symptoms detected on the leaf.',
    symptoms: [
      'Vibrant and bright green color',
      'Normal leaf structure and texture',
      'Spotless and hole-free surface',
      'Healthy vein structure'
    ],
    treatment: [
      'Maintain regular watering schedule',
      'Apply balanced fertilization (N-P-K)',
      'Consider preventive fungicide application',
      'Monitor plant health regularly'
    ]
  },
  'Late Blight': {
    tr: 'Late Blight',
    en: 'Late Blight',
    severity: 'high',
    icon: '☠️',
    description: 'Phytophthora infestans - VERY DANGEROUS and fast-spreading disease. Requires immediate action!',
    symptoms: [
      'Watery, dark green-brown spots on leaves',
      'White mold layer under leaves',
      'Very rapid leaf death and decay',
      'Brown hard spots on fruits',
      'Spreads rapidly in humid conditions'
    ],
    treatment: [
      'URGENT: Apply fungicide containing Metalaxyl or Fosetyl-Al',
      'Remove and destroy infected plants IMMEDIATELY',
      'Maximize ventilation',
      'Reduce watering, control humidity',
      'Apply preventive treatment to neighboring plants'
    ]
  },
  'Leaf Miner': {
    tr: 'Leaf Miner',
    en: 'Leaf Miner',
    severity: 'medium',
    icon: '🪲',
    description: 'Damage caused by Liriomyza fly larvae feeding on leaf tissue.',
    symptoms: [
      'White/gray winding tunnel trails on leaves',
      'Zigzag lines on leaf surface',
      'Leaf yellowing and premature drying',
      'Significant reduction in photosynthesis capacity'
    ],
    treatment: [
      'Install yellow sticky traps',
      'Collect and destroy damaged leaves',
      'Protect natural enemies (parasitoid wasps)',
      'Apply neem oil spray',
      'Use Spinosad-based insecticide for severe infestations'
    ]
  },
  'Leaf Mold': {
    tr: 'Leaf Mold',
    en: 'Leaf Mold',
    severity: 'medium',
    icon: '🍄',
    description: 'Caused by Passalora fulva (Cladosporium) fungus, common in greenhouse environments.',
    symptoms: [
      'Pale yellow-green spots on upper leaf surface',
      'Brown-purple mold layer on lower leaf surface',
      'Leaf curling and wrinkling',
      'Leaf drop in severe infections'
    ],
    treatment: [
      'Improve greenhouse ventilation',
      'Keep humidity below 85%',
      'Water in a way that keeps leaves dry',
      'Apply Copper or Chlorothalonil fungicide',
      'Choose resistant tomato varieties'
    ]
  },
  'Mosaic Virus': {
    tr: 'Mosaic Virus',
    en: 'Mosaic Virus',
    severity: 'high',
    icon: '🧬',
    description: 'Tobacco/Tomato Mosaic Virus - Viral disease easily spread by mechanical contact. NO CURE!',
    symptoms: [
      'Light-dark green mosaic pattern on leaves',
      'Leaf curling and deformation',
      'Stunted plant growth',
      'Yellow spotting and deformation on fruits'
    ],
    treatment: [
      'Remove and destroy infected plants IMMEDIATELY (by burning)',
      'Disinfect all tools with 10% bleach solution',
      'Wash hands before and after working',
      'Wash hands before smoking (TMV comes from tobacco plant)',
      'Use resistant seed varieties'
    ]
  },
  'Septoria': {
    tr: 'Septoria Leaf Spot',
    en: 'Septoria Leaf Spot',
    severity: 'medium',
    icon: '🔴',
    description: 'Caused by Septoria lycopersici fungus, common in warm and humid weather.',
    symptoms: [
      'Small (2-3mm), round, grayish spots',
      'Black dots (pycnidia) in spot centers',
      'Usually starts from lower leaves',
      'All leaves affected in severe cases'
    ],
    treatment: [
      'Apply Copper or Mancozeb fungicide',
      'Collect and destroy infected leaves',
      'Apply 2-3 year crop rotation',
      'Use drip irrigation without wetting leaves',
      'Increase plant spacing (ventilation)'
    ]
  },
  'Spider Mites': {
    tr: 'Spider Mites',
    en: 'Spider Mites',
    severity: 'low',
    icon: '🕷️',
    description: 'Tetranychus urticae - Small mite pest that multiplies rapidly in hot and dry conditions.',
    symptoms: [
      'Pale spots on upper leaf surface',
      'Fine webbing (silk) layer under leaves',
      'Bronzing and drying of leaves',
      'Plant death in severe infestations'
    ],
    treatment: [
      'Wash leaves with strong water jet',
      'Apply Abamectin or Spiromesifen acaricide',
      'Purchase natural enemies (Phytoseiulus)',
      'Increase ambient humidity (above 60%)',
      'Avoid excessive nitrogen fertilization'
    ]
  },
  'Yellow Leaf Curl Virus': {
    tr: 'Yellow Leaf Curl Virus',
    en: 'Yellow Leaf Curl Virus',
    severity: 'high',
    icon: '🦟',
    description: 'TYLCV - Very harmful viral disease transmitted by whitefly (Bemisia tabaci). NO CURE!',
    symptoms: [
      'Leaf edges curl upward',
      'Significant yellowing of leaves',
      'Plant stunting and growth arrest',
      'Flower and fruit drop, yield loss'
    ],
    treatment: [
      'Remove and destroy infected plants IMMEDIATELY',
      'Control whiteflies effectively (yellow traps + insecticide)',
      'Create physical barrier with mesh cover',
      'Use TYLCV resistant tomato varieties',
      'Install double door system at greenhouse entrances'
    ]
  }
};

// Eski format icin uyumluluk
export const DISEASE_LABELS: Record<string, { tr: string; severity: 'healthy' | 'low' | 'medium' | 'high' }> =
  Object.fromEntries(
    Object.entries(DISEASE_INFO).map(([key, val]) => [key, { tr: val.tr, severity: val.severity }])
  );
