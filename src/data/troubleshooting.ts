import { TroubleshootIssue } from '../types';

export const TROUBLESHOOT_ISSUES: TroubleshootIssue[] = [
  {
    id: 'rejected-application',
    category: 'rejected',
    title: 'Rejected or Ineligible Status in Navasakam / Jnanabhumi',
    teluguTitle: 'దరఖాస్తు తిరస్కరణ లేదా అనర్హతగా చూపించడం',
    shortSummary: 'How to discover the exact rejection reason, file an appeal, and submit for re-verification at Grama / Ward Sachivalayam.',
    teluguShortSummary: 'తిరస్కరణ గల అసలు కారణాన్ని తెలుసుకోవడం, రీ-వెరిఫికేషన్ కోసం దరఖాస్తు చేసుకోవడం మరియు స్పందన పోర్టల్‌లో అప్పీల్ చేయడం.',
    rootCauses: [
      'Four-wheeler ownership flagged in Transport database (Vahan) incorrectly linked to family Aadhaar.',
      'Household electricity consumption exceeding monthly ceiling (>300 units/month).',
      'Old or duplicate family member entry listed under government employee / pensioner database.',
      'Land extent showing >10 acres due to unpartitioned ancestor ancestral land (joint Webland khata).',
      'Municipal property tax assessment showing house area >1,000 sq ft in urban limits.'
    ],
    actionSteps: [
      {
        order: 1,
        title: 'Check Specific Ineligibility Reason on Navasakam Portal',
        detail: 'Visit navasakam.ap.gov.in or your Sachivalayam. Request the "Six-Step Rejection Notice" from the Welfare & Education Assistant (WEA) which details the exact data discrepancy.',
        portalOrOffice: 'navasakam.ap.gov.in / Village Sachivalayam'
      },
      {
        order: 2,
        title: 'Collect Proof of Rectification',
        detail: 'If electricity bill is wrong, produce last 6 months APCPDCL/APEPDCL/APSPDCL meter readings. If car ownership is false, obtain Non-Possession RTA Certificate. If joint land is issue, provide Tahsildar family partition deed (ROR 1B).',
        portalOrOffice: 'Local MeeSeva / Revenue Office'
      },
      {
        order: 3,
        title: 'Submit Grievance during Biannual Re-verification Window',
        detail: 'The Government opens biannual verification cycles (June and December). Submit your grievance physically to the WEA or online on Spandana.ap.gov.in.',
        portalOrOffice: 'Grama / Ward Sachivalayam Counter'
      },
      {
        order: 4,
        title: 'Track Appeal Status using 1902 Spandana Ticket',
        detail: 'Obtain an official 14-digit Spandana grievance registration receipt. Grievances must be resolved within 14 working days by the MPDO or Municipal Commissioner.',
        portalOrOffice: 'Spandana Call Center: Dial 1902'
      }
    ],
    escalationChannel: 'Dial 1902 (Spandana Toll Free) or visit Monday Grievance Day at District Collectorate.',
    teluguEscalation: 'టోల్ ఫ్రీ 1902 డయల్ చేయండి లేదా ప్రతి సోమవారం కలెక్టరేట్ లేదా ఎంపీడీవో కార్యాలయంలో స్పందనలో ఫిర్యాదు ఇవ్వండి.',
    timelineDays: '14 to 21 working days',
    relevantHelpline: '1902 / 0866-2489830'
  },
  {
    id: 'missing-documents',
    category: 'documents',
    title: 'Missing, Expired, or Unavailable Certificates (Income / Caste / Rice Card)',
    teluguTitle: 'ఆదాయ, కుల ధ్రువీకరణ లేదా రైస్ కార్డు లేకపోవడం',
    shortSummary: 'Step-by-step guidance on obtaining instant digital certificates via MeeSeva and adding members to Rice Card.',
    teluguShortSummary: 'మీసేవ ద్వారా డిజిటల్ ఆదాయ మరియు కుల సర్టిఫికెట్లను ఎలా పొందాలి, మరియు రైస్ కార్డులో పేర్లు ఎలా చేర్చాలి.',
    rootCauses: [
      'Income Certificate expired (most revenue certificates in AP are valid for 1 year).',
      'Name mismatch between Aadhaar and Secondary School (10th/SSC) Certificate.',
      'Newly married or split family not having a separate Rice Card (White Ration Card).',
      'Old manual caste certificate lacks digital MeeSeva 16-digit application number barcode.'
    ],
    actionSteps: [
      {
        order: 1,
        title: 'Apply for Digital Integrated Certificate at MeeSeva',
        detail: 'Do not submit handwritten certificates. Apply for "Integrated Certificate (Caste, Nativity, Date of Birth)" and "Income Certificate" through any MeeSeva counter or meeseva.ap.gov.in with Tahsildar approval.',
        portalOrOffice: 'MeeSeva Online / Center'
      },
      {
        order: 2,
        title: 'Apply for Rice Card Member Addition / Split at Sachivalayam',
        detail: 'Visit the Digital Assistant at your Ward/Village Secretariat. Fill Form A for new Rice Card or member split. Verification takes 5 to 7 days by VRO and Food Inspector.',
        portalOrOffice: 'Village / Ward Secretariat'
      },
      {
        order: 3,
        title: 'Aadhaar Demographic Correction',
        detail: 'If name spelling or date of birth differs from SSC certificate, update Aadhaar first at a Post Office or Bank Aadhaar Seva Kendra. Changes take 48-72 hours to reflect in UIDAI server.',
        portalOrOffice: 'Aadhaar Seva Kendra / India Post'
      }
    ],
    escalationChannel: 'Tahsildar Office Grievance Desk or MeeSeva Helpline: 0866-2489830',
    teluguEscalation: 'తహశీల్దార్ కార్యాలయం లేదా మీసేవ సహాయ కేంద్రం (0866-2489830).',
    timelineDays: '7 to 10 working days',
    relevantHelpline: '0866-2489830 / 1902'
  },
  {
    id: 'verification-failures',
    category: 'verification',
    title: 'Biometric, e-KYC, or Aadhaar Authentication Failures',
    teluguTitle: 'బయోమెట్రిక్, వేలిముద్ర లేదా ఈ-కేవైసీ విఫలం కావడం',
    shortSummary: 'Resolving fingerprint wear-and-tear for manual laborers, iris scan alternatives, and facial recognition mobile e-KYC.',
    teluguShortSummary: 'వేలిముద్రలు పడకపోతే ఐరిస్ (కంటిపాప) లేదా ఫేస్ ఆథెంటికేషన్ ద్వారా ఈ-కేవైసీ పూర్తి చేసే విధానం.',
    rootCauses: [
      'Fingerprint ridges worn out due to manual labor, agricultural work, or old age.',
      'Mobile number linked to Aadhaar is deactivated or not receiving OTP.',
      'Server timeout between UIDAI authentication gateway and state Navasakam server.',
      'Aadhaar flagged as inactive due to lack of update within past 10 years.'
    ],
    actionSteps: [
      {
        order: 1,
        title: 'Use Face Authentication via AadhaarFaceRd Mobile App',
        detail: 'Grama / Ward Sachivalayam staff have facial authentication devices. You do NOT need thumb impressions if you utilize UIDAI-approved Face RD mobile scanning with good lighting.',
        portalOrOffice: 'Sachivalayam with Volunteer / Staff'
      },
      {
        order: 2,
        title: 'Iris (Eye) Scanner Authentication',
        detail: 'Every Sachivalayam is equipped with an Iris scanner. If fingerprints fail after 3 attempts, the operator must switch to Iris scan as per AP e-Governance policy.',
        portalOrOffice: 'Grama / Ward Secretariat'
      },
      {
        order: 3,
        title: 'Update Biometrics at Post Office Aadhaar Center',
        detail: 'If both thumb and iris consistently fail, visit a Post Office Aadhaar Seva Kendra to re-capture all 10 fingerprints and iris scans. Mandatory biometrics update is free for children reaching age 5 and 15.',
        portalOrOffice: 'Head Post Office / UIDAI Kendra'
      }
    ],
    escalationChannel: 'Contact Village / Ward Digital Assistant or UIDAI Regional Office Vijayawada (1947).',
    teluguEscalation: 'సచివాలయ డిజిటల్ అసిస్టెంట్ లేదా ఆధార్ టోల్ ఫ్రీ 1947 ని సంప్రదించండి.',
    timelineDays: 'Same-day at Sachivalayam (or 3-5 days for UIDAI update)',
    relevantHelpline: '1947 (UIDAI) / 1902 (AP Spandana)'
  },
  {
    id: 'delayed-payment',
    category: 'delayed_payment',
    title: 'Amount Not Credited / DBT Payment Failure / NPCI Mapping',
    teluguTitle: 'పథకం డబ్బులు ఖాతాలో జమ కాకపోవడం / డీబీటీ సమస్య',
    shortSummary: 'Diagnose why funds released by government did not arrive in your bank account, and fix the NPCI Aadhaar bank mapper.',
    teluguShortSummary: 'ప్రభుత్వం నిధులు విడుదల చేసినప్పటికీ ఖాతాలో పడకపోవడానికి గల కారణాలు మరియు ఎన్‌పీసీఐ మ్యాపింగ్ సరిచేసుకోవడం.',
    rootCauses: [
      'Aadhaar is linked to the bank account for KYC, but NOT seeded in the NPCI (National Payments Corporation of India) DBT mapper.',
      'Payment was routed to a different old or dormant bank account (e.g. zero balance Jan Dhan or student scholarship account) linked to Aadhaar.',
      'Bank account is dormant due to inactivity over 6 months or exceeded transaction limit.',
      'Treasury CFMS bill status stuck at "Token Generated" or "Payment In Progress".'
    ],
    actionSteps: [
      {
        order: 1,
        title: 'Check NPCI Active Seeding Status Online',
        detail: 'Open UIDAI website (myaadhaar.uidai.gov.in) -> Login with Aadhaar OTP -> Click "Bank Seeding Status". It will show which exact bank holds your active DBT receiving mandate.',
        portalOrOffice: 'myaadhaar.uidai.gov.in'
      },
      {
        order: 2,
        title: 'Submit NPCI Mandate Form at Preferred Bank Branch',
        detail: 'Visit your active bank branch (e.g. SBI, Union Bank, APGVB) and ask for "Aadhaar NPCI DBT Mandate Application Form". Ensure the bank officer flags your account as "Primary DBT Account".',
        portalOrOffice: 'Your Bank Branch'
      },
      {
        order: 3,
        title: 'Check AP Comprehensive Financial Management System (CFMS) Bill',
        detail: 'Ask your Sachivalayam Welfare Assistant or check cfms.ap.gov.in using your Aadhaar or Beneficiary Code to verify whether the payment order was disbursed or returned as "UTR Rejected".',
        portalOrOffice: 'cfms.ap.gov.in / Sachivalayam'
      },
      {
        order: 4,
        title: 'Apply for Retrigger of Failed DBT Transactions',
        detail: 'Once your NPCI mandate is active, the Welfare Assistant submits a "Failed Transaction Re-Push" request on the Navasakam Nodal portal.',
        portalOrOffice: 'Village / Ward Secretariat'
      }
    ],
    escalationChannel: 'AP Treasury Helpline & Spandana 1902 with CFMS Bill Number.',
    teluguEscalation: 'సీఎఫ్‌ఎమ్ఎస్ బిల్లు నంబరుతో స్పందన 1902 లేదా మీ బ్యాంకు శాఖ మేనేజర్‌ను సంప్రదించండి.',
    timelineDays: '5 to 14 working days',
    relevantHelpline: '1902 / 1800-425-1818'
  }
];
