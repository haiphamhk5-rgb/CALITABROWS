
import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { analyzeProfile } from './services/geminiService';
import { AnalysisResult } from './types';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);

  const handleAnalysis = async (data: { name: string; dob: string; job: string; browPreference: string; hasOldTattoo: boolean; imageFile: File }) => {
    setLoading(true);
    setError(null);
    setResult(null);

    // Create a local URL for the image to display in the result
    const objectUrl = URL.createObjectURL(data.imageFile);
    setUserImagePreview(objectUrl);

    try {
      const analysisData = await analyzeProfile(data.imageFile, data.name, data.dob, data.job, data.browPreference, data.hasOldTattoo);
      setResult(analysisData);
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra trong quá trình phân tích. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-tech-bg text-slate-200 selection:bg-tech-primary selection:text-white relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-tech-primary/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-tech-accent/10 rounded-full blur-[100px]"></div>
      </div>

      <header className="py-6 px-4 md:px-8 sticky top-0 z-50 backdrop-blur-md border-b border-white/5 bg-tech-bg/80">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center font-bold text-white">C</div>
                <h1 className="text-xl font-heading font-bold text-white tracking-wide">
                  CALITA <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI</span>
                </h1>
            </div>
            
            {/* Removed Nav Links as requested */}
            <div className="hidden md:block"></div> 

            {!result && !loading && (
                <button className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full transition-all border border-white/10">
                    Chế Độ Chuyên Gia
                </button>
            )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        {error && (
            <div className="max-w-lg mx-auto mb-10 p-4 bg-red-500/10 text-red-200 rounded-xl border border-red-500/20 text-center backdrop-blur-sm">
                {error}
                <button onClick={() => setError(null)} className="block mx-auto mt-2 text-sm underline hover:text-white">Thử lại</button>
            </div>
        )}

        {!result && (
          <div className="flex flex-col items-center">
            {!loading && (
                <div className="text-center mb-16 max-w-4xl mx-auto animate-fadeIn">
                    <span className="text-tech-accent text-xs font-bold tracking-[0.2em] uppercase mb-4 block">CÔNG NGHỆ LÀM ĐẸP AI TIÊN TIẾN 2025</span>
                    <h2 className="text-5xl md:text-7xl font-heading font-bold text-white mb-6 leading-tight">
                        Kiến Tạo <span className="text-gradient">Tương Lai</span> <br/>
                        Chân Mày Phong Thủy
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto mb-8 font-light">
                        Khai phá tiềm năng vẻ đẹp của bạn với công nghệ AI. 
                        Phân tích nhân tướng, thần số học và tạo dáng mày 8K chỉ trong vài giây.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <div className="h-1 w-12 bg-tech-primary rounded-full"></div>
                        <div className="h-1 w-2 bg-slate-700 rounded-full"></div>
                        <div className="h-1 w-2 bg-slate-700 rounded-full"></div>
                    </div>
                </div>
            )}
            
            <div className="w-full">
                {loading ? (
                    <div className="max-w-md mx-auto text-center space-y-8 py-20 fade-in">
                        <div className="relative w-32 h-32 mx-auto">
                             <div className="absolute inset-0 rounded-full border-2 border-tech-primary/30"></div>
                             <div className="absolute inset-0 rounded-full border-t-2 border-tech-accent animate-spin"></div>
                             <div className="absolute inset-4 rounded-full border-2 border-tech-secondary/20"></div>
                             <div className="absolute inset-4 rounded-full border-b-2 border-tech-secondary animate-spin" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
                             <div className="absolute inset-0 flex items-center justify-center">
                                 <span className="text-3xl animate-pulse">AI</span>
                             </div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-heading font-bold text-white mb-2">Đang Phân Tích & Tạo Ảnh...</h3>
                            <p className="text-slate-400">Hệ thống đang thiết kế 3 dáng mày phù hợp nhất cho bạn...</p>
                        </div>
                    </div>
                ) : (
                    <InputForm onSubmit={handleAnalysis} isLoading={loading} />
                )}
            </div>
          </div>
        )}

        {result && (
            <AnalysisDisplay result={result} userImage={userImagePreview} />
        )}
      </main>

      <footer className="border-t border-white/5 bg-tech-bg/50 backdrop-blur-lg py-12 mt-12">
         <div className="container mx-auto px-4 text-center">
             <div className="flex items-center justify-center gap-2 mb-4">
                 <div className="w-6 h-6 rounded bg-gradient-primary"></div>
                 <span className="font-heading font-bold text-lg">CALITA AI</span>
             </div>
             <p className="text-slate-500 text-sm">© 2025 Calita AI Technology. Kiến tạo vẻ đẹp tương lai.</p>
         </div>
      </footer>
    </div>
  );
};

export default App;
