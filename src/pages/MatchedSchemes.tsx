import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Bookmark, 
  BookmarkCheck, 
  ArrowRight, 
  ExternalLink, 
  Sparkles,
  Building,
  GraduationCap,
  Wheat,
  HeartPulse,
  Hammer,
  Layers,
  XCircle,
  FileText,
  Calendar,
  Clock,
  ShieldCheck,
  Info
} from 'lucide-react';
import { SchemeEvaluationResult, SchemeOutcome, UserProfile } from '../types';

interface MatchedSchemesProps {
  matchResults: SchemeEvaluationResult[];
  profile: UserProfile;
  navigate: (route: string, param?: string) => void;
  savedClaimSchemeIds: string[];
  onToggleClaim: (schemeId: string) => void;
}

export const MatchedSchemes: React.FC<MatchedSchemesProps> = ({
  matchResults,
  profile,
  navigate,
  savedClaimSchemeIds,
  onToggleClaim,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOutcome, setSelectedOutcome] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const filteredResults = useMemo(() => {
    return matchResults.filter((res) => {
      const scheme = res.scheme;
      
      // Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = 
          scheme.name.toLowerCase().includes(q) ||
          (scheme.teluguName && scheme.teluguName.toLowerCase().includes(q)) ||
          scheme.description.toLowerCase().includes(q) ||
          scheme.department.toLowerCase().includes(q) ||
          scheme.beneficiaryCategory.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      // Outcome Filter
      if (selectedOutcome !== 'all') {
        if (res.outcome !== selectedOutcome) return false;
      }

      // Category Filter
      if (selectedCategory !== 'all' && scheme.beneficiaryCategory !== selectedCategory) {
        return false;
      }

      // Scheme Level
      if (selectedLevel !== 'all' && scheme.schemeLevel !== selectedLevel) {
        return false;
      }

      return true;
    });
  }, [matchResults, searchQuery, selectedOutcome, selectedCategory, selectedLevel]);

  const potentialCount = matchResults.filter(r => r.outcome === 'POTENTIAL MATCH').length;
  const verificationCount = matchResults.filter(r => r.outcome === 'NEEDS VERIFICATION').length;
  const notMatchCount = matchResults.filter(r => r.outcome === 'LIKELY NOT A MATCH').length;

  const getOutcomeBadge = (outcome: SchemeOutcome) => {
    switch (outcome) {
      case 'POTENTIAL MATCH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>POTENTIAL MATCH</span>
          </span>
        );
      case 'NEEDS VERIFICATION':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>NEEDS VERIFICATION</span>
          </span>
        );
      case 'LIKELY NOT A MATCH':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-300">
            <XCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>LIKELY NOT A MATCH</span>
          </span>
        );
    }
  };

  return (
    <div className="py-8 bg-[#fcfbf9] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Profile Indicator */}
        <div className="mb-6 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Deterministic Civic Eligibility Engine</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                Evaluated Welfare Schemes & Benefits
              </h1>
            </div>

            {/* Quick Profile Summary Badge */}
            <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 flex items-center justify-between gap-3 shadow-sm">
              <div>
                <span className="font-semibold text-navy-900">Active Profile:</span>{' '}
                <span className="text-teal-800 font-medium">
                  {profile.employmentStatus} • {profile.district} • {profile.incomeBand.split('/')[0]}
                </span>
              </div>
              <button
                onClick={() => navigate('profile')}
                className="text-xs font-bold text-teal-700 hover:text-teal-900 underline shrink-0"
              >
                Change Profile
              </button>
            </div>
          </div>

          <p className="text-sm text-slate-600">
            Government schemes evaluated through pure deterministic rule comparison. No opaque weighted scores or AI-generated eligibility decisions.
          </p>
        </div>

        {/* Highlight Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div 
            onClick={() => setSelectedOutcome('POTENTIAL MATCH')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedOutcome === 'POTENTIAL MATCH' ? 'bg-emerald-100 border-emerald-400' : 'bg-emerald-50 border-emerald-200'
            }`}
          >
            <div className="text-xl font-black text-emerald-800">{potentialCount}</div>
            <div className="text-xs font-bold text-emerald-900">POTENTIAL MATCH</div>
            <div className="text-[10px] text-emerald-700">All mandatory rules satisfied</div>
          </div>

          <div 
            onClick={() => setSelectedOutcome('NEEDS VERIFICATION')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedOutcome === 'NEEDS VERIFICATION' ? 'bg-amber-100 border-amber-400' : 'bg-amber-50 border-amber-200'
            }`}
          >
            <div className="text-xl font-black text-amber-800">{verificationCount}</div>
            <div className="text-xs font-bold text-amber-900">NEEDS VERIFICATION</div>
            <div className="text-[10px] text-amber-700">Unknowns or portal checks</div>
          </div>

          <div 
            onClick={() => setSelectedOutcome('LIKELY NOT A MATCH')}
            className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
              selectedOutcome === 'LIKELY NOT A MATCH' ? 'bg-slate-200 border-slate-400' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-xl font-black text-slate-700">{notMatchCount}</div>
            <div className="text-xs font-bold text-slate-700">LIKELY NOT A MATCH</div>
            <div className="text-[10px] text-slate-500">Conflicts with mandatory rules</div>
          </div>

          <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200">
            <div className="text-xl font-black text-teal-800">{savedClaimSchemeIds.length}</div>
            <div className="text-xs font-bold text-teal-900">Saved in My Claims</div>
            <div className="text-[10px] text-teal-700">In document preparation</div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm mb-6 space-y-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by scheme name, degree (B.Tech, ITI), health, farmer, artisan, loan..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            
            {/* Outcome Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
              <span className="text-[11px] font-semibold text-slate-500 px-1.5">Outcome:</span>
              <button
                onClick={() => setSelectedOutcome('all')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedOutcome === 'all' ? 'bg-white text-navy-900 shadow-xs' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedOutcome('POTENTIAL MATCH')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedOutcome === 'POTENTIAL MATCH' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                Potential Matches
              </button>
              <button
                onClick={() => setSelectedOutcome('NEEDS VERIFICATION')}
                className={`px-2.5 py-1 rounded font-medium transition-colors ${
                  selectedOutcome === 'NEEDS VERIFICATION' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                Needs Verification
              </button>
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">All Beneficiary Domains</option>
              <option value="Education & Scholarships">Education & Scholarships</option>
              <option value="Farmer & Agriculture">Farmer & Agriculture</option>
              <option value="Healthcare & Insurance">Healthcare & Insurance</option>
              <option value="Women & Child Welfare">Women & Child Welfare</option>
              <option value="Livelihood & Artisans">Livelihood & Artisans</option>
            </select>

            {/* Scheme Level */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="all">State & Central</option>
              <option value="State">State Schemes (Andhra Pradesh)</option>
              <option value="Central">Central Government Schemes</option>
            </select>

            <span className="ml-auto text-slate-400 font-medium">
              Showing {filteredResults.length} of {matchResults.length} schemes
            </span>
          </div>

        </div>

        {/* Schemes List */}
        {filteredResults.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-navy-900">No matching schemes for this filter</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try resetting the search query or outcome filter to see the complete list of evaluated programs.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedOutcome('all');
                  setSelectedCategory('all');
                  setSelectedLevel('all');
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredResults.map((result) => {
              const scheme = result.scheme;
              const isSaved = savedClaimSchemeIds.includes(scheme.id);

              return (
                <div
                  key={scheme.id}
                  className={`p-6 rounded-2xl bg-white border transition-all duration-200 shadow-sm hover:shadow-md ${
                    result.outcome === 'POTENTIAL MATCH'
                      ? 'border-emerald-300/90 bg-gradient-to-br from-white to-emerald-50/20'
                      : result.outcome === 'NEEDS VERIFICATION'
                      ? 'border-amber-300/80 bg-gradient-to-br from-white to-amber-50/20'
                      : 'border-slate-200 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    
                    {/* Left: Scheme Information & Diagnostic Evaluation */}
                    <div className="space-y-3 flex-1">
                      
                      {/* Meta Tags */}
                      <div className="flex flex-wrap items-center gap-2">
                        {getOutcomeBadge(result.outcome)}

                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {scheme.schemeLevel} Level
                        </span>

                        <span className="text-[11px] font-medium text-slate-600">
                          {scheme.beneficiaryCategory}
                        </span>

                        <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                          {scheme.code}
                        </span>

                        {scheme.dataStatus === 'verified' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 px-1.5 py-0.5 rounded">
                            <ShieldCheck className="w-3 h-3 text-teal-600" />
                            <span>Verified Policy ({scheme.lastVerifiedDate})</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-300 px-1.5 py-0.5 rounded">
                            <span>Illustrative Demo Model</span>
                          </span>
                        )}
                      </div>

                      {/* Titles */}
                      <div>
                        <h3 
                          className="text-lg sm:text-xl font-extrabold text-navy-900 hover:text-teal-700 cursor-pointer"
                          onClick={() => navigate('details', scheme.id)}
                        >
                          {scheme.name}
                        </h3>
                        {scheme.teluguName && (
                          <p className="text-xs text-amber-800 font-medium font-['Noto_Sans_Telugu'] mt-0.5">
                            {scheme.teluguName}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                          Administered by: {scheme.department}
                        </p>
                      </div>

                      {/* Benefit Financial Highlight Box */}
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                            Direct Entitlement
                          </span>
                          <span className="font-extrabold text-navy-900 text-sm text-teal-800">
                            {scheme.benefitFinancials}
                          </span>
                        </div>
                        <div className="text-right sm:text-right shrink-0 text-slate-600">
                          <span className="text-[10px] text-slate-400 block">Disbursement</span>
                          <span className="font-semibold text-slate-700">{scheme.frequency}</span>
                        </div>
                      </div>

                      {/* WHY IT MATCHED / SUMMARY */}
                      <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200 text-xs space-y-1">
                        <span className="font-bold text-navy-900 block">
                          Evaluation Summary:
                        </span>
                        <p className="text-slate-700 leading-relaxed">
                          {result.matchSummary}
                        </p>
                      </div>

                      {/* Conditions Breakdown */}
                      <div className="space-y-2 pt-1 text-xs">
                        
                        {/* Satisfied Conditions */}
                        {result.satisfiedConditions.length > 0 && (
                          <div className="space-y-1">
                            <span className="font-bold text-emerald-800 flex items-center gap-1 text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Conditions Satisfied ({result.satisfiedConditions.length}):</span>
                            </span>
                            <ul className="text-slate-600 space-y-0.5 pl-4 list-disc text-[11px]">
                              {result.satisfiedConditions.map((sc, i) => (
                                <li key={i}>
                                  <strong>{sc.condition.label}:</strong> {sc.condition.explanation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Conditions Needing Verification */}
                        {result.needsVerificationConditions.length > 0 && (
                          <div className="space-y-1 pt-1">
                            <span className="font-bold text-amber-800 flex items-center gap-1 text-[11px]">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              <span>Conditions Needing Verification ({result.needsVerificationConditions.length}):</span>
                            </span>
                            <ul className="text-amber-900 space-y-0.5 pl-4 list-disc text-[11px]">
                              {result.needsVerificationConditions.map((nc, i) => (
                                <li key={i}>
                                  <strong>{nc.condition.label}:</strong> {nc.explanation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Conditions Not Satisfied */}
                        {result.notSatisfiedConditions.length > 0 && (
                          <div className="space-y-1 pt-1">
                            <span className="font-bold text-slate-600 flex items-center gap-1 text-[11px]">
                              <XCircle className="w-3.5 h-3.5 text-slate-400" />
                              <span>Conditions Not Satisfied ({result.notSatisfiedConditions.length}):</span>
                            </span>
                            <ul className="text-slate-600 space-y-0.5 pl-4 list-disc text-[11px]">
                              {result.notSatisfiedConditions.map((fc, i) => (
                                <li key={i}>
                                  <strong>{fc.condition.label}:</strong> {fc.explanation}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      </div>

                      {/* Missing Profile Information Highlight */}
                      {result.missingProfileFields.length > 0 && (
                        <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                          <span className="font-bold block">
                            Missing Profile Information:
                          </span>
                          <p className="text-[11px] text-blue-800">
                            Updating your profile with{' '}
                            <strong>{result.missingProfileFields.map(f => f.label).join(', ')}</strong>{' '}
                            will help verify this scheme.
                          </p>
                        </div>
                      )}

                      {/* Clear Next Action */}
                      <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-xs space-y-0.5">
                        <span className="font-bold text-teal-900 block">
                          Recommended Next Action:
                        </span>
                        <p className="text-teal-950 font-medium leading-relaxed">
                          {result.clearNextAction}
                        </p>
                      </div>

                      {/* Official Sources & Documents To Prepare */}
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                            <FileText className="w-3 h-3 text-slate-400" />
                            <span>Prepare {scheme.requiredDocuments.length} Documents</span>
                          </span>
                          <span>•</span>
                          <span>{scheme.offlineCenter.split('(')[0].trim()}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <a
                            href={result.officialLinks.infoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-teal-700 hover:text-teal-900 font-bold"
                          >
                            <span>Official Source Info</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          {result.officialLinks.applyUrl && (
                            <a
                              href={result.officialLinks.applyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-navy-900 hover:text-navy-950 font-bold"
                            >
                              <span>Official Application Portal</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Authority Disclaimer */}
                      <p className="text-[10px] text-slate-400 italic">
                        {result.disclaimer}
                      </p>

                    </div>

                    {/* Right: Actions */}
                    <div className="lg:w-48 flex flex-row lg:flex-col items-center lg:items-stretch justify-between lg:justify-start gap-2 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                      
                      <button
                        onClick={() => navigate('details', scheme.id)}
                        className="flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold shadow-sm transition-all text-center"
                      >
                        <span>View Scheme Details</span>
                        <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                      </button>

                      <button
                        onClick={() => onToggleClaim(scheme.id)}
                        className={`flex-1 lg:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all text-center ${
                          isSaved
                            ? 'bg-teal-50 text-teal-800 border-teal-300 font-bold'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                        }`}
                      >
                        {isSaved ? (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5 text-teal-600" />
                            <span>Saved in Claims</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                            <span>Save to Claims</span>
                          </>
                        )}
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
