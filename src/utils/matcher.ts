import { 
  UserProfile, 
  Scheme, 
  StructuredCondition, 
  EvaluatedCondition, 
  ConditionState, 
  SchemeOutcome, 
  SchemeEvaluationResult,
  ProfileField 
} from '../types';

/**
 * Checks whether a profile field value represents an unknown/unspecified answer.
 */
export function isUnknownProfileValue(val: any): boolean {
  if (val === null || val === undefined) return true;
  if (typeof val === 'string') {
    const trimmed = val.trim().toLowerCase();
    if (trimmed === '' || 
        trimmed === 'unknown / not sure' || 
        trimmed === 'prefer not to say' || 
        trimmed === 'prefer not to disclose' || 
        trimmed === 'applied / not sure' ||
        trimmed === 'none') {
      return true;
    }
  }
  return false;
}

/**
 * Evaluates an individual structured condition against a user profile.
 * Returns exactly one state: 'Satisfied' | 'Not satisfied' | 'Unknown / needs verification'.
 */
export function evaluateCondition(condition: StructuredCondition, profile: UserProfile): EvaluatedCondition {
  // Safe handling of malformed condition
  if (!condition || !condition.field) {
    return {
      condition: condition || { id: 'unknown', field: 'state', operator: 'equals', isMandatory: false, label: 'Unknown', explanation: 'Malformed' },
      state: 'Unknown / needs verification',
      actualValue: undefined,
      explanation: 'Condition data is incomplete or missing.'
    };
  }

  // If condition requires external verification (e.g. 75% biometric college attendance, Webland title verification)
  if (condition.requiresExternalVerification) {
    return {
      condition,
      state: 'Unknown / needs verification',
      actualValue: profile ? profile[condition.field] : undefined,
      explanation: `${condition.explanation} (Requires official verification by ${condition.sourceReference || 'competent authority'}).`
    };
  }

  // If profile is missing entirely
  if (!profile) {
    return {
      condition,
      state: 'Unknown / needs verification',
      actualValue: undefined,
      explanation: 'Profile information has not been provided.',
      missingField: condition.field
    };
  }

  const actualValue = profile[condition.field];

  // Check if profile value is unknown/unspecified
  if (isUnknownProfileValue(actualValue)) {
    return {
      condition,
      state: 'Unknown / needs verification',
      actualValue,
      explanation: `Information required: ${condition.label} is unknown or not specified in your profile.`,
      missingField: condition.field
    };
  }

  // Pure deterministic evaluation using explicit comparison rules
  let isSatisfied = false;

  switch (condition.operator) {
    case 'equals':
      isSatisfied = actualValue === condition.requiredValue;
      break;

    case 'not_equals':
      isSatisfied = actualValue !== condition.requiredValue;
      break;

    case 'in':
      if (Array.isArray(condition.requiredValue)) {
        isSatisfied = condition.requiredValue.includes(actualValue);
      } else {
        isSatisfied = false;
      }
      break;

    case 'not_in':
      if (Array.isArray(condition.requiredValue)) {
        isSatisfied = !condition.requiredValue.includes(actualValue);
      } else {
        isSatisfied = false;
      }
      break;

    case 'less_than_or_equal': {
      const numActual = Number(actualValue);
      const numReq = Number(condition.requiredValue);
      if (isNaN(numActual) || isNaN(numReq)) {
        isSatisfied = false;
      } else {
        isSatisfied = numActual <= numReq;
      }
      break;
    }

    case 'greater_than_or_equal': {
      const numActual = Number(actualValue);
      const numReq = Number(condition.requiredValue);
      if (isNaN(numActual) || isNaN(numReq)) {
        isSatisfied = false;
      } else {
        isSatisfied = numActual >= numReq;
      }
      break;
    }

    case 'between': {
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

    case 'boolean_true':
      isSatisfied = actualValue === true;
      break;

    case 'boolean_false':
      isSatisfied = actualValue === false;
      break;

    default:
      // Unknown operator fallback
      return {
        condition,
        state: 'Unknown / needs verification',
        actualValue,
        explanation: `Unsupported comparison operator: ${condition.operator}`
      };
  }

  if (isSatisfied) {
    return {
      condition,
      state: 'Satisfied',
      actualValue,
      explanation: `${condition.label}: Satisfied (${condition.explanation})`
    };
  } else {
    return {
      condition,
      state: 'Not satisfied',
      actualValue,
      explanation: `${condition.label}: Not satisfied. Current answer (${String(actualValue)}) conflicts with requirement (${String(condition.requiredValue)}). ${condition.explanation}`
    };
  }
}

/**
 * Evaluates an entire scheme against a user profile deterministically.
 * Returns:
 * - POTENTIAL MATCH: all mandatory conditions are known & satisfied, no disqualifying condition.
 * - NEEDS VERIFICATION: one or more material conditions are unknown or require official confirmation (no known disqualification).
 * - LIKELY NOT A MATCH: a known answer conflicts with an explicit mandatory condition.
 */
export function evaluateScheme(scheme: Scheme, profile: UserProfile): SchemeEvaluationResult {
  const disclaimer = 'Informational Assessment: This assessment is an informational indicator based on your stated profile and does not guarantee eligibility or approval. The final decision rests solely with the competent government authority.';

  // Incomplete scheme data safety check
  if (!scheme || !Array.isArray(scheme.conditions) || scheme.conditions.length === 0) {
    return {
      scheme: scheme || { id: 'unknown', name: 'Unknown Scheme' } as Scheme,
      outcome: 'NEEDS VERIFICATION',
      matchSummary: 'Scheme criteria data is incomplete or under review.',
      satisfiedConditions: [],
      notSatisfiedConditions: [],
      needsVerificationConditions: [],
      missingProfileFields: [],
      documentsToPrepare: scheme?.requiredDocuments || [],
      clearNextAction: scheme?.defaultNextAction || 'Contact the administering department for eligibility guidelines.',
      officialLinks: {
        infoUrl: scheme?.officialInfoUrl || '#',
        applyUrl: scheme?.applicationUrl
      },
      disclaimer
    };
  }

  const evaluatedConditions = scheme.conditions.map(c => evaluateCondition(c, profile));

  const satisfiedConditions = evaluatedConditions.filter(e => e.state === 'Satisfied');
  const notSatisfiedConditions = evaluatedConditions.filter(e => e.state === 'Not satisfied');
  const needsVerificationConditions = evaluatedConditions.filter(e => e.state === 'Unknown / needs verification');

  // Identify distinct missing profile fields
  const missingFieldMap = new Map<ProfileField, string>();
  for (const ev of needsVerificationConditions) {
    if (ev.missingField && !ev.condition.requiresExternalVerification) {
      missingFieldMap.set(ev.missingField, ev.condition.label);
    }
  }
  const missingProfileFields = Array.from(missingFieldMap.entries()).map(([field, label]) => ({
    field,
    label
  }));

  // Determine overall scheme outcome
  // Rule 1: A known answer conflicts with an explicit mandatory condition -> LIKELY NOT A MATCH
  const hasDisqualifyingMandatory = notSatisfiedConditions.some(c => c.condition.isMandatory);

  let outcome: SchemeOutcome = 'LIKELY NOT A MATCH';
  let matchSummary = '';

  if (hasDisqualifyingMandatory) {
    outcome = 'LIKELY NOT A MATCH';
    const failedLabels = notSatisfiedConditions
      .filter(c => c.condition.isMandatory)
      .map(c => c.condition.label)
      .join(', ');
    matchSummary = `Your stated profile conflicts with mandatory requirements (${failedLabels}).`;
  } else if (needsVerificationConditions.length > 0) {
    // Rule 2: One or more material conditions are unknown or require official confirmation -> NEEDS VERIFICATION
    outcome = 'NEEDS VERIFICATION';
    if (missingProfileFields.length > 0) {
      matchSummary = `Potential match pending missing profile information (${missingProfileFields.map(f => f.label).join(', ')}).`;
    } else {
      matchSummary = `All known profile criteria satisfied. Official on-ground confirmation required for attendance or certificates.`;
    }
  } else {
    // Rule 3: All mandatory conditions are known and satisfied, with no known disqualification -> POTENTIAL MATCH
    outcome = 'POTENTIAL MATCH';
    matchSummary = `All mandatory criteria for this scheme are satisfied based on your stated profile.`;
  }

  // Clear next action
  let clearNextAction = scheme.defaultNextAction;
  if (outcome === 'LIKELY NOT A MATCH') {
    clearNextAction = 'Review conflicting criteria or consult local Secretariat before applying.';
  } else if (outcome === 'NEEDS VERIFICATION' && missingProfileFields.length > 0) {
    clearNextAction = `Update your profile with ${missingProfileFields[0].label} to confirm alignment.`;
  } else if (scheme.requiredDocuments.length > 0) {
    clearNextAction = `Prepare your mandatory certificates (${scheme.requiredDocuments.filter(d => d.isMandatory).map(d => d.name).slice(0, 2).join(', ')}) and visit ${scheme.offlineCenter.split('(')[0].trim()}.`;
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

/**
 * Pure evaluation function for a collection of schemes against a profile.
 * Sorts: POTENTIAL MATCH first, then NEEDS VERIFICATION, then LIKELY NOT A MATCH.
 */
export function evaluateAllSchemes(schemes: Scheme[], profile: UserProfile): SchemeEvaluationResult[] {
  if (!Array.isArray(schemes)) return [];

  return schemes
    .map(s => evaluateScheme(s, profile))
    .sort((a, b) => {
      const rank: Record<SchemeOutcome, number> = {
        'POTENTIAL MATCH': 3,
        'NEEDS VERIFICATION': 2,
        'LIKELY NOT A MATCH': 1
      };
      const outcomeDiff = rank[b.outcome] - rank[a.outcome];
      if (outcomeDiff !== 0) return outcomeDiff;
      // Tie breaker: higher number of satisfied conditions first
      return b.satisfiedConditions.length - a.satisfiedConditions.length;
    });
}
