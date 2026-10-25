import React from 'react';
import { 
  FileCheck2, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ExternalLink, 
  Printer, 
  HelpCircle, 
  Building, 
  Clock, 
  Info,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Scheme, UserProfile, ClaimRecord, DocumentReadinessState } from '../types';
import { calculateSchemeReadiness } from '../utils/readiness';

interface ClaimReadinessPanelProps {
  scheme: Scheme;
  profile: UserProfile;
  claim?: ClaimRecord;
  onUpdateDocState: (schemeId: string, docId: string, state: DocumentReadinessState) => void;
  onToggleStep: (schemeId: string, stepNumber: number) => void;
  onOpenPrintSummary: () => void;
  navigate: (route: string, param?: string) => void;
}

export const ClaimReadinessPanel: React.FC<ClaimReadinessPanelProps> = ({
  scheme,
  profile,
  claim,
  onUpdateDocState,
  onToggleStep,
  onOpenPrintSummary,
  navigate,
}) => {
  const readiness = calculateSchemeReadiness(scheme, profile, claim);
  const documentStates = claim?.documentStates || {};
  const completedStepNumbers = claim?.completedStepNumbers || [];

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Dynamic Progress & Actions */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-teal-600" />
              <h2 className="text-lg font-extrabold text-navy-900">
                Claim Readiness Copilot
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Readiness score derived dynamically from your verified documents and completed preparation steps.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onOpenPrintSummary}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Print Preparation Summary</span>
            </button>
          </div>
        </div>

        {/* Progress Bar & Actual Count */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-navy-900">
              Preparation Progress: {readiness.completedChecklistItems} of {readiness.totalChecklistItems} items completed
            </span>
            <span className={`px-2.5 py-0.5 rounded-full font-extrabold text-xs ${
              readiness.readinessPercentage >= 80 
                ? 'bg-emerald-100 text-emerald-800' 
                : readiness.readinessPercentage >= 50
                ? 'bg-teal-100 text-teal-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {readiness.readinessPercentage}% Ready
            </span>
          </div>

          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                readiness.readinessPercentage >= 80
                  ? 'bg-emerald-500'
                  : readiness.readinessPercentage >= 50
                  ? 'bg-teal-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${Math.max(5, readiness.readinessPercentage)}%` }}
            ></div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
            <span>Mandatory Docs: <strong className="text-navy-900">{readiness.readyMandatoryDocs}/{readiness.totalMandatoryDocs} Ready</strong></span>
            <span>•</span>
            <span>Preparation Steps: <strong className="text-navy-900">{readiness.completedSteps}/{readiness.totalSteps} Done</strong></span>
            {readiness.needsVerificationDocs > 0 && (
              <>
                <span>•</span>
                <span className="text-amber-700 font-medium">{readiness.needsVerificationDocs} Docs Need Verification</span>
              </>
            )}
          </div>
        </div>

        {/* Prominent Next Best Action */}
        <div className={`p-4 rounded-2xl border transition-all ${
          readiness.nextActionPriority === 'ready_to_apply'
            ? 'bg-emerald-50 border-emerald-300'
            : readiness.nextActionPriority === 'disqualification'
            ? 'bg-rose-50 border-rose-300'
            : 'bg-teal-50/80 border-teal-200'
        }`}>
          <div className="flex items-center gap-2">
            <Target className={`w-4 h-4 ${
              readiness.nextActionPriority === 'ready_to_apply'
                ? 'text-emerald-700'
                : readiness.nextActionPriority === 'disqualification'
                ? 'text-rose-700'
                : 'text-teal-700'
            }`} />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Next Best Action Recommendation
            </span>
          </div>

          <p className="text-sm font-extrabold text-navy-950 mt-1 leading-relaxed">
            {readiness.computedNextBestAction}
          </p>
        </div>

        {/* Missing Profile Information Alert */}
        {readiness.missingProfileFields.length > 0 && (
          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-blue-900">
              <span className="font-bold">Missing Profile Information: </span>
              <span>
                Please specify <strong>{readiness.missingProfileFields.map(f => f.label).join(', ')}</strong> in your profile.
              </span>
            </div>
            <button
              onClick={() => navigate('profile')}
              className="text-xs font-bold text-blue-800 underline shrink-0 hover:text-blue-950"
            >
              Update Profile Now →
            </button>
          </div>
        )}
      </div>

      {/* Document Checklist with 3-Way State Controls */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-navy-900">
            Document Preparation Checklist
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Mark each document as Ready, Needs Verification, or Not Available. Status saves instantly.
          </p>
        </div>

        <div className="space-y-3">
          {scheme.requiredDocuments.map((doc) => {
            const currentState: DocumentReadinessState = documentStates[doc.id] || 'not_available';

            return (
              <div
                key={doc.id}
                className={`p-4 rounded-2xl border transition-all ${
                  currentState === 'ready'
                    ? 'bg-emerald-50/40 border-emerald-300'
                    : currentState === 'needs_verification'
                    ? 'bg-amber-50/40 border-amber-300'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  
                  {/* Document Info */}
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-navy-900">
                        {doc.name}
                      </span>
                      {doc.isMandatory ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          Mandatory
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          Conditional
                        </span>
                      )}
                    </div>

                    {doc.teluguName && (
                      <p className="text-xs text-amber-800 font-['Noto_Sans_Telugu'] font-medium">
                        {doc.teluguName}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {doc.description}
                    </p>

                    <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px]">
                      <span className="text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Where to get: {doc.whereToGet}
                      </span>
                      {doc.alternativeAllowed && (
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Alternative: {doc.alternativeAllowed}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3-Way State Selector Buttons */}
                  <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl self-start shrink-0">
                    <button
                      type="button"
                      onClick={() => onUpdateDocState(scheme.id, doc.id, 'ready')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        currentState === 'ready'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-navy-900'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Ready</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateDocState(scheme.id, doc.id, 'needs_verification')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        currentState === 'needs_verification'
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-slate-600 hover:text-navy-900'
                      }`}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Needs Verification</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onUpdateDocState(scheme.id, doc.id, 'not_available')}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                        currentState === 'not_available'
                          ? 'bg-slate-300 text-slate-800'
                          : 'text-slate-500 hover:text-navy-900'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Not Available</span>
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preparation Steps with Completion Controls */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-extrabold text-navy-900">
            Application Preparation Roadmap
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Check off steps as you complete them with colleges, banks, or Secretariat counters.
          </p>
        </div>

        <div className="space-y-3">
          {scheme.applicationSteps.map((step) => {
            const isCompleted = completedStepNumbers.includes(step.stepNumber);

            return (
              <div
                key={step.stepNumber}
                onClick={() => onToggleStep(scheme.id, step.stepNumber)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isCompleted
                    ? 'bg-teal-50/50 border-teal-300'
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100/50'
                }`}
              >
                <div className={`w-7 h-7 rounded-xl font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                  isCompleted
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-navy-900 text-teal-300'
                }`}>
                  {isCompleted ? '✓' : step.stepNumber}
                </div>

                <div className="space-y-1 text-xs flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-bold text-sm ${isCompleted ? 'text-teal-950 line-through' : 'text-navy-900'}`}>
                      {step.title}
                    </h4>
                    {step.locationOrUrl && (
                      <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {step.locationOrUrl}
                      </span>
                    )}
                  </div>

                  {step.teluguTitle && (
                    <p className="text-amber-800 font-['Noto_Sans_Telugu'] font-medium">
                      {step.teluguTitle}
                    </p>
                  )}

                  <p className="text-slate-600 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="pt-1">
                    <span className={`text-[11px] font-bold ${isCompleted ? 'text-teal-800' : 'text-slate-500'}`}>
                      {isCompleted ? '✓ Step Completed' : 'Click to mark as completed'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unverifiable Items Callout */}
      {readiness.unverifiableItems.length > 0 && (
        <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
            <Info className="w-4 h-4 text-amber-600" />
            <span>Items Requiring Official In-Person / External Verification</span>
          </div>

          <p className="text-[11px] text-amber-950 leading-relaxed">
            The following conditions cannot be independently verified or certified by the HaqSetu AI client application alone and require sign-off by competent government authorities:
          </p>

          <ul className="text-xs text-amber-900 space-y-1.5 list-disc pl-5">
            {readiness.unverifiableItems.map((item, idx) => (
              <li key={idx}>
                <strong>{item.label}:</strong> {item.reason} (Authority: <em>{item.authority}</em>)
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Official Links Directory */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <span className="text-slate-500 block text-[11px]">Official Information & Verification Source</span>
          <a
            href={scheme.officialInfoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-teal-800 hover:text-teal-950 font-bold text-sm inline-flex items-center gap-1 mt-0.5"
          >
            <span>{scheme.officialInfoUrl}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {scheme.applicationUrl && (
          <a
            href={scheme.applicationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-xs self-start sm:self-auto"
          >
            <span>Direct Application Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
          </a>
        )}
      </div>

    </div>
  );
};
