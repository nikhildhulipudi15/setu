import React, { useState } from 'react';
import { 
  BookmarkCheck, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileCheck2, 
  AlertCircle, 
  ExternalLink, 
  Trash2, 
  Edit3, 
  Save, 
  Sparkles,
  HelpCircle,
  Building,
  PlusCircle,
  TrendingUp,
  Target,
  Printer,
  AlertOctagon,
  FileText
} from 'lucide-react';
import { 
  ClaimRecord, 
  Scheme, 
  ClaimStatus, 
  UserProfile, 
  DocumentReadinessState 
} from '../types';
import { calculateSchemeReadiness } from '../utils/readiness';
import { PrintableClaimSummary } from '../components/PrintableClaimSummary';

interface MyClaimsProps {
  claims: ClaimRecord[];
  schemes: Scheme[];
  profile: UserProfile;
  navigate: (route: string, param?: string) => void;
  onUpdateClaimStatus: (claimId: string, status: ClaimStatus) => void;
  onUpdateClaimField: (claimId: string, field: 'applicationNumber' | 'notes', value: string) => void;
  onRemoveClaim: (claimId: string) => void;
  onUpdateDocState: (schemeId: string, docId: string, state: DocumentReadinessState) => void;
}

export const MyClaims: React.FC<MyClaimsProps> = ({
  claims,
  schemes,
  profile,
  navigate,
  onUpdateClaimStatus,
  onUpdateClaimField,
  onRemoveClaim,
  onUpdateDocState,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [editingClaimId, setEditingClaimId] = useState<string | null>(null);
  const [tempAppNumber, setTempAppNumber] = useState('');
  const [tempNotes, setTempNotes] = useState('');
  const [printSchemeId, setPrintSchemeId] = useState<string | null>(null);

  const schemeMap = new Map(schemes.map(s => [s.id, s]));

  const filteredClaims = claims.filter((claim) => {
    if (selectedFilter === 'all') return true;
    return claim.status === selectedFilter;
  });

  const gatheringCount = claims.filter(c => c.status === 'gathering_docs').length;
  const readyCount = claims.filter(c => c.status === 'ready_to_apply').length;
  const submittedCount = claims.filter(c => c.status === 'submitted').length;
  const approvedCount = claims.filter(c => c.status === 'approved').length;

  const handleStartEdit = (claim: ClaimRecord) => {
    setEditingClaimId(claim.id);
    setTempAppNumber(claim.applicationNumber || '');
    setTempNotes(claim.notes || '');
  };

  const handleSaveEdit = (claimId: string) => {
    onUpdateClaimField(claimId, 'applicationNumber', tempAppNumber);
    onUpdateClaimField(claimId, 'notes', tempNotes);
    setEditingClaimId(null);
  };

  // Find most urgent claim to compute global Next Best Action
  const urgentClaim = claims.find(c => c.status === 'gathering_docs') || claims[0];
  const urgentScheme = urgentClaim ? schemeMap.get(urgentClaim.schemeId) : null;
  const urgentReadiness = urgentScheme ? calculateSchemeReadiness(urgentScheme, profile, urgentClaim) : null;

  const activePrintScheme = printSchemeId ? schemeMap.get(printSchemeId) : null;
  const activePrintClaim = printSchemeId ? claims.find(c => c.schemeId === printSchemeId) : undefined;
  const activePrintReadiness = (activePrintScheme && activePrintClaim) 
    ? calculateSchemeReadiness(activePrintScheme, profile, activePrintClaim) 
    : null;

  return (
    <div className="py-8 bg-[#fcfbf9] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 mb-1.5">
              <BookmarkCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Connected Entitlement Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              My Claims & Readiness Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Real-time progress derived from actual document checklists, pending preparation steps, and official application records.
            </p>
          </div>

          <button
            onClick={() => navigate('matched')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Discover More Schemes</span>
          </button>
        </div>

        {/* Pipeline Stage Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div 
            onClick={() => setSelectedFilter('gathering_docs')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedFilter === 'gathering_docs' 
                ? 'bg-amber-100/70 border-amber-400' 
                : 'bg-amber-50 border-amber-200 hover:bg-amber-100/50'
            }`}
          >
            <div className="text-xl font-black text-amber-900">{gatheringCount}</div>
            <div className="text-xs font-bold text-amber-900">Gathering Documents</div>
            <div className="text-[10px] text-amber-700">Certificates in preparation</div>
          </div>

          <div 
            onClick={() => setSelectedFilter('ready_to_apply')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedFilter === 'ready_to_apply' 
                ? 'bg-teal-100/80 border-teal-400' 
                : 'bg-teal-50 border-teal-200 hover:bg-teal-100/50'
            }`}
          >
            <div className="text-xl font-black text-teal-900">{readyCount}</div>
            <div className="text-xs font-bold text-teal-900">Ready to Apply</div>
            <div className="text-[10px] text-teal-700">Checklist complete</div>
          </div>

          <div 
            onClick={() => setSelectedFilter('submitted')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedFilter === 'submitted' 
                ? 'bg-blue-100/80 border-blue-400' 
                : 'bg-blue-50 border-blue-200 hover:bg-blue-100/50'
            }`}
          >
            <div className="text-xl font-black text-blue-900">{submittedCount}</div>
            <div className="text-xs font-bold text-blue-900">Submitted / In Review</div>
            <div className="text-[10px] text-blue-700">Awaiting WEA or L1 approval</div>
          </div>

          <div 
            onClick={() => setSelectedFilter('approved')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedFilter === 'approved' 
                ? 'bg-emerald-100/80 border-emerald-400' 
                : 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100/50'
            }`}
          >
            <div className="text-xl font-black text-emerald-900">{approvedCount}</div>
            <div className="text-xs font-bold text-emerald-900">Approved & Active</div>
            <div className="text-[10px] text-emerald-700">Disbursed via DBT</div>
          </div>
        </div>

        {/* Global Next Best Action Spotlight */}
        {urgentClaim && urgentScheme && urgentReadiness && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 text-white border border-navy-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-bold">
                <Target className="w-3.5 h-3.5 text-teal-400" />
                <span>Computed Next Best Action (Priority Task)</span>
              </div>
              <span className="text-xs font-bold text-teal-400">
                {urgentReadiness.readinessPercentage}% Prepared
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-lg sm:text-xl font-extrabold text-white">
                {urgentScheme.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {urgentReadiness.computedNextBestAction}
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate('details', urgentScheme.id)}
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>Open Claim Readiness Copilot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setPrintSchemeId(urgentScheme.id)}
                className="px-4 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-300 text-xs font-semibold border border-navy-700 transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-slate-400" />
                <span>Print Preparation Summary</span>
              </button>
            </div>
          </div>
        )}

        {/* Filter Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'all', label: 'All Saved Claims', count: claims.length },
              { id: 'gathering_docs', label: 'Gathering Documents', count: gatheringCount },
              { id: 'ready_to_apply', label: 'Ready to Apply', count: readyCount },
              { id: 'submitted', label: 'Submitted / In Review', count: submittedCount },
              { id: 'approved', label: 'Approved', count: approvedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 ${
                  selectedFilter === tab.id
                    ? 'bg-navy-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-navy-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedFilter === tab.id ? 'bg-teal-400 text-navy-950' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Claims List */}
        {filteredClaims.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
            <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-navy-900">No claims in this category</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Save schemes from the Evaluated Schemes page to monitor your document collection progress and application preparation steps.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('matched')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm"
              >
                <span>Browse Evaluated Schemes</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredClaims.map((claim) => {
              const scheme = schemeMap.get(claim.schemeId);
              if (!scheme) return null;

              const readiness = calculateSchemeReadiness(scheme, profile, claim);
              const isEditing = editingClaimId === claim.id;

              return (
                <div
                  key={claim.id}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                          {scheme.schemeLevel} Level
                        </span>
                        <span className="text-[10px] font-medium text-slate-500">
                          {scheme.beneficiaryCategory}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Saved: {new Date(claim.savedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 
                        onClick={() => navigate('details', scheme.id)}
                        className="text-lg font-extrabold text-navy-900 hover:text-teal-700 cursor-pointer"
                      >
                        {scheme.name}
                      </h3>
                      {scheme.teluguName && (
                        <p className="text-xs text-amber-800 font-medium font-['Noto_Sans_Telugu']">
                          {scheme.teluguName}
                        </p>
                      )}
                      <p className="text-xs text-slate-500 mt-1 font-semibold text-teal-800">
                        Entitlement: {scheme.benefitFinancials}
                      </p>
                    </div>

                    {/* Status Changer Dropdown */}
                    <div className="shrink-0">
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Application Status
                      </label>
                      <select
                        value={claim.status}
                        onChange={(e) => onUpdateClaimStatus(claim.id, e.target.value as ClaimStatus)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                          claim.status === 'approved'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : claim.status === 'submitted'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : claim.status === 'ready_to_apply'
                            ? 'bg-teal-50 text-teal-800 border-teal-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="gathering_docs">⏳ Gathering Documents</option>
                        <option value="ready_to_apply">✅ Ready to Apply</option>
                        <option value="submitted">📨 Submitted / In Review</option>
                        <option value="approved">🎉 Approved & Disbursed</option>
                      </select>
                    </div>

                  </div>

                  {/* Dynamic Readiness Metric Bar (Calculated from actual items) */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-navy-900">
                        Readiness Progress: {readiness.completedChecklistItems} of {readiness.totalChecklistItems} items completed
                      </span>
                      <span className={`px-2 py-0.5 rounded-full font-extrabold text-[11px] ${
                        readiness.readinessPercentage >= 80 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-teal-100 text-teal-800'
                      }`}>
                        {readiness.readinessPercentage}% Ready
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-500 rounded-full transition-all duration-300"
                        style={{ width: `${readiness.readinessPercentage}%` }}
                      ></div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500">
                      <span>Mandatory Docs: <strong className="text-navy-900">{readiness.readyMandatoryDocs}/{readiness.totalMandatoryDocs} Ready</strong></span>
                      <span>•</span>
                      <span>Preparation Steps: <strong className="text-navy-900">{readiness.completedSteps}/{readiness.totalSteps} Completed</strong></span>
                    </div>
                  </div>

                  {/* Next Best Action Callout */}
                  <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 text-teal-900 font-bold">
                      <Target className="w-3.5 h-3.5 text-teal-700" />
                      <span>Next Action for this Scheme:</span>
                    </div>
                    <p className="text-teal-950 font-medium">
                      {readiness.computedNextBestAction}
                    </p>
                  </div>

                  {/* Application Reference Number & Personal Volunteer Notes */}
                  <div className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200 text-xs space-y-2">
                    {isEditing ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block font-bold text-navy-900 mb-1">
                            Application / Token Reference Number:
                          </label>
                          <input
                            type="text"
                            value={tempAppNumber}
                            onChange={(e) => setTempAppNumber(e.target.value)}
                            placeholder="e.g. JNB2024-884920 or MeeSeva App ID"
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-navy-900 mb-1">
                            Personal Action Notes / Volunteer Info:
                          </label>
                          <textarea
                            rows={2}
                            value={tempNotes}
                            onChange={(e) => setTempNotes(e.target.value)}
                            placeholder="e.g. Visited Sachivalayam; WEA Ramesh promised verification on Tuesday..."
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSaveEdit(claim.id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Save Details</span>
                          </button>
                          <button
                            onClick={() => setEditingClaimId(null)}
                            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-navy-900">Application Number:</span>
                            <span className="font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                              {claim.applicationNumber || 'Not recorded yet'}
                            </span>
                          </div>
                          {claim.notes && (
                            <p className="text-slate-600 text-[11px] italic">
                              "{claim.notes}"
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleStartEdit(claim)}
                          className="inline-flex items-center gap-1 text-slate-600 hover:text-navy-900 font-semibold self-start sm:self-auto text-xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Notes</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate('details', scheme.id)}
                        className="font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1"
                      >
                        <span>Open Readiness Copilot</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setPrintSchemeId(scheme.id)}
                        className="text-slate-600 hover:text-navy-900 font-medium flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5 text-slate-500" />
                        <span>Print Summary</span>
                      </button>

                      <a
                        href={scheme.officialInfoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-600 hover:text-navy-900 font-medium flex items-center gap-1"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate('troubleshoot')}
                        className="text-rose-700 hover:text-rose-900 font-medium flex items-center gap-1"
                      >
                        <AlertOctagon className="w-3.5 h-3.5" />
                        <span>Diagnose Blockers</span>
                      </button>

                      <button
                        onClick={() => onRemoveClaim(claim.id)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Remove from saved claims"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Printable Claim Summary Modal */}
      {activePrintScheme && activePrintReadiness && (
        <PrintableClaimSummary
          scheme={activePrintScheme}
          readiness={activePrintReadiness}
          claim={activePrintClaim}
          onClose={() => setPrintSchemeId(null)}
        />
      )}
    </div>
  );
};
