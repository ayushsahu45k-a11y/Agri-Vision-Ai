import React, { useState, useRef } from 'react';
import { Upload, X, Scan, TestTube, Loader2, Sparkles } from 'lucide-react';
import { Button } from '../components/Layout';
import { analyzeCropImage, fileToGenerativePart, getTreatmentPlan } from '../services/geminiService';
import { AnalysisResult, Language } from '../types';
import ReactMarkdown from 'react-markdown';
import { t } from '../utils/translations';

interface AnalyzerProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  language: Language;
}

export const Analyzer: React.FC<AnalyzerProps> = ({ onAnalysisComplete, language }) => {
  const [image, setImage] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loadingTreatment, setLoadingTreatment] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setImage(URL.createObjectURL(selectedFile));
      setResult(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file || !image) return;

    setAnalyzing(true);
    try {
      const base64Data = await fileToGenerativePart(file);
      const data = await analyzeCropImage(base64Data, file.type, language);
      
      const newResult: AnalysisResult = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        imageUrl: image,
        cropDetected: data.cropDetected,
        condition: data.condition,
        healthScore: data.healthScore,
        diagnosis: data.diagnosis,
        reasoning: data.reasoning
      };
      
      setResult(newResult);
      onAnalysisComplete(newResult);
    } catch (error) {
      alert("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGetTreatment = async () => {
    if (!result) return;
    setLoadingTreatment(true);
    const plan = await getTreatmentPlan(result.diagnosis, result.cropDetected, language);
    setResult({ ...result, treatmentPlan: plan });
    setLoadingTreatment(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">{t.diagnosticsTitle[language]}</h2>
        <p className="text-gray-400">{t.diagnosticsDesc[language]}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Col: Upload & Image */}
        <div className="space-y-6">
          <div className={`
            relative aspect-square rounded-2xl overflow-hidden border-2 border-dashed 
            ${image ? 'border-agri-main' : 'border-gray-700 hover:border-agri-main/50'} 
            transition-all group glass-panel flex flex-col items-center justify-center
          `}>
            {image ? (
              <>
                <img src={image} alt="Upload" className="w-full h-full object-cover" />
                <button 
                  onClick={() => { setImage(null); setFile(null); setResult(null); }}
                  className="absolute top-4 right-4 p-2 bg-black/60 rounded-full text-white hover:bg-red-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer text-center p-8 w-full h-full flex flex-col items-center justify-center"
              >
                <div className="w-20 h-20 rounded-full bg-agri-main/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-agri-main" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-white">{t.uploadPhoto[language]}</h3>
                <p className="text-sm text-gray-500 mt-2">Tap to browse or drag and drop</p>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
            )}
            
            {/* Scanning Overlay Animation */}
            {analyzing && (
              <div className="absolute inset-0 bg-agri-dark/40 z-10">
                <div className="w-full h-1 bg-agri-accent shadow-[0_0_15px_var(--color-agri-accent)] animate-[scan_2s_ease-in-out_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin text-agri-accent mb-2" size={40} />
                    <span className="text-agri-accent font-mono text-sm tracking-widest">{t.analyzing[language]}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {!result && (
            <Button 
              onClick={handleAnalyze} 
              disabled={!file || analyzing}
              className="w-full"
            >
              <Scan className="mr-2" />
              {analyzing ? t.processing[language] : t.startAnalysis[language]}
            </Button>
          )}
        </div>

        {/* Right Col: Results */}
        <div className="relative">
          {result ? (
            <div className="glass-panel p-6 rounded-2xl border-t-4 border-agri-main animate-slide-up space-y-6 h-full overflow-y-auto max-h-[600px]">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b border-gray-700 pb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white capitalize">{result.cropDetected}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      result.condition === 'Healthy' ? 'bg-agri-main/20 text-agri-accent' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {result.condition.toUpperCase()}
                    </span>
                    <span className="text-gray-400 text-xs">| {new Date(result.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${result.healthScore > 70 ? 'text-agri-accent' : 'text-yellow-400'}`}>
                    {result.healthScore}%
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wide">Health</div>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <h4 className="text-agri-accent text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <TestTube size={16} /> {t.diagnosis[language]}
                </h4>
                <p className="text-white text-lg font-medium">{result.diagnosis}</p>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed">{result.reasoning}</p>
              </div>

              {/* AI Analysis With Us - Action Button */}
              {!result.treatmentPlan ? (
                <div className="pt-4">
                  <button 
                    onClick={handleGetTreatment}
                    disabled={loadingTreatment}
                    className="w-full group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-4 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-900/50"
                  >
                    <div className="relative z-10 flex items-center justify-center gap-2 text-white font-bold">
                      {loadingTreatment ? <Loader2 className="animate-spin" /> : <Sparkles />}
                      {loadingTreatment ? t.generating[language] : t.getTreatment[language]}
                    </div>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
                  <p className="text-center text-xs text-gray-500 mt-2">Get personalized treatment steps from our advanced AI.</p>
                </div>
              ) : (
                <div className="mt-4 bg-blue-900/20 rounded-xl p-4 border border-blue-500/30 animate-fade-in">
                  <h4 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                    <Sparkles size={16} /> {t.treatmentPlan[language]}
                  </h4>
                  <div className="prose prose-invert prose-sm max-w-none text-gray-300">
                    <ReactMarkdown>{result.treatmentPlan}</ReactMarkdown>
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 border-2 border-dashed border-gray-800 rounded-2xl text-gray-600">
              <div className="text-center">
                <Scan size={48} className="mx-auto mb-4 opacity-50" />
                <p>Analysis results will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};