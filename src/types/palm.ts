export interface LineCoordinate {
  x: number;
  y: number;
}

export interface MajorLine {
  id: string;
  name: string;
  sanskritName: string;
  color: string;
  clarity: string;
  pathDescription: string;
  specialMarkings: string[];
  traditionalMeaning: string;
  coordinates: LineCoordinate[];
}

export interface Mount {
  name: string;
  rulingPlanet: string;
  prominence: string;
  location: LineCoordinate;
  traditionalSignificance: string;
}

export interface HandShape {
  element: string; // Earth, Air, Fire, Water
  description: string;
  temperament: string;
}

export interface PalmReading {
  handShape: HandShape;
  majorLines: MajorLine[];
  mounts: Mount[];
  personality: {
    summary: string;
    coreTraits: string[];
    strengths: string[];
    growthAreas: string[];
    communicationStyle: string;
  };
  loveAndRelationships: {
    summary: string;
    romanticNature: string;
    relationshipPatterns: string;
    marriageIndication: string;
    adviceForHarmony: string;
  };
  careerAndAmbition: {
    summary: string;
    leadershipQuality: string;
    businessVsEmployment: string;
    peakAges: string;
    suitableFields: string[];
  };
  wealthAndProsperity: {
    summary: string;
    moneyTriangle: string;
    financialDiscipline: string;
    wealthCreationTendency: string;
  };
  healthAndVitality: {
    summary: string;
    vitalityFlow: string;
    stressManagement: string;
    wellnessRecommendation: string;
  };
  destinyAndSpirituality: {
    summary: string;
    majorTransitions: string;
    spiritualSigns: string;
    karmicGuidance: string;
  };
  handComparison: {
    dominantHandRole: string;
    nonDominantRole: string;
    freeWillVsDestiny: string;
  };
  blessingQuote: string;
}

export interface CompatibilityData {
  overallCompatibilityScore: number;
  elementalSynergy: string;
  emotionalHarmony: string;
  intellectualRhythm: string;
  sharedStrengths: string[];
  relationshipGrowthTips: string[];
  longTermDestinyVerdict: string;
}
