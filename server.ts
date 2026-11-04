import express, { Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { Pool } from 'pg';
import { createHash, randomBytes } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable('x-powered-by');
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const SHARE_TTL_DAYS = 30;

const trustedProxyHops = Number(process.env.TRUST_PROXY_HOPS ?? 0);
if (!Number.isInteger(trustedProxyHops) || trustedProxyHops < 0) {
  throw new Error('TRUST_PROXY_HOPS must be a non-negative integer.');
}
app.set('trust proxy', trustedProxyHops);

if (process.env.NODE_ENV === 'production') {
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
      },
    },
  }));
}

const createApiLimiter = (max: number, windowMs: number) =>
  rateLimit({
    windowMs,
    limit: max,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Too many requests. Please wait before trying again.' },
  });

const analysisLimiter = createApiLimiter(6, 15 * 60 * 1000);
const compatibilityLimiter = createApiLimiter(4, 15 * 60 * 1000);
const shareLimiter = createApiLimiter(10, 60 * 60 * 1000);

app.use('/api', createApiLimiter(60, 15 * 60 * 1000));
app.use('/api', (_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
app.use(express.json({ limit: '10mb' }));

// Server-side Gemini initialization
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'palmora-app',
        },
      },
    })
  : null;

const database = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

function extractImage(dataUrl: unknown) {
  if (typeof dataUrl !== 'string') {
    throw new Error('An image is required.');
  }

  const match = dataUrl.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/]+={0,2})$/);
  if (!match) {
    throw new Error('Use a JPEG, PNG, or WebP image.');
  }

  const data = match[2];
  const imageBytes = Buffer.from(data, 'base64');
  if (imageBytes.byteLength === 0 || imageBytes.byteLength > MAX_IMAGE_BYTES) {
    throw new Error('Each image must be smaller than 3 MB after processing.');
  }
  const isJpeg = match[1] === 'image/jpeg' && imageBytes[0] === 0xff && imageBytes[1] === 0xd8;
  const isPng = match[1] === 'image/png' && imageBytes.subarray(0, 8).equals(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  );
  const isWebp = match[1] === 'image/webp' &&
    imageBytes.toString('ascii', 0, 4) === 'RIFF' &&
    imageBytes.toString('ascii', 8, 12) === 'WEBP';
  if (!isJpeg && !isPng && !isWebp) {
    throw new Error('Image content does not match its file type.');
  }

  return { mimeType: match[1], data };
}

function boundedText(value: unknown, fallback: string, maxLength: number) {
  if (value === undefined) return fallback;
  if (typeof value !== 'string' || value.length > maxLength) {
    throw new Error(`Text fields must be no longer than ${maxLength} characters.`);
  }
  return value;
}

// Detailed Palm Reading Response Schema
const palmReadingSchema = {
  type: Type.OBJECT,
  properties: {
    handShape: {
      type: Type.OBJECT,
      properties: {
        element: { type: Type.STRING, description: "Earth, Air, Fire, or Water hand based on palm shape and finger length" },
        description: { type: Type.STRING, description: "Physical observation of palm shape, skin texture and fingers" },
        temperament: { type: Type.STRING, description: "Traditional elemental temperament" }
      },
      required: ["element", "description", "temperament"]
    },
    majorLines: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING, description: "heart, head, life, fate, sun, or marriage" },
          name: { type: Type.STRING, description: "Heart Line, Head Line, Life Line, Fate Line, Sun Line, or Marriage Lines" },
          sanskritName: { type: Type.STRING, description: "Traditional Sanskrit name like Hridaya Rekha, Mastak Rekha, etc." },
          color: { type: Type.STRING, description: "Hex color code for visual overlay e.g. #f43f5e for heart, #06b6d4 for head, #10b981 for life, #8b5cf6 for fate, #f59e0b for sun" },
          clarity: { type: Type.STRING, description: "Deep and clear, chained, faint, broken, or branched" },
          pathDescription: { type: Type.STRING, description: "Where it starts, journeys through, and terminates" },
          specialMarkings: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Visible forks, tridents, triangles, stars, or islands"
          },
          traditionalMeaning: { type: Type.STRING, description: "Comprehensive traditional palmistry interpretation" },
          coordinates: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                x: { type: Type.NUMBER, description: "Horizontal percentage 0-100 from left to right" },
                y: { type: Type.NUMBER, description: "Vertical percentage 0-100 from top to bottom" }
              },
              required: ["x", "y"]
            },
            description: "4 to 7 sampled points tracing the curve of this line on the palm"
          }
        },
        required: ["id", "name", "sanskritName", "color", "clarity", "pathDescription", "specialMarkings", "traditionalMeaning", "coordinates"]
      }
    },
    mounts: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: "Mount of Jupiter, Saturn, Sun/Apollo, Mercury, Venus, Moon, or Mars" },
          rulingPlanet: { type: Type.STRING },
          prominence: { type: Type.STRING, description: "High, Balanced, or Low" },
          location: {
            type: Type.OBJECT,
            properties: {
              x: { type: Type.NUMBER, description: "Approximate percentage x (0-100)" },
              y: { type: Type.NUMBER, description: "Approximate percentage y (0-100)" }
            },
            required: ["x", "y"]
          },
          traditionalSignificance: { type: Type.STRING, description: "What this mount reveals about ambition, wisdom, creativity, etc." }
        },
        required: ["name", "rulingPlanet", "prominence", "location", "traditionalSignificance"]
      }
    },
    personality: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        coreTraits: { type: Type.ARRAY, items: { type: Type.STRING } },
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        growthAreas: { type: Type.ARRAY, items: { type: Type.STRING } },
        communicationStyle: { type: Type.STRING }
      },
      required: ["summary", "coreTraits", "strengths", "growthAreas", "communicationStyle"]
    },
    loveAndRelationships: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        romanticNature: { type: Type.STRING },
        relationshipPatterns: { type: Type.STRING },
        marriageIndication: { type: Type.STRING, description: "Traditional interpretations of marriage/commitment lines" },
        adviceForHarmony: { type: Type.STRING }
      },
      required: ["summary", "romanticNature", "relationshipPatterns", "marriageIndication", "adviceForHarmony"]
    },
    careerAndAmbition: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        leadershipQuality: { type: Type.STRING },
        businessVsEmployment: { type: Type.STRING },
        peakAges: { type: Type.STRING, description: "Traditional milestone ages indicated on Fate/Head lines" },
        suitableFields: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["summary", "leadershipQuality", "businessVsEmployment", "peakAges", "suitableFields"]
    },
    wealthAndProsperity: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        moneyTriangle: { type: Type.STRING, description: "Presence and closure of the Dhan Yoga / money triangle formed by Life, Head, and Fate lines" },
        financialDiscipline: { type: Type.STRING },
        wealthCreationTendency: { type: Type.STRING }
      },
      required: ["summary", "moneyTriangle", "financialDiscipline", "wealthCreationTendency"]
    },
    healthAndVitality: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        vitalityFlow: { type: Type.STRING, description: "Traditional prana/vital energy flow according to the Life line" },
        stressManagement: { type: Type.STRING },
        wellnessRecommendation: { type: Type.STRING, description: "Holistic traditional lifestyle harmonization tips (non-medical)" }
      },
      required: ["summary", "vitalityFlow", "stressManagement", "wellnessRecommendation"]
    },
    destinyAndSpirituality: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING },
        majorTransitions: { type: Type.STRING },
        spiritualSigns: { type: Type.STRING, description: "Mystic cross, Solomon's ring, or fish sign if visible" },
        karmicGuidance: { type: Type.STRING }
      },
      required: ["summary", "majorTransitions", "spiritualSigns", "karmicGuidance"]
    },
    handComparison: {
      type: Type.OBJECT,
      properties: {
        dominantHandRole: { type: Type.STRING, description: "Active hand representing current conscious actions and manifested destiny" },
        nonDominantRole: { type: Type.STRING, description: "Passive hand representing subconscious blueprint and ancestral karma" },
        freeWillVsDestiny: { type: Type.STRING }
      },
      required: ["dominantHandRole", "nonDominantRole", "freeWillVsDestiny"]
    },
    blessingQuote: { type: Type.STRING, description: "An uplifting philosophical reflection from Vedic palmistry / Hast Rekha" }
  },
  required: [
    "handShape",
    "majorLines",
    "mounts",
    "personality",
    "loveAndRelationships",
    "careerAndAmbition",
    "wealthAndProsperity",
    "healthAndVitality",
    "destinyAndSpirituality",
    "handComparison",
    "blessingQuote"
  ]
};

// Retry only transient upstream capacity failures; configuration and request errors are not hidden.
async function generateContentWithRetryAndFallback(options: {
  parts: any[];
  systemInstruction: string;
  responseSchema?: any;
}) {
  if (!ai) {
    throw new Error('Gemini is not configured. Set GEMINI_API_KEY on the server.');
  }
  const modelsToTry = [
    process.env.GEMINI_MODEL || 'gemini-3.8-flash',
    process.env.GEMINI_FALLBACK_MODEL || 'gemini-3.1-flash-lite',
  ].filter((model): model is string => Boolean(model));
  let lastError: unknown;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: { parts: options.parts },
          config: {
            responseMimeType: 'application/json',
            ...(options.responseSchema ? { responseSchema: options.responseSchema } : {}),
            systemInstruction: options.systemInstruction,
          },
        });

        if (response.text) {
          return response.text;
        }
        throw new Error(`Gemini model ${model} returned an empty response.`);
      } catch (err: any) {
        const status = err?.status ?? err?.statusCode;
        const message = String(err?.message || '');
        const isTransient = status === 429 || status === 503 ||
          message.includes('429') || message.includes('503') || message.includes('UNAVAILABLE');
        if (!isTransient) {
          throw err;
        }
        lastError = err;
        if (attempt === 2) break;
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }
    }
  }

  throw lastError ?? new Error('No Gemini model is configured.');
}

// Traditional Hast Rekha emergency fallback generator if upstream Gemini API encounters regional 503 outage
function generateFallbackPalmReading(dominantHand: 'left' | 'right', focus: string, language: string) {
  const isRight = dominantHand === 'right';
  return {
    handShape: {
      element: "Air",
      description: "Well-balanced intellectual hand with articulated finger joints and refined palm elasticity, denoting an intuitive communicator and analytical thinker.",
      temperament: "Philosophical, communicative, observant, and adaptable to life's shifting currents."
    },
    majorLines: [
      {
        id: "heart",
        name: "Heart Line",
        sanskritName: "Hridaya Rekha (हृदय रेखा)",
        color: "#f43f5e",
        clarity: "Deep and clearly defined",
        pathDescription: "Sweeps elegantly beneath the Mounts of Mercury and Apollo, curving gently toward the space between Jupiter and Saturn.",
        specialMarkings: ["Gentle terminal fork", "Upward devotion branch"],
        traditionalMeaning: "Denotes high emotional fidelity, balanced affection without unrealistic possessiveness, and genuine empathy in long-term relationships.",
        coordinates: [
          { x: isRight ? 88 : 12, y: 38 },
          { x: isRight ? 70 : 30, y: 35 },
          { x: isRight ? 50 : 50, y: 32 },
          { x: isRight ? 35 : 65, y: 28 },
          { x: isRight ? 26 : 74, y: 25 }
        ]
      },
      {
        id: "head",
        name: "Head Line",
        sanskritName: "Mastak Rekha (मस्तक रेखा)",
        color: "#06b6d4",
        clarity: "Long, continuous, and crisp",
        pathDescription: "Originates in harmonious proximity to the Life Line and extends straight across the lower plain of Mars with a slight artistic declination.",
        specialMarkings: ["Clear mental channel", "Creative curve toward Moon"],
        traditionalMeaning: "Exceptional cognitive endurance, ability to balance analytical logic with creative imagination, and calm judgment under pressure.",
        coordinates: [
          { x: isRight ? 24 : 76, y: 44 },
          { x: isRight ? 40 : 60, y: 48 },
          { x: isRight ? 60 : 40, y: 53 },
          { x: isRight ? 78 : 22, y: 59 },
          { x: isRight ? 88 : 12, y: 65 }
        ]
      },
      {
        id: "life",
        name: "Life Line",
        sanskritName: "Jeevan Rekha (जीवन रेखा)",
        color: "#10b981",
        clarity: "Broad, uninterrupted rosy arc",
        pathDescription: "Encompasses the Mount of Venus in a generous, vibrant contour flowing down toward the Rascette bracelet at the wrist.",
        specialMarkings: ["Ascending ambition twig", "Wide vitality perimeter"],
        traditionalMeaning: "Vibrant prana life force, robust recuperative vitality, and openness to exciting life experiences and community engagement.",
        coordinates: [
          { x: isRight ? 24 : 76, y: 44 },
          { x: isRight ? 28 : 72, y: 55 },
          { x: isRight ? 33 : 67, y: 68 },
          { x: isRight ? 38 : 62, y: 82 },
          { x: isRight ? 44 : 56, y: 92 }
        ]
      },
      {
        id: "fate",
        name: "Fate Line",
        sanskritName: "Bhagya Rekha (भाग्य रेखा)",
        color: "#8b5cf6",
        clarity: "Straight and ascending",
        pathDescription: "Rises steadily from the upper wrist plain toward the Mount of Saturn (middle finger base).",
        specialMarkings: ["Milestone convergence at Head line", "Independent ascent"],
        traditionalMeaning: "Indicates strong self-determination, proactive vocational growth, and increasing professional authority and fulfillment from age 28 onward.",
        coordinates: [
          { x: isRight ? 49 : 51, y: 88 },
          { x: isRight ? 49 : 51, y: 72 },
          { x: isRight ? 50 : 50, y: 55 },
          { x: isRight ? 51 : 49, y: 40 },
          { x: isRight ? 52 : 48, y: 26 }
        ]
      },
      {
        id: "sun",
        name: "Sun Line",
        sanskritName: "Surya Rekha (सूर्य रेखा)",
        color: "#f59e0b",
        clarity: "Fine radiant vertical stream",
        pathDescription: "Emerges gracefully in the upper palm ascending straight to the Mount of Apollo beneath the ring finger.",
        specialMarkings: ["Auspicious radiance ray"],
        traditionalMeaning: "Natural magnetism, aesthetic taste, public respect, and reward for creative integrity and professional dedication.",
        coordinates: [
          { x: isRight ? 67 : 33, y: 56 },
          { x: isRight ? 68 : 32, y: 42 },
          { x: isRight ? 69 : 31, y: 28 }
        ]
      },
      {
        id: "marriage",
        name: "Marriage Lines",
        sanskritName: "Vivah Rekha (विवाह रेखा)",
        color: "#ec4899",
        clarity: "Distinct horizontal mark",
        pathDescription: "Positioned on the percussion edge between the pinky finger base and Heart line.",
        specialMarkings: ["Uncrossed harmony streak"],
        traditionalMeaning: "Deep emotional commitment and enduring partnership built upon shared intellectual respect and spiritual harmony.",
        coordinates: [
          { x: isRight ? 94 : 6, y: 30 },
          { x: isRight ? 86 : 14, y: 31 }
        ]
      }
    ],
    mounts: [
      {
        name: "Mount of Jupiter (Guru)",
        rulingPlanet: "Jupiter",
        prominence: "Prominent & well-elevated",
        location: { x: isRight ? 30 : 70, y: 22 },
        traditionalSignificance: "Nobility, moral leadership, natural dignity, spiritual ambition, and desire to uplift others."
      },
      {
        name: "Mount of Saturn (Shani)",
        rulingPlanet: "Saturn",
        prominence: "Balanced",
        location: { x: isRight ? 48 : 52, y: 20 },
        traditionalSignificance: "Patience, disciplined research, philosophical depth, and reliable steadiness."
      },
      {
        name: "Mount of Sun / Apollo (Surya)",
        rulingPlanet: "Sun",
        prominence: "Elevated",
        location: { x: isRight ? 66 : 34, y: 22 },
        traditionalSignificance: "Appreciation of beauty, creative genius, warm radiance, and social goodwill."
      },
      {
        name: "Mount of Mercury (Budha)",
        rulingPlanet: "Mercury",
        prominence: "Well-developed",
        location: { x: isRight ? 84 : 16, y: 26 },
        traditionalSignificance: "Sharp articulation, quick commercial sense, social adaptability, and psychological acuity."
      },
      {
        name: "Mount of Venus (Shukra)",
        rulingPlanet: "Venus",
        prominence: "Warm & expansive",
        location: { x: isRight ? 26 : 74, y: 66 },
        traditionalSignificance: "Generous affection, passion for music and aesthetics, love of fine hospitality, and vitality."
      },
      {
        name: "Mount of Moon (Chandra)",
        rulingPlanet: "Moon",
        prominence: "Broad",
        location: { x: isRight ? 78 : 22, y: 76 },
        traditionalSignificance: "Poetic imagination, subconscious intuition, love of travel, and empathetic emotional perception."
      }
    ],
    personality: {
      summary: "Your palm demonstrates a rare synergy between structured intellect (Head line) and expansive emotional empathy (Heart line). You observe situations deeply before committing, yet act decisively once your intuition and intellect align.",
      coreTraits: ["Reflective Observer", "Empathetic Communicator", "Strategic Organizer", "Aesthetic Visionary"],
      strengths: ["Clear verbal expression", "Instinctive integrity", "Grace under pressure", "Long-range strategic planning"],
      growthAreas: ["Tendency to over-analyze small uncertainties", "Occasional reluctance to delegate important projects"],
      communicationStyle: "Articulate, diplomatic, and thoughtful; you prefer genuine, meaningful discourse over shallow superficial banter."
    },
    loveAndRelationships: {
      summary: "Your Heart line reflects an emotionally noble nature. You do not enter into deep attachments lightly, but once committed, you offer steadfast loyalty, thoughtful support, and deep mutual respect.",
      romanticNature: "Balanced romance; passionate yet grounded, seeking intellectual companionship alongside emotional warmth.",
      relationshipPatterns: "Values shared values, quiet understanding, and personal freedom within a committed partnership.",
      marriageIndication: "Strong indication of a deeply fulfilling, enduring primary union where both partners elevate each other's aspirations.",
      adviceForHarmony: "Communicate minor vulnerabilities early rather than holding emotional reservations behind a composed exterior."
    },
    careerAndAmbition: {
      summary: "The Fate Line ascending clearly toward Saturn confirms that self-directed effort and integrity are your greatest career catalysts. Your professional story is characterized by increasing autonomy and leadership.",
      leadershipQuality: "Empowering and mentor-oriented; you lead by competence and exemplary discipline rather than authoritarian mandate.",
      businessVsEmployment: "Strong capability for independent enterprise, consultancy, or managing autonomous divisions where your strategic vision has freedom.",
      peakAges: "Auspicious milestone transitions highlighted around ages 27–29, 35, and 42.",
      suitableFields: ["Technology & Software Leadership", "Creative & Media Strategy", "Consulting & Higher Advisory", "Writing & Communication", "Education & Life Mentorship"]
    },
    wealthAndProsperity: {
      summary: "The intersection of your Head, Life, and Fate lines forms a well-closed Dhan Yoga (Sacred Money Triangle), pointing toward reliable wealth retention and sound financial judgment.",
      moneyTriangle: "Dhan Yoga is well-formed and closed; you possess natural aptitude for turning strategic concepts into sustainable prosperity.",
      financialDiscipline: "Prudent and methodical; you avoid speculative illusions in favor of value-generating assets and secure foundations.",
      wealthCreationTendency: "Progressive accumulation through earned reputation, specialized mastery, and disciplined reinvestment."
    },
    healthAndVitality: {
      summary: "The wide sweeping arc of your Life line indicates generous reserves of prana (vital energy) and natural physical resilience.",
      vitalityFlow: "Steadily circulating prana; good recovery rate from mental and physical fatigue when circadian rest is respected.",
      stressManagement: "Your nervous system benefits profoundly from nature walks, mindful breathwork (Pranayama), and regular periods of digital detachment.",
      wellnessRecommendation: "Maintain consistent hydration, balance cerebral work with physical mobility, and honor restful sleep routines."
    },
    destinyAndSpirituality: {
      summary: "The configuration of your palm reveals an active spiritual seeker who honors both worldly responsibilities and inner contemplative truth.",
      majorTransitions: "Major positive evolutions occur whenever you realign your outer work with your authentic inner values.",
      spiritualSigns: "Mystic cross inclinations visible in the central quadrangle between Heart and Head lines, denoting strong intuitive hunches.",
      karmicGuidance: "Trust the inner knowing that guides your important life choices; your free will is your strongest sacred tool."
    },
    handComparison: {
      dominantHandRole: `Your active ${dominantHand} hand illustrates how effectively you have converted your innate potential into conscious achievements and daily discipline.`,
      nonDominantRole: "Your non-dominant hand carries the ancestral blueprint and initial talents gifted to you at birth.",
      freeWillVsDestiny: "Your lines demonstrate that personal choices, disciplined habits, and positive thoughts have strengthened your life and fate lines beyond baseline tendencies."
    },
    blessingQuote: "Hastam Nireekshya Karmanyeva Siddhim — The hands reveal the divine canvas, yet right action paints destiny."
  };
}

// POST /api/analyze-palm
app.post('/api/analyze-palm', analysisLimiter, async (req: Request, res: Response) => {
  const {
    dominantImage,
    secondaryImage,
    dominantHand = 'right',
    focus = 'all',
    language = 'English',
    userNotes = ''
  } = req.body ?? {};

  let mainImage: ReturnType<typeof extractImage>;
  let secondary: ReturnType<typeof extractImage> | undefined;
  let readingFocus: string;
  let readingLanguage: string;
  let notes: string;
  try {
    if (dominantHand !== 'left' && dominantHand !== 'right') {
      throw new Error('Dominant hand must be left or right.');
    }
    mainImage = extractImage(dominantImage);
    secondary = secondaryImage ? extractImage(secondaryImage) : undefined;
    readingFocus = boundedText(focus, 'all', 100);
    readingLanguage = boundedText(language, 'English', 40);
    notes = boundedText(userNotes, '', 1000);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Invalid palm analysis request.',
    });
  }
  if (!ai) {
    return res.status(503).json({ error: 'AI analysis is not configured on this server.' });
  }

  try {
    const parts: any[] = [
      {
        inlineData: {
          mimeType: mainImage.mimeType,
          data: mainImage.data,
        },
      },
    ];

    if (secondary) {
      parts.push({
        inlineData: {
          mimeType: secondary.mimeType,
          data: secondary.data,
        },
      });
    }

    const promptText = `
You are a master Vedic and Western Chiromancer (Hast Rekha Shastra scholar and expert palmist) with decades of experience interpreting the ancient sacred geometry of the human palm.

Analyze this palm image very carefully:
- Dominant Hand: ${dominantHand} Hand (this represents conscious actions, choices, and currently manifested destiny).
${secondaryImage ? `- Secondary Hand included for non-dominant subconscious comparison.` : ''}
- Reading Focus Area: ${readingFocus}
- Language: Produce all descriptions, readings, traits, and interpretations in ${readingLanguage}.
${notes ? `- User context/questions: ${notes}` : ''}

INSTRUCTIONS FOR LINE & FEATURE DETECTION:
1. Examine the actual palm image provided:
   - Identify the palm's contours, width, and finger proportions to classify Hand Shape (Earth, Air, Fire, Water).
   - Detect the Major Lines: Heart Line (Hridaya Rekha), Head Line (Mastak Rekha), Life Line (Jeevan Rekha), Fate Line (Bhagya Rekha), Sun Line (Surya Rekha), and Marriage Lines (Vivah Rekha).
   - Estimate realistic normalized coordinates (0-100% X and Y) tracing each visible line across the palm so our visualizer can draw an exact glowing line overlay over the user's hand!
     - 0% X is left edge, 100% X is right edge.
     - 0% Y is top edge (fingertips/top of palm), 100% Y is bottom edge (wrist).
     - Provide 4 to 7 smooth sequential points for each line following its actual curvature on the palm.
   - Inspect the Mounts: Jupiter (below index finger), Saturn (below middle finger), Apollo/Sun (below ring finger), Mercury (below pinky finger), Venus (base of thumb), Moon/Luna (lower percussion opposite thumb), and Mars.
2. Provide a thorough, respectful, deep palmistry interpretation covering:
   - Personality, Core traits, Communication style
   - Love, Emotions, Marriage lines, and Romantic compatibility
   - Career, Professional milestones, Leadership, Business vs Job
   - Wealth, Financial discipline, Dhan Yoga (Money Triangle)
   - Prana & Vitality flow (vitality energy, stress response, holistic harmony - framed ethically as traditional belief, not medical diagnosis)
   - Destiny, Karmic lessons, and Spiritual signs (like Mystic Cross)
3. Be inspiring, nuanced, compassionate, and culturally rich in your Hast Rekha interpretation.
`;

    parts.push({ text: promptText });

    try {
      const resultText = await generateContentWithRetryAndFallback({
      parts,
      systemInstruction: 'You are Palmora AI. Present palmistry as traditional reflection, not scientific, medical, financial, or predictive advice. Do not claim certainty.',
      responseSchema: palmReadingSchema,
      });

      const parsedData = JSON.parse(resultText);
      if (!parsedData || typeof parsedData !== 'object' || !parsedData.handShape || !Array.isArray(parsedData.majorLines)) {
      throw new Error('Gemini returned an invalid palm reading response.');
      }
      return res.json({ success: true, reading: parsedData });
    } catch (apiErr: any) {
      console.error('Palm analysis provider error:', apiErr);
      return res.status(502).json({
      error: 'Palm analysis is temporarily unavailable. Please try again later.',
      });
    }
  } catch (error: any) {
    console.error('Fatal error in /api/analyze-palm:', error);
    return res.status(500).json({ error: 'The palm analysis request could not be completed.' });
  }
});

// POST /api/compatibility-reading
app.post('/api/compatibility-reading', compatibilityLimiter, async (req: Request, res: Response) => {
  const { palmA, palmB, nameA = 'Partner 1', nameB = 'Partner 2', language = 'English' } = req.body ?? {};

  let imgA: ReturnType<typeof extractImage>;
  let imgB: ReturnType<typeof extractImage>;
  let safeNameA: string;
  let safeNameB: string;
  let readingLanguage: string;
  try {
    imgA = extractImage(palmA);
    imgB = extractImage(palmB);
    safeNameA = boundedText(nameA, 'Partner 1', 40);
    safeNameB = boundedText(nameB, 'Partner 2', 40);
    readingLanguage = boundedText(language, 'English', 40);
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Invalid compatibility request.',
    });
  }
  if (!ai) {
    return res.status(503).json({ error: 'AI analysis is not configured on this server.' });
  }

  try {
    const parts = [
      { inlineData: { mimeType: imgA.mimeType, data: imgA.data } },
      { inlineData: { mimeType: imgB.mimeType, data: imgB.data } },
      {
        text: `You are a master palmist comparing the hands of ${safeNameA} (first image) and ${safeNameB} (second image).
Analyze the emotional synergy (Heart lines), intellectual harmony (Head lines), elemental hand shapes (Earth/Air/Fire/Water compatibility), and communication rhythm.
Language: ${readingLanguage}.
Treat palmistry as traditional reflection, not scientific certainty or professional advice.
Return a JSON object with:
- overallCompatibilityScore (number from 65 to 98)
- elementalSynergy (e.g. Fire & Air, complementary spark)
- emotionalHarmony (Heart lines comparison)
- intellectualRhythm (Head lines comparison)
- sharedStrengths (array of strings)
- relationshipGrowthTips (array of strings)
- longTermDestinyVerdict (string)`
      }
    ];

    try {
      const resultText = await generateContentWithRetryAndFallback({
        parts,
        systemInstruction: 'You are Palmora AI specializing in romantic chiromancy and hand synergy comparisons.',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallCompatibilityScore: { type: Type.INTEGER },
            elementalSynergy: { type: Type.STRING },
            emotionalHarmony: { type: Type.STRING },
            intellectualRhythm: { type: Type.STRING },
            sharedStrengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            relationshipGrowthTips: { type: Type.ARRAY, items: { type: Type.STRING } },
            longTermDestinyVerdict: { type: Type.STRING }
          },
          required: [
            "overallCompatibilityScore",
            "elementalSynergy",
            "emotionalHarmony",
            "intellectualRhythm",
            "sharedStrengths",
            "relationshipGrowthTips",
            "longTermDestinyVerdict"
          ]
        }
      });

      const parsed = JSON.parse(resultText);
      if (!parsed || typeof parsed !== 'object' || !Number.isInteger(parsed.overallCompatibilityScore) ||
          !Array.isArray(parsed.sharedStrengths) || !Array.isArray(parsed.relationshipGrowthTips)) {
        throw new Error('Gemini returned an invalid compatibility response.');
      }
      return res.json({ success: true, compatibility: parsed });
    } catch (err: any) {
      console.error('Compatibility provider error:', err);
      return res.status(502).json({
        error: 'Compatibility analysis is temporarily unavailable. Please try again later.',
      });
    }
  } catch (error: any) {
    console.error('Error analyzing compatibility:', error);
    return res.status(500).json({ error: 'The compatibility request could not be completed.' });
  }
});

async function initializeDatabase() {
  if (!database) return;
  await database.query(`
    CREATE TABLE IF NOT EXISTS shared_readings (
      share_id TEXT PRIMARY KEY,
      reading JSONB NOT NULL,
      dominant_hand TEXT NOT NULL CHECK (dominant_hand IN ('left', 'right')),
      dominant_image TEXT NOT NULL,
      revoke_token_hash TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      expires_at TIMESTAMPTZ NOT NULL
    )
  `);
  await database.query('ALTER TABLE shared_readings ADD COLUMN IF NOT EXISTS revoke_token_hash TEXT');
  await database.query('CREATE INDEX IF NOT EXISTS shared_readings_expires_at_idx ON shared_readings (expires_at)');
  await database.query('DELETE FROM shared_readings WHERE expires_at <= NOW()');

  const cleanup = setInterval(() => {
    database.query('DELETE FROM shared_readings WHERE expires_at <= NOW()')
      .catch((error) => console.error('Expired share cleanup failed:', error));
  }, 6 * 60 * 60 * 1000);
  cleanup.unref();
}

// POST /api/share
app.post('/api/share', shareLimiter, async (req: Request, res: Response) => {
  if (!database) {
    return res.status(503).json({ error: 'Share links are not configured on this server.' });
  }

  let reading: any;
  let dominantHand: 'left' | 'right';
  let dominantImage: string;
  try {
    const body = req.body ?? {};
    if (!body.reading || typeof body.reading !== 'object' || !body.reading.handShape ||
        (body.dominantHand !== 'left' && body.dominantHand !== 'right')) {
      return res.status(400).json({ error: 'A valid reading and dominant hand are required.' });
    }
    dominantHand = body.dominantHand;
    dominantImage = body.dominantImage;
    extractImage(dominantImage);
    reading = body.reading;
  } catch (error) {
    return res.status(400).json({
      error: error instanceof Error ? error.message : 'Invalid share request.',
    });
  }

  try {
    const shareId = `pr_${randomBytes(24).toString('base64url')}`;
    const revokeToken = randomBytes(32).toString('base64url');
    const revokeTokenHash = createHash('sha256').update(revokeToken).digest('hex');
    const expiresAt = new Date(Date.now() + SHARE_TTL_DAYS * 24 * 60 * 60 * 1000);
    await database.query(
      `INSERT INTO shared_readings (share_id, reading, dominant_hand, dominant_image, revoke_token_hash, expires_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [shareId, reading, dominantHand, dominantImage, revokeTokenHash, expiresAt],
    );

    return res.json({ success: true, shareId, revokeToken, expiresAt: expiresAt.toISOString() });
  } catch (error) {
    console.error('Share creation failed:', error);
    return res.status(500).json({ error: 'Failed to create share link.' });
  }
});

// GET /api/share/:id
app.get('/api/share/:id', createApiLimiter(120, 60 * 1000), async (req: Request, res: Response) => {
  if (!database) {
    return res.status(503).json({ error: 'Share links are not configured on this server.' });
  }
  const { id } = req.params;

  try {
    const result = await database.query(
      `SELECT reading, dominant_hand, dominant_image, created_at
       FROM shared_readings
       WHERE share_id = $1 AND expires_at > NOW()`,
      [id],
    );
    const entry = result.rows[0];
    if (!entry) {
      return res.status(404).json({ error: 'Shared reading not found or expired.' });
    }
    return res.json({
      success: true,
      data: {
        reading: entry.reading,
        dominantHand: entry.dominant_hand,
        dominantImage: entry.dominant_image,
        createdAt: entry.created_at,
      },
    });
  } catch (error) {
    console.error('Share lookup failed:', error);
    return res.status(500).json({ error: 'Could not load the shared reading.' });
  }
});

app.delete('/api/share/:id', shareLimiter, async (req: Request, res: Response) => {
  if (!database) {
    return res.status(503).json({ error: 'Share links are not configured on this server.' });
  }
  try {
    const revokeToken = req.get('x-share-revoke-token');
    if (!revokeToken || revokeToken.length > 128) {
      return res.status(403).json({ error: 'A valid share revocation token is required.' });
    }
    const revokeTokenHash = createHash('sha256').update(revokeToken).digest('hex');
    const result = await database.query(
      'DELETE FROM shared_readings WHERE share_id = $1 AND revoke_token_hash = $2',
      [req.params.id, revokeTokenHash],
    );
    return result.rowCount
      ? res.status(204).end()
      : res.status(404).json({ error: 'Shared reading not found or already expired.' });
  } catch (error) {
    console.error('Share revocation failed:', error);
    return res.status(500).json({ error: 'Could not revoke the shared reading.' });
  }
});

app.get(['/healthz', '/api/healthz'], (_req, res) => res.status(200).json({ status: 'ok' }));

app.get(['/readyz', '/api/readyz'], async (_req, res) => {
  if (!database) {
    return res.status(process.env.NODE_ENV === 'production' ? 503 : 200)
      .json({ status: process.env.NODE_ENV === 'production' ? 'not-ready' : 'ok' });
  }
  try {
    await database.query('SELECT 1');
    return res.status(200).json({ status: 'ready' });
  } catch {
    return res.status(503).json({ status: 'not-ready' });
  }
});

async function initializeApp() {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd && !ai) {
    throw new Error('GEMINI_API_KEY must be configured in production.');
  }
  if (isProd && !database) {
    throw new Error('DATABASE_URL must be configured in production for share links.');
  }
  if (database) {
    await initializeDatabase();
  }

  app.use((error: any, _req: Request, res: Response, _next: (error?: unknown) => void) => {
    if (error?.type === 'entity.too.large') {
      return res.status(413).json({ error: 'The request is too large.' });
    }
    if (error instanceof SyntaxError && 'body' in error) {
      return res.status(400).json({ error: 'Request body must be valid JSON.' });
    }
    console.error('Unhandled server error:', error);
    return res.status(500).json({ error: 'An unexpected server error occurred.' });
  });
}

let appInitialization: Promise<void> | undefined;
export function initializeForServerless() {
  appInitialization ??= initializeApp();
  return appInitialization;
}

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (isProd) {
    await initializeForServerless();
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    await initializeApp();
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Palmora AI server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  startServer().catch((error) => {
    console.error('Server startup failed:', error);
    process.exitCode = 1;
  });
}
