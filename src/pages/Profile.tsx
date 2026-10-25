import React, { useState } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  RotateCcw,
  AlertCircle,
  HelpCircle,
  Building,
  GraduationCap,
  Briefcase,
  IndianRupee,
  Layers,
  Heart
} from 'lucide-react';
import { 
  UserProfile, 
  State, 
  EducationLevel, 
  EmploymentStatus, 
  IncomeBand, 
  SocialCategory, 
  RationCardType 
} from '../types';
import { AP_DISTRICTS } from '../data/districts';
import { SAMPLE_PRESETS, DEFAULT_PROFILE } from '../utils/storage';

interface ProfileProps {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  onSaveAndFindMatches: () => void;
  eligibleCount: number;
}

export const Profile: React.FC<ProfileProps> = ({
  profile,
  setProfile,
  onSaveAndFindMatches,
  eligibleCount
}) => {
  const [savedNotification, setSavedNotification] = useState(false);

  const handleChange = <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => {
    setProfile({
      ...profile,
      [key]: value
    });
  };

  const handleApplyPreset = (index: number) => {
    const selected = SAMPLE_PRESETS[index].profile;
    setProfile({ ...selected });
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const handleReset = () => {
    setProfile({ ...DEFAULT_PROFILE });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAndFindMatches();
  };

  return (
    <div className="py-8 bg-[#fcfbf9] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-6 space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
            <UserCheck className="w-3.5 h-3.5 text-teal-600" />
            <span>Citizen Profile & Eligibility Criteria</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Personal & Household Profile
          </h1>
          <p className="text-sm text-slate-600">
            Provide basic criteria so our deterministic rule engine can accurately match your welfare schemes, scholarships, and fee reimbursements.
          </p>
        </div>

        {/* Privacy First Civic Banner */}
        <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 mb-6 flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-xs text-teal-950 space-y-1">
            <strong className="font-bold text-teal-900 block text-sm">
              Zero Sensitive Data Collection Guarantee
            </strong>
            <p className="text-teal-800 leading-relaxed">
              We <strong>never ask for your 12-digit Aadhaar number, PAN, OTP, or bank passwords</strong>. All criteria remain securely in your local browser storage. You can select "Unknown" for any questions you are unsure about.
            </p>
          </div>
        </div>

        {/* Quick Sample Presets */}
        <div className="mb-8 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>One-Click Test Profiles (Illustrative)</span>
            </span>
            <span className="text-[11px] text-slate-400">Click to autofill</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {SAMPLE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleApplyPreset(idx)}
                className="text-left p-3 rounded-xl border border-slate-200 hover:border-teal-500/70 hover:bg-teal-50/40 transition-all text-xs space-y-1 group"
              >
                <div className="font-bold text-navy-900 group-hover:text-teal-800">
                  {preset.name}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-2">
                  {preset.description}
                </div>
              </button>
            ))}
          </div>

          {savedNotification && (
            <div className="mt-3 text-xs text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Sample profile loaded! Check the updated fields below.</span>
            </div>
          )}
        </div>

        {/* Guided Profile Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Section 1: Location & Demographics */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Building className="w-5 h-5 text-teal-600" />
              <div>
                <h2 className="text-base font-bold text-navy-900">1. Location & Demographics</h2>
                <p className="text-xs text-slate-500">Determines state-specific AP welfare vs central schemes</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* State */}
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                  State of Residence *
                </label>
                <select
                  value={profile.state}
                  onChange={(e) => handleChange('state', e.target.value as State)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-navy-900"
                >
                  <option value="Andhra Pradesh">Andhra Pradesh (ఆంధ్రప్రదేశ్)</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Other">Other State</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  AP residents unlock Jagananna Vidya Deevena, Cheyutha & Rythu Bharosa.
                </p>
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                  District (Andhra Pradesh) *
                </label>
                <select
                  value={profile.district}
                  required={profile.state === 'Andhra Pradesh'}
                  onChange={(e) => handleChange('district', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-navy-900"
                  disabled={profile.state !== 'Andhra Pradesh'}
                >
                  <option value="" disabled>Select your district</option>
                  {AP_DISTRICTS.map((dist) => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  All 26 reorganized AP districts supported.
                </p>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                  Age of Applicant (Years)
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={profile.age ?? ''}
                  onChange={(e) => handleChange('age', e.target.value ? parseInt(e.target.value, 10) : null)}
                  placeholder="e.g. 20 (or leave empty)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Critical for Cheyutha (45-60 yrs) & Vishwakarma (18+ yrs).
                </p>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                  Gender
                </label>
                <select
                  value={profile.gender}
                  onChange={(e) => handleChange('gender', e.target.value as UserProfile['gender'])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-navy-900"
                >
                  <option value="Female">Female (మహిళ)</option>
                  <option value="Male">Male (పురుషుడు)</option>
                  <option value="Transgender">Transgender</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Enables women-targeted schemes like Cheyutha, Sunna Vaddi, and Amma Vodi.
                </p>
              </div>

            </div>
          </div>

          {/* Section 2: Education & Occupation */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <GraduationCap className="w-5 h-5 text-teal-600" />
              <div>
                <h2 className="text-base font-bold text-navy-900">2. Education & Occupation Status</h2>
                <p className="text-xs text-slate-500">Matches scholarships, fee reimbursements, or livelihood support</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Education Level */}
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                  Current / Highest Education Level *
                </label>
                <select
                  value={profile.education}
                  onChange={(e) => handleChange('education', e.target.value as EducationLevel)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-navy-900"
                >
                  <option value="Below 10th">Below 10th (Class 1 to 9)</option>
                  <option value="10th Class (SSC)">10th Class (SSC Passed)</option>
                  <option value="Intermediate (11th-12th)">Intermediate (11th - 12th)</option>
                  <option value="ITI / Polytechnic Diploma">ITI / Polytechnic Diploma</option>
                  <option value="Undergraduate (BA, B.Sc, B.Com, B.Tech, MBBS)">Undergraduate (Degree, B.Tech, MBBS, etc.)</option>
                  <option value="Postgraduate / Professional">Postgraduate / Professional (MCA, MBA, M.Tech, etc.)</option>
                  <option value="None">No Formal Schooling</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Select your current enrolled course if you are a student.
                </p>
              </div>

              {/* Employment Status */}
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                  Employment / Student Status *
                </label>
                <select
                  value={profile.employmentStatus}
                  onChange={(e) => handleChange('employmentStatus', e.target.value as EmploymentStatus)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-navy-900"
                >
                  <option value="Prefer not to say">Prefer not to say</option>
                  <option value="Regular Student">Regular Student (విద్యార్థి)</option>
                  <option value="Small / Marginal Farmer">Small / Marginal Farmer (సన్నకారు రైతు)</option>
                  <option value="Tenant Farmer">Tenant Farmer (కౌలు రైతు)</option>
                  <option value="Artisan / Craftsman / Handloom">Artisan / Craftsman / Weaver / Handloom</option>
                  <option value="Daily Wage / Rural Worker">Daily Wage / Agricultural Worker</option>
                  <option value="Self-Employed / Street Vendor">Self-Employed / Street Vendor</option>
                  <option value="Unemployed / Job Seeker">Unemployed / Job Seeker</option>
                  <option value="Homemaker">Homemaker (గృహిణి)</option>
                  <option value="Private Sector Employee">Private Sector Employee</option>
                  <option value="Government / Pensioner">Government Employee / Pensioner</option>
                </select>
              </div>

            </div>
          </div>

          {/* Section 3: Household Financials & Landholding */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <IndianRupee className="w-5 h-5 text-teal-600" />
              <div>
                <h2 className="text-base font-bold text-navy-900">3. Household Financials & Landholding</h2>
                <p className="text-xs text-slate-500">Government schemes enforce ceiling limits on annual income & land</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Income Band */}
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                  Annual Household Income Band *
                </label>
                <select
                  value={profile.incomeBand}
                  onChange={(e) => handleChange('incomeBand', e.target.value as IncomeBand)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-navy-900"
                >
                  <option value="Below ₹1,00,000 / year">Below ₹1,00,000 / year (BPL / Low Income)</option>
                  <option value="₹1,00,000 - ₹2,50,000 / year">₹1,00,000 - ₹2,50,000 / year (Qualifies for Fee Reimbursement)</option>
                  <option value="₹2,50,000 - ₹5,00,000 / year">₹2,50,000 - ₹5,00,000 / year (Qualifies for Aarogyasri)</option>
                  <option value="Above ₹5,00,000 / year">Above ₹5,00,000 / year</option>
                  <option value="Unknown / Not sure">Unknown / Not sure</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Vidya Deevena threshold is ₹2.5L; Aarogyasri threshold is ₹5.0L.
                </p>
              </div>

              {/* Ration Card Type */}
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                  Ration Card / Rice Card Status *
                </label>
                <select
                  value={profile.rationCard}
                  onChange={(e) => handleChange('rationCard', e.target.value as RationCardType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-navy-900"
                >
                  <option value="White Card (Rice Card / BPL)">White Card (Rice Card / BPL) — బియ్యం కార్డు</option>
                  <option value="Pink Card">Pink Card (Non-BPL)</option>
                  <option value="None">No Ration Card</option>
                  <option value="Applied / Not sure">Applied / Not sure</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  An active White Rice Card serves as automatic income proof in AP.
                </p>
              </div>

              {/* Land Ownership */}
              <div className="sm:col-span-2 p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-navy-900">
                      Does your family own agricultural land?
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Checked against Webland records (ceiling is 10 acres wet or 25 acres dry).
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={profile.ownsAgriculturalLand}
                      onChange={(e) => handleChange('ownsAgriculturalLand', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>

                {profile.ownsAgriculturalLand && (
                  <div className="pt-2 border-t border-slate-200 flex items-center gap-3">
                    <label className="text-xs text-slate-700 font-medium">
                      Total Extent in Acres:
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.5"
                      value={profile.landHoldingAcres ?? ''}
                      onChange={(e) => handleChange('landHoldingAcres', e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="e.g. 2.5"
                      className="w-28 px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-teal-500"
                    />
                    <span className="text-xs text-slate-500">Acres (Total family khata)</span>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Section 4: Social & Priority Criteria */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Layers className="w-5 h-5 text-teal-600" />
              <div>
                <h2 className="text-base font-bold text-navy-900">4. Social Category & Special Indicators</h2>
                <p className="text-xs text-slate-500">Unlocks targeted affirmative action, women schemes, and tribal patta aid</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Social Category */}
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                  Social / Community Category *
                </label>
                <select
                  value={profile.socialCategory}
                  onChange={(e) => handleChange('socialCategory', e.target.value as SocialCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-navy-900"
                >
                  <option value="General (OC)">General (OC / Open Competition)</option>
                  <option value="OBC / BC (Backward Classes)">OBC / BC (Backward Classes A, B, C, D, E)</option>
                  <option value="SC (Scheduled Caste)">SC (Scheduled Caste)</option>
                  <option value="ST (Scheduled Tribe)">ST (Scheduled Tribe)</option>
                  <option value="Minority (Muslim, Christian, etc.)">Minority (Muslim, Christian, Sikh, Buddhist, Jain)</option>
                  <option value="EWS (Economically Weaker Section)">EWS (Economically Weaker Section)</option>
                  <option value="Prefer not to disclose">Prefer not to disclose</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Required for SC/ST/BC Post-Matric & YSR Cheyutha.
                </p>
              </div>

              {/* Bank Aadhaar Link */}
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                  Bank Account NPCI Seeding
                </label>
                <select
                  value={profile.hasBankAadhaarLinked ? 'yes' : 'no'}
                  onChange={(e) => handleChange('hasBankAadhaarLinked', e.target.value === 'yes')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none bg-white text-navy-900"
                >
                  <option value="yes">Yes - Bank account linked to Aadhaar with NPCI mapper</option>
                  <option value="no">No / Not sure / Need guidance to link</option>
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Essential for all Direct Benefit Transfer (DBT) scheme payouts.
                </p>
              </div>

              {/* Toggles */}
              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                
                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.isRural}
                    onChange={(e) => handleChange('isRural', e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 border-slate-300"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-navy-900 block">Rural Resident</span>
                    <span className="text-[11px] text-slate-500">Village panchayat area</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.isSingleMotherOrWidow}
                    onChange={(e) => handleChange('isSingleMotherOrWidow', e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 border-slate-300"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-navy-900 block">Single Mother / Widow</span>
                    <span className="text-[11px] text-slate-500">Priority welfare category</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.hasDisability}
                    onChange={(e) => handleChange('hasDisability', e.target.checked)}
                    className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500 border-slate-300"
                  />
                  <div className="text-xs">
                    <span className="font-bold text-navy-900 block">Person with Disability</span>
                    <span className="text-[11px] text-slate-500">SADAREM certificate holder</span>
                  </div>
                </label>

              </div>

            </div>
          </div>

          {/* Action Footer & Live Match Indicator */}
          <div className="sticky bottom-4 z-30 p-4 rounded-2xl bg-navy-950 text-white shadow-2xl border border-navy-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center font-extrabold text-lg">
                {eligibleCount}
              </div>
              <div>
                <div className="text-sm font-bold text-white">
                  {eligibleCount > 0 
                    ? `${eligibleCount} Potential Matches Unlocked` 
                    : 'Complete criteria to unlock potential matches'}
                </div>
                <div className="text-xs text-slate-400">
                  Evaluated deterministically against official department rules.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-navy-800 border border-navy-800 transition-colors flex items-center gap-1.5"
                title="Reset form to defaults"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="submit"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Save & Find Matched Schemes</span>
                <ArrowRight className="w-4 h-4 text-navy-950" />
              </button>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
