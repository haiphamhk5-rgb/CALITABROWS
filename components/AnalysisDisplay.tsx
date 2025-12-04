
import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisDisplayProps {
  result: AnalysisResult;
  userImage: string | null;
}

export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, userImage }) => {
  return (
    <div className="max-w-6xl mx-auto pb-20 space-y-16 fade-in">
      
      {/* 1. Face Analysis Hero */}
      <section className="relative bg-tech-surface border border-white/5 rounded-[2rem] overflow-hidden p-8 md:p-12">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tech-primary/10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="relative z-10 grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-4">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl group">
                    {userImage && <img src={userImage} alt="User" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-tech-bg/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                        <span className="bg-tech-primary text-white text-xs font-bold px-2 py-1 rounded">QUÉT GƯƠNG MẶT</span>
                    </div>
                </div>
            </div>
            
            <div className="md:col-span-8 space-y-8">
                <div>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-2">Phân Tích Gương Mặt</h2>
                    <p className="text-tech-accent font-medium text-lg">{result.faceAnalysis.dominantEnergy}</p>
                </div>

                {/* New Section: Current Brow Diagnosis (Pain Points) */}
                <div className="bg-orange-500/10 border border-orange-500/30 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                    <div className="flex items-start gap-4">
                        <span className="text-2xl mt-1">⚠️</span>
                        <div>
                            <h4 className="text-orange-400 font-bold text-sm uppercase mb-2">Chẩn Đoán Tình Trạng Hiện Tại</h4>
                            <p className="text-slate-200 leading-relaxed italic">
                                "{result.faceAnalysis.currentBrowProblems}"
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { label: 'Tỷ lệ khuôn mặt', val: result.faceAnalysis.goldenRatio, icon: '📐' },
                        { label: 'Đặc điểm ngũ quan', val: result.faceAnalysis.features, icon: '✨' },
                        { label: 'Phong thái & Aura', val: result.faceAnalysis.aura, icon: '🔮' },
                        { label: 'Phân tích ánh nhìn', val: result.faceAnalysis.eyes, icon: '👁️' },
                    ].map((item, idx) => (
                        <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-lg">{item.icon}</span>
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{item.label}</span>
                            </div>
                            <p className="text-slate-200 font-medium">{item.val}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* 2. Brow Styles Cards with AI Images */}
      <section>
        <div className="flex items-end justify-between mb-8">
             <div>
                <span className="text-tech-accent text-xs font-bold uppercase tracking-wider">GỢI Ý PHONG CÁCH 2025</span>
                <h3 className="text-3xl font-heading font-bold text-white mt-1">3 Dáng Mày Thiết Kế Riêng</h3>
                <p className="text-slate-400 text-sm mt-2">Mô phỏng AI độ phân giải 8K - Hiệu ứng trong veo tự nhiên</p>
             </div>
             <div className="hidden md:block h-px flex-1 bg-white/10 ml-8 mb-2"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
            {result.browStyles.map((style, idx) => {
                const isRecommended = style.isRecommended;
                return (
                  <div 
                    key={idx} 
                    className={`
                        group bg-tech-surface p-6 rounded-3xl transition-all duration-300 relative overflow-hidden flex flex-col
                        ${isRecommended 
                            ? 'border-2 border-tech-primary shadow-2xl shadow-tech-primary/20 scale-105 z-10' 
                            : 'border border-white/5 hover:border-tech-primary/50 hover:-translate-y-2'
                        }
                    `}
                  >
                    {isRecommended && (
                         <div className="absolute top-0 right-0 bg-gradient-to-r from-tech-primary to-tech-secondary text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl z-20 shadow-lg">
                             CHUYÊN GIA ĐỀ XUẤT
                         </div>
                    )}

                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-tech-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Generated Image Display */}
                    <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-6 bg-black/20 border border-white/5">
                        {style.imageUrl ? (
                           <>
                             <img src={style.imageUrl} alt={style.name} className="w-full h-full object-cover" />
                             <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] text-white/80 font-bold border border-white/10">
                                AI HEALED EFFECT
                             </div>
                           </>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500">
                             <svg className="w-8 h-8 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                             <span className="text-xs">Đang mô phỏng...</span>
                          </div>
                        )}
                    </div>

                    <h4 className={`text-2xl font-heading font-bold mb-2 ${isRecommended ? 'text-tech-accent' : 'text-white'}`}>{style.name}</h4>
                    <p className="text-slate-400 text-sm italic mb-4">{style.impression}</p>
                    
                    <div className="space-y-4 flex-1">
                        <div>
                            <span className="text-slate-500 text-xs uppercase block mb-1">Tại sao hợp?</span>
                            <p className="text-slate-300 text-sm leading-relaxed">{style.reason}</p>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-white/5">
                         <div className="flex items-center gap-2">
                             <div className={`w-2 h-2 rounded-full ${isRecommended ? 'bg-tech-accent animate-pulse' : 'bg-green-500'}`}></div>
                             <p className="text-xs text-slate-400 font-medium">Hợp nghề: <span className="text-white">{style.jobSuitability}</span></p>
                         </div>
                    </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* 3. Color & Simulation (Tech Stats View) */}
      <section className="grid md:grid-cols-2 gap-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-1">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="bg-tech-bg/90 backdrop-blur-xl h-full rounded-[20px] p-8 md:p-10 flex flex-col justify-center relative z-10">
                  <span className="text-tech-accent text-xs font-bold uppercase mb-2">MÀU MỰC ĐỀ XUẤT</span>
                  <h3 className="text-4xl font-heading font-bold text-white mb-4">{result.colorSuggestion.color}</h3>
                  <p className="text-slate-300 leading-relaxed mb-6">{result.colorSuggestion.reason}</p>
                  <div className="flex items-center gap-2 mt-auto">
                      <div className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-tech-accent w-[85%]"></div>
                      </div>
                      <span className="text-xs text-slate-400">Phù hợp 98%</span>
                  </div>
              </div>
          </div>
          
          <div className="bg-tech-surface border border-white/5 p-8 md:p-10 rounded-3xl">
             <h3 className="text-2xl font-heading font-bold text-white mb-8">Dự Đoán Kết Quả</h3>
             <div className="space-y-6">
                 {[
                    { label: 'Độ mềm mại', val: result.beforeAfter.softnessIncrease, w: '80%' },
                    { label: 'Sáng khuôn mặt', val: result.beforeAfter.brightnessIncrease, w: '90%' },
                    { label: 'Trẻ hóa', val: result.beforeAfter.yearsYounger, w: '75%' },
                 ].map((stat, i) => (
                    <div key={i}>
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-slate-400 text-sm">{stat.label}</span>
                            <span className="text-white font-bold text-lg">{stat.val}</span>
                        </div>
                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-tech-primary to-tech-secondary rounded-full" style={{width: stat.w}}></div>
                        </div>
                    </div>
                 ))}
                 
                 <div className="bg-white/5 p-4 rounded-xl border border-white/5 mt-6">
                     <p className="text-slate-300 italic text-center text-sm">"{result.beforeAfter.firstImpression}"</p>
                 </div>
             </div>
          </div>
      </section>

      {/* 4. Numerology - Dark Mode */}
      <section className="relative rounded-3xl overflow-hidden bg-tech-surface border border-white/5">
          <div className="absolute inset-0">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-black/80"></div>
          </div>
          
          <div className="relative z-10 p-8 md:p-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b border-white/10 pb-8">
                  <div>
                    <h3 className="text-3xl font-heading font-bold text-white">Thần Số Học</h3>
                    <p className="text-slate-400">Giải mã năng lượng từ ngày sinh của bạn (Năm 2025)</p>
                  </div>
                  <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
                      <div className="text-right">
                          <span className="block text-xs text-slate-400 uppercase">Con số chủ đạo</span>
                          <span className="block text-2xl font-bold text-tech-accent">SỐ {result.numerology.mainNumber}</span>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-tech-accent/20 flex items-center justify-center text-tech-accent font-bold">
                          #
                      </div>
                  </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                      <div className="bg-tech-bg/50 p-6 rounded-2xl border border-white/5">
                          <h5 className="text-tech-secondary font-bold text-sm uppercase mb-2">Sứ mệnh linh hồn</h5>
                          <p className="text-white leading-relaxed">{result.numerology.soulMission}</p>
                      </div>
                      <div className="bg-tech-bg/50 p-6 rounded-2xl border border-white/5">
                          <h5 className="text-tech-secondary font-bold text-sm uppercase mb-2">Bài học năm 2025</h5>
                          <p className="text-slate-300 leading-relaxed text-sm">{result.numerology.yearlyLesson}</p>
                      </div>
                  </div>

                  <div className="space-y-8">
                        <div>
                             <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                <span className="w-1 h-6 bg-tech-primary rounded-full"></span>
                                Kết nối dáng mày
                             </h4>
                             <p className="text-slate-300 text-sm leading-relaxed">{result.numerology.connectionToBrow}</p>
                        </div>
                        <div>
                             <h4 className="text-white font-bold mb-3 flex items-center gap-2">
                                <span className="w-1 h-6 bg-tech-accent rounded-full"></span>
                                Giai đoạn & Lời khuyên
                             </h4>
                             <p className="text-slate-300 text-sm leading-relaxed mb-2">{result.lifeAdvice.currentPhase}</p>
                             <p className="text-slate-300 text-sm leading-relaxed">{result.lifeAdvice.focusThisYear}</p>
                        </div>
                  </div>
              </div>
          </div>
      </section>

      {/* 5. Soft Closing - Minimalist */}
      <section className="text-center max-w-3xl mx-auto space-y-8 py-8">
          <div className="space-y-4">
              {result.softClosing.suggestions.map((suggestion, idx) => (
                  <p key={idx} className="text-xl md:text-2xl text-white font-medium font-heading">
                      "{suggestion}"
                  </p>
              ))}
          </div>
          
          <p className="text-slate-500 italic leading-relaxed">
              {result.softClosing.finalNote}
          </p>

          <div className="pt-8">
             <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm uppercase tracking-widest font-bold"
             >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
                Phân Tích Mới
             </button>
          </div>
      </section>
    </div>
  );
};
