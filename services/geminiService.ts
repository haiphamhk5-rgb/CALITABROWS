
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

const API_KEY = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the Data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

// Function to generate brow images using Gemini
const generateBrowImage = async (base64Image: string, styleName: string, description: string, browPreference: string, hasOldTattoo: boolean): Promise<string | undefined> => {
  try {
    // Determine strict geometric rules based on style name
    let geometryRule = "";
    if (styleName.toLowerCase().includes("nhẹ") || styleName.toLowerCase().includes("soft")) {
      geometryRule = "SHAPE: FLAT / STRAIGHT / KOREAN STYLE. The brow body should be mostly horizontal with a very soft, low tail. DO NOT ARCH HIGH. Look youthful and gentle.";
    } else if (styleName.toLowerCase().includes("tây") || styleName.toLowerCase().includes("high") || styleName.toLowerCase().includes("western")) {
      geometryRule = "SHAPE: HIGH ARCH / ANGULAR / WESTERN STYLE. The peak (đỉnh mày) must be DISTINCTLY HIGH and SHARP. The tail should lift upwards. Look fierce, sharp, and luxury.";
    } else {
      // Cong Vừa / Defined
      geometryRule = "SHAPE: STANDARD CURVE / BALANCED ARCH. A classic semi-circle arch. The peak is visible but soft. The tail drops gently. Look standard and balanced.";
    }

    // Correction Logic String
    const correctionInstruction = hasOldTattoo 
        ? `
        🛠 CORRECTIVE MODE ACTIVE (SỬA DÁNG MÀY CŨ):
        - The user has an OLD, likely thick or blocky tattoo. 
        - IGNORE the boundaries of the old tattoo.
        - GENERATE A NEW, SLIMMER, AND MORE REFINED SHAPE.
        - SIMULATE REMOVAL of the excess old ink (Inpainting logic: replace messy old borders with clean skin or new delicate strokes).
        - The new brow MUST be THINNER/SMALLER than the old one to look elegant (thanh thoát).
        `
        : `
        ✨ VIRGIN BROWS MODE (LÀM MỚI):
        - Enhance the natural brow bone structure.
        - Keep the shape balanced and refined.
        `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', 
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: `
              ROLE: Expert High-End Photo Retoucher & PMU Master Artist.
              TASK: EDIT the user's eyebrows in the provided image. 
              
              ⛔️ CRITICAL CONSTRAINT (IDENTITY PRESERVATION):
              - KEEP the user's face, skin texture, lighting, makeup, eyes, and hair 100% UNCHANGED.
              - This is NOT a new character generation. This is an EDIT of the specific person in the photo.
              - DO NOT apply smoothing filters or cartoon effects. Keep it RAW and REALISTIC.

              🎨 STYLE: "NATURE BROWS" (Phun Nature Tự Nhiên - Thanh Thoát):
              - **Concept**: "HEALED EFFECT" (Hiệu ứng sau bong) - "MY BROWS BUT BETTER".
              - **Opacity & Color**: 
                 - **EXTREMELY SHEER & NATURAL**. Use only 40-50% Opacity.
                 - Color: **Transparent Soft Ash Brown / Taupe**. 
                 - **IMPORTANT**: It must look like the user has NO TATTOO, just naturally beautiful, fluffy brows.
                 - DO NOT make it dark. DO NOT make it look like makeup.
              
              - **Technique**: **Airy Powder / Nano Mist**. 
                 - Create a soft, misty pixel effect (hiệu ứng rải hạt mịn tơi xốp).
                 - **Edges**: Soft and fuzzy (không đóng khung). The brow should fade gently into the skin.
                 - **Head (Đầu mày)**: Extremely soft and transparent gradient.
              - **Size/Volume**: **SLIM & REFINED (Thanh thoát)**.
                 - ⛔️ STRICTLY NO THICK, HEAVY, OR BLOCKY BROWS (Không làm to).
                 - The shape must be delicate, thin enough to look elegant, and perfectly balanced with the face structure.

              ${correctionInstruction}

              ✨ TARGET SHAPE: "${styleName}"
              - **GEOMETRIC RULE (MUST FOLLOW)**: ${geometryRule}
              - Shape Detail: ${description}
              - Preference Adjustment: "${browPreference}" (Note: If user chose "Small/Slim", make it very refined/thin).
              - **Symmetry**: Ensure 100% Geometrical Symmetry between Left and Right brows.
              - **Makeup**: Add very subtle natural eyeliner and wispy lashes to enhance the eyes naturally (Make the eyes look more beautiful but keep it natural).

              OUTPUT QUALITY: 8K Resolution, Macro Photography detail, Hyper-realistic texture.
            `,
          },
        ],
      },
    });

    // Extract the image from the response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
       if (part.inlineData && part.inlineData.data) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
       }
    }
    return undefined;
  } catch (error) {
    console.warn(`Failed to generate image for style ${styleName}:`, error);
    return undefined;
  }
};

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    faceAnalysis: {
      type: Type.OBJECT,
      properties: {
        goldenRatio: { type: Type.STRING },
        features: { type: Type.STRING },
        aura: { type: Type.STRING },
        eyes: { type: Type.STRING },
        dominantEnergy: { type: Type.STRING },
        currentBrowProblems: { type: Type.STRING, description: "Phân tích sâu lỗi lông mày hiện tại và nỗi đau nếu không sửa." },
      },
      required: ["goldenRatio", "features", "aura", "eyes", "dominantEnergy", "currentBrowProblems"],
    },
    browStyles: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          reason: { type: Type.STRING },
          effectOnFace: { type: Type.STRING, description: "Detailed physical description of the brow shape for the image generator." },
          impression: { type: Type.STRING },
          jobSuitability: { type: Type.STRING },
          isRecommended: { type: Type.BOOLEAN, description: "Set to true for the single best suited style out of the 3." },
        },
        required: ["name", "reason", "effectOnFace", "impression", "jobSuitability", "isRecommended"],
      },
    },
    colorSuggestion: {
      type: Type.OBJECT,
      properties: {
        color: { type: Type.STRING },
        reason: { type: Type.STRING },
      },
      required: ["color", "reason"],
    },
    beforeAfter: {
      type: Type.OBJECT,
      properties: {
        softnessIncrease: { type: Type.STRING },
        brightnessIncrease: { type: Type.STRING },
        yearsYounger: { type: Type.STRING },
        firstImpression: { type: Type.STRING },
      },
      required: ["softnessIncrease", "brightnessIncrease", "yearsYounger", "firstImpression"],
    },
    numerology: {
      type: Type.OBJECT,
      properties: {
        mainNumber: { type: Type.STRING },
        soulMission: { type: Type.STRING },
        lifePhase: { type: Type.STRING },
        yearlyLesson: { type: Type.STRING },
        careerEnergy: { type: Type.STRING },
        connectionToBrow: { type: Type.STRING },
      },
      required: ["mainNumber", "soulMission", "lifePhase", "yearlyLesson", "careerEnergy", "connectionToBrow"],
    },
    lifeAdvice: {
      type: Type.OBJECT,
      properties: {
        currentPhase: { type: Type.STRING },
        focusThisYear: { type: Type.STRING },
        postureToBuild: { type: Type.STRING },
      },
      required: ["currentPhase", "focusThisYear", "postureToBuild"],
    },
    softClosing: {
      type: Type.OBJECT,
      properties: {
        suggestions: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        finalNote: { type: Type.STRING },
      },
      required: ["suggestions", "finalNote"],
    },
  },
  required: [
    "faceAnalysis",
    "browStyles",
    "colorSuggestion",
    "beforeAfter",
    "numerology",
    "lifeAdvice",
    "softClosing",
  ],
};

export const analyzeProfile = async (
  imageFile: File,
  name: string,
  dob: string,
  job: string,
  browPreference: string,
  hasOldTattoo: boolean
): Promise<AnalysisResult> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY.");
  }

  const imageBase64 = await fileToBase64(imageFile);

  const correctionContext = hasOldTattoo 
    ? "KHÁCH HÀNG ĐÃ TỪNG LÀM MÀY (CÓ MÀY CŨ). Bạn cần tư vấn dáng mày mới để SỬA LỖI dáng cũ. Yêu cầu dáng mới phải NHỎ HƠN, THANH THOÁT HƠN, để gương mặt nhẹ nhàng hơn, không bị dữ."
    : "Khách hàng có lông mày nguyên bản (Chưa từng làm).";

  const prompt = `
    THỜI ĐIỂM HIỆN TẠI LÀ NĂM 2025.
    Đóng vai trò là Chuyên gia Phân tích Khuôn mặt – Phong thủy – Thần số học – Tư vấn phun mày cấp Master thuộc CALITA AI.
    Nhiệm vụ: Tạo một bản tư vấn hoàn chỉnh, tự nhiên, giàu cảm xúc và giúp khách tự ra quyết định.

    Thông tin khách hàng:
    - Họ và tên: ${name}
    - Ngày sinh: ${dob} (Tính toán Thần số học dựa trên năm hiện tại là 2025)
    - Nghề nghiệp: ${job}
    - TÌNH TRẠNG CHÂN MÀY: ${correctionContext}
    - SỞ THÍCH DÁNG MÀY: "${browPreference}" (QUAN TRỌNG: Hãy đảm bảo cả 3 dáng mày gợi ý đều tuân thủ độ dày/kích thước theo sở thích này).

    Hãy phân tích hình ảnh khuôn mặt được cung cấp và thông tin trên để tạo ra đầu ra JSON chi tiết:

    1. PHÂN TÍCH KHUÔN MẶT & VẤN ĐỀ HIỆN TẠI (Quan trọng):
    - Tỷ lệ vàng, Dáng trán/mũi/chân mày, Phong thái (hiền/sắc/sang...), Vùng mắt, Khí chất chủ đạo.
    - **currentBrowProblems**: PHÂN TÍCH GAY GẮT & THẤM THÍA về lỗi của lông mày gốc/hiện tại (ví dụ: thưa nhạt khiến mặt nhợt nhạt, dáng cụp khiến mặt buồn, không cân đối phá tướng...).
      + Nhấn mạnh "Nỗi Đau": Nếu không làm ngay, gương mặt sẽ trông già hơn tuổi, thiếu sức sống, ảnh hưởng ấn tượng đầu tiên và phong thủy tài lộc.
      + Văn phong: Chân thành nhưng phải chạm vào cảm xúc lo lắng của khách hàng để kích thích họ thay đổi.

    2. GỢI Ý 3 DÁNG MÀY (3 STYLE CỤ THỂ SAU - PHẢI KHÁC BIỆT RÕ RỆT):
    
    - Style 1: "Nature Cong Nhẹ" (Soft Nature Arch).
      + Mô tả: Dáng mày Nature thanh thoát, Dáng Gần Như Ngang, độ cong cực nhẹ ở đuôi (Flat/Low Arch), form mềm mại.
      + Cảm giác: Trẻ trung, hiền dịu, trong trẻo.
    
    - Style 2: "Nature Cong Vừa" (Defined Nature Arch).
      + Mô tả: Dáng mày Nature có độ nâng cung mày rõ ràng, cân đối (Standard Medium Arch), đỉnh mày bo tròn, dáng chuẩn mực.
      + Cảm giác: Sang trọng, cân đối, gương mặt sáng.
    
    - Style 3: "Nature Cong Tây" (High Nature Arch).
      + Mô tả: Dáng mày Nature nhưng có độ cong Mạnh (High Arch), đỉnh cao và Đuôi Hất Lên (Lifted Tail).
      + Cảm giác: Cá tính, sắc sảo, quý phái, quyền lực, khác biệt hoàn toàn với 2 dáng kia.
    
    Trong trường "effectOnFace", hãy mô tả cực kỳ chi tiết hình dáng vật lý cho AI vẽ (bằng tiếng Anh):
    + Style 1: "Slim straight brow, flat horizontal shape with very subtle tail curve, soft edges, airy powder"
    + Style 2: "Slim standard arch brow, balanced curve, distinct peak point, elegant and refined, airy powder"
    + Style 3: "Slim high arch brow, angular peak, lifted tail, sharp and fierce, luxury look, airy powder"
    
    QUAN TRỌNG: Chọn 1 dáng mày xuất sắc nhất làm "isRecommended": true.

    3. MÀU MỰC:
    - Chỉ định rõ: Nâu Tây Tự Nhiên (Soft Neutral Brown) - Hiệu ứng trong veo.
    - Kỹ thuật: "Phun Nature Brows" - Rải hạt mịn, hiệu ứng tơi xốp, thanh thoát, không đóng khung (No contour), không bết.

    4. BEFORE - AFTER:
    - Mềm hơn bao nhiêu %, Sáng hơn bao nhiêu %, Trẻ hơn bao nhiêu tuổi.

    5. THẦN SỐ HỌC (Năm 2025):
    - Con số chủ đạo, Sứ mệnh, Bài học năm nay 2025. Kết nối dáng mày với thần số học.

    6. GIAI ĐOẠN CUỘC ĐỜI & CHỐT ĐƠN MỀM:
    - Lời khuyên 2025.
    - 3-4 câu nói gợi mở nhu cầu khéo léo.
  `;

  try {
    // 1. Generate Text Analysis
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: imageFile.type,
                data: imageBase64,
              },
            },
            { text: prompt },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const result = JSON.parse(text) as AnalysisResult;

    // 2. Auto-Generate Images for the 3 Brow Styles (Parallel)
    const imagePromises = result.browStyles.map(async (style) => {
      // Pass the specific shape instruction AND hasOldTattoo flag to the image generator
      const generatedImage = await generateBrowImage(imageBase64, style.name, style.effectOnFace, browPreference, hasOldTattoo);
      return { ...style, imageUrl: generatedImage };
    });

    const updatedBrowStyles = await Promise.all(imagePromises);
    result.browStyles = updatedBrowStyles;

    return result;

  } catch (error) {
    console.error("Analysis failed:", error);
    throw error;
  }
};
