import { UserProfile, ClaimRecord, DocumentReadinessState } from '../types';

export const DEFAULT_PROFILE: UserProfile = {
  state: 'Andhra Pradesh',
  district: '',
  age: null,
  gender: 'Prefer not to say',
  education: 'Prefer not to say',
  employmentStatus: 'Prefer not to say',
  incomeBand: 'Unknown / Not sure',
  socialCategory: 'Prefer not to disclose',
  rationCard: 'Applied / Not sure',
  isRural: false,
  hasDisability: false,
  isSingleMotherOrWidow: false,
  ownsAgriculturalLand: false,
  landHoldingAcres: 0,
  hasBankAadhaarLinked: false,
};

export const SAMPLE_PRESETS: { name: string; description: string; profile: UserProfile }[] = [
  {
    name: 'B.Tech College Student (AP)',
    description: '20-year-old student from Visakhapatnam pursuing engineering, low-income White Rice card family.',
    profile: {
      state: 'Andhra Pradesh',
      district: 'Visakhapatnam',
      age: 20,
      gender: 'Female',
      education: 'Undergraduate (BA, B.Sc, B.Com, B.Tech, MBBS)',
      employmentStatus: 'Regular Student',
      incomeBand: 'Below ₹1,00,000 / year',
      socialCategory: 'OBC / BC (Backward Classes)',
      rationCard: 'White Card (Rice Card / BPL)',
      isRural: true,
      hasDisability: false,
      isSingleMotherOrWidow: false,
      ownsAgriculturalLand: false,
      landHoldingAcres: 0,
      hasBankAadhaarLinked: true
    }
  },
  {
    name: 'Small Farmer Family (Guntur)',
    description: '48-year-old farmer cultivating 3 acres in Guntur district with White Rice card.',
    profile: {
      state: 'Andhra Pradesh',
      district: 'Guntur',
      age: 48,
      gender: 'Male',
      education: '10th Class (SSC)',
      employmentStatus: 'Small / Marginal Farmer',
      incomeBand: '₹1,00,000 - ₹2,50,000 / year',
      socialCategory: 'General (OC)',
      rationCard: 'White Card (Rice Card / BPL)',
      isRural: true,
      hasDisability: false,
      isSingleMotherOrWidow: false,
      ownsAgriculturalLand: true,
      landHoldingAcres: 3,
      hasBankAadhaarLinked: true
    }
  },
  {
    name: 'Woman Entrepreneur / Weaver (Prakasam)',
    description: '49-year-old woman artisan in Chirala/Prakasam from BC community looking for livelihood & interest support.',
    profile: {
      state: 'Andhra Pradesh',
      district: 'Prakasam',
      age: 49,
      gender: 'Female',
      education: 'Below 10th',
      employmentStatus: 'Artisan / Craftsman / Handloom',
      incomeBand: 'Below ₹1,00,000 / year',
      socialCategory: 'OBC / BC (Backward Classes)',
      rationCard: 'White Card (Rice Card / BPL)',
      isRural: true,
      hasDisability: false,
      isSingleMotherOrWidow: false,
      ownsAgriculturalLand: false,
      landHoldingAcres: 0,
      hasBankAadhaarLinked: true
    }
  },
  {
    name: 'School Mother (Amma Vodi Candidate)',
    description: '34-year-old mother with children in 8th & 10th standard in Eluru district.',
    profile: {
      state: 'Andhra Pradesh',
      district: 'Eluru',
      age: 34,
      gender: 'Female',
      education: '10th Class (SSC)',
      employmentStatus: 'Homemaker',
      incomeBand: 'Below ₹1,00,000 / year',
      socialCategory: 'SC (Scheduled Caste)',
      rationCard: 'White Card (Rice Card / BPL)',
      isRural: true,
      hasDisability: false,
      isSingleMotherOrWidow: false,
      ownsAgriculturalLand: false,
      landHoldingAcres: 0,
      hasBankAadhaarLinked: true
    }
  }
];

const PROFILE_KEY = 'haqsetu_user_profile_v2';
const CLAIMS_KEY = 'haqsetu_user_claims_v2';
const FRESH_DATA_MARKER = 'haqsetu_clean_profile_v1';

/** Clear prior demo/profile data once after the clean-start update. */
export function prepareFreshCitizenData(): void {
  try {
    if (localStorage.getItem(FRESH_DATA_MARKER) === 'done') return;
    [
      PROFILE_KEY,
      CLAIMS_KEY,
      'haqsetu_user_profile_v1',
      'haqsetu_user_claims_v1',
    ].forEach((key) => localStorage.removeItem(key));
    localStorage.setItem(FRESH_DATA_MARKER, 'done');
    return;
  } catch (e) {
    console.warn('Unable to clear previous HaqSetu demo data.', e);
  }
}

/**
 * Validates and sanitizes a profile object against malformed data.
 */
export function sanitizeProfile(raw: any): UserProfile {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_PROFILE };

  return {
    state: (raw.state === 'Andhra Pradesh' || raw.state === 'Telangana' || raw.state === 'Other') 
      ? raw.state 
      : DEFAULT_PROFILE.state,
    district: raw.district === '' ? '' : typeof raw.district === 'string' && raw.district.trim() ? raw.district : DEFAULT_PROFILE.district,
    age: (typeof raw.age === 'number' && !isNaN(raw.age) && raw.age > 0) ? raw.age : null,
    gender: ['Female', 'Male', 'Transgender', 'Prefer not to say'].includes(raw.gender) ? raw.gender : DEFAULT_PROFILE.gender,
    education: typeof raw.education === 'string' ? raw.education : DEFAULT_PROFILE.education,
    employmentStatus: typeof raw.employmentStatus === 'string' ? raw.employmentStatus : DEFAULT_PROFILE.employmentStatus,
    incomeBand: typeof raw.incomeBand === 'string' ? raw.incomeBand : DEFAULT_PROFILE.incomeBand,
    socialCategory: typeof raw.socialCategory === 'string' ? raw.socialCategory : DEFAULT_PROFILE.socialCategory,
    rationCard: typeof raw.rationCard === 'string' ? raw.rationCard : DEFAULT_PROFILE.rationCard,
    isRural: Boolean(raw.isRural),
    hasDisability: Boolean(raw.hasDisability),
    isSingleMotherOrWidow: Boolean(raw.isSingleMotherOrWidow),
    ownsAgriculturalLand: Boolean(raw.ownsAgriculturalLand),
    landHoldingAcres: (typeof raw.landHoldingAcres === 'number' && !isNaN(raw.landHoldingAcres)) ? raw.landHoldingAcres : 0,
    hasBankAadhaarLinked: Boolean(raw.hasBankAadhaarLinked),
  };
}

/**
 * Validates and migrates a single claim record safely.
 */
export function sanitizeClaim(raw: any): ClaimRecord | null {
  if (!raw || typeof raw !== 'object' || !raw.schemeId) return null;

  const validStatuses = ['bookmarked', 'gathering_docs', 'ready_to_apply', 'submitted', 'approved'];
  const status = validStatuses.includes(raw.status) ? raw.status : 'gathering_docs';

  // Migrate documentStates
  const documentStates: Record<string, DocumentReadinessState> = {};
  if (raw.documentStates && typeof raw.documentStates === 'object') {
    for (const [docId, st] of Object.entries(raw.documentStates)) {
      if (st === 'ready' || st === 'not_available' || st === 'needs_verification') {
        documentStates[docId] = st as DocumentReadinessState;
      }
    }
  } else if (Array.isArray(raw.gatheredDocIds)) {
    // Migration from v1 gatheredDocIds
    for (const docId of raw.gatheredDocIds) {
      if (typeof docId === 'string') {
        documentStates[docId] = 'ready';
      }
    }
  }

  const completedStepNumbers: number[] = Array.isArray(raw.completedStepNumbers)
    ? raw.completedStepNumbers.filter((n: any) => typeof n === 'number' && !isNaN(n))
    : [];

  return {
    id: typeof raw.id === 'string' && raw.id ? raw.id : `claim-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    schemeId: String(raw.schemeId),
    status,
    savedAt: typeof raw.savedAt === 'string' ? raw.savedAt : new Date().toISOString(),
    lastUpdated: typeof raw.lastUpdated === 'string' ? raw.lastUpdated : new Date().toISOString(),
    applicationNumber: typeof raw.applicationNumber === 'string' ? raw.applicationNumber : '',
    notes: typeof raw.notes === 'string' ? raw.notes : '',
    documentStates,
    completedStepNumbers,
    gatheredDocIds: Object.keys(documentStates).filter(k => documentStates[k] === 'ready'),
    nextAction: typeof raw.nextAction === 'string' ? raw.nextAction : ''
  };
}

export function getStoredProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      return sanitizeProfile(JSON.parse(raw));
    }
  } catch (e) {
    console.warn('Failed reading user profile from localStorage, resetting to default.', e);
  }
  return { ...DEFAULT_PROFILE };
}

export function saveStoredProfile(profile: UserProfile): void {
  try {
    const sanitized = sanitizeProfile(profile);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(sanitized));
  } catch (e) {
    console.error('Failed saving user profile to localStorage', e);
  }
}

export function getStoredClaims(): ClaimRecord[] {
  try {
    const raw = localStorage.getItem(CLAIMS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const sanitized = parsed.map(sanitizeClaim).filter((c): c is ClaimRecord => c !== null);
        return sanitized;
      }
    }
  } catch (e) {
    console.warn('Failed reading claims from localStorage, resetting to default.', e);
  }

  return [];
}

export function saveStoredClaims(claims: ClaimRecord[]): void {
  try {
    const sanitized = claims.map(sanitizeClaim).filter((c): c is ClaimRecord => c !== null);
    localStorage.setItem(CLAIMS_KEY, JSON.stringify(sanitized));
  } catch (e) {
    console.error('Failed saving claims to localStorage', e);
  }
}

export function addClaimForScheme(schemeId: string): ClaimRecord {
  const claims = getStoredClaims();
  const existing = claims.find(c => c.schemeId === schemeId);
  if (existing) return existing;

  const newClaim: ClaimRecord = {
    id: 'claim-' + Date.now(),
    schemeId,
    status: 'gathering_docs',
    savedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    documentStates: {},
    completedStepNumbers: [],
    gatheredDocIds: [],
    notes: 'Saved from HaqSetu eligibility search.'
  };

  const updated = [newClaim, ...claims];
  saveStoredClaims(updated);
  return newClaim;
}
