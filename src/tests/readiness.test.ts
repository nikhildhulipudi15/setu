import test from 'node:test';
import assert from 'node:assert';
import { calculateSchemeReadiness } from '../utils/readiness';
import { sanitizeProfile, sanitizeClaim } from '../utils/storage';
import { Scheme, UserProfile, ClaimRecord } from '../types';

// Baseline matching profile
const matchingProfile: UserProfile = {
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
};

// Deterministic test scheme with 2 mandatory documents and 2 application steps
const mockScholarshipScheme: Scheme = {
  id: 'test-scholarship-01',
  name: 'Vidya Jyothi Fee Reimbursement',
  code: 'VJ-01',
  schemeLevel: 'State',
  department: 'Higher Education Department',
  description: 'Full tuition fee reimbursement for eligible college students in AP.',
  beneficiaryCategory: 'Education & Scholarships',
  lastVerifiedDate: '2024-10-15',
  dataStatus: 'verified',
  officialInfoUrl: 'https://jnb.apcfss.in',
  applicationUrl: 'https://jnb.apcfss.in/apply',
  benefitFinancials: '100% Tuition Fee',
  frequency: 'Annual',
  verificationAuthority: 'Welfare and Education Assistant (WEA)',
  offlineCenter: 'Grama / Ward Sachivalayam',
  helpline: '1902',
  defaultNextAction: 'Submit admission details at college office.',
  conditions: [
    {
      id: 'cond-state',
      field: 'state',
      operator: 'equals',
      requiredValue: 'Andhra Pradesh',
      isMandatory: true,
      label: 'Resident of Andhra Pradesh',
      explanation: 'Applicant must reside in AP.'
    },
    {
      id: 'cond-income',
      field: 'incomeBand',
      operator: 'in',
      requiredValue: ['Below ₹1,00,000 / year', '₹1,00,000 - ₹2,50,000 / year'],
      isMandatory: true,
      label: 'Annual Family Income <= 2.5 Lakhs',
      explanation: 'Must be low or marginal income band.'
    },
    {
      id: 'cond-attendance',
      field: 'employmentStatus',
      operator: 'equals',
      requiredValue: 'Regular Student',
      isMandatory: true,
      requiresExternalVerification: true,
      sourceReference: 'Jnanabhumi AePDS Biometric Attendance Feed',
      label: '75% Minimum Biometric Attendance',
      explanation: 'Verified through college AePDS biometric machines every month.'
    }
  ],
  requiredDocuments: [
    {
      id: 'doc-rice-card',
      name: 'White Ration Card (Rice Card)',
      isMandatory: true,
      whereToGet: 'Civil Supplies / Grama Sachivalayam',
      description: 'Proof of an active ration card with the applicant listed.',
      alternativeAllowed: 'Integrated Income Certificate (MeeSeva)'
    },
    {
      id: 'doc-allotment',
      name: 'College Allotment Order',
      isMandatory: true,
      whereToGet: 'Convener Office / APSCHE Portal',
      description: 'Official confirmation of college admission.'
    },
    {
      id: 'doc-optional-bonafide',
      name: 'College Study Certificate',
      isMandatory: false,
      whereToGet: 'College Principal Office',
      description: 'A study certificate signed by the college principal.'
    }
  ],
  applicationSteps: [
    {
      stepNumber: 1,
      title: 'College Admission Verification',
      description: 'Principal registers student admission on Jnanabhumi portal.',
      locationOrUrl: 'College Admin Counter'
    },
    {
      stepNumber: 2,
      title: 'Biometric e-KYC Verification',
      description: 'Student and parent complete fingerprint authentication at Sachivalayam.',
      locationOrUrl: 'Grama Sachivalayam Counter'
    }
  ]
};

test('Test 1: Full readiness calculation when all mandatory documents are ready and all steps completed', () => {
  const claim: ClaimRecord = {
    id: 'claim-1',
    schemeId: mockScholarshipScheme.id,
    status: 'ready_to_apply',
    savedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    documentStates: {
      'doc-rice-card': 'ready',
      'doc-allotment': 'ready'
    },
    completedStepNumbers: [1, 2],
    gatheredDocIds: ['doc-rice-card', 'doc-allotment'],
    notes: 'Everything ready'
  };

  const readiness = calculateSchemeReadiness(mockScholarshipScheme, matchingProfile, claim);

  assert.strictEqual(readiness.totalMandatoryDocs, 2, 'Should have 2 mandatory documents');
  assert.strictEqual(readiness.readyMandatoryDocs, 2, 'Both mandatory documents should be ready');
  assert.strictEqual(readiness.totalSteps, 2, 'Should have 2 application steps');
  assert.strictEqual(readiness.completedSteps, 2, 'Both application steps should be completed');
  assert.strictEqual(readiness.totalChecklistItems, 4, 'Total checklist items = 2 docs + 2 steps');
  assert.strictEqual(readiness.completedChecklistItems, 4, 'All 4 checklist items completed');
  assert.strictEqual(readiness.readinessPercentage, 100, 'Readiness percentage should be exactly 100%');
  assert.strictEqual(readiness.nextActionPriority, 'ready_to_apply', 'Next action priority should be ready_to_apply');
  assert.ok(readiness.computedNextBestAction.includes('All documents and preparation steps ready'), 'Next action indicates full readiness');
});

test('Test 2: Partial readiness when 1 of 2 mandatory documents is ready and 0 steps completed', () => {
  const claim: ClaimRecord = {
    id: 'claim-2',
    schemeId: mockScholarshipScheme.id,
    status: 'gathering_docs',
    savedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    documentStates: {
      'doc-rice-card': 'ready',
      'doc-allotment': 'not_available'
    },
    completedStepNumbers: [],
    gatheredDocIds: ['doc-rice-card'],
    notes: 'Gathering docs'
  };

  const readiness = calculateSchemeReadiness(mockScholarshipScheme, matchingProfile, claim);

  assert.strictEqual(readiness.readyMandatoryDocs, 1);
  assert.strictEqual(readiness.notAvailableDocs, 1);
  assert.strictEqual(readiness.completedSteps, 0);
  assert.strictEqual(readiness.completedChecklistItems, 1);
  assert.strictEqual(readiness.totalChecklistItems, 4);
  // 1 out of 4 items is 25%
  assert.strictEqual(readiness.readinessPercentage, 25);
  assert.strictEqual(readiness.nextActionPriority, 'document_needed');
});

test('Test 3: Document marked not_available directs Next Best Action to obtain that specific certificate', () => {
  const claim: ClaimRecord = {
    id: 'claim-3',
    schemeId: mockScholarshipScheme.id,
    status: 'gathering_docs',
    savedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    documentStates: {
      'doc-rice-card': 'not_available',
      'doc-allotment': 'ready'
    },
    completedStepNumbers: [1],
    gatheredDocIds: ['doc-allotment'],
    notes: ''
  };

  const readiness = calculateSchemeReadiness(mockScholarshipScheme, matchingProfile, claim);

  assert.strictEqual(readiness.nextActionPriority, 'document_needed');
  assert.ok(
    readiness.computedNextBestAction.includes('White Ration Card (Rice Card)'),
    `Expected Next Best Action to mention missing Rice Card, got: ${readiness.computedNextBestAction}`
  );
  assert.ok(
    readiness.computedNextBestAction.includes('Civil Supplies / Grama Sachivalayam'),
    `Expected Next Best Action to mention where to get it, got: ${readiness.computedNextBestAction}`
  );
});

test('Test 4: Document marked needs_verification directs Next Best Action to verify with designated authority', () => {
  const claim: ClaimRecord = {
    id: 'claim-4',
    schemeId: mockScholarshipScheme.id,
    status: 'gathering_docs',
    savedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    documentStates: {
      'doc-rice-card': 'ready',
      'doc-allotment': 'needs_verification'
    },
    completedStepNumbers: [],
    gatheredDocIds: ['doc-rice-card'],
    notes: ''
  };

  const readiness = calculateSchemeReadiness(mockScholarshipScheme, matchingProfile, claim);

  assert.strictEqual(readiness.nextActionPriority, 'verification_needed');
  assert.ok(
    readiness.computedNextBestAction.includes('Verify validity of College Allotment Order'),
    `Expected Next Best Action to mention verifying Allotment Order, got: ${readiness.computedNextBestAction}`
  );
  assert.ok(
    readiness.computedNextBestAction.includes('Convener Office / APSCHE Portal'),
    `Expected Next Best Action to reference the issuing authority, got: ${readiness.computedNextBestAction}`
  );
});

test('Test 5: Next Action properly prioritizes missing profile fields before document preparation', () => {
  // Profile missing incomeBand
  const incompleteProfile: UserProfile = {
    ...matchingProfile,
    incomeBand: null as any
  };

  const claim: ClaimRecord = {
    id: 'claim-5',
    schemeId: mockScholarshipScheme.id,
    status: 'gathering_docs',
    savedAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    documentStates: {
      'doc-rice-card': 'ready',
      'doc-allotment': 'ready'
    },
    completedStepNumbers: [1, 2],
    gatheredDocIds: ['doc-rice-card', 'doc-allotment'],
    notes: ''
  };

  const readiness = calculateSchemeReadiness(mockScholarshipScheme, incompleteProfile, claim);

  assert.strictEqual(readiness.nextActionPriority, 'missing_profile');
  assert.ok(
    readiness.computedNextBestAction.includes('Update your profile'),
    `Expected profile prompt before document readiness, got: ${readiness.computedNextBestAction}`
  );
  assert.strictEqual(readiness.missingProfileFields.length, 1);
  assert.strictEqual(readiness.missingProfileFields[0].field, 'incomeBand');
});

test('Test 6: Storage sanitization repairs corrupted data and migrates v1 gatheredDocIds to v2 documentStates', () => {
  // Test sanitizeProfile with invalid and corrupted fields
  const corruptedProfileRaw = {
    state: 'InvalidStateName',
    district: '   ',
    age: -15,
    gender: 'UnknownGender',
    education: 12345, // invalid type
    incomeBand: null,
    socialCategory: 999,
    rationCard: 'Pink Card (AP)',
    isRural: 'yes', // should convert to boolean
    ownsAgriculturalLand: 1, // should convert to boolean
    landHoldingAcres: 'five' // NaN should fallback to 0
  };

  const cleanedProfile = sanitizeProfile(corruptedProfileRaw);
  assert.strictEqual(cleanedProfile.state, 'Andhra Pradesh', 'Fallback to default state');
  assert.strictEqual(cleanedProfile.district, 'Visakhapatnam', 'Fallback to default district');
  assert.strictEqual(cleanedProfile.age, null, 'Negative age sanitized to null');
  assert.strictEqual(cleanedProfile.gender, 'Female', 'Invalid gender reset to default');
  assert.strictEqual(cleanedProfile.isRural, true, 'isRural converted to boolean');
  assert.strictEqual(cleanedProfile.ownsAgriculturalLand, true, 'ownsAgriculturalLand converted to boolean');
  assert.strictEqual(cleanedProfile.landHoldingAcres, 0, 'NaN acres converted to 0');

  // Test sanitizeClaim migrating v1 legacy array
  const legacyClaimRaw = {
    id: 'legacy-claim-99',
    schemeId: 'jvd-rtf',
    status: 'gathering_docs',
    gatheredDocIds: ['doc-rice-card', 'doc-college-allotment']
    // Note: no documentStates or completedStepNumbers
  };

  const migratedClaim = sanitizeClaim(legacyClaimRaw);
  assert.ok(migratedClaim !== null, 'Claim should be successfully migrated');
  assert.strictEqual(migratedClaim.documentStates['doc-rice-card'], 'ready', 'doc-rice-card migrated to ready');
  assert.strictEqual(migratedClaim.documentStates['doc-college-allotment'], 'ready', 'doc-college-allotment migrated to ready');
  assert.deepStrictEqual(migratedClaim.completedStepNumbers, [], 'completedStepNumbers initialized as empty array');
  assert.deepStrictEqual(migratedClaim.gatheredDocIds, ['doc-rice-card', 'doc-college-allotment']);

  // Test null / invalid claim inputs
  assert.strictEqual(sanitizeClaim(null), null);
  assert.strictEqual(sanitizeClaim(undefined), null);
  assert.strictEqual(sanitizeClaim({}), null); // missing schemeId
});

test('Test 7: Unverifiable conditions are flagged with official offline authority explanation', () => {
  const readiness = calculateSchemeReadiness(mockScholarshipScheme, matchingProfile);

  assert.strictEqual(readiness.unverifiableItems.length, 1);
  assert.strictEqual(readiness.unverifiableItems[0].label, '75% Minimum Biometric Attendance');
  assert.strictEqual(
    readiness.unverifiableItems[0].authority,
    'Jnanabhumi AePDS Biometric Attendance Feed'
  );
  assert.ok(
    readiness.unverifiableItems[0].reason.includes('cannot be verified offline by HaqSetu AI'),
    'Reason clearly warns users of offline authority verification requirement'
  );
});

test('Test 8: Disqualification warning takes top priority when profile conflicts with mandatory criteria', () => {
  const disqualifiedProfile: UserProfile = {
    ...matchingProfile,
    state: 'Telangana' // conflicts with cond-state: Andhra Pradesh
  };

  const readiness = calculateSchemeReadiness(mockScholarshipScheme, disqualifiedProfile);

  assert.strictEqual(readiness.nextActionPriority, 'disqualification');
  assert.ok(
    readiness.computedNextBestAction.includes('Review conflicting requirement'),
    `Expected disqualification action, got: ${readiness.computedNextBestAction}`
  );
});
