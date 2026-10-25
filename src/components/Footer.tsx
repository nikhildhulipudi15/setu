import React from 'react';
import { ShieldCheck, Lock, ExternalLink, Heart, Globe, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800/80">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">HaqSetu AI</span>
              <span className="text-xs bg-teal-900/60 text-teal-300 border border-teal-700/50 px-2 py-0.5 rounded font-mono">
                v1.0 Civic
              </span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              <strong className="text-white">Every eligible person deserves every benefit.</strong> Empowering students, small farmers, women, and low-income families across Andhra Pradesh with clear eligibility clarity, document readiness, and direct official action.
            </p>

            <div className="p-3.5 rounded-xl bg-navy-900/90 border border-navy-800 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2 text-teal-300 font-semibold">
                <Lock className="w-3.5 h-3.5" />
                <span>Zero Sensitive Data Storage</span>
              </div>
              <p>
                All eligibility assessments run entirely in your local browser. HaqSetu AI never asks for or stores Aadhaar numbers, biometric data, or bank login passwords.
              </p>
            </div>
          </div>

          {/* Quick Routes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Explore HaqSetu
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigate('home')} className="hover:text-teal-300 transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => navigate('profile')} className="hover:text-teal-300 transition-colors">
                  Guided Eligibility Profile
                </button>
              </li>
              <li>
                <button onClick={() => navigate('matched')} className="hover:text-teal-300 transition-colors">
                  Matched Welfare Schemes
                </button>
              </li>
              <li>
                <button onClick={() => navigate('claims')} className="hover:text-teal-300 transition-colors">
                  My Claims & Next Action
                </button>
              </li>
              <li>
                <button onClick={() => navigate('troubleshoot')} className="hover:text-teal-300 transition-colors text-amber-300">
                  AI Help & Troubleshooting
                </button>
              </li>
            </ul>
          </div>

          {/* Verified Official Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Verified Portals
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a 
                  href="https://jnanabhumi.ap.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-300 transition-colors"
                >
                  <span>Jnanabhumi (Vidya Deevena)</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://navasakam.ap.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-300 transition-colors"
                >
                  <span>AP Navasakam Welfare</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://aarogyasri.ap.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-300 transition-colors"
                >
                  <span>YSR Aarogyasri Trust</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://pmkisan.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-300 transition-colors"
                >
                  <span>PM-KISAN Samman Nidhi</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a 
                  href="https://scholarships.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 hover:text-teal-300 transition-colors"
                >
                  <span>National Scholarship (NSP)</span>
                  <ArrowUpRight className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Civic Centers & Help */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-4">
              Ground Support
            </h4>
            <div className="space-y-3 text-xs text-slate-400">
              <p>
                <strong className="text-slate-200 block text-sm">Grama / Ward Sachivalayam</strong>
                Visit your local Village or Ward Secretariat for physical biometric authentication and Social Audit lists.
              </p>
              <p>
                <strong className="text-slate-200 block text-sm">MeeSeva Centers</strong>
                For digitally signed Integrated Income, Caste, and Nativity certificates.
              </p>
              <div className="pt-1">
                <span className="text-[11px] text-amber-300 font-semibold">Grievance Escalation:</span>
                <div className="text-white font-bold text-sm">Dial 1902 (Spandana)</div>
              </div>
            </div>
          </div>

        </div>

        {/* Legal Disclaimer & Bottom Credits */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center md:text-left">
          <p className="max-w-2xl">
            <span className="text-slate-400 font-medium">Civic Disclaimer:</span> HaqSetu AI is an independent, non-governmental public assistance technology tool. Eligibility assessments are calculated deterministically against official department guidelines. Official approval and financial disbursements remain subject to verification by designated government authorities.
          </p>

          <div className="flex items-center gap-4 text-slate-400 shrink-0">
            <span>Andhra Pradesh • India</span>
            <span>•</span>
            <span className="text-teal-400 font-medium">Bilingual Support (EN / తె)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
