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
    tr: 'Erken Yaniklik',
    en: 'Early Blight',
    severity: 'medium',
    icon: '🍂',
    description: 'Alternaria solani mantari kaynakli yaygin yaprak hastaligi.',
    symptoms: [
      'Konsantrik halkali kahverengi lekeler',
      'Alt yapraklardan baslar yukari yayilir',
      'Yaprak sararması ve erken dokulmesi',
      'Leke etrafinda sari hale olusumu'
    ],
    treatment: [
      'Chlorothalonil veya Mancozeb iceren fungisit uygula',
      'Hasta yapraklari hemen uzaklastir ve yok et',
      'Bitki artıklarini temizle',
      'Mulch kullanarak toprak sicramasini onle',
      'Damlama sulama tercih et, yapraklari islatma'
    ]
  },
  'Healthy': {
    tr: 'Saglikli',
    en: 'Healthy',
    severity: 'healthy',
    icon: '✅',
    description: 'Yaprakta herhangi bir hastalik belirtisi tespit edilmedi.',
    symptoms: [
      'Canli ve parlak yesil renk',
      'Normal yaprak yapisi ve dokusu',
      'Lekesiz ve deliksiz yuzey',
      'Saglikli damar yapisi'
    ],
    treatment: [
      'Duzenli sulama programi uygula',
      'Dengeli gubreleme yap (N-P-K)',
      'Koruyucu fungisit uygulamasi dusun',
      'Bitki sagligini duzenli kontrol et'
    ]
  },
  'Late Blight': {
    tr: 'Gec Yaniklik',
    en: 'Late Blight',
    severity: 'high',
    icon: '☠️',
    description: 'Phytophthora infestans - COK TEHLIKELI ve hizli yayilan hastalik. Acil mudahale gerektirir!',
    symptoms: [
      'Yapraklarda sulu, koyu yesil-kahverengi lekeler',
      'Yaprak altinda beyaz kuf tabakasi',
      'Cok hizli yaprak olumu ve curumesi',
      'Meyvelerde kahverengi sert lekeler',
      'Nemli havalarda hizla yayilir'
    ],
    treatment: [
      'ACIL: Metalaxyl veya Fosetyl-Al iceren fungisit uygula',
      'Hasta bitkileri HEMEN sok ve yok et',
      'Havalandirmayi maksimum artir',
      'Sulama miktarini azalt, nem kontrolu yap',
      'Komsu bitkilere koruyucu ilaclama yap'
    ]
  },
  'Leaf Miner': {
    tr: 'Yaprak Galeri Sinegi',
    en: 'Leaf Miner',
    severity: 'medium',
    icon: '🪲',
    description: 'Liriomyza sinegi larvalarinin yaprak ici dokularini yemesiyle olusan hasar.',
    symptoms: [
      'Yapraklarda beyaz/gri kivrimli tunel izleri',
      'Yaprak yuzeyinde zig-zag seklinde cizgiler',
      'Yaprak sararması ve erken kurumasi',
      'Fotosentez kapasitesinde belirgin azalma'
    ],
    treatment: [
      'Sari yapiskanlı tuzaklar yerlestirilr',
      'Zarar goren yapraklari topla ve yok et',
      'Dogal dusmanları (parazitoid arilari) koru',
      'Neem yagi spreyi uygula',
      'Siddetli bulasmada Spinosad iceren insektisit kullan'
    ]
  },
  'Leaf Mold': {
    tr: 'Yaprak Kufu',
    en: 'Leaf Mold',
    severity: 'medium',
    icon: '🍄',
    description: 'Passalora fulva (Cladosporium) mantari kaynakli, ozellikle sera ortamlarinda yaygin.',
    symptoms: [
      'Yaprak ust yuzeyinde soluk sari-yesil lekeler',
      'Yaprak alt yuzeyinde kahverengi-mor kuf tabakasi',
      'Yaprak kivrilmasi ve burusması',
      'Siddetli enfeksiyonda yaprak dokulmesi'
    ],
    treatment: [
      'Sera havalandirmasini iyilestir',
      'Nem oranini %85 altinda tut',
      'Yapraklari kuru tutacak sekilde sula',
      'Copper veya Chlorothalonil fungisit uygula',
      'Dayanikli domates cesitleri tercih et'
    ]
  },
  'Mosaic Virus': {
    tr: 'Mozaik Virusu',
    en: 'Mosaic Virus',
    severity: 'high',
    icon: '🧬',
    description: 'Tobacco/Tomato Mosaic Virus - Mekanik temasla kolayca yayilan viral hastalik. TEDAVISI YOKTUR!',
    symptoms: [
      'Yapraklarda acik-koyu yesil mozaik deseni',
      'Yaprak kivrilmasi ve deformasyonu',
      'Bitki gelisiminde gerileme',
      'Meyvelerde sari lekelenme ve sekil bozuklugu'
    ],
    treatment: [
      'Hasta bitkileri HEMEN sok ve yok et (yakarak)',
      'Tum aletleri %10 camasir suyu ile dezenfekte et',
      'Calismadan once ve sonra ellerini yika',
      'Sigara icmeden once ellerini yika (TMV sigara bitkisinden gelir)',
      'Direncli tohum cesitleri kullan'
    ]
  },
  'Septoria': {
    tr: 'Septoria Yaprak Lekesi',
    en: 'Septoria Leaf Spot',
    severity: 'medium',
    icon: '🔴',
    description: 'Septoria lycopersici mantari kaynakli, sicak ve nemli havalarda yaygin.',
    symptoms: [
      'Kucuk (2-3mm), yuvarlak, grimsi lekeler',
      'Leke merkezinde siyah noktalar (picnidia)',
      'Genellikle alt yapraklardan baslar',
      'Siddetli durumda tum yapraklar dokulu'
    ],
    treatment: [
      'Copper veya Mancozeb fungisit uygula',
      'Hasta yapraklari topla ve yok et',
      '2-3 yillik ekim nobeti uygula',
      'Yapraklari islatmadan dip sulama yap',
      'Bitkiler arasi mesafeyi artir (havalandirma)'
    ]
  },
  'Spider Mites': {
    tr: 'Kirmizi Orumcek',
    en: 'Spider Mites',
    severity: 'low',
    icon: '🕷️',
    description: 'Tetranychus urticae - Sicak ve kuru havalarda hizla coğalan kucuk akar zararlisi.',
    symptoms: [
      'Yaprak ust yuzeyinde soluk noktaciklarla',
      'Yaprak altinda ince ag (ipek) tabakasi',
      'Yapraklarda bronzlasma ve kuruma',
      'Siddetli bulasmada bitki olumu'
    ],
    treatment: [
      'Yapraklari guclu su jeti ile yika',
      'Abamectin veya Spiromesifen akarisit uygula',
      'Dogal dusmanları (Phytoseiulus) satin al',
      'Ortam nemini artir (%60 ustu)',
      'Asiri azotlu gubrelemeden kacin'
    ]
  },
  'Yellow Leaf Curl Virus': {
    tr: 'Sari Yaprak Kivircikligi',
    en: 'Yellow Leaf Curl Virus',
    severity: 'high',
    icon: '🦟',
    description: 'TYLCV - Beyazsinek (Bemisia tabaci) ile tasinan cok zararli viral hastalik. TEDAVISI YOKTUR!',
    symptoms: [
      'Yaprak kenarlari yukari dogru kivrilir',
      'Yapraklarda belirgin sararma',
      'Bitki bodurlasmasi ve gelisim durması',
      'Cicek ve meyve dusmesi, verim kaybi'
    ],
    treatment: [
      'Hasta bitkileri HEMEN sok ve yok et',
      'Beyazsinekle etkin mucadele et (sari tuzak + insektisit)',
      'Ag ortu (tul) ile fiziksel bariyer olustur',
      'TYLCV direncli domates cesitleri kullan',
      'Sera girislerine cift kapi sistemi kur'
    ]
  }
};

// Eski format icin uyumluluk
export const DISEASE_LABELS: Record<string, { tr: string; severity: 'healthy' | 'low' | 'medium' | 'high' }> =
  Object.fromEntries(
    Object.entries(DISEASE_INFO).map(([key, val]) => [key, { tr: val.tr, severity: val.severity }])
  );
