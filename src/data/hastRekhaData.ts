export interface PalmLineInfo {
  id: string;
  name: string;
  hindiName: string;
  elementColor: string;
  description: string;
  significance: string;
  traditionalRules: string[];
}

export const TRADITIONAL_LINES: PalmLineInfo[] = [
  {
    id: 'heart',
    name: 'Heart Line',
    hindiName: 'Hridaya Rekha (हृदय रेखा)',
    elementColor: '#f43f5e',
    description: 'Runs horizontally across the upper palm below the base of the fingers. Governs emotional temperament, love, romantic fidelity, and cardiovascular prana.',
    significance: 'Reveals how deeply you connect with others, your romantic expectations, and emotional resilience.',
    traditionalRules: [
      'Ending under Mount of Jupiter (index finger): Idealistic love, noble devotion, high romantic standards.',
      'Ending between Jupiter and Saturn: Balanced, grounded, and emotionally stable relationships.',
      'Chained or feathered line: Emotional vulnerability, intense empathy, and sensitive heart vibrations.',
      'Fork at the end (Writer’s or Palmist’s fork): Ability to balance passion with common sense.'
    ]
  },
  {
    id: 'head',
    name: 'Head Line',
    hindiName: 'Mastak Rekha (मस्तक रेखा)',
    elementColor: '#06b6d4',
    description: 'Traverses the middle palm above the Life Line. Governs intellect, memory, analytical focus, mental endurance, and creativity.',
    significance: 'Indicates how you process information, solve problems, and communicate decisions.',
    traditionalRules: [
      'Straight across towards Upper Mars: Logical, practical, scientific, and realistic mindset.',
      'Curving downwards towards Mount of Moon: Creative imagination, artistic intuition, and emotional depth.',
      'Long and clearly defined: Remarkable focus, intellectual stamina, and strategic vision.',
      'Separate from Life Line at beginning: Independent thinker, bold risk-taker from early youth.'
    ]
  },
  {
    id: 'life',
    name: 'Life Line',
    hindiName: 'Jeevan Rekha (जीवन रेखा)',
    elementColor: '#10b981',
    description: 'Arches gracefully around the base of the thumb (Mount of Venus) towards the wrist. Governs physical vitality, life force (Prana), vitality enthusiasm, and major environmental transitions.',
    significance: 'Traditional palmists read this line for energy reserves and adaptability, NOT deterministic lifespan.',
    traditionalRules: [
      'Wide sweeping arc into the palm: Abundant vitality, outgoing warmth, and zest for adventurous life.',
      'Hugging close to the thumb: Reserved energy, home-loving nature, cautious physical pacing.',
      'Deep, unbroken rosy groove: Exceptional physical vitality and quick recovery from fatigue.',
      'Upward branching twigs: Periods of triumph, educational honors, and personal self-elevation.'
    ]
  },
  {
    id: 'fate',
    name: 'Fate Line',
    hindiName: 'Bhagya Rekha (भाग्य रेखा)',
    elementColor: '#8b5cf6',
    description: 'Runs vertically up the palm from the wrist toward the Mount of Saturn (middle finger). Governs career direction, personal vocation, and sense of purpose.',
    significance: 'Reflects how external world forces and personal discipline interact to shape career accomplishments.',
    traditionalRules: [
      'Starting from wrist base: Early clarity of purpose, self-made ambition, and steady professional climb.',
      'Starting from Mount of Moon: Career influenced by public favor, creative arts, or international travel.',
      'Starting late on the Head Line (age 35+): Late-blooming career success and mature triumph through wisdom.',
      'Deep and unwavering: Uncompromising focus on career targets and professional mastery.'
    ]
  },
  {
    id: 'sun',
    name: 'Sun Line',
    hindiName: 'Surya Rekha (सूर्य रेखा)',
    elementColor: '#f59e0b',
    description: 'Runs vertically beneath the ring finger (Mount of Apollo). Also known as the Line of Apollo or Line of Success.',
    significance: 'Marks fame, public recognition, artistic genius, social influence, and magnetic charisma.',
    traditionalRules: [
      'Present and sharp: Natural spotlight, public applause, and creative accolades.',
      'Multiple parallel sun lines: Diversified artistic talents and widespread social goodwill.',
      'Star at the termination: High renown, celebrated achievements, and artistic legacy.'
    ]
  },
  {
    id: 'marriage',
    name: 'Marriage Lines',
    hindiName: 'Vivah Rekha (विवाह रेखा)',
    elementColor: '#ec4899',
    description: 'Short horizontal lines situated on the side of the percussion between the pinky finger and Heart Line.',
    significance: 'Traditional markers of deep emotional bonds, serious commitments, and soul partnerships.',
    traditionalRules: [
      'Deep, straight, and uncrossed: Harmonious, enduring, and mutually uplifting lifelong bond.',
      'Closer to Heart Line: Early profound love union or committed youth engagement.',
      'Equidistant between pinky and Heart Line: Prime relationship commitment in mid-twenties to thirties.'
    ]
  }
];

export const PLANETARY_MOUNTS = [
  { name: 'Mount of Jupiter (Guru)', planet: 'Jupiter', meaning: 'Ambition, leadership, dignity, spirituality, and generous command.' },
  { name: 'Mount of Saturn (Shani)', planet: 'Saturn', meaning: 'Wisdom, discipline, philosophy, solitude, perseverance, and structure.' },
  { name: 'Mount of Sun (Surya / Apollo)', planet: 'Sun', meaning: 'Creativity, prestige, radiance, aesthetic refinement, and fortune.' },
  { name: 'Mount of Mercury (Budha)', planet: 'Mercury', meaning: 'Eloquence, commerce, sharp wit, quick intellect, and healing gifts.' },
  { name: 'Mount of Venus (Shukra)', planet: 'Venus', meaning: 'Sensory delight, love of beauty, warmth, passion, and artistic vitality.' },
  { name: 'Mount of Moon (Chandra)', planet: 'Moon', meaning: 'Subconscious intuition, vivid imagination, romance, and mystical empathy.' },
  { name: 'Mount of Mars (Mangal)', planet: 'Mars', meaning: 'Upper Mars represents moral courage and patience; Lower Mars represents active courage and drive.' },
];
