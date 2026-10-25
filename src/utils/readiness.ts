import { 
  Scheme, 
  UserProfile, 
  ClaimRecord, 
  SchemeReadinessAssessment, 
  DocumentReadinessState 
} from '../types';
import { evaluateScheme } from './matcher';

/**
 * Pure calculation function for Scheme Readiness Assessment.
 * Computes progress strictly from actual document and preparation step states,
 * and dynamically derives the single highest-priority Next Best Action.
 */
export function calculateSchemeReadiness(
  scheme: Scheme,
  profile: UserProfile,
  claim?: ClaimRecord
): SchemeReadinessAssessment {
  const evaluation = evaluateScheme(scheme, profile);

  const documentStates = claim?.documentStates || {};
  const completedStepNumbers = claim?.completedStepNumbers || [];

  const mandatoryDocs = scheme.requiredDocuments.filter(d => d.isMandatory);
  const totalMandatoryDocs = mandatoryDocs.length;

  let readyMandatoryDocs = 0;
  let needsVerificationDocs = 0;
  let notAvailableDocs = 0;

  for (const doc of mandatoryDocs) {
    const state: DocumentReadinessState = documentStates[doc.id] || 'not_available';
    if (state === 'ready') {
      readyMandatoryDocs++;
    } else if (state === 'needs_verification') {
      needsVerificationDocs++;
    } else {
      notAvailableDocs++;
    }
  }

  const totalSteps = scheme.applicationSteps.length;
  const completedSteps = scheme.applicationSteps.filter(s => 
    completedStepNumbers.includes(s.stepNumber)
  ).length;

  // Actual checklist calculation (mandatory docs + preparation steps)
  const totalChecklistItems = totalMandatoryDocs + totalSteps;
  const completedChecklistItems = readyMandatoryDocs + completedSteps;

  const readinessPercentage = totalChecklistItems > 0
    ? Math.round((completedChecklistItems / totalChecklistItems) * 100)
    : (evaluation.outcome === 'POTENTIAL MATCH' ? 100 : 50);

  // Unverifiable items explanation (cannot be certified by the client app alone)
  const unverifiableItems = scheme.conditions
    .filter(c => c.requiresExternalVerification)
    .map(c => ({
      label: c.label,
      reason: 'This condition requires live biometric verification, university registrar attendance feed, or official revenue field survey that cannot be verified offline by HaqSetu AI.',
      authority: c.sourceReference || scheme.verificationAuthority
    }));

  // Derive prominent Next Best Action computed from outstanding requirements
  let computedNextBestAction = scheme.defaultNextAction;
  let nextActionPriority: SchemeReadinessAssessment['nextActionPriority'] = 'ready_to_apply';

  if (evaluation.outcome === 'LIKELY NOT A MATCH') {
    const failedCondition = evaluation.notSatisfiedConditions[0];
    computedNextBestAction = `Review conflicting requirement (${failedCondition ? failedCondition.condition.label : 'Criteria'}) before preparing documents.`;
    nextActionPriority = 'disqualification';
  } else if (evaluation.missingProfileFields.length > 0) {
    const firstMissing = evaluation.missingProfileFields[0];
    computedNextBestAction = `Update your profile with ${firstMissing.label} to confirm whether you qualify for this benefit.`;
    nextActionPriority = 'missing_profile';
  } else {
    // Check mandatory documents
    const firstNotAvailable = mandatoryDocs.find(d => (documentStates[d.id] || 'not_available') === 'not_available');
    const firstNeedsVerification = mandatoryDocs.find(d => documentStates[d.id] === 'needs_verification');

    if (firstNotAvailable) {
      computedNextBestAction = `Obtain ${firstNotAvailable.name} from ${firstNotAvailable.whereToGet.split('(')[0].trim()}.`;
      nextActionPriority = 'document_needed';
    } else if (firstNeedsVerification) {
      computedNextBestAction = `Verify validity of ${firstNeedsVerification.name} with ${firstNeedsVerification.whereToGet.split('(')[0].trim()}.`;
      nextActionPriority = 'verification_needed';
    } else {
      // Check preparation steps
      const nextPendingStep = scheme.applicationSteps.find(s => !completedStepNumbers.includes(s.stepNumber));
      if (nextPendingStep) {
        computedNextBestAction = `Complete Step ${nextPendingStep.stepNumber}: ${nextPendingStep.title} at ${nextPendingStep.locationOrUrl || scheme.offlineCenter.split('(')[0].trim()}.`;
        nextActionPriority = 'step_pending';
      } else {
        computedNextBestAction = `All documents and preparation steps ready! Proceed to submit application on ${scheme.officialInfoUrl.replace('https://', '')} or visit ${scheme.offlineCenter.split('(')[0].trim()}.`;
        nextActionPriority = 'ready_to_apply';
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
