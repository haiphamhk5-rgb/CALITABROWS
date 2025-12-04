
import React, { useState, ChangeEvent } from 'react';

interface InputFormProps {
  onSubmit: (data: { name: string; dob: string; job: string; browPreference: string; hasOldTattoo: boolean; imageFile: File }) => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [job, setJob] = useState('');
  const [browPreference, setBrowPreference] = useState('Tự Nhiên'); // Default
  const [hasOldTattoo, setHasOldTattoo] = useState(false); // Default: Virgin brows
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && dob && job && imageFile) {
      onSubmit({ name, dob, job, browPreference, hasOldTattoo, imageFile });
    }
  };

  const preferences = [
    { id: 'Tự Nhiên', label: 'Tự Nhiên', desc: 'Dáng chuẩn, hài hòa' },
    { id: 'Tự Nhiên (Nhỏ)', label: 'Tự Nhiên (Nhỏ)', desc: 'Thanh thoát, gọn gàng' },
    { id: 'Mảnh Mai (Nhỏ Nhất)', label: 'Mảnh Mai', desc: 'Nhỏ nhất, tinh tế' },
  ];

  return (
    <div className="max-w-4xl mx-auto bg-tech-surface/50 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl">
      <div className="grid md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
              <div>
                  <h3 className="text-2xl font-heading font-bold text-white mb-2">Bắt Đầu Phân Tích</h3>
                  <p className="text-slate-400 text-sm">Tải lên ảnh chân dung để AI phân tích đường nét, nhân tướng và thần thái của bạn.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-tech-accent uppercase tracking-wider">Họ và Tên</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nhập tên của bạn..."
                    className="w-full px-5 py-4 bg-tech-bg/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-tech-primary focus:border-transparent outline-none transition-all placeholder-slate-600"
                  />
                </div>

                {/* DOB Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-tech-accent uppercase tracking-wider">Ngày Tháng Năm Sinh</label>
                  <input
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-5 py-4 bg-tech-bg/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-tech-primary focus:border-transparent outline-none transition-all placeholder-slate-600"
                  />
                </div>

                {/* Job Input */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-tech-accent uppercase tracking-wider">Nghề Nghiệp Hiện Tại</label>
                  <input
                    type="text"
                    required
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    placeholder="Ví dụ: Kinh doanh, CEO, Thiết kế..."
                    className="w-full px-5 py-4 bg-tech-bg/50 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-tech-primary focus:border-transparent outline-none transition-all placeholder-slate-600"
                  />
                </div>

                {/* Brow Preference Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-tech-accent uppercase tracking-wider">Sở Thích Dáng Mày</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {preferences.map((pref) => (
                      <button
                        key={pref.id}
                        type="button"
                        onClick={() => setBrowPreference(pref.id)}
                        className={`
                          relative px-2 py-3 rounded-xl border text-left transition-all duration-200
                          ${browPreference === pref.id 
                            ? 'bg-tech-primary/20 border-tech-primary text-white' 
                            : 'bg-tech-bg/30 border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200'}
                        `}
                      >
                        <div className="flex flex-col items-center text-center">
                           <span className="font-bold text-xs mb-1">{pref.label}</span>
                           <span className="text-[10px] opacity-70 leading-tight">{pref.desc}</span>
                        </div>
                        {browPreference === pref.id && (
                          <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-tech-accent animate-pulse"></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Old Tattoo Status */}
                <div className="space-y-2">
                   <label className="text-xs font-semibold text-tech-accent uppercase tracking-wider">Tình Trạng Chân Mày</label>
                   <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setHasOldTattoo(false)}
                        className={`px-4 py-3 rounded-xl border transition-all duration-200 font-medium text-sm
                          ${!hasOldTattoo 
                            ? 'bg-green-500/20 border-green-500 text-white' 
                            : 'bg-tech-bg/30 border-white/5 text-slate-400 hover:bg-white/5'}
                        `}
                      >
                        ✨ Chưa từng làm
                      </button>
                      <button
                        type="button"
                        onClick={() => setHasOldTattoo(true)}
                        className={`px-4 py-3 rounded-xl border transition-all duration-200 font-medium text-sm
                          ${hasOldTattoo 
                            ? 'bg-orange-500/20 border-orange-500 text-white' 
                            : 'bg-tech-bg/30 border-white/5 text-slate-400 hover:bg-white/5'}
                        `}
                      >
                        🛠 Đã từng làm (Sửa)
                      </button>
                   </div>
                   {hasOldTattoo && (
                      <p className="text-[10px] text-orange-400 italic mt-1">
                        * AI sẽ tự động chỉnh dáng mày nhỏ hơn, thanh thoát hơn để khắc phục dáng cũ.
                      </p>
                   )}
                </div>

                <button
                  type="submit"
                  disabled={!imageFile || !name || !dob || !job || isLoading}
                  className={`
                    w-full py-4 px-6 rounded-full font-bold text-lg shadow-lg transform transition-all duration-300 mt-4
                    ${(!imageFile || !name || !dob || !job || isLoading) 
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-white/5' 
                      : 'bg-gradient-primary text-white hover:shadow-tech-primary/50 hover:shadow-xl hover:-translate-y-1 active:scale-95'}
                  `}
                >
                  {isLoading ? 'Đang Xử Lý & Tạo Ảnh...' : 'Phân Tích Ngay'}
                </button>
              </form>
          </div>

          {/* Image Upload Area */}
          <div className="flex flex-col h-full">
            <label 
                htmlFor="image-upload" 
                className={`
                  flex-1 min-h-[300px] border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden group
                  ${previewUrl ? 'border-tech-primary/50' : 'border-white/10 hover:border-tech-accent/50 hover:bg-white/5'}
                `}
              >
                {previewUrl ? (
                  <>
                    <img src={previewUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm">Đổi Ảnh Khác</span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-tech-card to-tech-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border border-white/5 group-hover:border-tech-accent/30 transition-colors">
                        <svg className="h-8 w-8 text-slate-400 group-hover:text-tech-accent transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h4 className="text-white font-semibold mb-2">Tải Ảnh Lên</h4>
                    <p className="text-slate-500 text-sm max-w-[200px] mx-auto">Nhấp để chọn hoặc kéo thả ảnh chân dung vào đây</p>
                  </div>
                )}
                <input 
                  id="image-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageChange}
                />
              </label>
          </div>
      </div>
    </div>
  );
};
