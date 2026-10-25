import React from 'react';
import { 
  Printer, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ExternalLink, 
  PhoneCall, 
  Building,
  Clock,
  Target
} from 'lucide-react';
import { Scheme, SchemeReadinessAssessment, ClaimRecord } from '../types';

interface PrintableClaimSummaryProps {
  scheme: Scheme;
  readiness: SchemeReadinessAssessment;
  claim?: ClaimRecord;
  onClose: () => void;
}

export const PrintableClaimSummary: React.FC<PrintableClaimSummaryProps> = ({
  scheme,
  readiness,
  claim,
  onClose,
}) => {
  const handlePrint = () => {
    // Let the modal finish painting before asking the browser to build its print preview.
    window.requestAnimationFrame(() => window.print());
  };

  const documentStates = claim?.documentStates || {};
  const completedSteps = claim?.completedStepNumbers || [];

  return (
    <div className="printable-claim-summary fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center">
      <div className="printable-claim-document bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Printer className="w-4 h-4 text-teal-400" />
            <span>Claim Preparation Summary (Print Preview)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="printable-claim-content p-8 sm:p-10 space-y-6 text-navy-900 bg-white">
          
          {/* Official Document Header */}
          <div className="pb-6 border-b-2 border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-800">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>HaqSetu AI • Citizen Entitlement Readiness Report</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-navy-950 mt-1">
                {scheme.name}
              </h1>
              {scheme.teluguName && (
                <p className="text-sm font-semibold text-amber-800 font-['Noto_Sans_Telugu']">
                  {scheme.teluguName}
                </p>
              )}
              <p className="text-xs text-slate-500 mt-1">
                Administered by: <strong>{scheme.department}</strong> ({scheme.schemeLevel} Level)
              </p>
            </div>

            <div className="text-right sm:text-right shrink-0">
              <span className="text-xs font-mono px-2 py-1 rounded bg-slate-100 text-slate-700 font-bold block">
                {scheme.code}
              </span>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="text-[10px] text-teal-700 font-semibold block">
                Verified: {scheme.lastVerifiedDate}
              </span>
            </div>
          </div>

          {/* Entitlement & Actual Readiness Metric */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px]">Financial Benefit</span>
              <strong className="text-teal-900 text-sm font-bold block mt-0.5">
                {scheme.benefitFinancials}
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Readiness Progress</span>
              <strong className="text-navy-950 text-sm font-bold block mt-0.5">
                {readiness.readinessPercentage}% Prepared ({readiness.completedChecklistItems}/{readiness.totalChecklistItems} Items)
              </strong>
            </div>

            <div>
              <span className="text-slate-500 block text-[11px]">Disbursement Cycle</span>
              <strong className="text-navy-900 text-sm font-bold block mt-0.5">
                {scheme.frequency}
              </strong>
            </div>
          </div>

          {/* Prominent Next Best Action */}
          <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-900">
              <Target className="w-4 h-4 text-teal-700" />
              <span>Recommended Next Best Action</span>
            </div>
            <p className="text-sm font-extrabold text-teal-950 leading-relaxed">
              {readiness.computedNextBestAction}
            </p>
          </div>

          {/* Section: Required Documents Checklist with 3-Way Status */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Required Documents Checklist ({readiness.readyMandatoryDocs}/{readiness.totalMandatoryDocs} Ready)
            </h3>

            <div className="space-y-2">
              {scheme.requiredDocuments.map((doc) => {
                const state = documentStates[doc.id] || 'not_available';
                return (
                  <div
                    key={doc.id}
                    className="p-3 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-2">
                        <strong className="text-navy-900 font-bold">{doc.name}</strong>
                        {doc.isMandatory ? (
                          <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded font-semibold border border-rose-200">
                            Mandatory
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            Conditional
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-[11px]">{doc.description}</p>
                      <span className="text-[10px] text-teal-800 font-medium block">
                        Where to get: {doc.whereToGet}
                      </span>
                    </div>

                    <div className="shrink-0 text-right">
                      {state === 'ready' ? (
                        <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Ready</span>
                        </span>
                      ) : state === 'needs_verification' ? (
                        <span className="px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 font-bold text-[11px] inline-flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>Needs Verification</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-semibold text-[11px]">
                          Pending / Missing
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Application Preparation Steps */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Application Preparation Steps ({readiness.completedSteps}/{readiness.totalSteps} Completed)
            </h3>

            <div className="space-y-2">
              {scheme.applicationSteps.map((step) => {
                const isDone = completedSteps.includes(step.stepNumber);
                return (
                  <div
                    key={step.stepNumber}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start gap-3 text-xs"
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 ${
                      isDone ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {isDone ? '✓' : step.stepNumber}
                    </div>

                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center justify-between">
                        <strong className={`font-bold ${isDone ? 'line-through text-slate-400' : 'text-navy-900'}`}>
                          {step.title}
                        </strong>
                        {step.locationOrUrl && (
                          <span className="text-[10px] font-semibold text-slate-500">
                            {step.locationOrUrl}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-[11px]">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Outstanding Verification / Unverifiable Items */}
          {readiness.unverifiableItems.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1.5">
              <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider">
                External Verification Required (Cannot be certified by App):
              </span>
              <ul className="text-amber-950 text-[11px] space-y-1 list-disc pl-4">
                {readiness.unverifiableItems.map((item, i) => (
                  <li key={i}>
                    <strong>{item.label}:</strong> {item.reason} — <em>Authority: {item.authority}</em>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Official Verification Links & Helplines */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
            <div>
              <span>Official Info: </span>
              <strong className="text-navy-900">{scheme.officialInfoUrl}</strong>
              {scheme.applicationUrl && (
                <> • Application: <strong className="text-navy-900">{scheme.applicationUrl}</strong></>
              )}
            </div>

            <div>
              <span>Helpline: </span>
              <strong className="text-teal-800">{scheme.helpline}</strong>
            </div>
          </div>

          {/* Privacy & Legal Disclaimer */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[10px] text-slate-500 leading-relaxed">
            <strong>Privacy & Legal Disclaimer:</strong> Sensitive personal data (such as Aadhaar numbers, PAN, or bank credentials) is strictly excluded from this report by design. This summary is generated client-side for citizen preparation and does not constitute an official government sanction or legal guarantee of entitlement. Final sanction is determined solely by the competent department authority.
          </div>

        </div>

      </div>
    </div>
  );
};
