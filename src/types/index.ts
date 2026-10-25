export type State = 'Andhra Pradesh' | 'Telangana' | 'Other';

export type EducationLevel = 
  | 'Below 10th'
  | '10th Class (SSC)'
  | 'Intermediate (11th-12th)'
  | 'ITI / Polytechnic Diploma'
  | 'Undergraduate (BA, B.Sc, B.Com, B.Tech, MBBS)'
  | 'Postgraduate / Professional'
  | 'None'
  | 'Prefer not to say';

export type EmploymentStatus = 
  | 'Prefer not to say'
  | 'Regular Student'
  | 'Unemployed / Job Seeker'
  | 'Small / Marginal Farmer'
  | 'Tenant Farmer'
  | 'Daily Wage / Rural Worker'
  | 'Artisan / Craftsman / Handloom'
  | 'Self-Employed / Street Vendor'
  | 'Private Sector Employee'
  | 'Government / Pensioner'
  | 'Homemaker';

export type IncomeBand = 
  | 'Below ₹1,00,000 / year'
  | '₹1,00,000 - ₹2,50,000 / year'
  | '₹2,50,000 - ₹5,00,000 / year'
  | 'Above ₹5,00,000 / year'
  | 'Unknown / Not sure';

export type SocialCategory = 
  | 'General (OC)'
  | 'OBC / BC (Backward Classes)'
  | 'SC (Scheduled Caste)'
  | 'ST (Scheduled Tribe)'
  | 'Minority (Muslim, Christian, etc.)'
  | 'EWS (Economically Weaker Section)'
  | 'Prefer not to disclose';

export type RationCardType = 
  | 'White Card (Rice Card / BPL)' 
  | 'Pink Card' 
  | 'None' 
  | 'Applied / Not sure';

export interface UserProfile {
  state: State;
  district: string;
  age: number | null;
  gender: 'Female' | 'Male' | 'Transgender' | 'Prefer not to say';
  education: EducationLevel;
  employmentStatus: EmploymentStatus;
  incomeBand: IncomeBand;
  socialCategory: SocialCategory;
  rationCard: RationCardType;
  isRural: boolean;
  hasDisability: boolean;
  isSingleMotherOrWidow: boolean;
  ownsAgriculturalLand: boolean;
  landHoldingAcres: number | null;
  hasBankAadhaarLinked: boolean;
}

export type ProfileField = keyof UserProfile;

export type SchemeCategory = 
  | 'Education & Scholarships'
  | 'Farmer & Agriculture'
  | 'Women & Child Welfare'
  | 'Healthcare & Insurance'
  | 'Livelihood & Artisans'
  | 'Social Security & Pensions';

export type ComparisonOperator = 
  | 'equals'
  | 'not_equals'
  | 'in'
  | 'not_in'
  | 'less_than_or_equal'
  | 'greater_than_or_equal'
  | 'between'
  | 'boolean_true'
  | 'boolean_false'
  | 'external_verification';

export interface StructuredCondition {
  id: string;
  field: ProfileField;
  operator: ComparisonOperator;
  requiredValue?: any;
  isMandatory: boolean;
  label: string;
  teluguLabel?: string;
  explanation: string;
  sourceReference?: string;
  requiresExternalVerification?: boolean;
}

export interface RequiredDocument {
  id: string;
  name: string;
  teluguName?: string;
  description: string;
  whereToGet: string;
  alternativeAllowed?: string;
  isMandatory: boolean;
}

export interface ApplicationStep {
  stepNumber: number;
  title: string;
  teluguTitle?: string;
  description: string;
  locationOrUrl?: string;
  isOffline?: boolean;
}

export type DataStatus = 'verified' | 'illustrative_demo';
export type SchemeLevel = 'State' | 'Central';

export interface Scheme {
  id: string;
  name: string;
  code: string;
  teluguName?: string;
  schemeLevel: SchemeLevel;
  department: string;
  description: string;
  beneficiaryCategory: SchemeCategory;

  conditions: StructuredCondition[];
  requiredDocuments: RequiredDocument[];
  applicationSteps: ApplicationStep[];

  officialInfoUrl: string;
  applicationUrl?: string;

  lastVerifiedDate: string;
  dataStatus: DataStatus;

  benefitFinancials: string;
  frequency: 'Annual' | 'Quarterly' | 'One-Time' | 'As Needed';
  verificationAuthority: string;
  offlineCenter: string;
  helpline: string;
  defaultNextAction: string;

  // Backward compatibility convenience getters
  title?: string;
  teluguTitle?: string;
  category?: SchemeCategory;
  stateOrCentral?: 'Andhra Pradesh' | 'Central Government';
  administeringDept?: string;
  tagline?: string;
  benefitSummary?: string;
  officialPortal?: {
    name: string;
    url: string;
    note: string;
  };
  isIllustrativeDemo?: boolean;
}

export type ConditionState = 'Satisfied' | 'Not satisfied' | 'Unknown / needs verification';

export interface EvaluatedCondition {
  condition: StructuredCondition;
  state: ConditionState;
  actualValue: any;
  explanation: string;
  missingField?: ProfileField;
}

export type SchemeOutcome = 'POTENTIAL MATCH' | 'NEEDS VERIFICATION' | 'LIKELY NOT A MATCH';

export interface SchemeEvaluationResult {
  scheme: Scheme;
  outcome: SchemeOutcome;
  matchSummary: string;
  satisfiedConditions: EvaluatedCondition[];
  notSatisfiedConditions: EvaluatedCondition[];
  needsVerificationConditions: EvaluatedCondition[];
  missingProfileFields: { field: ProfileField; label: string }[];
  documentsToPrepare: RequiredDocument[];
  clearNextAction: string;
  officialLinks: {
    infoUrl: string;
    applyUrl?: string;
  };
  disclaimer: string;
}

export type ClaimStatus = 
  | 'bookmarked'
  | 'gathering_docs'
  | 'ready_to_apply'
  | 'submitted'
  | 'approved';

// 3-way document readiness state
export type DocumentReadinessState = 'ready' | 'not_available' | 'needs_verification';

export interface ClaimRecord {
  id: string;
  schemeId: string;
  status: ClaimStatus;
  savedAt: string;
  lastUpdated?: string;
  applicationNumber?: string;
  submissionDate?: string;
  notes?: string;
  // Dynamic 3-way document checklist state
  documentStates: Record<string, DocumentReadinessState>;
  // Dynamic preparation steps completed
  completedStepNumbers: number[];
  // Legacy backward-compat field
  gatheredDocIds?: string[];
  nextAction?: string;
  targetDate?: string;
}

// Scheme-specific Claim Readiness Assessment
export interface SchemeReadinessAssessment {
  schemeId: string;
  totalMandatoryDocs: number;
  readyMandatoryDocs: number;
  needsVerificationDocs: number;
  notAvailableDocs: number;
  totalSteps: number;
  completedSteps: number;
  totalChecklistItems: number;
  completedChecklistItems: number;
  readinessPercentage: number;
  computedNextBestAction: string;
  nextActionPriority: 'missing_profile' | 'disqualification' | 'document_needed' | 'verification_needed' | 'step_pending' | 'ready_to_apply';
  unverifiableItems: {
    label: string;
    reason: string;
    authority: string;
  }[];
  outstandingConditions: EvaluatedCondition[];
  missingProfileFields: { field: ProfileField; label: string }[];
}

// Benefit Blocker Detector Types
export type BlockerType = 
  | 'rejected'
  | 'missing_or_incorrect_docs'
  | 'verification_failed'
  | 'payment_delayed'
  | 'portal_submission_error';

export interface BlockerDiagnosticStep {
  order: number;
  instruction: string;
  teluguInstruction?: string;
  evidenceNeeded?: string;
  portalOrDesk: string;
}

export interface BlockerSupportChannel {
  name: string;
  type: 'helpline' | 'portal' | 'physical_desk';
  contactOrUrl: string;
  resolutionTime: string;
  instructions: string;
}

export interface BlockerOption {
  id: string;
  label: string;
  symptom: string;
  orderedChecks: BlockerDiagnosticStep[];
  evidenceRequired: string[];
  portalOrOffice?: string;
  officialChannel: BlockerSupportChannel;
  schemeSpecificNote?: Record<string, string>;
}

export interface BlockerFlow {
  id: BlockerType;
  title: string;
  teluguTitle: string;
  shortDescription: string;
  followUpQuestion: string;
  options: BlockerOption[];
}

export interface TroubleshootIssue {
  id: string;
  category: 'rejected' | 'documents' | 'verification' | 'delayed_payment' | 'appeal';
  title: string;
  teluguTitle: string;
  shortSummary: string;
  teluguShortSummary: string;
  rootCauses: string[];
  actionSteps: {
    order: number;
    title: string;
    detail: string;
    portalOrOffice: string;
  }[];
  escalationChannel: string;
  teluguEscalation: string;
  timelineDays: string;
  relevantHelpline: string;
}
