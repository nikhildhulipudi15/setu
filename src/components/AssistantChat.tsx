import React, { FormEvent, useEffect, useRef, useState } from 'react';
import { MessageCircle, Mic, MicOff, Send, Sparkles, Volume2, X } from 'lucide-react';
import { SchemeEvaluationResult } from '../types';

interface SpeechRecognitionResultLike {
  readonly 0: { transcript: string; confidence?: number };
}

interface SpeechRecognitionEventLike {
  readonly results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

interface AssistantChatProps {
  matchResults: SchemeEvaluationResult[];
  navigate: (route: string, param?: string) => void;
}

interface ChatMessage {
  role: 'assistant' | 'user';
  text: string;
}

const quickQuestions = {
  'en-IN': ['Which schemes may I qualify for?', 'What documents should I prepare?', 'My payment is delayed'],
  'te-IN': ['నాకు ఏ పథకాలు సరిపోవచ్చు?', 'ఏ పత్రాలు సిద్ధం చేయాలి?', 'నా చెల్లింపు ఆలస్యం అవుతోంది'],
};

function detectReplyLanguage(text: string, fallback: string): string {
  if (/[\u0C00-\u0C7F]/.test(text)) return 'te-IN';
  if (/[A-Za-z]/.test(text)) return 'en-IN';
  return fallback;
}

function normalizeQuestion(value: string): string {
  return value.normalize('NFC').toLocaleLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

function findRequestedScheme(question: string, results: SchemeEvaluationResult[]): SchemeEvaluationResult | undefined {
  const normalized = normalizeQuestion(question);
  const tokens = new Set(normalized.split(/\s+/).filter(Boolean));
  const stopWords = new Set(['scheme', 'schemes', 'yojana', 'benefit', 'benefits', 'about', 'tell', 'me', 'what', 'how', 'for', 'the', 'and', 'is', 'eligibility', 'పథకం', 'పథకాలు', 'నాకు', 'ఏ']);

  const scored = results.map((result) => {
    const aliases = [result.scheme.name, result.scheme.code, result.scheme.teluguName, result.scheme.title, result.scheme.teluguTitle]
      .filter((alias): alias is string => Boolean(alias))
      .map(normalizeQuestion)
      .filter(Boolean);
    let score = 0;
    for (const alias of aliases) {
      if (normalized.includes(alias)) score = Math.max(score, 100 + alias.length);
      const distinctiveTokens = alias.split(/\s+/).filter((token) => token.length > 2 && !stopWords.has(token));
      const overlap = distinctiveTokens.filter((token) => tokens.has(token)).length;
      if (overlap) score = Math.max(score, overlap * 10 + (overlap === distinctiveTokens.length ? 15 : 0));
    }
    return { result, score };
  }).filter((item) => item.score > 0).sort((a, b) => b.score - a.score);

  if (!scored.length) return undefined;
  if (scored.length > 1 && scored[0].score === scored[1].score) return undefined;
  return scored[0].score >= 10 ? scored[0].result : undefined;
}

function schemeFreshness(scheme: SchemeEvaluationResult['scheme'], inTelugu: boolean): string {
  if (scheme.dataStatus === 'illustrative_demo') {
    return inTelugu
      ? 'ఇది ఉదాహరణ కోసం చూపిన డెమో సమాచారం మాత్రమే; అధికారిక పథక వివరంగా పరిగణించవద్దు.'
      : 'This is illustrative demo information, not an official scheme record.';
  }
  return inTelugu
    ? `హక్‌సేతు రికార్డు చివరిగా ధృవీకరించిన తేదీ ${scheme.lastVerifiedDate}. తాజా వివరాలను అధికారిక శాఖ వద్ద నిర్ధారించండి.`
    : `HaqSetu last verified this record on ${scheme.lastVerifiedDate}. Confirm current details with the official department.`;
}

function answerQuestion(question: string, results: SchemeEvaluationResult[], language: string, priorScheme?: SchemeEvaluationResult): string {
  const text = normalizeQuestion(question);
  const inTelugu = language === 'te-IN';
  const matches = results.filter((result) => result.outcome === 'POTENTIAL MATCH' && result.scheme.dataStatus === 'verified');
  const requestedScheme = findRequestedScheme(question, results) || priorScheme;
  const docsIntent = /document|certificate|paper|requirement|needed|papers|upload|పత్ర|సర్టిఫిక|అవసరం|కావాలి/.test(text);
  const benefitIntent = /benefit|amount|money|how much|cover|covers|provide|provides|ప్రయోజనం|ఎంత|లాభం|సాయం|సౌకర్యం/.test(text);
  const applicationIntent = /apply|application|how to|where|next step|దరఖాస్తు|ఎలా|ఎక్కడ/.test(text);
  const eligibilityIntent = /eligible|eligibility|qualif|match|అర్హత|సరిపోత/.test(text);

  if (/hello|hi\b|హాయ్|నమస్కార/.test(text)) {
    return inTelugu
      ? 'నమస్కారం! పథకం అర్హత, పత్రాలు, ప్రయోజనం లేదా దరఖాస్తు దశల గురించి అడగండి. పథకం పేరు చెబితే మరింత నిర్దిష్టంగా సమాధానం ఇస్తాను.'
      : 'Hello! Ask about eligibility, documents, benefits, or application steps. Include the scheme name for a more specific answer.';
  }

  if (/delay|payment|money|dbt|పేమెంట్|డబ్బు|చెల్లింపు/.test(text)) return requestedScheme
    ? (inTelugu
      ? `${requestedScheme.scheme.name} చెల్లింపు ఆలస్యమైతే ముందుగా అధికారిక పోర్టల్‌లో దరఖాస్తు స్థితి, బ్యాంక్ DBT/NPCI లింకింగ్ తనిఖీ చేయండి. ${requestedScheme.scheme.helpline}ను రిఫరెన్స్ నంబర్‌తో సంప్రదించండి. రహస్య సంఖ్యలను చాట్‌లో పంపవద్దు.`
      : `For a delayed ${requestedScheme.scheme.name} payment, check the official portal status and DBT/NPCI bank linking first. Contact ${requestedScheme.scheme.helpline} with your reference number. Don’t share confidential numbers in chat.`)
    : (inTelugu
      ? 'ముందుగా అధికారిక పోర్టల్‌లో దరఖాస్తు స్థితి, బ్యాంక్ DBT/NPCI లింకింగ్ తనిఖీ చేయండి. రిఫరెన్స్ నంబర్‌తో సంబంధిత పథకం హెల్ప్‌డెస్క్‌ను సంప్రదించండి; అవసరమైతే AP Spandana 1902కు ఫిర్యాదు చేయండి. మీ బ్యాంక్ లేదా ప్రభుత్వ రహస్య సంఖ్యలను చాట్‌లో పంపవద్దు.'
      : 'First check the application status on the official portal and confirm DBT/NPCI bank linking with your bank. Contact the scheme helpdesk with your reference number; if needed, raise a grievance with AP Spandana at 1902. Don’t share bank or government ID numbers in chat.');

  if (/reject|rejection|blocked|error|problem|trouble|సమస్య|తిరస్కర/.test(text)) return requestedScheme
    ? (inTelugu
      ? `${requestedScheme.scheme.name} దరఖాస్తులో సమస్యైతే కనిపిస్తున్న సందేశాన్ని (వ్యక్తిగత సంఖ్యలు తొలగించి) చెప్పండి. సాధారణంగా తనిఖీ చేయడానికి: ${requestedScheme.scheme.helpline}.`
      : `For a problem with ${requestedScheme.scheme.name}, tell me the exact message shown (remove personal numbers). The recorded helpline is ${requestedScheme.scheme.helpline}.`)
    : (inTelugu
      ? 'ఏ పథకం దరఖాస్తులో సమస్య వచ్చిందో, కనిపిస్తున్న సందేశం ఏమిటో (వ్యక్తిగత సంఖ్యలు తొలగించి) చెప్పండి. అప్పుడు సరైన తనిఖీ దశలు సూచిస్తాను. దశలవారీ సాధారణ మార్గదర్శకానికి Troubleshoot పేజీ చూడండి.'
      : 'Tell me which scheme application has the problem and the exact message shown (remove personal numbers). I can then suggest relevant checks. You can also open Troubleshoot for general step-by-step guidance.');

  if (requestedScheme) {
    const { scheme } = requestedScheme;
    const freshness = schemeFreshness(scheme, inTelugu);
    if (docsIntent) {
      const docs = scheme.requiredDocuments;
      if (!docs.length) return inTelugu
        ? `${scheme.name} కోసం పత్రాల జాబితా ఈ రికార్డులో లేదు. అధికారిక సమాచారం: ${scheme.officialInfoUrl}`
        : `The HaqSetu record has no document list for ${scheme.name}. Official information: ${scheme.officialInfoUrl}`;
      const docList = docs.map((doc) => {
        const name = inTelugu && doc.teluguName ? `${doc.teluguName} (${doc.name})` : doc.name;
        const status = inTelugu ? (doc.isMandatory ? 'తప్పనిసరి' : 'పథకం ఆధారంగా') : (doc.isMandatory ? 'mandatory' : 'conditional');
        const alternative = doc.alternativeAllowed ? (inTelugu ? `; ప్రత్యామ్నాయం: ${doc.alternativeAllowed}` : `; alternative: ${doc.alternativeAllowed}`) : '';
        return `${name} (${status}; ${inTelugu ? 'పొందే స్థలం' : 'get it from'}: ${doc.whereToGet}${alternative})`;
      }).join('; ');
      return inTelugu
        ? `${scheme.name} రికార్డులో ఉన్న పత్రాలు: ${docList}. ${freshness} అధికారిక సమాచారం: ${scheme.officialInfoUrl}`
        : `The HaqSetu record lists these documents for ${scheme.name}: ${docList}. ${freshness} Official information: ${scheme.officialInfoUrl}`;
    }
    if (benefitIntent) return inTelugu
      ? `${scheme.name} రికార్డులో చూపిన ప్రయోజనం: ${scheme.benefitFinancials}. ${freshness} అధికారిక సమాచారం: ${scheme.officialInfoUrl}`
      : `The HaqSetu record lists this benefit for ${scheme.name}: ${scheme.benefitFinancials}. ${freshness} Official information: ${scheme.officialInfoUrl}`;
    if (applicationIntent) {
      const steps = scheme.applicationSteps.map((step) => {
        const title = inTelugu && step.teluguTitle ? step.teluguTitle : step.title;
        return `${step.stepNumber}. ${title}${step.locationOrUrl ? ` (${step.locationOrUrl})` : ''}`;
      }).join('; ');
      const stepText = steps || scheme.defaultNextAction;
      return inTelugu
        ? `${scheme.name} రికార్డులోని దరఖాస్తు దశలు: ${stepText}. ${freshness} అధికారిక సమాచారం: ${scheme.applicationUrl || scheme.officialInfoUrl}`
        : `The HaqSetu record lists these application steps for ${scheme.name}: ${stepText}. ${freshness} Official information: ${scheme.applicationUrl || scheme.officialInfoUrl}`;
    }
    if (eligibilityIntent) {
      const missing = requestedScheme.missingProfileFields.map((field) => field.label).join(', ');
      const resultText = requestedScheme.outcome === 'POTENTIAL MATCH'
        ? (inTelugu ? 'మీరు ప్రాథమిక అర్హత ప్రమాణాలను సరిపోల్చారు' : 'your profile meets the recorded criteria for a potential match')
        : requestedScheme.outcome === 'NEEDS VERIFICATION'
          ? (inTelugu ? `ఇంకా సమాచారం లేదా అధికారిక ధృవీకరణ అవసరం${missing ? `: ${missing}` : ''}` : `more information or official verification is needed${missing ? `: ${missing}` : ''}`)
          : (inTelugu ? 'ప్రస్తుత ప్రొఫైల్‌లో తప్పనిసరి ప్రమాణం సరిపోలలేదు' : 'a mandatory recorded criterion does not match your current profile');
      return inTelugu
        ? `${scheme.name} విషయంలో ${resultText}. ఇది HaqSetu ప్రొఫైల్ ఆధారిత ప్రాథమిక ఫలితం మాత్రమే; తుది అర్హతను శాఖ నిర్ధారిస్తుంది. ${freshness} అధికారిక సమాచారం: ${scheme.officialInfoUrl}`
        : `For ${scheme.name}, ${resultText}. This is a preliminary result from the HaqSetu profile; the department makes the final determination. ${freshness} Official information: ${scheme.officialInfoUrl}`;
    }
    return inTelugu
      ? `${scheme.teluguName || scheme.name} గురించి ఏ సమాచారం కావాలి—అర్హత, పత్రాలు, ప్రయోజనం లేదా దరఖాస్తు దశలు? హక్‌సేతు రికార్డులో చూపిన ప్రయోజనం: ${scheme.benefitFinancials}. ${freshness} అధికారిక సమాచారం: ${scheme.officialInfoUrl}`
      : `${scheme.name}: ${scheme.description} Recorded benefit: ${scheme.benefitFinancials}. ${freshness} Official information: ${scheme.officialInfoUrl}`;
  }

  if (docsIntent) return inTelugu
    ? 'ఏ పథకానికి సంబంధించిన పత్రాలు కావాలో దాని పేరు చెప్పండి. పథకం పేరు లేకుండా తప్పు పత్రాల జాబితా ఇవ్వకుండా ఉండేందుకు మరింత సమాచారం అడుగుతున్నాను.'
    : 'Which scheme do you mean? Tell me its name so I don’t give you a document list for the wrong program.';

  if (applicationIntent) return inTelugu
    ? 'ఏ పథకం కోసం దరఖాస్తు చేయాలనుకుంటున్నారు? దాని పేరు చెబితే ఈ రికార్డులో ఉన్న దశలు, అధికారిక లింక్ చూపిస్తాను.'
    : 'Which scheme are you applying for? Tell me its name and I can give the recorded steps and official link.';

  const topic = [
    { pattern: /farmer|agriculture|crop|rythu|రైతు|వ్యవసాయ/, category: 'Farmer & Agriculture', label: inTelugu ? 'రైతు సంక్షేమ' : 'farmer support' },
    { pattern: /student|school|college|scholarship|education|విద్యార్థి|చదువు|స్కాలర్/, category: 'Education & Scholarships', label: inTelugu ? 'విద్యార్థి, విద్య' : 'student and education' },
    { pattern: /woman|women|mother|widow|మహిళ|తల్లి|వితంతు/, category: 'Women & Child Welfare', label: inTelugu ? 'మహిళలు, పిల్లల సంక్షేమ' : 'women and child welfare' },
    { pattern: /health|medical|hospital|treatment|ఆరోగ్య|వైద్య|చికిత్స/, category: 'Healthcare & Insurance', label: inTelugu ? 'ఆరోగ్య' : 'healthcare' },
    { pattern: /artisan|weaver|craft|vishwakarma|చేనేత|కళాకార|వృత్తి/, category: 'Livelihood & Artisans', label: inTelugu ? 'చేతివృత్తులు, జీవనోపాధి' : 'artisan and livelihood' },
  ].find((item) => item.pattern.test(text));
  if (topic && /scheme|benefit|support|help|పథక|సాయం|సంక్షేమ|లాభ/.test(text)) {
    const related = results.filter((result) => result.scheme.beneficiaryCategory === topic.category).slice(0, 4);
    if (related.length) {
      const summaries = related.map(({ scheme }) => {
        const demoLabel = scheme.dataStatus === 'illustrative_demo' ? (inTelugu ? ' (డెమో ఉదాహరణ)' : ' (illustrative demo)') : '';
        return `${inTelugu ? (scheme.teluguName || scheme.name) : scheme.name}: ${scheme.benefitFinancials}${demoLabel}`;
      }).join('; ');
      return inTelugu
        ? `${topic.label}కు సంబంధించిన HaqSetu రికార్డులు: ${summaries}. ఇవి సాధారణ సమాచారం మాత్రమే; వ్యక్తిగత అర్హతను మీ ప్రొఫైల్‌తో తనిఖీ చేయండి.`
        : `HaqSetu records related to ${topic.label}: ${summaries}. This is general information; check personal eligibility against your profile.`;
    }
  }

  if (eligibilityIntent) {
    if (matches.length) return inTelugu
      ? `మీరు ఇచ్చిన ప్రొఫైల్ ఆధారంగా ఈ పథకాలు ప్రాథమికంగా సరిపోవచ్చు: ${matches.slice(0, 4).map((result) => result.scheme.name).join(', ')}. ఇది ప్రభుత్వ ఆమోదం కాదు; తుది అర్హతను శాఖ ధృవీకరిస్తుంది.`
      : `Based on the profile you entered, these schemes are potential matches: ${matches.slice(0, 4).map((result) => result.scheme.name).join(', ')}. This is not government approval; the department verifies final eligibility.`;
    const missing = [...new Set(results.flatMap((result) => result.missingProfileFields.map((field) => field.label)))].slice(0, 5);
    if (missing.length) return inTelugu
      ? `అర్హతను అంచనా వేయడానికి ఈ ప్రొఫైల్ వివరాలు అవసరం: ${missing.join(', ')}. వివరాలు నింపిన తర్వాత మళ్లీ అడగండి.`
      : `I need more profile information before estimating eligibility: ${missing.join(', ')}. Fill in those details and ask again.`;
    return inTelugu
      ? 'ప్రస్తుత ప్రొఫైల్‌తో సరిపోలిన పథకం కనిపించలేదు. మీ వివరాలు, పథకం అర్హత నిబంధనలను తనిఖీ చేయండి; సందేహముంటే సంబంధిత అధికారిక శాఖను సంప్రదించండి.'
      : 'No potential match was found for the current profile. Review your profile and the scheme criteria, or confirm with the responsible department.';
  }

  return inTelugu
    ? 'మీ ప్రశ్నకు ఖచ్చితంగా సమాధానం ఇవ్వడానికి పథకం పేరు మరియు మీ ప్రశ్నను కొంచెం వివరంగా చెప్పండి. ఈ సహాయకుడు HaqSetu రికార్డుల నుంచే సమాచారం ఇస్తాడు; రికార్డులో లేనిదాన్ని ఊహించి చెప్పడు.'
    : 'Please include the scheme name and a little more detail so I can answer accurately. I use HaqSetu’s scheme records and won’t guess when the record lacks the answer.';
}

export const AssistantChat: React.FC<AssistantChatProps> = ({ matchResults, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [voiceMode, setVoiceMode] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState('en-IN');
  const [voiceNotice, setVoiceNotice] = useState('');
  const [contextSchemeId, setContextSchemeId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Hi! I’m the HaqSetu guide. Ask about scheme matches, documents, application steps, or a delayed payment. నమస్కారం!' },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const voiceModeRef = useRef(false);

  useEffect(() => {
    voiceModeRef.current = voiceMode;
  }, [voiceMode]);

  useEffect(() => {
    if (messages.length === 1) {
      setMessages([{ role: 'assistant', text: voiceLanguage === 'te-IN'
        ? 'నమస్కారం! పథకాలు, పత్రాలు, దరఖాస్తు దశలు లేదా చెల్లింపుల గురించి తెలుగులో అడగండి.'
        : 'Hi! I’m the HaqSetu guide. Ask about scheme matches, documents, application steps, or a delayed payment.' }]);
    }
  }, [voiceLanguage]);

  useEffect(() => () => {
    recognitionRef.current?.abort();
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, isOpen]);

  const sendMessage = (value: string, detectedLanguage?: string) => {
    const question = value.trim();
    if (!question) return;
    const responseLanguage = detectedLanguage || detectReplyLanguage(question, voiceLanguage);
    const explicitScheme = findRequestedScheme(question, matchResults);
    const normalizedQuestion = normalizeQuestion(question);
    const asksForSchemeList = /\b(which|what|all|list of) schemes?\b|matched schemes|ఏ పథకాలు|పథకాల జాబితా/.test(normalizedQuestion);
    const isSchemeFollowUp = Boolean(contextSchemeId) && (
      /\b(it|its|that|this)\b|దాని|దానికి|అది|ఆ పథకం/.test(normalizedQuestion)
      || (!asksForSchemeList && normalizedQuestion.length <= 55 && /document|certificate|paper|benefit|amount|money|how much|apply|application|eligibility|eligible|cover|provides|పత్ర|సర్టిఫిక|ప్రయోజనం|ఎంత|దరఖాస్తు|అర్హత/.test(normalizedQuestion))
    );
    const priorScheme = isSchemeFollowUp
      ? matchResults.find((result) => result.scheme.id === contextSchemeId)
      : undefined;
    const schemeContext = explicitScheme || priorScheme;
    setVoiceLanguage(responseLanguage);
    const response = answerQuestion(question, matchResults, responseLanguage, priorScheme);
    setContextSchemeId(schemeContext?.scheme.id || null);
    setMessages((current) => [
      ...current,
      { role: 'user', text: question },
      { role: 'assistant', text: response },
    ]);
    setDraft('');
    if (voiceModeRef.current && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(response);
      utterance.lang = responseLanguage;
      window.speechSynthesis.speak(utterance);
      setVoiceNotice('Reply spoken. Tap the microphone to ask another question.');
    }
  };

  const toggleVoiceChat = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setVoiceMode(false);
      setVoiceNotice('Voice chat paused. Tap the microphone to start again.');
      return;
    }

    const SpeechRecognition = (window as SpeechWindow).SpeechRecognition
      || (window as SpeechWindow).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceNotice('Voice input is not supported in this browser. You can still type your question.');
      setVoiceMode(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = voiceLanguage;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event) => {
        const alternative = event.results[0]?.[0];
        const transcript = alternative?.transcript?.trim();
        if (transcript && typeof alternative?.confidence === 'number' && alternative.confidence < 0.55) {
          setDraft(transcript);
          setVoiceNotice(voiceLanguage === 'te-IN'
            ? 'మీ మాటలు స్పష్టంగా వినిపించలేదు. పంపే ముందు వాక్యాన్ని సరిచూడండి.'
            : 'I may have misheard that. Review the transcript before sending it.');
        } else if (transcript) sendMessage(transcript, detectReplyLanguage(transcript, voiceLanguage));
        else setVoiceNotice('I didn’t catch that. Tap the microphone and try again.');
      };
      recognition.onerror = (event) => {
        const message = event.error === 'not-allowed'
          ? 'Microphone access is blocked. Allow microphone access for this page in your browser settings.'
          : event.error === 'no-speech'
            ? 'I didn’t hear anything. Tap the microphone and try again.'
            : 'Voice input stopped. You can try again or type your question.';
        setVoiceNotice(message);
        setIsListening(false);
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
      setVoiceMode(true);
      setVoiceNotice('Listening… Speak your question.');
      recognition.start();
      setIsListening(true);
    } catch {
      setVoiceMode(false);
      setIsListening(false);
      setVoiceNotice('Could not start the microphone. Check browser microphone access and try again.');
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(draft);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {isOpen && (
        <section className="flex h-[min(560px,calc(100vh-120px))] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-navy-950/20" aria-label="HaqSetu AI chat">
          <div className="flex items-center justify-between bg-navy-950 px-4 py-3.5 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 text-navy-950"><Sparkles className="h-5 w-5" /></div>
              <div>
                <h2 className="text-sm font-bold">HaqSetu Assistant</h2>
                <p className="text-xs text-teal-200">Scheme and application guide</p>
              </div>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close chat" className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3 py-4" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <p className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${message.role === 'user' ? 'rounded-br-md bg-teal-700 text-white' : 'rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm'}`}>
                  {message.text}
                </p>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {quickQuestions[voiceLanguage as keyof typeof quickQuestions].map((question) => (
                  <button key={question} type="button" onClick={() => sendMessage(question)} className="rounded-full border border-teal-200 bg-white px-3 py-1.5 text-left text-xs font-medium text-teal-800 transition hover:bg-teal-50">{question}</button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-slate-200 bg-white p-3">
            <div className="mb-2 flex gap-2">
              <button type="button" onClick={() => navigate('matched')} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">{voiceLanguage === 'te-IN' ? 'సరిపోలిన పథకాలు' : 'View matched schemes'}</button>
              <button type="button" onClick={() => navigate('troubleshoot')} className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200">{voiceLanguage === 'te-IN' ? 'సమస్య పరిష్కారం' : 'Troubleshoot'}</button>
            </div>
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <label className="sr-only" htmlFor="haqsetu-chat-input">Ask HaqSetu Assistant</label>
              <input id="haqsetu-chat-input" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={voiceLanguage === 'te-IN' ? 'మీ ప్రశ్న అడగండి...' : 'Ask a question...'} className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100" />
              <button type="button" onClick={toggleVoiceChat} aria-label={isListening ? 'Stop listening' : 'Start voice chat'} title={isListening ? 'Stop listening' : 'Start voice chat'} className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition focus:outline-none focus:ring-4 focus:ring-teal-100 ${isListening ? 'animate-pulse bg-rose-600 text-white' : 'bg-teal-50 text-teal-800 hover:bg-teal-100'}`}>
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <button type="submit" disabled={!draft.trim()} aria-label="Send message" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-40"><Send className="h-4 w-4" /></button>
            </form>
            <div className="mt-2 flex items-center justify-between gap-2">
              <label className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <Volume2 className="h-3.5 w-3.5" /> Chat language
                <select value={voiceLanguage} disabled={isListening} onChange={(event) => setVoiceLanguage(event.target.value)} className="rounded border border-slate-200 bg-white px-1 py-0.5 text-[11px] text-slate-700 disabled:opacity-60">
                  <option value="en-IN">English</option>
                  <option value="te-IN">తెలుగు</option>
                </select>
              </label>
              <span className="text-[10px] text-slate-400">{voiceMode ? 'Voice replies on' : 'Text chat'}</span>
            </div>
            {voiceNotice && <p role="status" className="mt-1.5 text-[11px] text-teal-800">{voiceNotice}</p>}
            <p className="mt-2 text-center text-[10px] text-slate-500">Guidance only. Confirm eligibility with the official department.</p>
          </div>
        </section>
      )}
      <button type="button" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? 'Close HaqSetu chat' : 'Open HaqSetu chat'} aria-expanded={isOpen} className="group flex items-center gap-2 rounded-full bg-teal-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/25 transition hover:-translate-y-0.5 hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-200">
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span>{isOpen ? 'Close chat' : 'Ask HaqSetu'}</span>
      </button>
    </div>
  );
};
