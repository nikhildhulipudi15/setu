import test from 'node:test';
import assert from 'node:assert';
import { 
  evaluateCondition, 
  evaluateScheme, 
  evaluateAllSchemes, 
  isUnknownProfileValue 
} from '../utils/matcher';
import { 
  UserProfile, 
  Scheme, 
  StructuredCondition 
} from '../types';

// Baseline valid AP student profile
const validAPStudentProfile: UserProfile = {
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

// Simple test scheme with 2 pure deterministic conditions
const simpleHealthScheme: Scheme = {
  id: 'test-health-01',
  name: 'Universal Free Health Coverage',
  code: 'TEST-HLT',
  schemeLevel: 'State',
  department: 'Health Trust',
  description: 'Cashless medical assistance for low and middle income families.',
  beneficiaryCategory: 'Healthcare & Insurance',
  lastVerifiedDate: '2024-10-01',
  dataStatus: 'verified',
  officialInfoUrl: 'https://health.example.gov.in',
  benefitFinancials: 'Up to ₹25 Lakhs',
  frequency: 'As Needed',
  verificationAuthority: 'Hospital Counter',
  offlineCenter: 'Network Hospitals',
  helpline: '104',
  defaultNextAction: 'Present health card at network hospital.',
  conditions: [
    {
      id: 'c1-state',
      field: 'state',
      operator: 'equals',
      requiredValue: 'Andhra Pradesh',
      isMandatory: true,
      label: 'Resident of Andhra Pradesh',
      explanation: 'Must reside in AP.'
    },
    {
      id: 'c2-income',
      field: 'incomeBand',
      operator: 'in',
      requiredValue: [
        'Below ₹1,00,000 / year',
        '₹1,00,000 - ₹2,50,000 / year',
        '₹2,50,000 - ₹5,00,000 / year'
      ],
      isMandatory: true,
      label: 'Family Income <= ₹5 Lakhs',
      explanation: 'Income must be within ceiling.'
    }
  ],
  requiredDocuments: [
    {
      id: 'doc-aadhaar',
      name: 'Aadhaar Card',
      description: 'Identity proof.',
      whereToGet: 'UIDAI',
      isMandatory: true
    }
  ],
  applicationSteps: []
};

// 1. FULLY MATCHING PROFILE TEST
test('1. Fully matching profile produces POTENTIAL MATCH with all conditions satisfied', () => {
  const result = evaluateScheme(simpleHealthScheme, validAPStudentProfile);

  assert.strictEqual(result.outcome, 'POTENTIAL MATCH');
  assert.strictEqual(result.notSatisfiedConditions.length, 0);
  assert.strictEqual(result.needsVerificationConditions.length, 0);
  assert.strictEqual(result.satisfiedConditions.length, 2);
  assert.strictEqual(result.missingProfileFields.length, 0);
  assert.ok(result.disclaimer.includes('does not guarantee eligibility or approval'));
  assert.ok(result.matchSummary.includes('All mandatory criteria for this scheme are satisfied'));
});

// 2. DISQUALIFYING CONDITION TEST
test('2. Disqualifying condition produces LIKELY NOT A MATCH with clear conflict explanation', () => {
  // Candidate lives in Telangana instead of Andhra Pradesh
  const nonResidentProfile: UserProfile = {
    ...validAPStudentProfile,
    state: 'Telangana'
  };

  const result = evaluateScheme(simpleHealthScheme, nonResidentProfile);

  assert.strictEqual(result.outcome, 'LIKELY NOT A MATCH');
  assert.strictEqual(result.notSatisfiedConditions.length, 1);
  assert.strictEqual(result.notSatisfiedConditions[0].condition.id, 'c1-state');
  assert.strictEqual(result.notSatisfiedConditions[0].state, 'Not satisfied');
  assert.ok(result.matchSummary.includes('Resident of Andhra Pradesh'));
  assert.ok(result.notSatisfiedConditions[0].explanation.includes('conflicts with requirement'));
});

test('2b. High income band disqualification produces LIKELY NOT A MATCH', () => {
  const highIncomeProfile: UserProfile = {
    ...validAPStudentProfile,
    incomeBand: 'Above ₹5,00,000 / year'
  };

  const result = evaluateScheme(simpleHealthScheme, highIncomeProfile);

  assert.strictEqual(result.outcome, 'LIKELY NOT A MATCH');
  assert.strictEqual(result.notSatisfiedConditions.length, 1);
  assert.strictEqual(result.notSatisfiedConditions[0].condition.field, 'incomeBand');
});

// 3. MISSING INFORMATION TEST
test('3. Unknown or unspecified profile fields produce NEEDS VERIFICATION with identified missing fields', () => {
  const unknownIncomeProfile: UserProfile = {
    ...validAPStudentProfile,
    incomeBand: 'Unknown / Not sure'
  };

  const result = evaluateScheme(simpleHealthScheme, unknownIncomeProfile);

  assert.strictEqual(result.outcome, 'NEEDS VERIFICATION');
  assert.strictEqual(result.needsVerificationConditions.length, 1);
  assert.strictEqual(result.needsVerificationConditions[0].missingField, 'incomeBand');
  assert.strictEqual(result.missingProfileFields.length, 1);
  assert.strictEqual(result.missingProfileFields[0].field, 'incomeBand');
  assert.ok(result.clearNextAction.includes('Family Income <= ₹5 Lakhs'));
});

test('3b. External verification condition triggers NEEDS VERIFICATION', () => {
  const attendanceCondition: StructuredCondition = {
    id: 'c-att',
    field: 'employmentStatus',
    operator: 'external_verification',
    requiresExternalVerification: true,
    isMandatory: true,
    label: '75% Biometric Attendance',
    explanation: 'Must be verified by College Principal and AePDS portal.'
  };

  const schemeWithAttendance: Scheme = {
    ...simpleHealthScheme,
    conditions: [...simpleHealthScheme.conditions, attendanceCondition]
  };

  const result = evaluateScheme(schemeWithAttendance, validAPStudentProfile);

  assert.strictEqual(result.outcome, 'NEEDS VERIFICATION');
  assert.strictEqual(result.needsVerificationConditions.length, 1);
  assert.strictEqual(result.needsVerificationConditions[0].condition.id, 'c-att');
});

// 4. BOUNDARY VALUES TESTS
test('4a. Age boundary conditions for between [45, 60] (YSR Cheyutha rule)', () => {
  const ageCondition: StructuredCondition = {
    id: 'c-age-between',
    field: 'age',
    operator: 'between',
    requiredValue: [45, 60],
    isMandatory: true,
    label: 'Age between 45 and 60',
    explanation: 'Aadhaar age verification.'
  };

  // Lower boundary: age 45 -> Satisfied
  const resAtLower = evaluateCondition(ageCondition, { ...validAPStudentProfile, age: 45 });
  assert.strictEqual(resAtLower.state, 'Satisfied');

  // Upper boundary: age 60 -> Satisfied
  const resAtUpper = evaluateCondition(ageCondition, { ...validAPStudentProfile, age: 60 });
  assert.strictEqual(resAtUpper.state, 'Satisfied');

  // Below lower boundary: age 44 -> Not satisfied
  const resBelow = evaluateCondition(ageCondition, { ...validAPStudentProfile, age: 44 });
  assert.strictEqual(resBelow.state, 'Not satisfied');

  // Above upper boundary: age 61 -> Not satisfied
  const resAbove = evaluateCondition(ageCondition, { ...validAPStudentProfile, age: 61 });
  assert.strictEqual(resAbove.state, 'Not satisfied');

  // Null age -> Unknown / needs verification
  const resNullAge = evaluateCondition(ageCondition, { ...validAPStudentProfile, age: null });
  assert.strictEqual(resNullAge.state, 'Unknown / needs verification');
});

test('4b. Agricultural land ceiling boundary (less_than_or_equal 10 acres)', () => {
  const landCondition: StructuredCondition = {
    id: 'c-land-ceiling',
    field: 'landHoldingAcres',
    operator: 'less_than_or_equal',
    requiredValue: 10,
    isMandatory: true,
    label: 'Land <= 10 Acres',
    explanation: 'Webland limit.'
  };

  // Exactly 10.0 acres -> Satisfied
  const resAt10 = evaluateCondition(landCondition, { ...validAPStudentProfile, landHoldingAcres: 10.0 });
  assert.strictEqual(resAt10.state, 'Satisfied');

  // 9.9 acres -> Satisfied
  const resAt9_9 = evaluateCondition(landCondition, { ...validAPStudentProfile, landHoldingAcres: 9.9 });
  assert.strictEqual(resAt9_9.state, 'Satisfied');

  // 10.1 acres -> Not satisfied
  const resAt10_1 = evaluateCondition(landCondition, { ...validAPStudentProfile, landHoldingAcres: 10.1 });
  assert.strictEqual(resAt10_1.state, 'Not satisfied');

  // 0 acres (no land) -> Satisfied
  const resZero = evaluateCondition(landCondition, { ...validAPStudentProfile, landHoldingAcres: 0 });
  assert.strictEqual(resZero.state, 'Satisfied');
});

test('4c. Minimum age boundary (greater_than_or_equal 18 for PM Vishwakarma)', () => {
  const minAgeCondition: StructuredCondition = {
    id: 'c-min-age',
    field: 'age',
    operator: 'greater_than_or_equal',
    requiredValue: 18,
    isMandatory: true,
    label: 'Minimum Age 18',
    explanation: 'Must be an adult.'
  };

  // Exactly 18 -> Satisfied
  const res18 = evaluateCondition(minAgeCondition, { ...validAPStudentProfile, age: 18 });
  assert.strictEqual(res18.state, 'Satisfied');

  // 17 -> Not satisfied
  const res17 = evaluateCondition(minAgeCondition, { ...validAPStudentProfile, age: 17 });
  assert.strictEqual(res17.state, 'Not satisfied');
});

// 5. INCOMPLETE SCHEME DATA & EDGE CASES
test('5a. Incomplete scheme with empty conditions list handled safely without crashing', () => {
  const emptyScheme: Scheme = {
    ...simpleHealthScheme,
    conditions: []
  };

  const result = evaluateScheme(emptyScheme, validAPStudentProfile);
  assert.strictEqual(result.outcome, 'NEEDS VERIFICATION');
  assert.ok(result.matchSummary.includes('incomplete or under review'));
});

test('5b. Incomplete or null profile handled safely without crashing', () => {
  const result = evaluateScheme(simpleHealthScheme, null as any);
  assert.strictEqual(result.outcome, 'NEEDS VERIFICATION');
  assert.strictEqual(result.needsVerificationConditions.length, 2);
});

test('5c. Condition with malformed operator handled safely', () => {
  const badCondition: StructuredCondition = {
    id: 'c-bad',
    field: 'state',
    operator: 'invalid_op' as any,
    requiredValue: 'test',
    isMandatory: true,
    label: 'Bad Operator',
    explanation: 'Test'
  };

  const res = evaluateCondition(badCondition, validAPStudentProfile);
  assert.strictEqual(res.state, 'Unknown / needs verification');
  assert.ok(res.explanation.includes('Unsupported comparison operator'));
});

test('5d. isUnknownProfileValue correctly flags missing placeholders', () => {
  assert.strictEqual(isUnknownProfileValue(null), true);
  assert.strictEqual(isUnknownProfileValue(undefined), true);
  assert.strictEqual(isUnknownProfileValue('Unknown / Not sure'), true);
  assert.strictEqual(isUnknownProfileValue('Prefer not to say'), true);
  assert.strictEqual(isUnknownProfileValue('Prefer not to disclose'), true);
  assert.strictEqual(isUnknownProfileValue('Applied / Not sure'), true);
  assert.strictEqual(isUnknownProfileValue('None'), true);
  assert.strictEqual(isUnknownProfileValue('Andhra Pradesh'), false);
  assert.strictEqual(isUnknownProfileValue(25), false);
  assert.strictEqual(isUnknownProfileValue(0), false);
  assert.strictEqual(isUnknownProfileValue(false), false);
});
