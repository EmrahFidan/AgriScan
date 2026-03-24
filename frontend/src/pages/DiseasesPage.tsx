import { useState } from 'react';
import { Link } from 'react-router-dom';
import { DISEASE_INFO } from '../services/api';

export default function DiseasesPage() {
  const [selectedDisease, setSelectedDisease] = useState<string | null>(null);

  const severityConfig = {
    healthy: {
      label: 'Healthy',
      bg: 'bg-emerald-500',
      bgLight: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      description: 'Plant is healthy with no disease symptoms.'
    },
    low: {
      label: 'Low Risk',
      bg: 'bg-yellow-500',
      bgLight: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-700',
      description: 'Can be easily controlled with early intervention.'
    },
    medium: {
      label: 'Medium Risk',
      bg: 'bg-orange-500',
      bgLight: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      description: 'Requires careful monitoring and timely intervention.'
    },
    high: {
      label: 'High Risk',
      bg: 'bg-red-500',
      bgLight: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      description: 'Requires immediate action, spreads rapidly!'
    }
  };

  const diseases = Object.entries(DISEASE_INFO);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 bg-[#faf6ef] border-b border-[#e8dfd0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-[#6b5d4d] mb-4">
            <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#3d3426] font-medium">Diseases</span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#3d3426] mb-4">
            Tomato Leaf Diseases Guide
          </h1>
          <p className="text-lg text-[#6b5d4d] max-w-3xl">
            Detailed information about 9 different disease classes that our YOLOv11 model can detect.
            Explore symptoms, causes, and treatment methods for each disease.
          </p>
        </div>
      </section>

      {/* Risk Legend */}
      <section className="py-6 bg-[#f5f0e8] border-b border-[#e8dfd0]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-[#3d3426]">Risk Levels:</span>
            {Object.entries(severityConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${config.bg}`}></div>
                <span className="text-sm text-[#6b5d4d]">{config.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diseases Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid gap-8">
            {diseases.map(([key, disease]) => {
              const severity = severityConfig[disease.severity];
              const isExpanded = selectedDisease === key;

              return (
                <div
                  key={key}
                  className={`rounded-2xl border-2 overflow-hidden transition-all duration-300 ${
                    isExpanded ? `${severity.border} shadow-xl` : 'border-[#e8dfd0] hover:border-[#d4c4b0]'
                  }`}
                >
                  {/* Disease Header - Always Visible */}
                  <button
                    onClick={() => setSelectedDisease(isExpanded ? null : key)}
                    className={`w-full p-6 text-left transition-colors ${
                      isExpanded ? severity.bgLight : 'bg-white hover:bg-[#faf6ef]'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-16 h-16 ${severity.bg} rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg`}>
                        {disease.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className={`text-xs font-bold px-3 py-1 rounded-full ${severity.bg} text-white`}>
                            {severity.label}
                          </span>
                          <span className="text-xs text-[#6b5d4d] bg-[#f5f0e8] px-2 py-1 rounded-full">
                            {disease.en}
                          </span>
                        </div>
                        <h2 className="font-display text-2xl font-bold text-[#3d3426] mb-2">
                          {disease.tr}
                        </h2>
                        <p className="text-[#6b5d4d]">
                          {disease.description}
                        </p>
                      </div>

                      {/* Expand Arrow */}
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        isExpanded ? `${severity.bg} text-white` : 'bg-[#f5f0e8] text-[#6b5d4d]'
                      }`}>
                        <svg
                          className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="border-t border-[#e8dfd0]">
                      <div className="grid md:grid-cols-2 gap-0">
                        {/* Symptoms Column */}
                        <div className="p-6 bg-white border-b md:border-b-0 md:border-r border-[#e8dfd0]">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                            <h3 className="font-display font-bold text-lg text-[#3d3426]">Symptoms</h3>
                          </div>

                          {disease.symptoms.length > 0 ? (
                            <ul className="space-y-3">
                              {disease.symptoms.map((symptom, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                  <div className={`w-2 h-2 rounded-full ${severity.bg} mt-2 flex-shrink-0`}></div>
                                  <span className="text-[#6b5d4d]">{symptom}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="text-[#6b5d4d] italic">No disease symptoms - healthy leaf.</p>
                          )}
                        </div>

                        {/* Treatment Column */}
                        <div className="p-6 bg-emerald-50/50">
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                              <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h3 className="font-display font-bold text-lg text-[#3d3426]">
                              {disease.severity === 'healthy' ? 'Care Tips' : 'Treatment Methods'}
                            </h3>
                          </div>

                          <ul className="space-y-3">
                            {disease.treatment.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                                  {idx + 1}
                                </div>
                                <span className="text-[#6b5d4d]">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Warning for High Risk */}
                      {disease.severity === 'high' && (
                        <div className="p-4 bg-red-100 border-t border-red-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-bold text-red-800">Warning: High Risk Disease!</p>
                              <p className="text-sm text-red-700">This disease can spread rapidly. Immediately isolate infected plants and protect neighboring plants with preventive measures.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-[#3d3426]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Analyze Your Leaves?
          </h2>
          <p className="text-[#d4c4b0] mb-8">
            Upload your images and let AI detect diseases in seconds.
          </p>
          <Link
            to="/lab"
            className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-[#3d3426] font-bold rounded-xl text-lg transition-all shadow-lg hover:shadow-xl inline-flex items-center gap-2"
          >
            <span>Go to Analysis Lab</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-[#2a241a]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                🌿
              </div>
              <div>
                <p className="font-display text-xl font-bold text-[#faf6ef]">AgriScan</p>
                <p className="text-sm text-[#d4c4b0]">Smart Agriculture Solutions</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Link to="/" className="text-[#d4c4b0] hover:text-white transition-colors">Home</Link>
              <Link to="/lab" className="text-[#d4c4b0] hover:text-white transition-colors">Laboratory</Link>
              <Link to="/diseases" className="text-amber-400 font-medium">Diseases</Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#4a3f35] text-center text-sm text-[#a89880]">
            2024 AgriScan - Powered by YOLOv11 AI Model
          </div>
        </div>
      </footer>
    </div>
  );
}
