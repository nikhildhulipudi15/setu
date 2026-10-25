import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  FileCheck2, 
  Building, 
  PhoneCall, 
  Bookmark, 
  BookmarkCheck, 
  Calendar, 
  Clock, 
  FileText, 
  Sparkles, 
  Printer, 
  ChevronRight, 
  Info, 
  XCircle,
  AlertOctagon
} from 'lucide-react';
import { 
  Scheme, 
  UserProfile, 
  ClaimRecord, 
  SchemeOutcome, 
  DocumentReadinessState 
} from '../types';
import { evaluateScheme } from '../utils/matcher';
import { calculateSchemeReadiness } from '../utils/readiness';
import { ClaimReadinessPanel } from '../components/ClaimReadinessPanel';
import { PrintableClaimSummary } from '../components/PrintableClaimSummary';
import { BenefitBlockerDetector } from '../components/BenefitBlockerDetector';

interface SchemeDetailsProps {
  scheme: Scheme;
  profile: UserProfile;
  claim?: ClaimRecord;
  navigate: (route: string, param?: string) => void;
  onUpdateDocState: (schemeId: string, docId: string, state: DocumentReadinessState) => void;
  onToggleStep: (schemeId: string, stepNumber: number) => void;
  onSaveClaim: (schemeId: string) => void;
}

export const SchemeDetails: React.FC<SchemeDetailsProps> = ({
  scheme,
  profile,
  claim,
  navigate,
  onUpdateDocState,
  onToggleStep,
  onSaveClaim,
}) => {
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [showBlockerDetector, setShowBlockerDetector] = useState(false);

  const evaluation = evaluateScheme(scheme, profile);
  const readiness = calculateSchemeReadiness(scheme, profile, claim);

  const getOutcomeBadge = (outcome: SchemeOutcome) => {
    switch (outcome) {
      case 'POTENTIAL MATCH':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>POTENTIAL MATCH</span>
          </span>
        );
      case 'NEEDS VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>NEEDS VERIFICATION</span>
          </span>
        );
      case 'LIKELY NOT A MATCH':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-300">
            <XCircle className="w-4 h-4 text-slate-400" />
            <span>LIKELY NOT A MATCH</span>
          </span>
        );
    }
  };

  return (
    <div className="py-8 bg-[#fcfbf9] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('matched')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-navy-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Evaluated Schemes</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPrintModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-xs transition-colors"
              title="Print Claim Preparation Summary"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Summary</span>
            </button>

            <button
              onClick={() => onSaveClaim(scheme.id)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                claim
                  ? 'bg-teal-50 text-teal-800 border border-teal-300'
                  : 'bg-navy-900 hover:bg-navy-800 text-white shadow-sm'
              }`}
            >
              {claim ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-teal-600" />
                  <span>Saved in My Claims</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-teal-400" />
                  <span>Save to My Claims</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scheme Header Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {getOutcomeBadge(evaluation.outcome)}

            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {scheme.schemeLevel} Level
            </span>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {scheme.beneficiaryCategory}
            </span>
            <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              {scheme.code}
            </span>
            {scheme.dataStatus === 'verified' ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                <span>Verified Policy ({scheme.lastVerifiedDate})</span>
              </span>
            ) : (
              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded">
                Illustrative Demo Framework
              </span>
            )}
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-navy-900 tracking-tight">
              {scheme.name}
            </h1>
            {scheme.teluguName && (
              <p className="text-sm sm:text-base text-amber-800 font-semibold font-['Noto_Sans_Telugu'] mt-1">
                {scheme.teluguName}
              </p>
            )}
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Administered by: {scheme.department}
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
            {scheme.description}
          </p>

          {/* Benefit Highlight Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-50/80 via-teal-50/40 to-slate-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 block">
                Direct Financial & Welfare Entitlement
              </span>
              <div className="text-lg sm:text-xl font-extrabold text-navy-950 mt-0.5">
                {scheme.benefitFinancials}
              </div>
              <div className="text-xs text-slate-600 mt-1">
                Disbursement Cycle: <strong className="text-navy-900">{scheme.frequency}</strong>
              </div>
            </div>

            <div className="flex flex-col sm:items-end gap-2 shrink-0">
              <a
                href={scheme.officialInfoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                <span>Official Information Source</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              {scheme.applicationUrl && (
                <a
                  href={scheme.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-xs"
                >
                  <span>Direct Application Portal</span>
                  <ExternalLink className="w-3 h-3 text-teal-400" />
                </a>
              )}
            </div>
          </div>

          {/* Official Authority Disclaimer */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
            {evaluation.disclaimer}
          </div>
        </div>

        {/* Claim Readiness Panel (Signature Copilot) */}
        <ClaimReadinessPanel
          scheme={scheme}
          profile={profile}
          claim={claim}
          onUpdateDocState={onUpdateDocState}
          onToggleStep={onToggleStep}
          onOpenPrintSummary={() => setPrintModalOpen(true)}
          navigate={navigate}
        />

        {/* Diagnostic Blocker Section Toggle */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-extrabold text-navy-900 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                <span>Benefit Blocker Diagnostic Assistant</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Experiencing a rejection, missing document, failed biometric e-KYC, or delayed payment?
              </p>
            </div>

            <button
              onClick={() => setShowBlockerDetector(!showBlockerDetector)}
              className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-bold transition-colors self-start sm:self-auto"
            >
              {showBlockerDetector ? 'Hide Blocker Diagnostics' : 'Diagnose Blockers for this Scheme →'}
            </button>
          </div>

          {showBlockerDetector && (
            <div className="pt-2">
              <BenefitBlockerDetector
                activeSchemeId={scheme.id}
                schemeName={scheme.name}
              />
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => navigate('matched')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700"
          >
            ← Back to Evaluated Schemes
          </button>

          <button
            onClick={() => {
              onSaveClaim(scheme.id);
              navigate('claims');
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm"
          >
            <span>Open in My Claims Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Printable Claim Summary Modal */}
      {printModalOpen && (
        <PrintableClaimSummary
          scheme={scheme}
          readiness={readiness}
          claim={claim}
          onClose={() => setPrintModalOpen(false)}
        />
      )}
    </div>
  );
};
