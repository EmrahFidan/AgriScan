import { useEffect, useState } from 'react';
import type { ImageData } from '../types';
import { subscribeToImages, updateImageAnalysis } from '../services/firestore';
import { analyzeImage, DISEASE_LABELS } from '../services/roboflow';

export default function ImageGallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsubscribe = subscribeToImages((imgs) => {
      setImages(imgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAnalyze = async (image: ImageData, e: React.MouseEvent) => {
    e.stopPropagation();

    if (analyzingIds.has(image.id)) return;

    setAnalyzingIds(prev => new Set(prev).add(image.id));

    try {
      const result = await analyzeImage(image.url);
      await updateImageAnalysis(image.id, result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analiz sirasinda hata olustu. Lutfen tekrar deneyin.');
    } finally {
      setAnalyzingIds(prev => {
        const next = new Set(prev);
        next.delete(image.id);
        return next;
      });
    }
  };

  const handleAnalyzeAll = async () => {
    const pendingImages = images.filter(img => !img.analyzed);

    for (const image of pendingImages) {
      if (!analyzingIds.has(image.id)) {
        setAnalyzingIds(prev => new Set(prev).add(image.id));

        try {
          const result = await analyzeImage(image.url);
          await updateImageAnalysis(image.id, result);
        } catch (error) {
          console.error(`Analysis failed for ${image.fileName}:`, error);
        } finally {
          setAnalyzingIds(prev => {
            const next = new Set(prev);
            next.delete(image.id);
            return next;
          });
        }
      }
    }
  };

  const getMainPrediction = (image: ImageData) => {
    if (!image.analysisResult?.predictions?.length) return null;
    return image.analysisResult.predictions.reduce((max, pred) =>
      pred.confidence > max.confidence ? pred : max
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'healthy': return 'bg-emerald-600';
      case 'low': return 'bg-yellow-500';
      case 'medium': return 'bg-orange-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-20 h-20 rounded-2xl bg-emerald-600 flex items-center justify-center mb-4 animate-pulse shadow-xl">
          <span className="text-4xl">🌿</span>
        </div>
        <p className="text-earth-light font-medium">Goruntuler yukleniyor...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-28 h-28 rounded-3xl mb-6 bg-[#faf6ef] shadow-xl border border-[#e8dfd0]">
          <span className="text-6xl">🌱</span>
        </div>
        <h3 className="font-display text-2xl font-bold mb-3 text-earth">
          Henuz Goruntu Yuklenmedi
        </h3>
        <p className="text-earth-light max-w-md mx-auto">
          Yukaridaki alani kullanarak drone goruntulerinizi yukleyebilirsiniz
        </p>
      </div>
    );
  }

  const pendingCount = images.filter(i => !i.analyzed).length;

  return (
    <div>
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-2 text-earth">
            Yuklenen Goruntuler
          </h2>
          <p className="text-earth-light">
            Toplam <span className="font-semibold text-emerald-700">{images.length}</span> goruntu
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold text-emerald-800">
              {images.filter(i => i.analyzed).length} Analiz Edildi
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-sm font-semibold text-amber-800">
              {pendingCount} Bekliyor
            </span>
          </div>

          {pendingCount > 0 && (
            <button
              onClick={handleAnalyzeAll}
              disabled={analyzingIds.size > 0}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl text-sm transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
            >
              {analyzingIds.size > 0 ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Analiz Ediliyor...
                </span>
              ) : (
                `Tumunu Analiz Et (${pendingCount})`
              )}
            </button>
          )}
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {images.map((image, idx) => {
          const mainPrediction = getMainPrediction(image);
          const diseaseInfo = mainPrediction ? DISEASE_LABELS[mainPrediction.class] : null;
          const isAnalyzing = analyzingIds.has(image.id);

          return (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-[#faf6ef] shadow-lg hover:shadow-2xl animate-slideUp border border-[#e8dfd0]"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden bg-[#f5f0e8]">
                <img
                  src={image.url}
                  alt={image.fileName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                {isAnalyzing ? (
                  <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-white text-sm animate-spin">⏳</span>
                  </div>
                ) : image.analyzed ? (
                  <div className={`w-9 h-9 rounded-xl ${diseaseInfo ? getSeverityColor(diseaseInfo.severity) : 'bg-emerald-600'} flex items-center justify-center shadow-lg`}>
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                ) : (
                  <button
                    onClick={(e) => handleAnalyze(image, e)}
                    className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 flex items-center justify-center shadow-lg transition-colors"
                  >
                    <span className="text-white text-sm">🔍</span>
                  </button>
                )}
              </div>

              {/* Analysis Result Badge */}
              {image.analyzed && mainPrediction && diseaseInfo && (
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#3d3426]/90">
                  <p className="text-white text-xs font-semibold truncate">
                    {diseaseInfo.tr}
                  </p>
                  <p className="text-amber-200 text-xs">
                    %{Math.round(mainPrediction.confidence * 100)} guven
                  </p>
                </div>
              )}

              {/* Hover Overlay for pending images */}
              {!image.analyzed && !isAnalyzing && (
                <div className="absolute inset-0 bg-[#3d3426]/70 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center">
                  <button
                    onClick={(e) => handleAnalyze(image, e)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-lg"
                  >
                    Analiz Et
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3d3426]/90 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#faf6ef] rounded-3xl overflow-hidden animate-slideUp shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-11 h-11 rounded-xl bg-[#faf6ef]/95 text-earth flex items-center justify-center transition-all hover:bg-white hover:shadow-lg hover:scale-105"
            >
              ✕
            </button>

            {/* Image */}
            <div className="aspect-video bg-[#f5f0e8]">
              <img
                src={selectedImage.url}
                alt={selectedImage.fileName}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Info Bar */}
            <div className="p-6 bg-[#faf6ef]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-display font-bold text-xl mb-1 text-earth">
                    {selectedImage.fileName}
                  </h3>
                  <p className="text-sm text-earth-light">
                    {selectedImage.uploadedAt?.toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {!selectedImage.analyzed && (
                  <button
                    onClick={(e) => handleAnalyze(selectedImage, e)}
                    disabled={analyzingIds.has(selectedImage.id)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl text-sm transition-all shadow-lg"
                  >
                    {analyzingIds.has(selectedImage.id) ? 'Analiz Ediliyor...' : 'Analiz Et'}
                  </button>
                )}
              </div>

              {/* Analysis Results */}
              {selectedImage.analyzed && selectedImage.analysisResult?.predictions && (
                <div className="border-t border-[#e8dfd0] pt-4">
                  <h4 className="font-semibold text-earth mb-3">Analiz Sonuclari</h4>

                  {selectedImage.analysisResult.predictions.length === 0 ? (
                    <p className="text-earth-light text-sm">Hastalik tespit edilmedi.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedImage.analysisResult.predictions.map((pred, idx) => {
                        const info = DISEASE_LABELS[pred.class] || { tr: pred.class, severity: 'medium' };
                        return (
                          <div key={idx} className="flex items-center justify-between p-3 bg-[#f5f0e8] rounded-xl">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${getSeverityColor(info.severity)}`} />
                              <span className="font-medium text-earth">{info.tr}</span>
                            </div>
                            <span className="text-sm font-bold text-earth-light">
                              %{Math.round(pred.confidence * 100)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
