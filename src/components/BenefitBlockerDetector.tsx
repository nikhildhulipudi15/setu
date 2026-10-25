import React, { useState } from 'react';
import { 
  AlertTriangle, 
  FileText, 
  Fingerprint, 
  CreditCard, 
  ServerCrash, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  PhoneCall, 
  Building, 
  Clock, 
  ShieldAlert, 
  RotateCcw,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { BENEFIT_BLOCKER_FLOWS } from '../data/blockers';
import { BlockerType, BlockerOption } from '../types';

interface BenefitBlockerDetectorProps {
  activeSchemeId?: string;
  schemeName?: string;
}

export const BenefitBlockerDetector: React.FC<BenefitBlockerDetectorProps> = ({
  activeSchemeId,
  schemeName,
}) => {
  const [selectedBlockerType, setSelectedBlockerType] = useState<BlockerType>('rejected');
  const [selectedOptionId, setSelectedOptionId] = useState<string>('elec-units-exceeded');

  const currentFlow = BENEFIT_BLOCKER_FLOWS.find(f => f.id === selectedBlockerType) || BENEFIT_BLOCKER_FLOWS[0];
  const activeOption: BlockerOption = currentFlow.options.find(o => o.id === selectedOptionId) || currentFlow.options[0];

  const handleSelectBlocker = (type: BlockerType) => {
    setSelectedBlockerType(type);
    const flow = BENEFIT_BLOCKER_FLOWS.find(f => f.id === type);
    if (flow && flow.options.length > 0) {
      setSelectedOptionId(flow.options[0].id);
    }
  };

  const blockerCategories = [
    { id: 'rejected', label: '1. Application Rejected', icon: AlertTriangle, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { id: 'missing_or_incorrect_docs', label: '2. Missing / Incorrect Docs', icon: FileText, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { id: 'verification_failed', label: '3. Verification / eKYC Failed', icon: Fingerprint, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'payment_delayed', label: '4. Payment Delayed / DBT', icon: CreditCard, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'portal_submission_error', label: '5. Portal / Technical Error', icon: ServerCrash, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  ];

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 mb-1">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            <span>Benefit Blocker Diagnostic Detector</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
            Identify & Overcome Entitlement Obstacles
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Select the problem you are experiencing for guided practical checks in order and verified official support channels.
          </p>
        </div>

        {schemeName && (
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 text-xs text-slate-700 font-semibold self-start sm:self-auto">
            Focus: {schemeName}
          </div>
        )}
      </div>

      {/* 5 Problem Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
        {blockerCategories.map((cat) => {
          const isSelected = selectedBlockerType === cat.id;
          const IconComp = cat.icon;

          return (
            <button
              key={cat.id}
              onClick={() => handleSelectBlocker(cat.id as BlockerType)}
              className={`p-3 rounded-2xl border text-left transition-all text-xs space-y-1.5 ${
                isSelected 
                  ? 'bg-navy-900 text-white border-navy-900 shadow-md font-bold' 
                  : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700 font-semibold'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                isSelected ? 'bg-teal-500/20 text-teal-300' : cat.color
              }`}>
                <IconComp className="w-4 h-4" />
              </div>
              <div className="line-clamp-2 leading-tight">
                {cat.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Relevant Follow-Up Question */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-teal-600" />
          <span>{currentFlow.followUpQuestion}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {currentFlow.options.map((option) => {
            const isOptionSelected = activeOption.id === option.id;

            return (
              <button
                key={option.id}
                onClick={() => setSelectedOptionId(option.id)}
                className={`p-3.5 rounded-xl border text-left transition-all text-xs space-y-1 ${
                  isOptionSelected
                    ? 'bg-teal-50 border-teal-400 text-teal-950 font-bold shadow-xs'
                    : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option.label}</span>
                  {isOptionSelected && <CheckCircle2 className="w-3.5 h-3.5 text-teal-700 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 font-normal">
                  {option.symptom}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Practical Checks in Order */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
            Step-by-Step Practical Checks (In Order)
          </h3>
          <span className="text-[11px] text-slate-400">Follow steps sequentially</span>
        </div>

        <div className="space-y-3">
          {activeOption.orderedChecks.map((check) => (
            <div
              key={check.order}
              className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 flex items-start gap-3.5 text-xs"
            >
              <div className="w-6 h-6 rounded-lg bg-navy-900 text-teal-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                {check.order}
              </div>

              <div className="space-y-1 flex-1">
                <p className="text-slate-800 font-medium leading-relaxed">
                  {check.instruction}
                </p>
                {check.teluguInstruction && (
                  <p className="text-amber-800 font-['Noto_Sans_Telugu'] text-[11px]">
                    {check.teluguInstruction}
                  </p>
                )}
                {check.evidenceNeeded && (
                  <div className="text-[11px] text-teal-900 font-bold pt-0.5">
                    Evidence to Obtain: <span className="font-semibold text-slate-700">{check.evidenceNeeded}</span>
                  </div>
                )}
                <span className="inline-block text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 mt-1">
                  Desk: {check.portalOrDesk}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Evidence Required & Official Support Channel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Required Evidence Box */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 text-xs shadow-xs">
          <div className="flex items-center gap-2 text-navy-900 font-bold">
            <FileText className="w-4 h-4 text-teal-600" />
            <span>Evidence / Documents Required for Resolution</span>
          </div>

          <ul className="space-y-1.5 list-disc pl-5 text-slate-600">
            {activeOption.evidenceRequired.map((ev, i) => (
              <li key={i}>{ev}</li>
            ))}
          </ul>
        </div>

        {/* Official Channel Box */}
        <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-teal-950 font-bold">
              <PhoneCall className="w-4 h-4 text-teal-700" />
              <span>Official Support Channel</span>
            </div>
            <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded">
              Resolution: {activeOption.officialChannel.resolutionTime}
            </span>
          </div>

          <div className="space-y-1 text-teal-950">
            <strong className="block text-sm">{activeOption.officialChannel.name}</strong>
            <p className="text-[11px] text-teal-900">{activeOption.officialChannel.instructions}</p>
            <div className="pt-1">
              <span className="font-mono text-xs font-extrabold bg-white px-2.5 py-1 rounded border border-teal-300 inline-block">
                Contact: {activeOption.officialChannel.contactOrUrl}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Scheme-Specific Note (If applicable) */}
      {activeSchemeId && activeOption.schemeSpecificNote?.[activeSchemeId] && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-1">
          <span className="font-bold block text-amber-900">
            Verified Scheme-Specific Instruction:
          </span>
          <p className="leading-relaxed">
            {activeOption.schemeSpecificNote[activeSchemeId]}
          </p>
        </div>
      )}

      {/* Safety Boundary Disclaimer */}
      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 flex items-start gap-2.5 leading-relaxed">
        <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <strong>System Boundary Notice:</strong> HaqSetu AI is an independent advisory and readiness tool. It does <strong>not</strong> possess direct live access to government case files, confidential CFMS treasury ledgers, or individual UIDAI Aadhaar biometrics. Official status determinations are issued exclusively by government designated portals.
        </div>
      </div>

    </div>
  );
};
