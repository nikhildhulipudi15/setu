import React, { useState } from 'react';
import { 
  HelpCircle, 
  Send, 
  Sparkles, 
  Globe, 
  AlertTriangle, 
  FileText, 
  Fingerprint, 
  CreditCard, 
  PhoneCall, 
  ArrowRight, 
  ExternalLink, 
  Clock, 
  Building,
  CheckCircle2,
  RotateCcw,
  Bot,
  User,
  AlertOctagon,
  MessageSquare
} from 'lucide-react';
import { TROUBLESHOOT_ISSUES } from '../data/troubleshooting';
import { TroubleshootIssue } from '../types';
import { BenefitBlockerDetector } from '../components/BenefitBlockerDetector';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  teluguText?: string;
  actionLinks?: { label: string; url?: string; actionId?: string }[];
}

export const Troubleshoot: React.FC = () => {
  const [lang, setLang] = useState<'en' | 'te'>('en');
  const [activeTab, setActiveTab] = useState<'detector' | 'assistant'>('detector');
  const [selectedIssueId, setSelectedIssueId] = useState<string>('rejected-application');
  const [customQuestion, setCustomQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: "Namaste! I am your HaqSetu Civic AI Assistant. I can help you resolve government scheme rejections, missing MeeSeva certificates, biometric authentication failures, or delayed DBT payments in Andhra Pradesh and Central welfare programs. How can I assist you today?",
      teluguText: "నమస్తే! నేను మీ హక్ సేతు సివిక్ AI సహాయకుడిని. ఆంధ్రప్రదేశ్ మరియు కేంద్ర ప్రభుత్వ సంక్షేమ పథకాలలో దరఖాస్తు తిరస్కరణలు, మీసేవ సర్టిఫికెట్ల సమస్యలు, బయోమెట్రిక్ వేలిముద్ర సమస్యలు, లేదా బ్యాంకులో పథకం డబ్బులు పడకపోవడం వంటి సమస్యలను పరిష్కరించడంలో సహాయపడతాను. మీకు ఏ సహాయం కావాలి?",
      actionLinks: [
        { label: "My application was rejected", actionId: "rejected-application" },
        { label: "Biometric thumb impression failed", actionId: "verification-failures" },
        { label: "Money not received in bank account", actionId: "delayed-payment" },
        { label: "Need new Rice Card / Income Certificate", actionId: "missing-documents" },
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const activeIssue = TROUBLESHOOT_ISSUES.find(i => i.id === selectedIssueId) || TROUBLESHOOT_ISSUES[0];

  const handleSelectScenario = (issueId: string) => {
    setSelectedIssueId(issueId);
    setActiveTab('assistant');
    const issue = TROUBLESHOOT_ISSUES.find(i => i.id === issueId);
    if (!issue) return;

    const userQuery = lang === 'en' ? issue.title : issue.teluguTitle;
    const aiResponse = lang === 'en'
      ? `Here is the verified action plan for "${issue.title}":\n\n${issue.shortSummary}\n\nKey Steps:\n` +
        issue.actionSteps.map(s => `${s.order}. ${s.title}: ${s.detail}`).join('\n\n') +
        `\n\nOfficial Escalation: ${issue.escalationChannel} (Expected resolution: ${issue.timelineDays}).`
      : `"${issue.teluguTitle}" సమస్య పరిష్కారానికి అధికారిక విధానం:\n\n${issue.teluguShortSummary}\n\nప్రధాన దశలు:\n` +
        issue.actionSteps.map(s => `${s.order}. ${s.title}: ${s.detail}`).join('\n\n') +
        `\n\nఫిర్యాదు మార్గం: ${issue.teluguEscalation} (పరిష్కార గడువు: ${issue.timelineDays}).`;

    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: userQuery },
      { sender: 'assistant', text: aiResponse }
    ]);
  };

  const handleAskCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    const query = customQuestion.trim();
    setCustomQuestion('');
    
    setChatMessages(prev => [...prev, { sender: 'user', text: query }]);
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (q.includes('reject') || q.includes('ineligible') || q.includes('రైస్ కార్డు రాలేదు') || q.includes('తిరస్కరణ')) {
        reply = lang === 'en'
          ? "Navasakam rejections are issued with a specific 'Six-Step Reason' (e.g. electricity >300 units, car ownership, or land holding). You should visit your Village/Ward Sachivalayam and ask the Welfare Assistant (WEA) for the rejection slip. You can submit rectification documents during the biannual verification window or call Spandana at 1902 to file an official appeal."
          : "నవశకం పోర్టల్ ద్వారా దరఖాస్తు తిరస్కరణకు కారణాన్ని (ఉదా: విద్యుత్ బిల్లు, వాహనం, భూమి రికార్డు) సచివాలయ వెల్ఫేర్ అసిస్టెంట్ (WEA) వద్ద 'Six-Step Rejection Notice' ద్వారా తెలుసుకోవచ్చు. తగిన ఆధారాలతో స్పందన పోర్టల్ లేదా 1902 టోల్ ఫ్రీ నంబరుకు కాల్ చేసి అప్పీల్ దాఖలు చేయవచ్చు.";
      } else if (q.includes('biometric') || q.includes('finger') || q.includes('thumb') || q.includes('వేలిముద్ర') || q.includes('ఐరిస్')) {
        reply = lang === 'en'
          ? "If your thumb biometric is failing on the volunteer device: 1) Every Grama/Ward Sachivalayam is equipped with an Iris (eye) scanner—ask the staff to switch to Iris scan. 2) You can also complete e-KYC using facial authentication via the UIDAI AadhaarFaceRD mobile app. 3) For long-term fix, visit a Post Office Aadhaar Center to refresh fingerprint biometrics."
          : "సచివాలయం లేదా వాలంటీర్ డివైస్‌లో వేలిముద్రలు పడకపోతే: 1) సచివాలయంలో ఉన్న ఐరిస్ (కంటిపాప) స్కానర్ ద్వారా ప్రామాణీకరణ చేయాలని కోరండి. 2) ఆధార్ ఫేస్ ఆర్డీ (AadhaarFaceRD) యాప్ ద్వారా ఫేషియల్ రికగ్నిషన్ తో e-KYC పూర్తి చేయవచ్చు. 3) శాశ్వత పరిష్కారంగా పోస్టాఫీస్ ఆధార్ కేంద్రంలో వేలిముద్రలను రీ-క్యాప్చర్ చేయించుకోండి.";
      } else if (q.includes('money') || q.includes('payment') || q.includes('dbt') || q.includes('డబ్బులు') || q.includes('ఖాతా') || q.includes('npci')) {
        reply = lang === 'en'
          ? "Government welfare funds are sent via Aadhaar Payment Bridge (APB) to the NPCI-mapped account. 1) Check your active mapped bank account on myaadhaar.uidai.gov.in -> Bank Seeding Status. 2) If it shows inactive, submit the NPCI Mandate Form at your bank branch. 3) Ask your Sachivalayam WEA to check the CFMS Bill Token Number to ensure UTR was not rejected."
          : "ప్రభుత్వ నిధులు ఆధార్ ఆధారిత NPCI మ్యాపింగ్ ద్వారా మాత్రమే జమవుతాయి. 1) myaadhaar.uidai.gov.in లో 'Bank Seeding Status' ద్వారా ఏ బ్యాంకులో మ్యాప్ అయిందో పరిశీలించండి. 2) బ్యాంకు శాఖకు వెళ్లి ఆధార్ NPCI డీబీటీ మ్యాండేట్ ఫారమ్ సమర్పించండి. 3) సచివాలయంలో CFMS బిల్లు నంబరు పరిశీలించి పేమెంట్ స్టేటస్ తెలుసుకోండి.";
      } else if (q.includes('income') || q.includes('caste') || q.includes('meeseva') || q.includes('కుల') || q.includes('ఆదాయ')) {
        reply = lang === 'en'
          ? "You can apply for an Integrated Certificate (Caste, Nativity, DoB) and Income Certificate through any MeeSeva counter or meeseva.ap.gov.in. In Andhra Pradesh, having an active White Rice Card automatically functions as income proof up to ₹2.5 Lakhs for scholarships and welfare schemes."
          : "ఆదాయం మరియు కుల ధ్రువీకరణ పత్రాల కోసం మీసేవ కేంద్రం లేదా meeseva.ap.gov.in ద్వారా దరఖాస్తు చేసుకోవచ్చు. ఏపీలో తెల్ల రేషన్ కార్డు (రైస్ కార్డు) ఉంటే అదే ₹2.5 లక్షల లోపు ఆదాయ ధ్రువీకరణగా అనేక పథకాలకు చెల్లుబాటు అవుతుంది.";
      } else {
        reply = lang === 'en'
          ? `For questions regarding "${query}": Welfare eligibility in Andhra Pradesh is governed by Village/Ward Sachivalayam records and the Navasakam survey. We recommend verifying with your Sachivalayam Welfare & Education Assistant (WEA) or calling the AP Spandana citizen helpline at 1902 with your Rice Card or grievance reference.`
          : `మీ ప్రశ్న "${query}" కు సంబంధించి: ఆంధ్రప్రదేశ్‌లో సంక్షేమ పథకాల పరిశీలన గ్రామ/వార్డు సచివాలయం మరియు నవశకం సర్వే ద్వారా జరుగుతుంది. మీ స్థానిక సచివాలయ వెల్ఫేర్ అసిస్టెంట్ (WEA)ను సంప్రదించవచ్చు లేదా స్పందన టోల్ ఫ్రీ 1902 కు కాల్ చేసి ఖచ్చితమైన వివరాలు పొందవచ్చు.`;
      }

      setChatMessages(prev => [...prev, { sender: 'assistant', text: reply }]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <div className="py-8 bg-[#fcfbf9] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header with Bilingual Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>AI Civic Triage & Blocker Resolution Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              {lang === 'en' ? 'AI Help & Benefit Blocker Detector' : 'AI సహాయం & సమస్యల పరిష్కారం'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {lang === 'en' 
                ? 'Actionable step-by-step guidance for rejected applications, missing certificates, biometric failures, portal bugs, and delayed payments.'
                : 'దరఖాస్తు తిరస్కరణలు, సర్టిఫికెట్ల కొరత, బయోమెట్రిక్ సమస్యలు మరియు చెల్లింపుల ఆలస్యానికి పూర్తి పరిష్కార మార్గదర్శకత్వం.'}
            </p>
          </div>

          {/* Language & Workspace Toggle */}
          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300 shadow-xs">
              <Globe className="w-4 h-4 text-slate-400 ml-2 mr-1" />
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  lang === 'en' 
                    ? 'bg-navy-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLang('te')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold font-['Noto_Sans_Telugu'] transition-all ${
                  lang === 'te' 
                    ? 'bg-navy-900 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-navy-900'
                }`}
              >
                తెలుగు (Telugu)
              </button>
            </div>
          </div>
        </div>

        {/* Feature Workspace Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setActiveTab('detector')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'detector'
                ? 'bg-rose-50 text-rose-800 border border-rose-300 shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <span>Benefit Blocker Diagnostic Detector (5 Guided Flows)</span>
          </button>

          <button
            onClick={() => setActiveTab('assistant')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
              activeTab === 'assistant'
                ? 'bg-navy-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-teal-400" />
            <span>Interactive Civic AI Chat</span>
          </button>
        </div>

        {/* Tab 1: Benefit Blocker Detector */}
        {activeTab === 'detector' && (
          <BenefitBlockerDetector />
        )}

        {/* Tab 2: Interactive AI Assistant */}
        {activeTab === 'assistant' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Interactive AI Chat Column */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col h-[580px]">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-600 text-white flex items-center justify-center">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-900 text-sm">HaqSetu Civic AI</h3>
                      <p className="text-[10px] text-teal-700 font-semibold">Grounded in AP & Central G.O.s</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setChatMessages([chatMessages[0]])}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                    title="Clear conversation"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>

                {/* Message Transcript */}
                <div className="flex-1 overflow-y-auto py-4 space-y-3.5 text-xs">
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2.5 ${
                        msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        msg.sender === 'user' 
                          ? 'bg-navy-900 text-white' 
                          : 'bg-teal-50 text-teal-700 border border-teal-200'
                      }`}>
                        {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                      </div>

                      <div className={`p-3.5 rounded-2xl max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-navy-900 text-white rounded-tr-none'
                          : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none'
                      }`}>
                        {lang === 'te' && msg.teluguText ? msg.teluguText : msg.text}

                        {/* Action Chips */}
                        {msg.actionLinks && (
                          <div className="mt-3 pt-2 border-t border-slate-200/60 flex flex-wrap gap-1.5">
                            {msg.actionLinks.map((link, i) => (
                              <button
                                key={i}
                                onClick={() => link.actionId && handleSelectScenario(link.actionId)}
                                className="px-2.5 py-1 rounded-lg bg-white border border-teal-300 text-teal-800 text-[11px] font-semibold hover:bg-teal-50 transition-colors"
                              >
                                {link.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs pl-2">
                      <Bot className="w-4 h-4 animate-spin text-teal-600" />
                      <span>Analyzing government regulations...</span>
                    </div>
                  )}
                </div>

                {/* Prompt Input */}
                <form onSubmit={handleAskCustom} className="pt-3 border-t border-slate-100">
                  <div className="relative">
                    <input
                      type="text"
                      value={customQuestion}
                      onChange={(e) => setCustomQuestion(e.target.value)}
                      placeholder={
                        lang === 'en'
                          ? 'Ask any question (e.g., electricity bill >300, iris scan)...'
                          : 'ఏదైనా ప్రశ్న అడగండి (ఉదా: కరెంట్ బిల్లు, ఆధార్, వేలిముద్ర)...'
                      }
                      className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!customQuestion.trim()}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-40 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>

              </div>
            </div>

            {/* Detailed Official Resolution Blueprint Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                
                {/* Header */}
                <div className="space-y-1.5 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                      Official AP Procedure
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Timeline: {activeIssue.timelineDays}</span>
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-extrabold text-navy-900">
                    {lang === 'en' ? activeIssue.title : activeIssue.teluguTitle}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {lang === 'en' ? activeIssue.shortSummary : activeIssue.teluguShortSummary}
                  </p>
                </div>

                {/* Common Root Causes */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {lang === 'en' ? 'Most Common Root Causes in Andhra Pradesh' : 'ఆంధ్రప్రదేశ్‌లో సాధారణ కారణాలు'}
                  </h3>
                  <div className="space-y-1.5">
                    {activeIssue.rootCauses.map((cause, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5"></span>
                        <span>{cause}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Steps */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {lang === 'en' ? 'Step-by-Step Resolution Steps' : 'దశలవారీ పరిష్కార విధానం'}
                  </h3>

                  <div className="space-y-3">
                    {activeIssue.actionSteps.map((step) => (
                      <div
                        key={step.order}
                        className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3.5"
                      >
                        <div className="w-6 h-6 rounded-lg bg-navy-900 text-teal-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                          {step.order}
                        </div>

                        <div className="space-y-1 text-xs flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-navy-900">{step.title}</h4>
                            <span className="text-[10px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                              {step.portalOrOffice}
                            </span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">
                            {step.detail}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Escalation & Helpline Box */}
                <div className="p-5 rounded-2xl bg-teal-50 border border-teal-200 space-y-3">
                  <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
                    <PhoneCall className="w-4 h-4 text-teal-700" />
                    <span>
                      {lang === 'en' ? 'Official Grievance Escalation' : 'అధికారిక ఫిర్యాదు మార్గం'}
                    </span>
                  </div>

                  <p className="text-xs text-teal-950 leading-relaxed">
                    {lang === 'en' ? activeIssue.escalationChannel : activeIssue.teluguEscalation}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-teal-200/80 text-xs">
                    <div>
                      <span className="text-teal-800 font-medium">Designated Helpline: </span>
                      <strong className="text-teal-950 font-bold">{activeIssue.relevantHelpline}</strong>
                    </div>

                    <a
                      href="https://spandana.ap.gov.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-teal-800 hover:text-teal-950"
                    >
                      <span>Open AP Spandana Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
