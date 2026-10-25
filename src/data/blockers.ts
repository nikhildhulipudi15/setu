import { BlockerFlow } from '../types';

export const BENEFIT_BLOCKER_FLOWS: BlockerFlow[] = [
  {
    id: 'rejected',
    title: 'Application Rejected or Marked Ineligible',
    teluguTitle: 'దరఖాస్తు తిరస్కరణ లేదా అనర్హతగా చూపించడం',
    shortDescription: 'Unpack the exact Navasakam / Department rejection reason, gather rectification proof, and file an official Spandana appeal.',
    followUpQuestion: 'What specific reason was cited on your rejection slip or portal status?',
    options: [
      {
        id: 'elec-units-exceeded',
        label: 'Electricity consumption > 300 units/month',
        symptom: 'Household power meter flagged as exceeding 300 units/month threshold in DISCOM billing database.',
        orderedChecks: [
          {
            order: 1,
            instruction: 'Obtain last 6 months official electricity consumption bills from APCPDCL / APEPDCL / APSPDCL online portal or local sub-station.',
            teluguInstruction: 'గత 6 నెలల విద్యుత్ బిల్లులను డౌన్‌లోడ్ చేసుకోండి.',
            evidenceNeeded: '6-Month Electricity Consumption Ledger showing average consumption under 300 units.',
            portalOrDesk: 'Electricity Board Online Portal / Sub-station'
          },
          {
            order: 2,
            instruction: 'Check if multiple meters exist on a single residential premise or if a tenant bill is incorrectly clubbed with your household.',
            teluguInstruction: 'ఇంటికి ఒకే మీటర్ ఉందా లేదా ఇతర మీటర్లు మీ పేరుపై ఉన్నాయా తనిఖీ చేయండి.',
            portalOrDesk: 'Assistant Engineer (Operations), DISCOM'
          },
          {
            order: 3,
            instruction: 'Submit verification application along with consumption proof to the Welfare & Education Assistant (WEA) at your Village/Ward Secretariat.',
            teluguInstruction: 'బిల్లులతో సచివాలయ వెల్ఫేర్ అసిస్టెంట్‌కు పునఃపరిశీలన దరఖాస్తు ఇవ్వండి.',
            evidenceNeeded: 'Rectification Endorsement by DISCOM Assistant Engineer.',
            portalOrDesk: 'Village / Ward Secretariat'
          }
        ],
        evidenceRequired: [
          'Last 6 months electricity payment receipts',
          'DISCOM meter verification certificate',
          'White Rice Card copy'
        ],
        officialChannel: {
          name: 'AP Spandana Grievance Redressal (1902)',
          type: 'helpline',
          contactOrUrl: '1902',
          resolutionTime: '14 to 21 working days',
          instructions: 'Call 1902 with your Rice Card number and register a grievance under "Electricity Data Mismatch in Navasakam".'
        },
        schemeSpecificNote: {
          'jvd-rtf': 'For Jagananna Vidya Deevena, electricity ceiling is 300 units per month for the candidate family household.',
          'ysr-cheyutha': 'For YSR Cheyutha, monthly power limit is 300 units for rural and urban households.'
        }
      },
      {
        id: 'four-wheeler-flagged',
        label: 'Four-Wheeler Ownership Flagged',
        symptom: 'Transport database (Vahan) linked a commercial or passenger four-wheeler to family Aadhaar numbers.',
        orderedChecks: [
          {
            order: 1,
            instruction: 'Identify the vehicle registration number flagged on the Sachivalayam Navasakam verification screen.',
            teluguInstruction: 'ఏ వాహనం నంబరు లింక్ అయిందో సచివాలయంలో తెలుసుకోండి.',
            portalOrDesk: 'Village / Ward Secretariat (WEA Screen)'
          },
          {
            order: 2,
            instruction: 'If the vehicle was previously sold, destroyed, or never owned, visit the local RTO office to obtain a "Non-Possession Certificate" or updated RTA ownership transfer receipt.',
            teluguInstruction: 'వాహనం విక్రయించినట్లయితే ఆర్టీవో కార్యాలయం నుండి రశీదు పొందండి.',
            evidenceNeeded: 'RTA Vehicle Ownership Transfer Certificate (Form 29/30) or Police Non-Possession Endorsement.',
            portalOrDesk: 'RTO Office / aptransport.org'
          },
          {
            order: 3,
            instruction: 'Note that Taxis, Autos, and Tractors operated for livelihood are explicitly exempted under AP welfare norms with valid driving badge.',
            teluguInstruction: 'టాక్సీ, ఆటో, ట్రాక్టర్లకు మినహాయింపు ఉంటుంది.',
            portalOrDesk: 'Village Secretariat'
          }
        ],
        evidenceRequired: [
          'RTA Non-Possession Certificate',
          'Valid Commercial Taxi Badge (if commercial driver)',
          'Family Member Aadhaar copies'
        ],
        officialChannel: {
          name: 'Regional Transport Authority (RTA) / Spandana',
          type: 'physical_desk',
          contactOrUrl: 'aptransport.org / Dial 1902',
          resolutionTime: '7 to 14 working days',
          instructions: 'Submit RTA Non-Possession document directly during the biannual Navasakam verification window.'
        }
      },
      {
        id: 'land-ceiling-exceeded',
        label: 'Agricultural Land Extent > 10 Acres Wet / 25 Acres Dry',
        symptom: 'Webland khata reflects ancestral joint ownership exceeding ceiling limits before family partition.',
        orderedChecks: [
          {
            order: 1,
            instruction: 'Download current 1B (RoR) and Adangal from Meebhoomi portal to inspect survey numbers in the joint khata.',
            teluguInstruction: 'మీభూమి పోర్టల్ నుండి 1B మరియు అడంగల్ డౌన్‌లోడ్ చేసుకోండి.',
            portalOrDesk: 'meebhoomi.ap.gov.in'
          },
          {
            order: 2,
            instruction: 'If land belongs jointly to uncles/grandparents, apply for family partition (F-Line sub-division) with the Village Revenue Officer (VRO) and Tahsildar.',
            teluguInstruction: 'ఉమ్మడి ఆస్తి విభజన కోసం తహశీల్దార్ కార్యాలయంలో దరఖాస్తు చేయండి.',
            evidenceNeeded: 'Tahsildar Certified Partition Deed / Separate 1B Khata.',
            portalOrDesk: 'MeeSeva / Tahsildar Office'
          }
        ],
        evidenceRequired: [
          'Meebhoomi 1B record',
          'Registered family partition deed or genealogical tree certificate'
        ],
        officialChannel: {
          name: 'Revenue Department / Meebhoomi',
          type: 'portal',
          contactOrUrl: 'https://meebhoomi.ap.gov.in',
          resolutionTime: '15 to 30 working days',
          instructions: 'Apply for Webland khata correction through MeeSeva portal with Tahsildar approval.'
        }
      }
    ]
  },
  {
    id: 'missing_or_incorrect_docs',
    title: 'Missing or Incorrect Documents',
    teluguTitle: 'సర్టిఫికెట్లు లేకపోవడం లేదా వివరాలు తప్పుగా ఉండటం',
    shortDescription: 'Guidance on resolving expired certificates, name spelling differences between 10th and Aadhaar, and getting new Rice Cards.',
    followUpQuestion: 'Which certificate is currently blocking your application progress?',
    options: [
      {
        id: 'income-caste-expired',
        label: 'Income / Caste Certificate Expired or Lacks Barcode',
        symptom: 'Old manual certificate without MeeSeva digital barcode or income certificate older than 1 financial year.',
        orderedChecks: [
          {
            order: 1,
            instruction: 'Do not submit manual handwritten certificates. Apply for a digitally signed "Integrated Certificate" (Caste/Nativity/DoB) on MeeSeva.',
            teluguInstruction: 'మీసేవ ద్వారా డిజిటల్ ఇంటిగ్రేటెడ్ సర్టిఫికెట్ కోసం దరఖాస్తు చేయండి.',
            portalOrDesk: 'MeeSeva Online / Center'
          },
          {
            order: 2,
            instruction: 'Check if you have an active White Rice Card. In Andhra Pradesh, an active White Rice Card functions as automatic income certification for Vidya Deevena and Aarogyasri.',
            teluguInstruction: 'తెల్ల రేషన్ కార్డు ఉంటే అది ఆదాయ ధ్రువీకరణగా చెల్లుతుంది.',
            portalOrDesk: 'Grama / Ward Sachivalayam'
          }
        ],
        evidenceRequired: [
          'Ration Card / Rice Card',
          'School Transfer Certificate (TC) or SSC memo with caste endorsement',
          'Self-declaration affidavit'
        ],
        officialChannel: {
          name: 'AP MeeSeva Citizen Portal',
          type: 'portal',
          contactOrUrl: 'https://meeseva.ap.gov.in',
          resolutionTime: '7 working days',
          instructions: 'Track your 16-digit MeeSeva application number online or via MeeSeva helpline 0866-2489830.'
        }
      },
      {
        id: 'name-dob-mismatch',
        label: 'Name or Date of Birth Mismatch (Aadhaar vs Marksheet)',
        symptom: 'Aadhaar demographic data spells name differently from 10th Class certificate or lacks complete DD/MM/YYYY date.',
        orderedChecks: [
          {
            order: 1,
            instruction: 'Government welfare engines prioritize the SSC (10th) marksheet for exact legal name and date of birth.',
            teluguInstruction: '10వ తరగతి సర్టిఫికెట్ ప్రకారం ఆధార్‌లో పేరు మార్పించండి.',
            portalOrDesk: 'Aadhaar Seva Kendra / Post Office'
          },
          {
            order: 2,
            instruction: 'Visit a Bank or Head Post Office Aadhaar Seva Kendra with original SSC memo to update Aadhaar demographics. Update takes 48 to 72 hours.',
            teluguInstruction: 'పోస్టాఫీస్ ఆధార్ కేంద్రంలో 10వ తరగతి మార్కుల మెమోతో అప్‌డేట్ చేసుకోండి.',
            portalOrDesk: 'Post Office Aadhaar Center'
          }
        ],
        evidenceRequired: [
          'Original SSC / 10th Class Passing Certificate',
          'Updated Aadhaar slip with URN number'
        ],
        officialChannel: {
          name: 'UIDAI Regional Office & Aadhaar Toll-Free',
          type: 'helpline',
          contactOrUrl: '1947',
          resolutionTime: '48 to 72 hours',
          instructions: 'Dial 1947 with your 14-digit Update Request Number (URN) to track correction.'
        }
      }
    ]
  },
  {
    id: 'verification_failed',
    title: 'Verification Pending or Biometric / eKYC Failed',
    teluguTitle: 'బయోమెట్రిక్ వేలిముద్రలు పడకపోవడం లేదా వెరిఫికేషన్ నిలిచిపోవడం',
    shortDescription: 'Workarounds for fingerprint wear in agricultural laborers, iris scan equipment, and facial recognition mobile authentication.',
    followUpQuestion: 'Where did the authentication fail?',
    options: [
      {
        id: 'biometric-thumb-failure',
        label: 'Fingerprint Biometric Device Failing Repeatedly',
        symptom: 'Device shows "Fingerprint match score < 40%" or sensor times out during volunteer/secretariat survey.',
        orderedChecks: [
          {
            order: 1,
            instruction: 'Request Iris (Eye) Scanner Authentication: Every Grama / Ward Sachivalayam in AP is equipped with an Iris scanner. By government mandate, if 3 fingerprint attempts fail, operators must switch to Iris scan.',
            teluguInstruction: 'సచివాలయంలోని ఐరిస్ (కంటిపాప) స్కానర్ ఉపయోగించమని కోరండి.',
            portalOrDesk: 'Grama / Ward Sachivalayam'
          },
          {
            order: 2,
            instruction: 'Face RD Mobile Authentication: The volunteer can authenticate your e-KYC using the UIDAI AadhaarFaceRD application on an Android mobile phone under daylight.',
            teluguInstruction: 'ఆధార్ ఫేస్ ఆర్డీ యాప్ ద్వారా ముఖ ప్రామాణీకరణ చేయవచ్చు.',
            portalOrDesk: 'Volunteer / WEA Mobile App'
          },
          {
            order: 3,
            instruction: 'For senior citizens with severe ridge wear, Secretariat Digital Assistant can flag the record for "VRO Manual Inspection Override".',
            teluguInstruction: 'వయోవృద్ధులకు వీఆర్వో మాన్యువల్ ధ్రువీకరణ అవకాశం ఉంటుంది.',
            portalOrDesk: 'Village Secretariat'
          }
        ],
        evidenceRequired: [
          'Physical Aadhaar Card',
          'Voter ID / Ration Card for secondary photo identification'
        ],
        officialChannel: {
          name: 'Grama / Ward Sachivalayam Digital Assistant Desk',
          type: 'physical_desk',
          contactOrUrl: 'Native Village/Ward Secretariat',
          resolutionTime: 'Same-day resolution',
          instructions: 'Visit during Secretariat Citizen Service hours (3:00 PM to 5:00 PM).'
        }
      },
      {
        id: 'college-field-verification-pending',
        label: 'College Principal / WEA Field Verification Pending',
        symptom: 'Application status shows "Pending at College Level (L1)" or "Pending at Secretariat WEA (L2)".',
        orderedChecks: [
          {
            order: 1,
            instruction: 'Check with college scholarship coordinator whether your student admission data was pushed to Jnanabhumi with correct AFRC tuition fee group.',
            teluguInstruction: 'కళాశాల స్కాలర్‌షిప్ ఇన్‌చార్జ్‌ని సంప్రదించండి.',
            portalOrDesk: 'College Administrative Office'
          },
          {
            order: 2,
            instruction: 'Verify if your native Secretariat Welfare & Education Assistant has scheduled your household verification visit before the monthly portal cut-off date.',
            teluguInstruction: 'సచివాలయ వెల్ఫేర్ అసిస్టెంట్‌ను కలవండి.',
            portalOrDesk: 'Native Village/Ward Secretariat'
          }
        ],
        evidenceRequired: [
          'College Fee Receipt & Admission Allotment Order',
          'Student Biometric Attendance ID'
        ],
        officialChannel: {
          name: 'Jnanabhumi Student Grievance Desk',
          type: 'helpline',
          contactOrUrl: '0866-2489830',
          resolutionTime: '5 to 7 working days',
          instructions: 'Quote your Student Aadhaar and College Jnanabhumi Institution Code.'
        }
      }
    ]
  },
  {
    id: 'payment_delayed',
    title: 'Payment / DBT Disbursed but Not Received in Account',
    teluguTitle: 'ప్రభుత్వం డబ్బులు విడుదల చేసినా బ్యాంకు ఖాతాలో పడకపోవడం',
    shortDescription: 'Diagnose inactive NPCI Aadhaar bank mapper linkages, dormant accounts, and CFMS treasury bill transaction failures.',
    followUpQuestion: 'What does your portal payment status indicate?',
    options: [
      {
        id: 'npci-mapping-inactive',
        label: 'Aadhaar Linked for KYC but NOT Seeded in NPCI DBT Mapper',
        symptom: 'Payment rejected with error "UTR Failed: Aadhaar Not Mapped to NPCI / Bank Customer Inactive".',
        orderedChecks: [
          {
            order: 1,
            instruction: 'Check Active DBT Bank Mandate: Visit myaadhaar.uidai.gov.in -> Login with OTP -> Check "Bank Seeding Status". Verify which exact bank holds the primary DBT mandate.',
            teluguInstruction: 'myaadhaar.uidai.gov.in లో మీ బ్యాంక్ సీడింగ్ స్టేటస్ తనిఖీ చేయండి.',
            portalOrDesk: 'myaadhaar.uidai.gov.in'
          },
          {
            order: 2,
            instruction: 'Submit NPCI Mandate Form: Visit your active bank branch (SBI, Union Bank, APGVB, etc.) and submit the "Aadhaar NPCI DBT Seeding Application Form" to make that account primary.',
            teluguInstruction: 'బ్యాంకు శాఖకు వెళ్లి ఆధార్ ఎన్‌పీసీఐ మ్యాండేట్ ఫారమ్ సమర్పించండి.',
            evidenceNeeded: 'Bank Acknowledged NPCI Seeding Receipt.',
            portalOrDesk: 'Bank Branch Customer Service Desk'
          },
          {
            order: 3,
            instruction: 'Request Transaction Re-push: Once seeded, inform the Sachivalayam Welfare Assistant to re-trigger the failed DBT bill in the Navasakam Nodal portal.',
            teluguInstruction: 'సచివాలయంలో ఫెయిల్ అయిన ట్రాన్సాక్షన్ రీ-పుష్ కోసం అడగండి.',
            portalOrDesk: 'Village / Ward Secretariat'
          }
        ],
        evidenceRequired: [
          'Bank Passbook showing active transactions',
          'NPCI DBT Mandate Confirmation SMS / Slip'
        ],
        officialChannel: {
          name: 'Your Bank Branch Manager & Lead District Manager (LDM)',
          type: 'physical_desk',
          contactOrUrl: 'Local Bank Branch / Dial 1902 if bank refuses',
          resolutionTime: '3 to 5 working days',
          instructions: 'Banks are required under RBI / NPCI circulars to link DBT within 48 hours without demanding charges.'
        }
      },
      {
        id: 'cfms-bill-token-pending',
        label: 'Treasury CFMS Status Stuck at "Token Generated"',
        symptom: 'Payment order created in CFMS treasury system but funds not credited due to treasury clearance batching.',
        orderedChecks: [
          {
            order: 1,
            instruction: 'Check CFMS Beneficiary Search: Open cfms.ap.gov.in and search by Beneficiary Aadhaar or College Code to view the Bill Number and DDO approval status.',
            teluguInstruction: 'cfms.ap.gov.in లో బిల్లు నంబరు పరిశీలించండి.',
            portalOrDesk: 'cfms.ap.gov.in'
          },
          {
            order: 2,
            instruction: 'If status shows "Approved - In Queue", payments are released in scheduled state treasury cycles. No corrective paperwork is needed.',
            teluguInstruction: 'ట్రెజరీ క్యూలో ఉన్నట్లయితే కొద్ది రోజుల్లో జమవుతుంది.',
            portalOrDesk: 'AP Finance Dept'
          }
        ],
        evidenceRequired: [
          'CFMS Bill Number / Token Number'
        ],
        officialChannel: {
          name: 'CFMS Treasury Helpdesk / Spandana',
          type: 'helpline',
          contactOrUrl: '1902 / 0866-2489830',
          resolutionTime: '7 to 10 working days',
          instructions: 'Provide CFMS token number when dialing 1902.'
        }
      }
    ]
  },
  {
    id: 'portal_submission_error',
    title: 'Application Portal / Technical Submission Error',
    teluguTitle: 'పోర్టల్ లో సాంకేతిక లోపం లేదా దరఖాస్తు సమర్పణ కాకపోవడం',
    shortDescription: 'Troubleshoot Jnanabhumi, Navasakam, PM-KISAN, or NSP portal timeouts, duplicate Aadhaar alerts, and server errors.',
    followUpQuestion: 'What technical error did the portal display?',
    options: [
      {
        id: 'duplicate-aadhaar-alert',
        label: 'Duplicate Aadhaar / Already Exists in Database',
        symptom: 'Portal displays "Aadhaar already registered in another household or previous academic year".',
        orderedChecks: [
          {
            order: 1,
            instruction: 'Check previous school or college registration. If you recently graduated or shifted courses, the previous institution may not have archived/released your Jnanabhumi Student ID.',
            teluguInstruction: 'పాత కళాశాలలో విద్యార్థి ఐడీని రిలీజ్ చేయమని కోరండి.',
            portalOrDesk: 'Previous Institution Office'
          },
          {
            order: 2,
            instruction: 'Request "Institution Transfer / Data De-link" through your current college scholarship officer.',
            teluguInstruction: 'కొత్త కళాశాల ద్వారా డేటా డీ-లింక్ దరఖాస్తు చేయండి.',
            portalOrDesk: 'Current College Nodal Officer'
          }
        ],
        evidenceRequired: [
          'College Transfer Certificate (TC)',
          'Previous Course Relieving Letter'
        ],
        officialChannel: {
          name: 'AP e-Governance / Jnanabhumi Tech Support',
          type: 'portal',
          contactOrUrl: 'jnanabhumi.ap.gov.in / 0866-2489830',
          resolutionTime: '3 to 5 working days',
          instructions: 'Submit Transfer Certificate to scholarship cell for student transfer workflow.'
        }
      },
      {
        id: 'session-timeout-server-error',
        label: 'Server Error 500 / Session Expired During Final Submission',
        symptom: 'Web page hangs, gives 504 Gateway Timeout, or fails during OTP confirmation.',
        orderedChecks: [
          {
            order: 1,
            instruction: 'Avoid high-traffic peak hours (10:00 AM to 1:00 PM). Portals experience heavy traffic near submission deadlines; try early morning (before 8:30 AM) or after 7:00 PM.',
            teluguInstruction: 'ఉదయం 8:30 లోపు లేదా సాయంత్రం 7 గంటల తర్వాత ప్రయత్నించండి.',
            portalOrDesk: 'Browser'
          },
          {
            order: 2,
            instruction: 'Clear browser cookies and cache or use an Incognito / Private window with stable 4G/WiFi connection.',
            teluguInstruction: 'ప్రైవేట్ బ్రౌజింగ్ లేదా కాష్ క్లియర్ చేసి ప్రయత్నించండి.',
            portalOrDesk: 'Browser Settings'
          }
        ],
        evidenceRequired: [
          'Screenshot of the error page with URL and timestamp'
        ],
        officialChannel: {
          name: 'Portal Nodal Technical Helpdesk',
          type: 'helpline',
          contactOrUrl: '1902 / 0866-2489830',
          resolutionTime: '24 hours',
          instructions: 'Inform Sachivalayam Digital Assistant if portal is unresponsive across all center computers.'
        }
      }
    ]
  }
];
