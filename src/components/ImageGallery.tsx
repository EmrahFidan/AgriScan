import { useEffect, useState } from 'react';
import type { ImageData } from '../types';
import { subscribeToImages, updateImageAnalysis, deleteImage } from '../services/firestore';
import { analyzeImage, DISEASE_LABELS, DISEASE_INFO } from '../services/api';
import ConfirmModal from './ConfirmModal';

export default function ImageGallery() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  // selectedImage'i images array'inden al - boylece guncellenir
  const selectedImage = selectedImageId ? images.find(img => img.id === selectedImageId) || null : null;
  const [analyzingIds, setAnalyzingIds] = useState<Set<string>>(new Set());

  // Multi-select state
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Confirm modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // Expanded disease cards state (for accordion)
  const [expandedDiseases, setExpandedDiseases] = useState<Set<string>>(new Set());

  const toggleDiseaseExpand = (diseaseClass: string) => {
    setExpandedDiseases(prev => {
      const next = new Set(prev);
      if (next.has(diseaseClass)) {
        next.delete(diseaseClass);
      } else {
        next.add(diseaseClass);
      }
      return next;
    });
  };

  useEffect(() => {
    const unsubscribe = subscribeToImages((imgs) => {
      setImages(imgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Exit selection mode when no images selected
  useEffect(() => {
    if (selectionMode && selectedIds.size === 0 && images.length > 0) {
      // Keep selection mode active
    }
  }, [selectedIds, selectionMode, images]);

  // Reset expanded diseases when selected image changes
  useEffect(() => {
    setExpandedDiseases(new Set());
  }, [selectedImageId]);

  const toggleSelection = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(imageId)) {
        next.delete(imageId);
      } else {
        next.add(imageId);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(images.map(img => img.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const exitSelectionMode = () => {
    setSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleDeleteSingle = (image: ImageData, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmModal({
      isOpen: true,
      title: 'Goruntu Silinsin mi?',
      message: `"${image.fileName}" kalici olarak silinecek. Bu islem geri alinamaz.`,
      onConfirm: async () => {
        try {
          await deleteImage(image.id);
          if (selectedImageId === image.id) {
            setSelectedImageId(null);
          }
          selectedIds.delete(image.id);
          setSelectedIds(new Set(selectedIds));
        } catch (error) {
          console.error('Delete failed:', error);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleBulkDelete = () => {
    const count = selectedIds.size;
    setConfirmModal({
      isOpen: true,
      title: `${count} Goruntu Silinsin mi?`,
      message: `Secilen ${count} goruntu kalici olarak silinecek. Bu islem geri alinamaz.`,
      onConfirm: async () => {
        try {
          const deletePromises = Array.from(selectedIds).map(id => deleteImage(id));
          await Promise.all(deletePromises);
          setSelectedIds(new Set());
          setSelectionMode(false);
          if (selectedImageId && selectedIds.has(selectedImageId)) {
            setSelectedImageId(null);
          }
        } catch (error) {
          console.error('Bulk delete failed:', error);
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleAnalyze = async (image: ImageData, e: React.MouseEvent) => {
    e.stopPropagation();

    if (analyzingIds.has(image.id)) return;

    setAnalyzingIds(prev => new Set(prev).add(image.id));

    try {
      const result = await analyzeImage(image.url);
      await updateImageAnalysis(image.id, result);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setAnalyzingIds(prev => {
        const next = new Set(prev);
        next.delete(image.id);
        return next;
      });
    }
  };

  const handleAnalyzeAll = async () => {
    const pendingImages = images.filter(img => !img.analyzed || !img.analysisResult?.predictions?.length);

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

  const handleBulkAnalyze = async () => {
    const selectedImages = images.filter(img => selectedIds.has(img.id) && (!img.analyzed || !img.analysisResult?.predictions?.length));

    for (const image of selectedImages) {
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
    const aggregated = getAggregatedPredictions(image);
    if (aggregated.length === 0) return null;
    return aggregated[0]; // En yuksek guvenli tahmin
  };

  // Ayni siniftaki tahminleri birlestir
  const getAggregatedPredictions = (image: ImageData) => {
    if (!image.analysisResult?.predictions?.length) return [];

    const grouped = image.analysisResult.predictions.reduce((acc, pred) => {
      if (!acc[pred.class]) {
        acc[pred.class] = { class: pred.class, confidence: pred.confidence, count: 1 };
      } else {
        // En yuksek guven oranini al ve sayiyi artir
        acc[pred.class].confidence = Math.max(acc[pred.class].confidence, pred.confidence);
        acc[pred.class].count += 1;
      }
      return acc;
    }, {} as Record<string, { class: string; confidence: number; count: number }>);

    // Guven oranina gore sirala
    return Object.values(grouped).sort((a, b) => b.confidence - a.confidence);
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

  const pendingCount = images.filter(i => !i.analyzed || !i.analysisResult?.predictions?.length).length;
  const selectedPendingCount = images.filter(i => selectedIds.has(i.id) && (!i.analyzed || !i.analysisResult?.predictions?.length)).length;

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
              {images.filter(i => i.analyzed && i.analysisResult?.predictions?.length).length} Analiz Edildi
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 border border-amber-200">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-sm font-semibold text-amber-800">
              {pendingCount} Bekliyor
            </span>
          </div>

          {/* Selection Mode Toggle */}
          <button
            onClick={() => selectionMode ? exitSelectionMode() : setSelectionMode(true)}
            className={`group flex items-center gap-2 px-4 py-2.5 font-semibold rounded-xl text-sm transition-all border-2 ${
              selectionMode
                ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600 hover:border-amber-600 shadow-lg shadow-amber-500/25'
                : 'bg-transparent text-earth-light border-[#e8dfd0] hover:border-amber-400 hover:text-amber-600'
            }`}
          >
            <svg
              className={`w-4 h-4 transition-transform ${selectionMode ? 'rotate-45' : 'group-hover:scale-110'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {selectionMode ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              )}
            </svg>
            {selectionMode ? 'Iptal' : 'Sec'}
          </button>

          {pendingCount > 0 && !selectionMode && (
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

      {/* Bulk Action Bar */}
      {selectionMode && (
        <div className="mb-6 p-4 bg-[#3d3426] rounded-2xl shadow-xl animate-slideUp">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                <span className="text-white font-bold">{selectedIds.size}</span>
              </div>
              <div>
                <p className="text-white font-semibold">
                  {selectedIds.size} goruntu secildi
                </p>
                <p className="text-amber-200 text-sm">
                  Islem yapmak icin asagidaki butonlari kullanin
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={selectAll}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                Tumunu Sec
              </button>
              <button
                onClick={deselectAll}
                disabled={selectedIds.size === 0}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 text-white hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Secimi Kaldir
              </button>
              {selectedPendingCount > 0 && (
                <button
                  onClick={handleBulkAnalyze}
                  disabled={analyzingIds.size > 0}
                  className="px-4 py-2 rounded-xl text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600 transition-all disabled:opacity-50"
                >
                  Secilenleri Analiz Et ({selectedPendingCount})
                </button>
              )}
              <button
                onClick={handleBulkDelete}
                disabled={selectedIds.size === 0}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Secilenleri Sil ({selectedIds.size})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {images.map((image, idx) => {
          const mainPrediction = getMainPrediction(image);
          const diseaseInfo = mainPrediction ? DISEASE_LABELS[mainPrediction.class] : null;
          const isAnalyzing = analyzingIds.has(image.id);
          const isSelected = selectedIds.has(image.id);

          return (
            <div
              key={image.id}
              onClick={() => selectionMode ? toggleSelection(image.id, { stopPropagation: () => {} } as React.MouseEvent) : setSelectedImageId(image.id)}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] bg-[#faf6ef] shadow-lg hover:shadow-2xl animate-slideUp border-2 ${
                isSelected ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-[#e8dfd0]'
              }`}
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

              {/* Selection Checkbox */}
              {selectionMode && (
                <div
                  className={`absolute top-3 left-3 w-8 h-8 rounded-lg flex items-center justify-center transition-all z-10 ${
                    isSelected
                      ? 'bg-amber-500 shadow-lg'
                      : 'bg-white/90 border-2 border-[#e8dfd0] group-hover:border-amber-400'
                  }`}
                >
                  {isSelected && <span className="text-white font-bold">✓</span>}
                </div>
              )}

              {/* Delete Button (non-selection mode) */}
              {!selectionMode && (
                <button
                  onClick={(e) => handleDeleteSingle(image, e)}
                  className="absolute top-3 left-3 w-8 h-8 rounded-lg bg-red-500/90 hover:bg-red-600 flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                  title="Sil"
                >
                  <span className="text-white text-sm font-bold">✕</span>
                </button>
              )}

              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                {isAnalyzing ? (
                  <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-white text-sm animate-spin">⏳</span>
                  </div>
                ) : image.analyzed && image.analysisResult?.predictions?.length ? (
                  <div className={`w-9 h-9 rounded-xl ${diseaseInfo ? getSeverityColor(diseaseInfo.severity) : 'bg-emerald-600'} flex items-center justify-center shadow-lg`}>
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                ) : !selectionMode && (
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
              {(!image.analyzed || !image.analysisResult?.predictions?.length) && !isAnalyzing && !selectionMode && (
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

      {/* Image Modal - Enhanced Design */}
      {selectedImage && !selectionMode && (() => {
        const isAnalyzing = analyzingIds.has(selectedImage.id);
        const severityConfig = {
          healthy: { color: 'emerald', label: 'Saglikli', bg: 'bg-emerald-500', bgLight: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
          low: { color: 'yellow', label: 'Dusuk Risk', bg: 'bg-yellow-500', bgLight: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
          medium: { color: 'orange', label: 'Orta Risk', bg: 'bg-orange-500', bgLight: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
          high: { color: 'red', label: 'Yuksek Risk', bg: 'bg-red-500', bgLight: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
        };

        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3d3426]/95 backdrop-blur-md animate-fadeIn"
            onClick={() => setSelectedImageId(null)}
          >
            <div
              className="relative w-full max-w-6xl max-h-[90vh] bg-[#faf6ef] rounded-3xl overflow-hidden animate-slideUp shadow-2xl flex flex-col lg:flex-row"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button - Top Right Corner */}
              <button
                onClick={() => setSelectedImageId(null)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-xl bg-[#3d3426]/80 hover:bg-[#3d3426] text-white flex items-center justify-center transition-all backdrop-blur-sm shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Left Side - Image */}
              <div className="lg:w-1/2 bg-[#2a241a] relative">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.fileName}
                  className="w-full h-64 lg:h-full object-contain"
                />
              </div>

              {/* Right Side - Details */}
              <div className="lg:w-1/2 flex flex-col overflow-y-auto max-h-[60vh] lg:max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-[#e8dfd0]">
                  <h3 className="font-display font-bold text-xl text-earth truncate pr-8">
                    {selectedImage.fileName}
                  </h3>
                  <p className="text-sm text-earth-light mt-1">
                    {selectedImage.uploadedAt?.toLocaleDateString('tr-TR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>

                  {/* Analyze Button - HER ZAMAN goster (sonuc yoksa veya tekrar analiz icin) */}
                  <div className="mt-4">
                    <button
                      onClick={(e) => handleAnalyze(selectedImage, e)}
                      disabled={isAnalyzing}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 relative overflow-hidden"
                    >
                      {isAnalyzing ? (
                        <>
                          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Analiz Ediliyor...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          {selectedImage.analyzed && selectedImage.analysisResult?.predictions?.length ? 'Tekrar Analiz Et' : 'Yapay Zeka ile Analiz Et'}
                        </>
                      )}
                    </button>

                    {/* Progress Bar */}
                    {isAnalyzing && (
                      <div className="mt-3 space-y-2">
                        <div className="h-2 bg-[#e8dfd0] rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full animate-progress" />
                        </div>
                        <p className="text-xs text-earth-light text-center">
                          YOLOv11 modeli goruntunuzu analiz ediyor...
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Analysis Results */}
                {selectedImage.analysisResult?.predictions && selectedImage.analysisResult.predictions.length > 0 && (() => {
                  // Fallback ile hastalık bilgisi al
                  const aggregated = getAggregatedPredictions(selectedImage);
                  const topPred = aggregated[0];
                  const topDiseaseInfo = topPred ? (DISEASE_INFO[topPred.class] || {
                    tr: topPred.class,
                    en: topPred.class,
                    severity: 'medium' as const,
                    icon: '🔍',
                    description: 'Tespit edilen durum.',
                    symptoms: [],
                    treatment: []
                  }) : null;
                  const topSeverity = severityConfig[topDiseaseInfo?.severity || 'medium'];

                  return (
                    <div className="flex-1 p-6 space-y-6">
                      {/* Main Diagnosis */}
                      {topPred && topDiseaseInfo && (
                        <div className={`p-5 rounded-2xl ${topSeverity.bgLight} border ${topSeverity.border}`}>
                          <div className="flex items-start gap-4">
                            <div className={`w-14 h-14 rounded-2xl ${topSeverity.bg} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                              <span className="text-2xl">{topDiseaseInfo.icon}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${topSeverity.bg} text-white`}>
                                  {topSeverity.label}
                                </span>
                              </div>
                              <h4 className="font-display font-bold text-xl text-earth">
                                {topDiseaseInfo.tr}
                              </h4>
                              <p className="text-sm text-earth-light mt-1">
                                {topDiseaseInfo.description}
                              </p>
                            </div>
                          </div>

                          {/* Confidence Bar */}
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-earth-light">Guven Orani</span>
                              <span className={`font-bold ${topSeverity.text}`}>
                                %{Math.round(topPred.confidence * 100)}
                              </span>
                            </div>
                            <div className="h-3 bg-white rounded-full overflow-hidden">
                              <div
                                className={`h-full ${topSeverity.bg} rounded-full transition-all duration-1000`}
                                style={{ width: `${topPred.confidence * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Other Detected Diseases - Accordion Design */}
                      {aggregated.length > 1 && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-earth flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Diger Tespit Edilen Durumlar ({aggregated.length - 1})
                          </h5>
                          {aggregated.slice(1).filter(p => p.class.toLowerCase() !== 'healthy').map((pred, idx) => {
                            const info = DISEASE_INFO[pred.class] || {
                              tr: pred.class,
                              en: pred.class,
                              severity: 'medium' as const,
                              icon: '🔍',
                              description: 'Tespit edilen durum.',
                              symptoms: [],
                              treatment: []
                            };
                            const predSeverity = severityConfig[info.severity || 'medium'];
                            const isExpanded = expandedDiseases.has(pred.class);

                            return (
                              <div
                                key={idx}
                                className={`rounded-xl ${predSeverity.bgLight} border ${predSeverity.border} overflow-hidden transition-all duration-300`}
                              >
                                {/* Accordion Header - Clickable */}
                                <button
                                  onClick={() => toggleDiseaseExpand(pred.class)}
                                  className="w-full flex items-center gap-3 p-3 hover:bg-white/30 transition-colors"
                                >
                                  <span className="text-lg">{info.icon}</span>
                                  <div className="flex-1 min-w-0 text-left">
                                    <div className="flex items-center gap-2">
                                      <p className="font-medium text-sm truncate text-earth">
                                        {info.tr}
                                      </p>
                                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${predSeverity.bg} text-white`}>
                                        {predSeverity.label}
                                      </span>
                                      {pred.count > 1 && (
                                        <span className="text-xs px-1.5 py-0.5 rounded-full bg-white/50 text-earth-light">
                                          {pred.count} bolge
                                        </span>
                                      )}
                                    </div>
                                    <div className="h-1.5 bg-white/50 rounded-full mt-1 overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all duration-500 ${predSeverity.bg}`}
                                        style={{ width: `${pred.confidence * 100}%` }}
                                      />
                                    </div>
                                  </div>
                                  <span className={`text-sm font-bold ${predSeverity.text}`}>
                                    %{Math.round(pred.confidence * 100)}
                                  </span>
                                  {/* Expand/Collapse Arrow */}
                                  <svg
                                    className={`w-5 h-5 text-earth-light transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>

                                {/* Accordion Content - Expandable */}
                                {isExpanded && (
                                  <div className="px-4 pb-4 pt-1 border-t border-white/30 animate-slideUp">
                                    {/* Description */}
                                    <p className="text-sm text-earth-light mb-3">
                                      {info.description}
                                    </p>

                                    {/* Symptoms */}
                                    {info.symptoms && info.symptoms.length > 0 && (
                                      <div className="mb-3">
                                        <h6 className="font-semibold text-sm text-earth mb-2 flex items-center gap-1">
                                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                          </svg>
                                          Belirtiler
                                        </h6>
                                        <ul className="space-y-1">
                                          {info.symptoms.map((symptom, sIdx) => (
                                            <li key={sIdx} className="flex items-start gap-2 text-xs text-earth-light">
                                              <span className="text-amber-500 mt-0.5">•</span>
                                              {symptom}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}

                                    {/* Treatment */}
                                    {info.treatment && info.treatment.length > 0 && (
                                      <div className="bg-emerald-50/50 border border-emerald-200/50 rounded-xl p-3">
                                        <h6 className="font-semibold text-sm text-emerald-800 mb-2 flex items-center gap-1">
                                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                          </svg>
                                          Tedavi Onerileri
                                        </h6>
                                        <ul className="space-y-1">
                                          {info.treatment.map((item, tIdx) => (
                                            <li key={tIdx} className="flex items-start gap-2 text-xs text-emerald-700">
                                              <span className="text-emerald-500 mt-0.5 font-bold">{tIdx + 1}.</span>
                                              {item}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Symptoms */}
                      {topDiseaseInfo && topDiseaseInfo.symptoms.length > 0 && topDiseaseInfo.severity !== 'healthy' && (
                        <div>
                          <h5 className="font-semibold text-earth mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Belirtiler
                          </h5>
                          <ul className="space-y-2">
                            {topDiseaseInfo.symptoms.map((symptom, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-earth-light">
                                <span className="text-amber-500 mt-0.5">•</span>
                                {symptom}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Treatment */}
                      {topDiseaseInfo && topDiseaseInfo.treatment.length > 0 && (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                          <h5 className="font-semibold text-emerald-800 mb-3 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {topDiseaseInfo.severity === 'healthy' ? 'Oneriler' : 'Tedavi Onerileri'}
                          </h5>
                          <ul className="space-y-2">
                            {topDiseaseInfo.treatment.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-emerald-700">
                                <span className="text-emerald-500 mt-0.5 font-bold">{idx + 1}.</span>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Not Analyzed State */}
                {!selectedImage.analyzed && !isAnalyzing && (
                  <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-20 h-20 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
                      <span className="text-4xl">🔬</span>
                    </div>
                    <h4 className="font-display font-bold text-lg text-earth">Analiz Bekleniyor</h4>
                    <p className="text-earth-light text-sm mt-1 max-w-xs">
                      Yapay zeka modelimiz ile bu goruntuyu analiz edin ve hastalik tespiti yapin
                    </p>
                  </div>
                )}

                {/* Analyzing State */}
                {!selectedImage.analyzed && isAnalyzing && (
                  <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                    <div className="w-24 h-24 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4 animate-pulse-glow">
                      <div className="relative">
                        <span className="text-5xl">🌿</span>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <h4 className="font-display font-bold text-lg text-earth">Yaprak Analiz Ediliyor</h4>
                    <p className="text-earth-light text-sm mt-1 max-w-xs">
                      YOLOv11 modeli goruntuyu tarıyor ve hastalik belirtilerini arıyor...
                    </p>
                    <div className="mt-4 w-full max-w-xs">
                      <div className="flex justify-between text-xs text-earth-light mb-1">
                        <span>Analiz ediliyor</span>
                        <span className="text-emerald-600 font-medium">Lutfen bekleyin</span>
                      </div>
                      <div className="h-2 bg-[#e8dfd0] rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full animate-progress" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Confirm Modal */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText="Sil"
        cancelText="Vazgec"
        type="danger"
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
