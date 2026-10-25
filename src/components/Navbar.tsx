import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  BookmarkCheck, 
  HelpCircle, 
  Menu, 
  X, 
  PhoneCall, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string, param?: string) => void;
  claimCount: number;
  matchedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentRoute, 
  navigate, 
  claimCount,
  matchedCount 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [helplineModalOpen, setHelplineModalOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', telugu: 'హోమ్', icon: null },
    { id: 'profile', label: 'My Profile', telugu: 'నా ప్రొఫైల్', icon: UserCheck, badge: null },
    { 
      id: 'matched', 
      label: 'Matched Schemes', 
      telugu: 'అర్హతగల పథకాలు', 
      icon: FileText, 
      badge: matchedCount > 0 ? `${matchedCount}` : null 
    },
    { 
      id: 'claims', 
      label: 'My Claims', 
      telugu: 'నా దరఖాస్తులు', 
      icon: BookmarkCheck, 
      badge: claimCount > 0 ? `${claimCount}` : null 
    },
    { 
      id: 'troubleshoot', 
      label: 'AI Help & Troubleshoot', 
      telugu: 'సహాయం & సమస్యలు', 
      icon: HelpCircle, 
      badge: 'Bilingual' 
    },
  ];

  const handleNavClick = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Civic Trust Ribbon */}
      <div className="bg-navy-950 text-slate-300 text-xs py-1.5 px-4 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-900/80 text-teal-300 border border-teal-700/60">
              Civic-Tech Platform
            </span>
            <span>Andhra Pradesh & Central Government Entitlement Discovery</span>
            <span className="hidden md:inline text-slate-500">•</span>
            <span className="hidden md:inline text-slate-400">Zero sensitive data stored (No Aadhaar/Bank credentials asked)</span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setHelplineModalOpen(true)}
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-medium transition-colors"
              title="Official Citizen Helplines"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>AP Spandana: 1902</span>
            </button>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400 font-medium">తెలుగు / English</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Brand Logo */}
            <div 
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-navy-900 via-navy-800 to-teal-800 flex items-center justify-center text-white shadow-md shadow-navy-900/10 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg sm:text-xl text-navy-900 tracking-tight">HaqSetu</span>
                  <span className="text-xs font-bold uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200 px-1.5 py-0.5 rounded">
                    AI
                  </span>
                  <span className="text-xs text-amber-700 font-medium hidden sm:inline ml-1 font-['Noto_Sans_Telugu']">
                    హక్ సేతు
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium tracking-tight">
                  Every eligible person deserves every benefit
                </p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1.5">
              {navItems.map((item) => {
                const isActive = currentRoute === item.id;
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`relative whitespace-nowrap px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      isActive 
                        ? 'bg-navy-900 text-white shadow-sm' 
                        : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100/80'
                    }`}
                  >
                    {IconComponent && (
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    )}
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={`inline-flex min-w-5 justify-center text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                        isActive 
                          ? 'bg-teal-500 text-navy-950' 
                          : 'bg-teal-100 text-teal-800 border border-teal-200'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Desktop Action Button */}
            <div className="hidden xl:flex items-center gap-3">
              <button
                onClick={() => handleNavClick('profile')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm shadow-teal-600/20 transition-all hover:translate-y-[-1px]"
              >
                <span>Check Eligibility</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex xl:hidden items-center gap-2">
              <button
                onClick={() => handleNavClick('profile')}
                className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold"
              >
                Check
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg">
            {navItems.map((item) => {
              const isActive = currentRoute === item.id;
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
                    isActive 
                      ? 'bg-navy-900 text-white' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {IconComponent && (
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-teal-400' : 'text-slate-400'}`} />
                    )}
                    <div className="text-left">
                      <div>{item.label}</div>
                      <div className="text-[11px] opacity-75 font-['Noto_Sans_Telugu']">{item.telugu}</div>
                    </div>
                  </div>
                  {item.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      isActive ? 'bg-teal-400 text-navy-950' : 'bg-teal-100 text-teal-800'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
            
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setHelplineModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 px-3 text-xs font-medium text-amber-800 bg-amber-50 rounded-lg flex items-center justify-center gap-2 border border-amber-200"
              >
                <PhoneCall className="w-4 h-4 text-amber-600" />
                <span>View Official Helplines (Spandana 1902)</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Official Helplines Modal */}
      {helplineModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-navy-900 text-base">Official Citizen Helplines</h3>
                  <p className="text-xs text-slate-500">Government of Andhra Pradesh & Central Portals</p>
                </div>
              </div>
              <button 
                onClick={() => setHelplineModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-navy-900 text-sm">AP Spandana Grievance Redressal</div>
                  <div className="text-xs text-slate-500">Any state scheme rejection, delay, or volunteer complaint</div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200">1902</span>
                  <div className="text-[10px] text-slate-500 mt-0.5">Toll-Free (24x7)</div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-navy-900 text-sm">Dr. YSR Aarogyasri Trust</div>
                  <div className="text-xs text-slate-500">Cashless hospital admissions & medical grievance</div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200">104 / 1800-425-1818</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-navy-900 text-sm">Jnanabhumi Scholarship Helpdesk</div>
                  <div className="text-xs text-slate-500">Vidya & Vasathi Deevena biometric and bill queries</div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200">0866-2489830</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-navy-900 text-sm">Rythu Bharosa / PM-KISAN Helpline</div>
                  <div className="text-xs text-slate-500">e-Crop booking and farmer DBT credits</div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200">155251 / 1800-425-1661</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-navy-900 text-sm">National Scholarship Portal (NSP)</div>
                  <div className="text-xs text-slate-500">Central post-matric scholarships & OTR</div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-extrabold text-teal-700 bg-teal-50 px-2 py-1 rounded border border-teal-200">0120-6619540</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Always ask for a grievance reference ticket number.</span>
              <button 
                onClick={() => setHelplineModalOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-navy-900 text-white font-medium hover:bg-navy-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
