import test from "node:test";
import assert from "node:assert";
function isUnknownProfileValue(val) {
  if (val === null || val === void 0) return true;
  if (typeof val === "string") {
    const trimmed = val.trim().toLowerCase();
    if (trimmed === "" || trimmed === "unknown / not sure" || trimmed === "prefer not to say" || trimmed === "prefer not to disclose" || trimmed === "applied / not sure" || trimmed === "none") {
      return true;
    }
  }
  return false;
}
function evaluateCondition(condition, profile) {
  if (!condition || !condition.field) {
    return {
      condition: condition || { id: "unknown", field: "state", operator: "equals", isMandatory: false, label: "Unknown", explanation: "Malformed" },
      state: "Unknown / needs verification",
      actualValue: void 0,
      explanation: "Condition data is incomplete or missing."
    };
  }
  if (condition.requiresExternalVerification) {
    return {
      condition,
      state: "Unknown / needs verification",
      actualValue: profile ? profile[condition.field] : void 0,
      explanation: `${condition.explanation} (Requires official verification by ${condition.sourceReference || "competent authority"}).`
    };
  }
  if (!profile) {
    return {
      condition,
      state: "Unknown / needs verification",
      actualValue: void 0,
      explanation: "Profile information has not been provided.",
      missingField: condition.field
    };
  }
  const actualValue = profile[condition.field];
  if (isUnknownProfileValue(actualValue)) {
    return {
      condition,
      state: "Unknown / needs verification",
      actualValue,
      explanation: `Information required: ${condition.label} is unknown or not specified in your profile.`,
      missingField: condition.field
    };
  }
  let isSatisfied = false;
  switch (condition.operator) {
    case "equals":
      isSatisfied = actualValue === condition.requiredValue;
      break;
    case "not_equals":
      isSatisfied = actualValue !== condition.requiredValue;
      break;
    case "in":
      if (Array.isArray(condition.requiredValue)) {
        isSatisfied = condition.requiredValue.includes(actualValue);
      } else {
        isSatisfied = false;
      }
      break;
    case "not_in":
      if (Array.isArray(condition.requiredValue)) {
        isSatisfied = !condition.requiredValue.includes(actualValue);
      } else {
        isSatisfied = false;
      }
      break;
    case "less_than_or_equal": {
      const numActual = Number(actualValue);
      const numReq = Number(condition.requiredValue);
      if (isNaN(numActual) || isNaN(numReq)) {
        isSatisfied = false;
      } else {
        isSatisfied = numActual <= numReq;
      }
      break;
    }
    case "greater_than_or_equal": {
      const numActual = Number(actualValue);
      const numReq = Number(condition.requiredValue);
      if (isNaN(numActual) || isNaN(numReq)) {
        isSatisfied = false;
      } else {
        isSatisfied = numActual >= numReq;
      }
      break;
    }
    case "between": {
      const numActual = Number(actualValue);
      if (Array.isArray(condition.requiredValue) && condition.requiredValue.length === 2) {
        const [min, max] = condition.requiredValue.map(Number);
        if (isNaN(numActual) || isNaN(min) || isNaN(max)) {
          isSatisfied = false;
        } else {
          isSatisfied = numActual >= min && numActual <= max;
        }
      } else {
        isSatisfied = false;
      }
      break;
    }
    case "boolean_true":
      isSatisfied = actualValue === true;
      break;
    case "boolean_false":
      isSatisfied = actualValue === false;
      break;
    default:
      return {
        condition,
        state: "Unknown / needs verification",
        actualValue,
        explanation: `Unsupported comparison operator: ${condition.operator}`
      };
  }
  if (isSatisfied) {
    return {
      condition,
      state: "Satisfied",
      actualValue,
      explanation: `${condition.label}: Satisfied (${condition.explanation})`
    };
  } else {
    return {
      condition,
      state: "Not satisfied",
      actualValue,
      explanation: `${condition.label}: Not satisfied. Current answer (${String(actualValue)}) conflicts with requirement (${String(condition.requiredValue)}). ${condition.explanation}`
    };
  }
}
function evaluateScheme(scheme, profile) {
  const disclaimer = "Informational Assessment: This assessment is an informational indicator based on your stated profile and does not guarantee eligibility or approval. The final decision rests solely with the competent government authority.";
  if (!scheme || !Array.isArray(scheme.conditions) || scheme.conditions.length === 0) {
    return {
      scheme: scheme || { id: "unknown", name: "Unknown Scheme" },
      outcome: "NEEDS VERIFICATION",
      matchSummary: "Scheme criteria data is incomplete or under review.",
      satisfiedConditions: [],
      notSatisfiedConditions: [],
      needsVerificationConditions: [],
      missingProfileFields: [],
      documentsToPrepare: (scheme == null ? void 0 : scheme.requiredDocuments) || [],
      clearNextAction: (scheme == null ? void 0 : scheme.defaultNextAction) || "Contact the administering department for eligibility guidelines.",
      officialLinks: {
        infoUrl: (scheme == null ? void 0 : scheme.officialInfoUrl) || "#",
        applyUrl: scheme == null ? void 0 : scheme.applicationUrl
      },
      disclaimer
    };
  }
  const evaluatedConditions = scheme.conditions.map((c) => evaluateCondition(c, profile));
  const satisfiedConditions = evaluatedConditions.filter((e) => e.state === "Satisfied");
  const notSatisfiedConditions = evaluatedConditions.filter((e) => e.state === "Not satisfied");
  const needsVerificationConditions = evaluatedConditions.filter((e) => e.state === "Unknown / needs verification");
  const missingFieldMap = /* @__PURE__ */ new Map();
  for (const ev of needsVerificationConditions) {
    if (ev.missingField && !ev.condition.requiresExternalVerification) {
      missingFieldMap.set(ev.missingField, ev.condition.label);
    }
  }
  const missingProfileFields = Array.from(missingFieldMap.entries()).map(([field, label]) => ({
    field,
    label
  }));
  const hasDisqualifyingMandatory = notSatisfiedConditions.some((c) => c.condition.isMandatory);
  let outcome = "LIKELY NOT A MATCH";
  let matchSummary = "";
  if (hasDisqualifyingMandatory) {
    outcome = "LIKELY NOT A MATCH";
    const failedLabels = notSatisfiedConditions.filter((c) => c.condition.isMandatory).map((c) => c.condition.label).join(", ");
    matchSummary = `Your stated profile conflicts with mandatory requirements (${failedLabels}).`;
  } else if (needsVerificationConditions.length > 0) {
    outcome = "NEEDS VERIFICATION";
    if (missingProfileFields.length > 0) {
      matchSummary = `Potential match pending missing profile information (${missingProfileFields.map((f) => f.label).join(", ")}).`;
    } else {
      matchSummary = `All known profile criteria satisfied. Official on-ground confirmation required for attendance or certificates.`;
    }
  } else {
    outcome = "POTENTIAL MATCH";
    matchSummary = `All mandatory criteria for this scheme are satisfied based on your stated profile.`;
  }
  let clearNextAction = scheme.defaultNextAction;
  if (outcome === "LIKELY NOT A MATCH") {
    clearNextAction = "Review conflicting criteria or consult local Secretariat before applying.";
  } else if (outcome === "NEEDS VERIFICATION" && missingProfileFields.length > 0) {
    clearNextAction = `Update your profile with ${missingProfileFields[0].label} to confirm alignment.`;
  } else if (scheme.requiredDocuments.length > 0) {
    clearNextAction = `Prepare your mandatory certificates (${scheme.requiredDocuments.filter((d) => d.isMandatory).map((d) => d.name).slice(0, 2).join(", ")}) and visit ${scheme.offlineCenter.split("(")[0].trim()}.`;
  }
  return {
    scheme,
    outcome,
    matchSummary,
    satisfiedConditions,
    notSatisfiedConditions,
    needsVerificationConditions,
    missingProfileFields,
    documentsToPrepare: scheme.requiredDocuments,
    clearNextAction,
    officialLinks: {
      infoUrl: scheme.officialInfoUrl,
      applyUrl: scheme.applicationUrl
    },
    disclaimer
  };
}
const validAPStudentProfile = {
  state: "Andhra Pradesh",
  district: "Visakhapatnam",
  age: 20,
  gender: "Female",
  education: "Undergraduate (BA, B.Sc, B.Com, B.Tech, MBBS)",
  employmentStatus: "Regular Student",
  incomeBand: "Below ₹1,00,000 / year",
  socialCategory: "OBC / BC (Backward Classes)",
  rationCard: "White Card (Rice Card / BPL)",
  isRural: true,
  hasDisability: false,
  isSingleMotherOrWidow: false,
  ownsAgriculturalLand: false,
  landHoldingAcres: 0,
  hasBankAadhaarLinked: true
};
const simpleHealthScheme = {
  id: "test-health-01",
  name: "Universal Free Health Coverage",
  code: "TEST-HLT",
  schemeLevel: "State",
  department: "Health Trust",
  description: "Cashless medical assistance for low and middle income families.",
  beneficiaryCategory: "Healthcare & Insurance",
  lastVerifiedDate: "2024-10-01",
  dataStatus: "verified",
  officialInfoUrl: "https://health.example.gov.in",
  benefitFinancials: "Up to ₹25 Lakhs",
  frequency: "As Needed",
  verificationAuthority: "Hospital Counter",
  offlineCenter: "Network Hospitals",
  helpline: "104",
  defaultNextAction: "Present health card at network hospital.",
  conditions: [
    {
      id: "c1-state",
      field: "state",
      operator: "equals",
      requiredValue: "Andhra Pradesh",
      isMandatory: true,
      label: "Resident of Andhra Pradesh",
      explanation: "Must reside in AP."
    },
    {
      id: "c2-income",
      field: "incomeBand",
      operator: "in",
      requiredValue: [
        "Below ₹1,00,000 / year",
        "₹1,00,000 - ₹2,50,000 / year",
        "₹2,50,000 - ₹5,00,000 / year"
      ],
      isMandatory: true,
      label: "Family Income <= ₹5 Lakhs",
      explanation: "Income must be within ceiling."
    }
  ],
  requiredDocuments: [
    {
      id: "doc-aadhaar",
      name: "Aadhaar Card",
      description: "Identity proof.",
      whereToGet: "UIDAI",
      isMandatory: true
    }
  ],
  applicationSteps: []
};
test("1. Fully matching profile produces POTENTIAL MATCH with all conditions satisfied", () => {
  const result = evaluateScheme(simpleHealthScheme, validAPStudentProfile);
  assert.strictEqual(result.outcome, "POTENTIAL MATCH");
  assert.strictEqual(result.notSatisfiedConditions.length, 0);
  assert.strictEqual(result.needsVerificationConditions.length, 0);
  assert.strictEqual(result.satisfiedConditions.length, 2);
  assert.strictEqual(result.missingProfileFields.length, 0);
  assert.ok(result.disclaimer.includes("does not guarantee eligibility or approval"));
  assert.ok(result.matchSummary.includes("All mandatory criteria for this scheme are satisfied"));
});
test("2. Disqualifying condition produces LIKELY NOT A MATCH with clear conflict explanation", () => {
  const nonResidentProfile = {
    ...validAPStudentProfile,
    state: "Telangana"
  };
  const result = evaluateScheme(simpleHealthScheme, nonResidentProfile);
  assert.strictEqual(result.outcome, "LIKELY NOT A MATCH");
  assert.strictEqual(result.notSatisfiedConditions.length, 1);
  assert.strictEqual(result.notSatisfiedConditions[0].condition.id, "c1-state");
  assert.strictEqual(result.notSatisfiedConditions[0].state, "Not satisfied");
  assert.ok(result.matchSummary.includes("Resident of Andhra Pradesh"));
  assert.ok(result.notSatisfiedConditions[0].explanation.includes("conflicts with requirement"));
});
test("2b. High income band disqualification produces LIKELY NOT A MATCH", () => {
  const highIncomeProfile = {
    ...validAPStudentProfile,
    incomeBand: "Above ₹5,00,000 / year"
  };
  const result = evaluateScheme(simpleHealthScheme, highIncomeProfile);
  assert.strictEqual(result.outcome, "LIKELY NOT A MATCH");
  assert.strictEqual(result.notSatisfiedConditions.length, 1);
  assert.strictEqual(result.notSatisfiedConditions[0].condition.field, "incomeBand");
});
test("3. Unknown or unspecified profile fields produce NEEDS VERIFICATION with identified missing fields", () => {
  const unknownIncomeProfile = {
    ...validAPStudentProfile,
    incomeBand: "Unknown / Not sure"
  };
  const result = evaluateScheme(simpleHealthScheme, unknownIncomeProfile);
  assert.strictEqual(result.outcome, "NEEDS VERIFICATION");
  assert.strictEqual(result.needsVerificationConditions.length, 1);
  assert.strictEqual(result.needsVerificationConditions[0].missingField, "incomeBand");
  assert.strictEqual(result.missingProfileFields.length, 1);
  assert.strictEqual(result.missingProfileFields[0].field, "incomeBand");
  assert.ok(result.clearNextAction.includes("Family Income <= ₹5 Lakhs"));
});
test("3b. External verification condition triggers NEEDS VERIFICATION", () => {
  const attendanceCondition = {
    id: "c-att",
    field: "employmentStatus",
    operator: "external_verification",
    requiresExternalVerification: true,
    isMandatory: true,
    label: "75% Biometric Attendance",
    explanation: "Must be verified by College Principal and AePDS portal."
  };
  const schemeWithAttendance = {
    ...simpleHealthScheme,
    conditions: [...simpleHealthScheme.conditions, attendanceCondition]
  };
  const result = evaluateScheme(schemeWithAttendance, validAPStudentProfile);
  assert.strictEqual(result.outcome, "NEEDS VERIFICATION");
  assert.strictEqual(result.needsVerificationConditions.length, 1);
  assert.strictEqual(result.needsVerificationConditions[0].condition.id, "c-att");
});
test("4a. Age boundary conditions for between [45, 60] (YSR Cheyutha rule)", () => {
  const ageCondition = {
    id: "c-age-between",
    field: "age",
    operator: "between",
    requiredValue: [45, 60],
    isMandatory: true,
    label: "Age between 45 and 60",
    explanation: "Aadhaar age verification."
  };
  const resAtLower = evaluateCondition(ageCondition, { ...validAPStudentProfile, age: 45 });
  assert.strictEqual(resAtLower.state, "Satisfied");
  const resAtUpper = evaluateCondition(ageCondition, { ...validAPStudentProfile, age: 60 });
  assert.strictEqual(resAtUpper.state, "Satisfied");
  const resBelow = evaluateCondition(ageCondition, { ...validAPStudentProfile, age: 44 });
  assert.strictEqual(resBelow.state, "Not satisfied");
  const resAbove = evaluateCondition(ageCondition, { ...validAPStudentProfile, age: 61 });
  assert.strictEqual(resAbove.state, "Not satisfied");
  const resNullAge = evaluateCondition(ageCondition, { ...validAPStudentProfile, age: null });
  assert.strictEqual(resNullAge.state, "Unknown / needs verification");
});
test("4b. Agricultural land ceiling boundary (less_than_or_equal 10 acres)", () => {
  const landCondition = {
    id: "c-land-ceiling",
    field: "landHoldingAcres",
    operator: "less_than_or_equal",
    requiredValue: 10,
    isMandatory: true,
    label: "Land <= 10 Acres",
    explanation: "Webland limit."
  };
  const resAt10 = evaluateCondition(landCondition, { ...validAPStudentProfile, landHoldingAcres: 10 });
  assert.strictEqual(resAt10.state, "Satisfied");
  const resAt9_9 = evaluateCondition(landCondition, { ...validAPStudentProfile, landHoldingAcres: 9.9 });
  assert.strictEqual(resAt9_9.state, "Satisfied");
  const resAt10_1 = evaluateCondition(landCondition, { ...validAPStudentProfile, landHoldingAcres: 10.1 });
  assert.strictEqual(resAt10_1.state, "Not satisfied");
  const resZero = evaluateCondition(landCondition, { ...validAPStudentProfile, landHoldingAcres: 0 });
  assert.strictEqual(resZero.state, "Satisfied");
});
test("4c. Minimum age boundary (greater_than_or_equal 18 for PM Vishwakarma)", () => {
  const minAgeCondition = {
    id: "c-min-age",
    field: "age",
    operator: "greater_than_or_equal",
    requiredValue: 18,
    isMandatory: true,
    label: "Minimum Age 18",
    explanation: "Must be an adult."
  };
  const res18 = evaluateCondition(minAgeCondition, { ...validAPStudentProfile, age: 18 });
  assert.strictEqual(res18.state, "Satisfied");
  const res17 = evaluateCondition(minAgeCondition, { ...validAPStudentProfile, age: 17 });
  assert.strictEqual(res17.state, "Not satisfied");
});
test("5a. Incomplete scheme with empty conditions list handled safely without crashing", () => {
  const emptyScheme = {
    ...simpleHealthScheme,
    conditions: []
  };
  const result = evaluateScheme(emptyScheme, validAPStudentProfile);
  assert.strictEqual(result.outcome, "NEEDS VERIFICATION");
  assert.ok(result.matchSummary.includes("incomplete or under review"));
});
test("5b. Incomplete or null profile handled safely without crashing", () => {
  const result = evaluateScheme(simpleHealthScheme, null);
  assert.strictEqual(result.outcome, "NEEDS VERIFICATION");
  assert.strictEqual(result.needsVerificationConditions.length, 2);
});
test("5c. Condition with malformed operator handled safely", () => {
  const badCondition = {
    id: "c-bad",
    field: "state",
    operator: "invalid_op",
    requiredValue: "test",
    isMandatory: true,
    label: "Bad Operator",
    explanation: "Test"
  };
  const res = evaluateCondition(badCondition, validAPStudentProfile);
  assert.strictEqual(res.state, "Unknown / needs verification");
  assert.ok(res.explanation.includes("Unsupported comparison operator"));
});
test("5d. isUnknownProfileValue correctly flags missing placeholders", () => {
  assert.strictEqual(isUnknownProfileValue(null), true);
  assert.strictEqual(isUnknownProfileValue(void 0), true);
  assert.strictEqual(isUnknownProfileValue("Unknown / Not sure"), true);
  assert.strictEqual(isUnknownProfileValue("Prefer not to say"), true);
  assert.strictEqual(isUnknownProfileValue("Prefer not to disclose"), true);
  assert.strictEqual(isUnknownProfileValue("Applied / Not sure"), true);
  assert.strictEqual(isUnknownProfileValue("None"), true);
  assert.strictEqual(isUnknownProfileValue("Andhra Pradesh"), false);
  assert.strictEqual(isUnknownProfileValue(25), false);
  assert.strictEqual(isUnknownProfileValue(0), false);
  assert.strictEqual(isUnknownProfileValue(false), false);
});
function calculateSchemeReadiness(scheme, profile, claim) {
  const evaluation = evaluateScheme(scheme, profile);
  const documentStates = (claim == null ? void 0 : claim.documentStates) || {};
  const completedStepNumbers = (claim == null ? void 0 : claim.completedStepNumbers) || [];
  const mandatoryDocs = scheme.requiredDocuments.filter((d) => d.isMandatory);
  const totalMandatoryDocs = mandatoryDocs.length;
  let readyMandatoryDocs = 0;
  let needsVerificationDocs = 0;
  let notAvailableDocs = 0;
  for (const doc of mandatoryDocs) {
    const state = documentStates[doc.id] || "not_available";
    if (state === "ready") {
      readyMandatoryDocs++;
    } else if (state === "needs_verification") {
      needsVerificationDocs++;
    } else {
      notAvailableDocs++;
    }
  }
  const totalSteps = scheme.applicationSteps.length;
  const completedSteps = scheme.applicationSteps.filter(
    (s) => completedStepNumbers.includes(s.stepNumber)
  ).length;
  const totalChecklistItems = totalMandatoryDocs + totalSteps;
  const completedChecklistItems = readyMandatoryDocs + completedSteps;
  const readinessPercentage = totalChecklistItems > 0 ? Math.round(completedChecklistItems / totalChecklistItems * 100) : evaluation.outcome === "POTENTIAL MATCH" ? 100 : 50;
  const unverifiableItems = scheme.conditions.filter((c) => c.requiresExternalVerification).map((c) => ({
    label: c.label,
    reason: "This condition requires live biometric verification, university registrar attendance feed, or official revenue field survey that cannot be verified offline by HaqSetu AI.",
    authority: c.sourceReference || scheme.verificationAuthority
  }));
  let computedNextBestAction = scheme.defaultNextAction;
  let nextActionPriority = "ready_to_apply";
  if (evaluation.outcome === "LIKELY NOT A MATCH") {
    const failedCondition = evaluation.notSatisfiedConditions[0];
    computedNextBestAction = `Review conflicting requirement (${failedCondition ? failedCondition.condition.label : "Criteria"}) before preparing documents.`;
    nextActionPriority = "disqualification";
  } else if (evaluation.missingProfileFields.length > 0) {
    const firstMissing = evaluation.missingProfileFields[0];
    computedNextBestAction = `Update your profile with ${firstMissing.label} to confirm whether you qualify for this benefit.`;
    nextActionPriority = "missing_profile";
  } else {
    const firstNotAvailable = mandatoryDocs.find((d) => (documentStates[d.id] || "not_available") === "not_available");
    const firstNeedsVerification = mandatoryDocs.find((d) => documentStates[d.id] === "needs_verification");
    if (firstNotAvailable) {
      computedNextBestAction = `Obtain ${firstNotAvailable.name} from ${firstNotAvailable.whereToGet.split("(")[0].trim()}.`;
      nextActionPriority = "document_needed";
    } else if (firstNeedsVerification) {
      computedNextBestAction = `Verify validity of ${firstNeedsVerification.name} with ${firstNeedsVerification.whereToGet.split("(")[0].trim()}.`;
      nextActionPriority = "verification_needed";
    } else {
      const nextPendingStep = scheme.applicationSteps.find((s) => !completedStepNumbers.includes(s.stepNumber));
      if (nextPendingStep) {
        computedNextBestAction = `Complete Step ${nextPendingStep.stepNumber}: ${nextPendingStep.title} at ${nextPendingStep.locationOrUrl || scheme.offlineCenter.split("(")[0].trim()}.`;
        nextActionPriority = "step_pending";
      } else {
        computedNextBestAction = `All documents and preparation steps ready! Proceed to submit application on ${scheme.officialInfoUrl.replace("https://", "")} or visit ${scheme.offlineCenter.split("(")[0].trim()}.`;
        nextActionPriority = "ready_to_apply";
      }
    }
  }
  return {
    schemeId: scheme.id,
    totalMandatoryDocs,
    readyMandatoryDocs,
    needsVerificationDocs,
    notAvailableDocs,
    totalSteps,
    completedSteps,
    totalChecklistItems,
    completedChecklistItems,
    readinessPercentage,
    computedNextBestAction,
    nextActionPriority,
    unverifiableItems,
    outstandingConditions: evaluation.needsVerificationConditions,
    missingProfileFields: evaluation.missingProfileFields
  };
}
const DEFAULT_PROFILE = {
  state: "Andhra Pradesh",
  district: "Visakhapatnam",
  age: 20,
  gender: "Female",
  education: "Undergraduate (BA, B.Sc, B.Com, B.Tech, MBBS)",
  employmentStatus: "Regular Student",
  incomeBand: "Below ₹1,00,000 / year",
  socialCategory: "OBC / BC (Backward Classes)",
  rationCard: "White Card (Rice Card / BPL)",
  isRural: true,
  hasDisability: false,
  isSingleMotherOrWidow: false,
  ownsAgriculturalLand: false,
  landHoldingAcres: 0,
  hasBankAadhaarLinked: true
};
function sanitizeProfile(raw) {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_PROFILE };
  return {
    state: raw.state === "Andhra Pradesh" || raw.state === "Telangana" || raw.state === "Other" ? raw.state : DEFAULT_PROFILE.state,
    district: typeof raw.district === "string" && raw.district.trim() ? raw.district : DEFAULT_PROFILE.district,
    age: typeof raw.age === "number" && !isNaN(raw.age) && raw.age > 0 ? raw.age : null,
    gender: ["Female", "Male", "Transgender", "Prefer not to say"].includes(raw.gender) ? raw.gender : DEFAULT_PROFILE.gender,
    education: typeof raw.education === "string" ? raw.education : DEFAULT_PROFILE.education,
    employmentStatus: typeof raw.employmentStatus === "string" ? raw.employmentStatus : DEFAULT_PROFILE.employmentStatus,
    incomeBand: typeof raw.incomeBand === "string" ? raw.incomeBand : DEFAULT_PROFILE.incomeBand,
    socialCategory: typeof raw.socialCategory === "string" ? raw.socialCategory : DEFAULT_PROFILE.socialCategory,
    rationCard: typeof raw.rationCard === "string" ? raw.rationCard : DEFAULT_PROFILE.rationCard,
    isRural: Boolean(raw.isRural),
    hasDisability: Boolean(raw.hasDisability),
    isSingleMotherOrWidow: Boolean(raw.isSingleMotherOrWidow),
    ownsAgriculturalLand: Boolean(raw.ownsAgriculturalLand),
    landHoldingAcres: typeof raw.landHoldingAcres === "number" && !isNaN(raw.landHoldingAcres) ? raw.landHoldingAcres : 0,
    hasBankAadhaarLinked: Boolean(raw.hasBankAadhaarLinked)
  };
}
function sanitizeClaim(raw) {
  if (!raw || typeof raw !== "object" || !raw.schemeId) return null;
  const validStatuses = ["bookmarked", "gathering_docs", "ready_to_apply", "submitted", "approved"];
  const status = validStatuses.includes(raw.status) ? raw.status : "gathering_docs";
  const documentStates = {};
  if (raw.documentStates && typeof raw.documentStates === "object") {
    for (const [docId, st] of Object.entries(raw.documentStates)) {
      if (st === "ready" || st === "not_available" || st === "needs_verification") {
        documentStates[docId] = st;
      }
    }
  } else if (Array.isArray(raw.gatheredDocIds)) {
    for (const docId of raw.gatheredDocIds) {
      if (typeof docId === "string") {
        documentStates[docId] = "ready";
      }
    }
  }
  const completedStepNumbers = Array.isArray(raw.completedStepNumbers) ? raw.completedStepNumbers.filter((n) => typeof n === "number" && !isNaN(n)) : [];
  return {
    id: typeof raw.id === "string" && raw.id ? raw.id : `claim-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    schemeId: String(raw.schemeId),
    status,
    savedAt: typeof raw.savedAt === "string" ? raw.savedAt : (/* @__PURE__ */ new Date()).toISOString(),
    lastUpdated: typeof raw.lastUpdated === "string" ? raw.lastUpdated : (/* @__PURE__ */ new Date()).toISOString(),
    applicationNumber: typeof raw.applicationNumber === "string" ? raw.applicationNumber : "",
    notes: typeof raw.notes === "string" ? raw.notes : "",
    documentStates,
    completedStepNumbers,
    gatheredDocIds: Object.keys(documentStates).filter((k) => documentStates[k] === "ready"),
    nextAction: typeof raw.nextAction === "string" ? raw.nextAction : ""
  };
}
const matchingProfile = {
  state: "Andhra Pradesh",
  district: "Visakhapatnam",
  age: 20,
  gender: "Female",
  education: "Undergraduate (BA, B.Sc, B.Com, B.Tech, MBBS)",
  employmentStatus: "Regular Student",
  incomeBand: "Below ₹1,00,000 / year",
  socialCategory: "OBC / BC (Backward Classes)",
  rationCard: "White Card (Rice Card / BPL)",
  isRural: true,
  hasDisability: false,
  isSingleMotherOrWidow: false,
  ownsAgriculturalLand: false,
  landHoldingAcres: 0,
  hasBankAadhaarLinked: true
};
const mockScholarshipScheme = {
  id: "test-scholarship-01",
  name: "Vidya Jyothi Fee Reimbursement",
  code: "VJ-01",
  schemeLevel: "State",
  department: "Higher Education Department",
  description: "Full tuition fee reimbursement for eligible college students in AP.",
  beneficiaryCategory: "Higher Education & Students",
  lastVerifiedDate: "2024-10-15",
  dataStatus: "verified",
  officialInfoUrl: "https://jnb.apcfss.in",
  applicationUrl: "https://jnb.apcfss.in/apply",
  benefitFinancials: "100% Tuition Fee",
  frequency: "Annual",
  verificationAuthority: "Welfare and Education Assistant (WEA)",
  offlineCenter: "Grama / Ward Sachivalayam",
  helpline: "1902",
  defaultNextAction: "Submit admission details at college office.",
  conditions: [
    {
      id: "cond-state",
      field: "state",
      operator: "equals",
      requiredValue: "Andhra Pradesh",
      isMandatory: true,
      label: "Resident of Andhra Pradesh",
      explanation: "Applicant must reside in AP."
    },
    {
      id: "cond-income",
      field: "incomeBand",
      operator: "in",
      requiredValue: ["Below ₹1,00,000 / year", "₹1,00,000 - ₹2,50,000 / year"],
      isMandatory: true,
      label: "Annual Family Income <= 2.5 Lakhs",
      explanation: "Must be low or marginal income band."
    },
    {
      id: "cond-attendance",
      field: "employmentStatus",
      operator: "equals",
      requiredValue: "Regular Student",
      isMandatory: true,
      requiresExternalVerification: true,
      sourceReference: "Jnanabhumi AePDS Biometric Attendance Feed",
      label: "75% Minimum Biometric Attendance",
      explanation: "Verified through college AePDS biometric machines every month."
    }
  ],
  requiredDocuments: [
    {
      id: "doc-rice-card",
      name: "White Ration Card (Rice Card)",
      isMandatory: true,
      whereToGet: "Civil Supplies / Grama Sachivalayam",
      typicalTimeDays: 7,
      alternativeDoc: "Integrated Income Certificate (MeeSeva)",
      verificationCheck: "Must have active member UID listed."
    },
    {
      id: "doc-allotment",
      name: "College Allotment Order",
      isMandatory: true,
      whereToGet: "Convener Office / APSCHE Portal",
      typicalTimeDays: 1,
      verificationCheck: "Convenor quota admission only."
    },
    {
      id: "doc-optional-bonafide",
      name: "College Study Certificate",
      isMandatory: false,
      whereToGet: "College Principal Office",
      typicalTimeDays: 2,
      verificationCheck: "Signed by Principal."
    }
  ],
  applicationSteps: [
    {
      stepNumber: 1,
      title: "College Admission Verification",
      description: "Principal registers student admission on Jnanabhumi portal.",
      locationOrUrl: "College Admin Counter",
      isRequired: true
    },
    {
      stepNumber: 2,
      title: "Biometric e-KYC Verification",
      description: "Student and parent complete fingerprint authentication at Sachivalayam.",
      locationOrUrl: "Grama Sachivalayam Counter",
      isRequired: true
    }
  ]
};
test("Test 1: Full readiness calculation when all mandatory documents are ready and all steps completed", () => {
  const claim = {
    schemeId: mockScholarshipScheme.id,
    savedAt: (/* @__PURE__ */ new Date()).toISOString(),
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
    documentStates: {
      "doc-rice-card": "ready",
      "doc-allotment": "ready"
    },
    completedStepNumbers: [1, 2]
  };
  const readiness = calculateSchemeReadiness(mockScholarshipScheme, matchingProfile, claim);
  assert.strictEqual(readiness.totalMandatoryDocs, 2, "Should have 2 mandatory documents");
  assert.strictEqual(readiness.readyMandatoryDocs, 2, "Both mandatory documents should be ready");
  assert.strictEqual(readiness.totalSteps, 2, "Should have 2 application steps");
  assert.strictEqual(readiness.completedSteps, 2, "Both application steps should be completed");
  assert.strictEqual(readiness.totalChecklistItems, 4, "Total checklist items = 2 docs + 2 steps");
  assert.strictEqual(readiness.completedChecklistItems, 4, "All 4 checklist items completed");
  assert.strictEqual(readiness.readinessPercentage, 100, "Readiness percentage should be exactly 100%");
  assert.strictEqual(readiness.nextActionPriority, "ready_to_apply", "Next action priority should be ready_to_apply");
  assert.ok(readiness.computedNextBestAction.includes("All documents and preparation steps ready"), "Next action indicates full readiness");
});
test("Test 2: Partial readiness when 1 of 2 mandatory documents is ready and 0 steps completed", () => {
  const claim = {
    schemeId: mockScholarshipScheme.id,
    savedAt: (/* @__PURE__ */ new Date()).toISOString(),
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
    documentStates: {
      "doc-rice-card": "ready",
      "doc-allotment": "not_available"
    },
    completedStepNumbers: []
  };
  const readiness = calculateSchemeReadiness(mockScholarshipScheme, matchingProfile, claim);
  assert.strictEqual(readiness.readyMandatoryDocs, 1);
  assert.strictEqual(readiness.notAvailableDocs, 1);
  assert.strictEqual(readiness.completedSteps, 0);
  assert.strictEqual(readiness.completedChecklistItems, 1);
  assert.strictEqual(readiness.totalChecklistItems, 4);
  assert.strictEqual(readiness.readinessPercentage, 25);
  assert.strictEqual(readiness.nextActionPriority, "document_needed");
});
test("Test 3: Document marked not_available directs Next Best Action to obtain that specific certificate", () => {
  const claim = {
    schemeId: mockScholarshipScheme.id,
    savedAt: (/* @__PURE__ */ new Date()).toISOString(),
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
    documentStates: {
      "doc-rice-card": "not_available",
      "doc-allotment": "ready"
    },
    completedStepNumbers: [1]
  };
  const readiness = calculateSchemeReadiness(mockScholarshipScheme, matchingProfile, claim);
  assert.strictEqual(readiness.nextActionPriority, "document_needed");
  assert.ok(
    readiness.computedNextBestAction.includes("White Ration Card (Rice Card)"),
    `Expected Next Best Action to mention missing Rice Card, got: ${readiness.computedNextBestAction}`
  );
  assert.ok(
    readiness.computedNextBestAction.includes("Civil Supplies / Grama Sachivalayam"),
    `Expected Next Best Action to mention where to get it, got: ${readiness.computedNextBestAction}`
  );
});
test("Test 4: Document marked needs_verification directs Next Best Action to verify with designated authority", () => {
  const claim = {
    schemeId: mockScholarshipScheme.id,
    savedAt: (/* @__PURE__ */ new Date()).toISOString(),
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
    documentStates: {
      "doc-rice-card": "ready",
      "doc-allotment": "needs_verification"
    },
    completedStepNumbers: []
  };
  const readiness = calculateSchemeReadiness(mockScholarshipScheme, matchingProfile, claim);
  assert.strictEqual(readiness.nextActionPriority, "verification_needed");
  assert.ok(
    readiness.computedNextBestAction.includes("Verify validity of College Allotment Order"),
    `Expected Next Best Action to mention verifying Allotment Order, got: ${readiness.computedNextBestAction}`
  );
  assert.ok(
    readiness.computedNextBestAction.includes("Convener Office / APSCHE Portal"),
    `Expected Next Best Action to reference the issuing authority, got: ${readiness.computedNextBestAction}`
  );
});
test("Test 5: Next Action properly prioritizes missing profile fields before document preparation", () => {
  const incompleteProfile = {
    ...matchingProfile,
    incomeBand: null
  };
  const claim = {
    schemeId: mockScholarshipScheme.id,
    savedAt: (/* @__PURE__ */ new Date()).toISOString(),
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString(),
    documentStates: {
      "doc-rice-card": "ready",
      "doc-allotment": "ready"
    },
    completedStepNumbers: [1, 2]
  };
  const readiness = calculateSchemeReadiness(mockScholarshipScheme, incompleteProfile, claim);
  assert.strictEqual(readiness.nextActionPriority, "missing_profile");
  assert.ok(
    readiness.computedNextBestAction.includes("Update your profile"),
    `Expected profile prompt before document readiness, got: ${readiness.computedNextBestAction}`
  );
  assert.strictEqual(readiness.missingProfileFields.length, 1);
  assert.strictEqual(readiness.missingProfileFields[0].field, "incomeBand");
});
test("Test 6: Storage sanitization repairs corrupted data and migrates v1 gatheredDocIds to v2 documentStates", () => {
  const corruptedProfileRaw = {
    state: "InvalidStateName",
    district: "   ",
    age: -15,
    gender: "UnknownGender",
    education: 12345,
    // invalid type
    incomeBand: null,
    socialCategory: 999,
    rationCard: "Pink Card (AP)",
    isRural: "yes",
    // should convert to boolean
    ownsAgriculturalLand: 1,
    // should convert to boolean
    landHoldingAcres: "five"
    // NaN should fallback to 0
  };
  const cleanedProfile = sanitizeProfile(corruptedProfileRaw);
  assert.strictEqual(cleanedProfile.state, "Andhra Pradesh", "Fallback to default state");
  assert.strictEqual(cleanedProfile.district, "Visakhapatnam", "Fallback to default district");
  assert.strictEqual(cleanedProfile.age, null, "Negative age sanitized to null");
  assert.strictEqual(cleanedProfile.gender, "Female", "Invalid gender reset to default");
  assert.strictEqual(cleanedProfile.isRural, true, "isRural converted to boolean");
  assert.strictEqual(cleanedProfile.ownsAgriculturalLand, true, "ownsAgriculturalLand converted to boolean");
  assert.strictEqual(cleanedProfile.landHoldingAcres, 0, "NaN acres converted to 0");
  const legacyClaimRaw = {
    id: "legacy-claim-99",
    schemeId: "jvd-rtf",
    status: "gathering_docs",
    gatheredDocIds: ["doc-rice-card", "doc-college-allotment"]
    // Note: no documentStates or completedStepNumbers
  };
  const migratedClaim = sanitizeClaim(legacyClaimRaw);
  assert.ok(migratedClaim !== null, "Claim should be successfully migrated");
  assert.strictEqual(migratedClaim.documentStates["doc-rice-card"], "ready", "doc-rice-card migrated to ready");
  assert.strictEqual(migratedClaim.documentStates["doc-college-allotment"], "ready", "doc-college-allotment migrated to ready");
  assert.deepStrictEqual(migratedClaim.completedStepNumbers, [], "completedStepNumbers initialized as empty array");
  assert.deepStrictEqual(migratedClaim.gatheredDocIds, ["doc-rice-card", "doc-college-allotment"]);
  assert.strictEqual(sanitizeClaim(null), null);
  assert.strictEqual(sanitizeClaim(void 0), null);
  assert.strictEqual(sanitizeClaim({}), null);
});
test("Test 7: Unverifiable conditions are flagged with official offline authority explanation", () => {
  const readiness = calculateSchemeReadiness(mockScholarshipScheme, matchingProfile);
  assert.strictEqual(readiness.unverifiableItems.length, 1);
  assert.strictEqual(readiness.unverifiableItems[0].label, "75% Minimum Biometric Attendance");
  assert.strictEqual(
    readiness.unverifiableItems[0].authority,
    "Jnanabhumi AePDS Biometric Attendance Feed"
  );
  assert.ok(
    readiness.unverifiableItems[0].reason.includes("cannot be verified offline by HaqSetu AI"),
    "Reason clearly warns users of offline authority verification requirement"
  );
});
test("Test 8: Disqualification warning takes top priority when profile conflicts with mandatory criteria", () => {
  const disqualifiedProfile = {
    ...matchingProfile,
    state: "Telangana"
    // conflicts with cond-state: Andhra Pradesh
  };
  const readiness = calculateSchemeReadiness(mockScholarshipScheme, disqualifiedProfile);
  assert.strictEqual(readiness.nextActionPriority, "disqualification");
  assert.ok(
    readiness.computedNextBestAction.includes("Review conflicting requirement"),
    `Expected disqualification action, got: ${readiness.computedNextBestAction}`
  );
});
