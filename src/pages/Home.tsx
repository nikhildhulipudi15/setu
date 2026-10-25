import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  GraduationCap, 
  HeartHandshake, 
  Wheat, 
  HeartPulse, 
  Hammer, 
  CheckCircle2, 
  FileCheck2, 
  Lock, 
  HelpCircle,
  Sparkles,
  Users,
  Search,
  ExternalLink,
  PhoneCall
} from 'lucide-react';
import { Scheme } from '../types';

interface HomeProps {
  navigate: (route: string, param?: string) => void;
  schemes: Scheme[];
  onSelectPreset: (presetIndex: number) => void;
}

export const Home: React.FC<HomeProps> = ({ navigate, schemes, onSelectPreset }) => {
  const categories = [
    {
      title: 'Higher Education & Fees',
      telugu: 'ఉన్నత విద్య & ఫీజు రీయింబర్స్మెంట్',
      icon: GraduationCap,
      description: '100% tuition reimbursement and maintenance allowances for ITI, Polytechnic, Degree, and Engineering students.',
      schemesCount: '3 Schemes',
      highlight: 'Jagananna Vidya Deevena & NSP'
    },
    {
      title: 'Farmers & Agriculture',
      telugu: 'రైతు సంక్షేమం & ఇన్పుట్ సబ్సిడీ',
      icon: Wheat,
      description: 'Annual cash input assistance for small, marginal, and tenant farmers with e-crop biometric booking.',
      schemesCount: '2 Schemes',
      highlight: 'YSR Rythu Bharosa / PM-KISAN'
    },
    {
      title: 'Cashless Healthcare',
      telugu: 'ఉచిత నగదు రహిత చికిత్స',
      icon: HeartPulse,
      description: 'Universal medical and surgical coverage up to ₹25 Lakhs per family across 3,200+ procedures.',
      schemesCount: 'Universal',
      highlight: 'Dr. YSR Aarogyasri Trust'
    },
    {
      title: 'Women Empowerment',
      telugu: 'మహిళా సాధికారత & సహాయం',
      icon: HeartHandshake,
      description: 'Direct financial assistance for middle-aged women, zero interest loans for SHGs, and schooling aid for mothers.',
      schemesCount: '3 Schemes',
      highlight: 'YSR Cheyutha & Sunna Vaddi'
    },
    {
      title: 'Traditional Artisans',
      telugu: 'చేతివృత్తుల వారి అభివృద్ధి',
      icon: Hammer,
      description: '₹15,000 modern toolkit vouchers, skill training stipends, and collateral-free enterprise credit at 5% interest.',
      schemesCount: '18 Trades',
      highlight: 'PM Vishwakarma Yojana'
    }
  ];

  return (
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <section className="relative bg-navy-950 text-white overflow-hidden pt-12 pb-20 border-b border-navy-800">
        {/* Subtle decorative civic pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-900 border border-teal-500/30 text-teal-300 text-xs font-semibold tracking-wide shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Civic Entitlement Intelligence for Andhra Pradesh & India</span>
            </div>

            {/* Main Tagline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Every eligible person deserves <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-200 to-amber-200">every benefit.</span>
            </h1>

            {/* Clear Explanation */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              Navigating government scholarships, medical coverage, and welfare schemes should not require middlemen, bribes, or days wasted at government offices. HaqSetu AI instantly identifies your exact entitlements, prepares your document checklist, and guides your next step.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate('profile')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-base shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Start Eligibility Check</span>
                <ArrowRight className="w-5 h-5 text-navy-950" />
              </button>

              <button
                onClick={() => navigate('matched')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-200 font-semibold text-sm border border-navy-700 transition-all"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span>Explore All 10 Schemes</span>
              </button>
            </div>

            {/* Quick Demo Pre-fills */}
            <div className="pt-6 border-t border-navy-800/80">
              <p className="text-xs text-slate-400 mb-3 font-medium">
                Want to test immediately? Select an illustrative AP citizen profile:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => {
                    onSelectPreset(0);
                    navigate('matched');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-navy-900/90 hover:bg-navy-800 text-xs text-slate-200 border border-navy-700 hover:border-teal-500/50 transition-colors flex items-center gap-1.5"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
                  <span>College Student (B.Tech, Vizag)</span>
                </button>

                <button
                  onClick={() => {
                    onSelectPreset(1);
                    navigate('matched');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-navy-900/90 hover:bg-navy-800 text-xs text-slate-200 border border-navy-700 hover:border-teal-500/50 transition-colors flex items-center gap-1.5"
                >
                  <Wheat className="w-3.5 h-3.5 text-amber-400" />
                  <span>Small Farmer (Guntur, 3 Acres)</span>
                </button>

                <button
                  onClick={() => {
                    onSelectPreset(2);
                    navigate('matched');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-navy-900/90 hover:bg-navy-800 text-xs text-slate-200 border border-navy-700 hover:border-teal-500/50 transition-colors flex items-center gap-1.5"
                >
                  <Hammer className="w-3.5 h-3.5 text-teal-300" />
                  <span>Artisan / Weaver (Prakasam)</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Civic Guarantees Ribbon */}
        <div className="max-w-6xl mx-auto px-4 mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-navy-900/80 border border-navy-800 text-center">
            <div className="p-2">
              <div className="text-xl sm:text-2xl font-black text-white">100%</div>
              <div className="text-xs text-teal-300 font-medium">Free & Civic-Tech</div>
              <div className="text-[11px] text-slate-400">Zero intermediary charges</div>
            </div>
            <div className="p-2">
              <div className="text-xl sm:text-2xl font-black text-white">Zero</div>
              <div className="text-xs text-teal-300 font-medium">Sensitive Data Kept</div>
              <div className="text-[11px] text-slate-400">No Aadhaar or OTP asked</div>
            </div>
            <div className="p-2">
              <div className="text-xl sm:text-2xl font-black text-white">10+ Verified</div>
              <div className="text-xs text-teal-300 font-medium">AP & Central Schemes</div>
              <div className="text-[11px] text-slate-400">Higher education, health, agriculture</div>
            </div>
            <div className="p-2">
              <div className="text-xl sm:text-2xl font-black text-white">Bilingual</div>
              <div className="text-xs text-teal-300 font-medium">తెలుగు & English</div>
              <div className="text-[11px] text-slate-400">Accessible for every citizen</div>
            </div>
          </div>
        </div>
      </section>

      {/* How HaqSetu Works (4 Clean Steps) */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2">
              Transparent 4-Step Process
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              How HaqSetu AI Guides You to Entitlements
            </h3>
            <p className="text-slate-600 text-sm mt-2">
              Designed specifically for citizens, students, and rural families with no complex jargon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-teal-400 flex items-center justify-center font-bold text-base shadow-sm">
                1
              </div>
              <h4 className="font-bold text-navy-900 text-base">Share Simple Criteria</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Enter only essential facts: district, education level, student or work status, and approximate income band. Unknowns are allowed.
              </p>
              <div className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded inline-block">
                No Aadhaar or Bank passwords
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-teal-400 flex items-center justify-center font-bold text-base shadow-sm">
                2
              </div>
              <h4 className="font-bold text-navy-900 text-base">Deterministic Matching</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our rule engine checks your profile against official government eligibility rules and shows high matches, potential matches, and why.
              </p>
              <div className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded inline-block">
                Transparent qualifying reasons
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-teal-400 flex items-center justify-center font-bold text-base shadow-sm">
                3
              </div>
              <h4 className="font-bold text-navy-900 text-base">Document Readiness</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                See the exact certificates required (Caste, Income, Rice Card), where to get them (MeeSeva vs Sachivalayam), and acceptable alternatives.
              </p>
              <div className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded inline-block">
                Interactive document checklist
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative space-y-3">
              <div className="w-10 h-10 rounded-xl bg-navy-900 text-teal-400 flex items-center justify-center font-bold text-base shadow-sm">
                4
              </div>
              <h4 className="font-bold text-navy-900 text-base">Decisive Next Action</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Save to your personal claims tracker. Get clear directions on the exact portal step or local Grama / Ward Sachivalayam counter to visit.
              </p>
              <div className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2 py-1 rounded inline-block">
                Track until approval & payout
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Welfare Domains Overview */}
      <section className="py-16 bg-[#fcfbf9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-1">
                Curated Entitlement Domains
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                Key Support Areas for Andhra Pradesh Citizens
              </h3>
            </div>
            <button
              onClick={() => navigate('matched')}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-700 hover:text-teal-800 self-start md:self-auto"
            >
              <span>View all available schemes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <div 
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-500/40 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-navy-900 group-hover:text-teal-300 transition-colors">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-700">
                        {cat.schemesCount}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-navy-900">{cat.title}</h4>
                      <p className="text-xs text-amber-700 font-medium font-['Noto_Sans_Telugu'] mt-0.5">
                        {cat.telugu}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium truncate max-w-[190px]">
                      Key: {cat.highlight}
                    </span>
                    <button
                      onClick={() => navigate('matched')}
                      className="font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
                    >
                      <span>Check</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust, Data Integrity & Redressal Pledge */}
      <section className="py-16 bg-navy-900 text-white border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-900/60 text-teal-300 border border-teal-700/50 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                <span>Our Civic Trust Pledge</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                Built to protect citizens from extortion, middlemen, and misinformation.
              </h3>

              <div className="space-y-3.5 text-slate-300 text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Zero Sensitive Credentials</strong>
                    We never ask for your 12-digit Aadhaar number, PAN, OTP, or net banking password. Only general eligibility parameters are evaluated.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">No Fabricated Rules or Phantom Grants</strong>
                    Every scheme, eligibility limit, and benefit calculation is mapped directly to actual Government Orders (G.O.) and verified department guidelines.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-medium">Bilingual Citizen Support (English & Telugu)</strong>
                    Troubleshoot rejected applications, missing biometric authentication, and delayed CFMS bill credits with official escalation numbers.
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigate('troubleshoot')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-teal-300 border border-teal-500/30 text-xs font-bold transition-colors"
                >
                  <HelpCircle className="w-4 h-4 text-teal-400" />
                  <span>Explore AI Troubleshooting & Rejection Guide</span>
                </button>
              </div>
            </div>

            {/* Helpline Card */}
            <div className="p-8 rounded-3xl bg-navy-950 border border-navy-800 space-y-6 shadow-xl">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Citizen Escalation Directory
                </span>
                <h4 className="text-xl font-bold text-white mt-1">
                  Facing an unfair rejection or payment delay?
                </h4>
                <p className="text-xs text-slate-400 mt-2">
                  Under the AP Right to Public Services, all grievances must be acknowledged with an official docket ticket.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">AP State Grievance Redressal</div>
                    <div className="text-sm font-bold text-white">Spandana Toll-Free</div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-teal-400">1902</span>
                    <div className="text-[10px] text-slate-500">24x7 Assistance</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Free Healthcare Admissions</div>
                    <div className="text-sm font-bold text-white">Aarogyasri Emergency Desk</div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-teal-400">104</span>
                    <div className="text-[10px] text-slate-500">Network Hospitals</div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-navy-900 border border-navy-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Biometric & eKYC Support</div>
                    <div className="text-sm font-bold text-white">UIDAI Helpline</div>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-extrabold text-teal-400">1947</span>
                    <div className="text-[10px] text-slate-500">Toll-Free</div>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  onClick={() => navigate('profile')}
                  className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-sm transition-all"
                >
                  Start Your Eligibility Check Now →
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
