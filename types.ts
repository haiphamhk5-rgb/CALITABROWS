
export interface FaceAnalysis {
  goldenRatio: string;
  features: string; // Trán, mũi, xương chân mày
  aura: string; // Phong thái tổng thể
  eyes: string; // Vùng mắt
  dominantEnergy: string; // Khí chất chủ đạo
  currentBrowProblems: string; // New field: Phân tích lỗi và nỗi đau
}

export interface BrowStyle {
  name: string;
  reason: string;
  effectOnFace: string;
  impression: string;
  jobSuitability: string;
  imageUrl?: string; // New field for generated brow image
  isRecommended: boolean; // New field to mark the best style
}

export interface ColorSuggestion {
  color: string;
  reason: string;
  isSuitableForSkin: boolean; // Added for strict checking logic if needed, optional
}

export interface BeforeAfter {
  softnessIncrease: string;
  brightnessIncrease: string;
  yearsYounger: string;
  firstImpression: string;
}

export interface Numerology {
  mainNumber: string;
  soulMission: string;
  lifePhase: string;
  yearlyLesson: string;
  careerEnergy: string;
  connectionToBrow: string;
}

export interface LifeAdvice {
  currentPhase: string;
  focusThisYear: string;
  postureToBuild: string;
}

export interface SoftClosing {
  suggestions: string[]; // Các câu gợi mở chốt đơn
  finalNote: string;
}

export interface AnalysisResult {
  faceAnalysis: FaceAnalysis;
  browStyles: BrowStyle[];
  colorSuggestion: ColorSuggestion;
  beforeAfter: BeforeAfter;
  numerology: Numerology;
  lifeAdvice: LifeAdvice;
  softClosing: SoftClosing;
}

export interface UserInput {
  name: string; // New field
  dob: string;
  job: string;
  browPreference: string; // New field for brow preference
  hasOldTattoo: boolean; // New field: Check if user has old brow tattoo
  imageFile: File | null;
}
