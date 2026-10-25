import { Scheme } from '../types';

export const SCHEMES: Scheme[] = [
  {
    id: 'jvd-rtf',
    name: 'Jagananna Vidya Deevena (RTF - Full Tuition Fee Reimbursement)',
    code: 'AP-HED-01',
    teluguName: 'జగనన్న విద్యా దీవెన (పూర్తి ఫీజు రీయింబర్స్మెంట్)',
    schemeLevel: 'State',
    department: 'Department of Higher Education & Social Welfare, Govt of Andhra Pradesh',
    description: 'Provides 100% full tuition fee reimbursement for eligible students enrolled in recognized ITI, Polytechnic, Degree, Engineering, Medicine, and Postgraduate courses across Andhra Pradesh. Disbursed quarterly directly to the mother’s Aadhaar-linked bank account.',
    beneficiaryCategory: 'Education & Scholarships',
    lastVerifiedDate: '2024-10-15',
    dataStatus: 'verified',
    officialInfoUrl: 'https://jnanabhumi.ap.gov.in',
    applicationUrl: 'https://jnanabhumi.ap.gov.in',
    benefitFinancials: '100% Tuition Fee Reimbursement (covers ₹15,000 to ₹1,20,000+ per year based on AFRC fees)',
    frequency: 'Quarterly',
    verificationAuthority: 'Grama / Ward Sachivalayam (Welfare & Education Assistant) & College Principal',
    offlineCenter: 'College Scholarship Desk & Native Village/Ward Secretariat',
    helpline: '1902 (Spandana) / 0866-2489830',
    defaultNextAction: 'Register college enrollment on Jnanabhumi portal and complete mother-student eKYC at Sachivalayam.',
    conditions: [
      {
        id: 'jvd-c1-state',
        field: 'state',
        operator: 'equals',
        requiredValue: 'Andhra Pradesh',
        isMandatory: true,
        label: 'State of Residence',
        teluguLabel: 'ఆంధ్రప్రదేశ్ నివాసం',
        explanation: 'Must be a bona fide resident of Andhra Pradesh.',
        sourceReference: 'G.O.Ms.No.115 Higher Education Dept.'
      },
      {
        id: 'jvd-c2-education',
        field: 'education',
        operator: 'in',
        requiredValue: [
          'ITI / Polytechnic Diploma',
          'Undergraduate (BA, B.Sc, B.Com, B.Tech, MBBS)',
          'Postgraduate / Professional'
        ],
        isMandatory: true,
        label: 'Course of Study',
        teluguLabel: 'కోర్సు స్థాయి',
        explanation: 'Must be enrolled in post-matric higher education: ITI, Polytechnic, Degree, Engineering, or PG.',
        sourceReference: 'AP Jnanabhumi Scheme Guidelines Clause 3.1'
      },
      {
        id: 'jvd-c3-income',
        field: 'incomeBand',
        operator: 'in',
        requiredValue: [
          'Below ₹1,00,000 / year',
          '₹1,00,000 - ₹2,50,000 / year'
        ],
        isMandatory: true,
        label: 'Household Annual Income',
        teluguLabel: 'వార్షిక ఆదాయ పరిమితి',
        explanation: 'Total parental/family annual income must not exceed ₹2,50,000 per annum.',
        sourceReference: 'AP Social Welfare Navasakam Income Ceiling G.O.'
      },
      {
        id: 'jvd-c4-land',
        field: 'landHoldingAcres',
        operator: 'less_than_or_equal',
        requiredValue: 10,
        isMandatory: true,
        label: 'Agricultural Land Ceiling',
        teluguLabel: 'వ్యవసాయ భూమి పరిమితి',
        explanation: 'Family must not own more than 10 acres of wet land or 25 acres of dry land.',
        sourceReference: 'Webland Integrated Ceiling Rules'
      },
      {
        id: 'jvd-c5-govt-employee',
        field: 'employmentStatus',
        operator: 'not_equals',
        requiredValue: 'Government / Pensioner',
        isMandatory: true,
        label: 'Non-Government Household',
        teluguLabel: 'ప్రభుత్వ ఉద్యోగి కాకపోవడం',
        explanation: 'No family member should be a regular government employee or pensioner (sanitary workers exempt).',
        sourceReference: 'AP Welfare Exclusion Criteria'
      },
      {
        id: 'jvd-c6-attendance',
        field: 'employmentStatus',
        operator: 'external_verification',
        isMandatory: true,
        requiresExternalVerification: true,
        label: '75% Biometric Attendance',
        teluguLabel: '75% బయోమెట్రిక్ హాజరు',
        explanation: 'Student must maintain at least 75% biometric attendance in college recorded on AePDS.',
        sourceReference: 'College Biometric Portal & Jnanabhumi Attendance Feed'
      }
    ],
    requiredDocuments: [
      {
        id: 'doc-rice-card',
        name: 'AP Rice Card / White Ration Card',
        teluguName: 'బియ్యం కార్డు (రైస్ కార్డు)',
        description: 'Proof of low-income household status in Andhra Pradesh.',
        whereToGet: 'Issued by Department of Food & Civil Supplies via Grama / Ward Sachivalayam.',
        isMandatory: true
      },
      {
        id: 'doc-income-cert',
        name: 'Integrated Income Certificate (if no Rice Card)',
        teluguName: 'ఆదాయ ధ్రువీకరణ పత్రం',
        description: 'Official revenue department income certificate showing income <= ₹2.5L.',
        whereToGet: 'Apply via MeeSeva portal or nearest Sachivalayam within 7 days.',
        alternativeAllowed: 'Active White Rice Card can directly substitute for income certificate.',
        isMandatory: false
      },
      {
        id: 'doc-caste-cert',
        name: 'Caste / Community Certificate',
        teluguName: 'కుల ధ్రువీకరణ పత్రం',
        description: 'Required for SC, ST, BC, and Minority social categories.',
        whereToGet: 'MeeSeva portal or Sachivalayam with Tahsildar digital signature.',
        isMandatory: true
      },
      {
        id: 'doc-college-allotment',
        name: 'College Admission Allotment Order & Fee Receipt',
        teluguName: 'కళాశాల సీటు అలాట్మెంట్ ఆర్డర్',
        description: 'Convener quota / general admission order from AP EAPCET / ICET / POLYCET / EDCET / OAMDC.',
        whereToGet: 'Downloadable from CET counseling admission portal or College Admissions Office.',
        isMandatory: true
      },
      {
        id: 'doc-mother-bank',
        name: "Mother's Bank Account Passbook (Aadhaar & NPCI Linked)",
        teluguName: 'తల్లి బ్యాంక్ పాస్‌బుక్ (ఆధార్ లింక్డ్)',
        description: 'Bank account in the name of the mother, enabled for DBT with NPCI mapping.',
        whereToGet: 'Any commercial bank branch or post office savings account.',
        isMandatory: true
      }
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'College Data Entry & Verification',
        teluguTitle: 'కళాశాలలో వివరాల నమోదు',
        description: 'During college admission, the college scholarship nodal officer registers your student ID on the Jnanabhumi portal and uploads admission details.',
        locationOrUrl: 'College Administrative Office'
      },
      {
        stepNumber: 2,
        title: 'Secretariat Volunteer & WEA Field Verification',
        teluguTitle: 'సచివాలయ సిబ్బంది క్షేత్రస్థాయి పరిశీలన',
        description: 'Welfare & Education Assistant (WEA) at your native Grama / Ward Sachivalayam verifies your household eligibility via Navasakam survey.',
        locationOrUrl: 'Native Village / Ward Sachivalayam',
        isOffline: true
      },
      {
        stepNumber: 3,
        title: 'Mother & Student Biometric Authentication',
        teluguTitle: 'తల్లి మరియు విద్యార్థి బయోమెట్రిక్ ప్రామాణీకరణ',
        description: 'Both the student and the mother provide biometric thumb impression or facial eKYC at the Sachivalayam to confirm the claim.',
        locationOrUrl: 'Sachivalayam or College Portal'
      },
      {
        stepNumber: 4,
        title: 'Direct Benefit Transfer (DBT) Disbursement',
        teluguTitle: 'ఖాతాలో ఫీజు జమ',
        description: 'Funds are directly transferred each quarter to the mother’s Aadhaar-linked account, with SMS notification via CFMS.',
        locationOrUrl: 'Direct Bank Transfer'
      }
    ]
  },
  {
    id: 'jvd-mtf',
    name: 'Jagananna Vasathi Deevena (MTF - Maintenance & Hostel Fee)',
    code: 'AP-HED-02',
    teluguName: 'జగనన్న వసతి దీవెన (హాస్టల్ & మెస్ భత్యం)',
    schemeLevel: 'State',
    department: 'Department of Higher Education, Govt of Andhra Pradesh',
    description: 'Provides boarding and maintenance allowances to students from economically backward households to cover hostel, mess, and study expenses.',
    beneficiaryCategory: 'Education & Scholarships',
    lastVerifiedDate: '2024-10-15',
    dataStatus: 'verified',
    officialInfoUrl: 'https://jnanabhumi.ap.gov.in',
    applicationUrl: 'https://jnanabhumi.ap.gov.in',
    benefitFinancials: '₹10,000/yr (ITI), ₹15,000/yr (Polytechnic), ₹20,000/yr (Degree & Engineering)',
    frequency: 'Annual',
    verificationAuthority: 'College Principal & Grama / Ward Sachivalayam',
    offlineCenter: 'Grama / Ward Sachivalayam',
    helpline: '1902 / 0866-2489830',
    defaultNextAction: 'Handled automatically along with Vidya Deevena enrollment on Jnanabhumi.',
    conditions: [
      {
        id: 'mtf-c1-state',
        field: 'state',
        operator: 'equals',
        requiredValue: 'Andhra Pradesh',
        isMandatory: true,
        label: 'State of Residence',
        explanation: 'Must be an Andhra Pradesh resident.',
        sourceReference: 'G.O.Ms.No.115 Higher Education Dept.'
      },
      {
        id: 'mtf-c2-education',
        field: 'education',
        operator: 'in',
        requiredValue: [
          'ITI / Polytechnic Diploma',
          'Undergraduate (BA, B.Sc, B.Com, B.Tech, MBBS)',
          'Postgraduate / Professional'
        ],
        isMandatory: true,
        label: 'Post-Matric Course Enrolled',
        explanation: 'Must be enrolled in recognized technical, degree, or professional courses.',
        sourceReference: 'Jnanabhumi Guidelines'
      },
      {
        id: 'mtf-c3-income',
        field: 'incomeBand',
        operator: 'in',
        requiredValue: [
          'Below ₹1,00,000 / year',
          '₹1,00,000 - ₹2,50,000 / year'
        ],
        isMandatory: true,
        label: 'Household Income Ceiling',
        explanation: 'Family annual income must be at or below ₹2,50,000.',
        sourceReference: 'Navasakam Economic Standard'
      }
    ],
    requiredDocuments: [
      {
        id: 'doc-hostel-receipt',
        name: 'College Bonafide Certificate / Hostel Admission Slip',
        teluguName: 'బోనఫైడ్ సర్టిఫికేట్ / హాస్టల్ రశీదు',
        description: 'Issued by college or government hostel confirming enrollment.',
        whereToGet: 'College registrar or hostel warden.',
        isMandatory: true
      },
      {
        id: 'doc-mother-aadhaar-bank',
        name: "Mother's Aadhaar & Active Bank Account Details",
        teluguName: 'తల్లి ఆధార్ & బ్యాంక్ వివరాలు',
        description: 'Must be seeded with NPCI mapper for Direct Benefit Transfer.',
        whereToGet: 'Bank branch / post office.',
        isMandatory: true
      }
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Single Joint Application with Vidya Deevena',
        teluguTitle: 'ఉమ్మడి దరఖాస్తు',
        description: 'No separate application required. Handled together on the Jnanabhumi portal during college registration.',
        locationOrUrl: 'College Scholarship Desk'
      },
      {
        stepNumber: 2,
        title: 'e-KYC Verification',
        teluguTitle: 'బయోమెట్రిక్ నిర్ధారణ',
        description: 'Biometric authorization done at native Sachivalayam or biometric device at college.',
        locationOrUrl: 'Sachivalayam',
        isOffline: true
      }
    ]
  },
  {
    id: 'ysr-rythu-bharosa',
    name: 'YSR Rythu Bharosa - PM KISAN',
    code: 'AP-AGR-03',
    teluguName: 'వైఎస్సార్ రైతు భరోసా - పీఎం కిసాన్',
    schemeLevel: 'State',
    department: 'Department of Agriculture & Farmers Welfare, Govt of AP & MoA India',
    description: 'Financial input support for cultivating farmers in Andhra Pradesh, providing ₹13,500 annually per farmer family across 3 installments for seeds, fertilizers, and farm inputs.',
    beneficiaryCategory: 'Farmer & Agriculture',
    lastVerifiedDate: '2024-09-30',
    dataStatus: 'verified',
    officialInfoUrl: 'https://ysrrythubharosa.ap.gov.in',
    applicationUrl: 'https://ysrrythubharosa.ap.gov.in',
    benefitFinancials: '₹13,500 / year (AP Government ₹7,500 + PM-KISAN ₹6,000)',
    frequency: 'Quarterly',
    verificationAuthority: 'Rythu Bharosa Kendram (RBK) & Village Agriculture Assistant (VAA)',
    offlineCenter: 'Village Rythu Bharosa Kendram (RBK)',
    helpline: '155251 / 1902 / 1800-425-1661',
    defaultNextAction: 'Complete seasonal e-crop biometric booking at your Village RBK.',
    conditions: [
      {
        id: 'rb-c1-state',
        field: 'state',
        operator: 'equals',
        requiredValue: 'Andhra Pradesh',
        isMandatory: true,
        label: 'Cultivating in Andhra Pradesh',
        explanation: 'Must be actively cultivating agricultural land in Andhra Pradesh.',
        sourceReference: 'AP Agriculture Dept Policy'
      },
      {
        id: 'rb-c2-status',
        field: 'employmentStatus',
        operator: 'in',
        requiredValue: [
          'Small / Marginal Farmer',
          'Tenant Farmer'
        ],
        isMandatory: true,
        label: 'Farmer Category',
        explanation: 'Beneficiary must be a small/marginal farmer, tenant farmer, or ROFR tribal cultivator.',
        sourceReference: 'Rythu Bharosa Guidelines Clause 2'
      },
      {
        id: 'rb-c3-land-ceiling',
        field: 'landHoldingAcres',
        operator: 'less_than_or_equal',
        requiredValue: 10,
        isMandatory: true,
        label: 'Land Holding Ceiling',
        explanation: 'Family landholding must not exceed 10 acres wet or 25 acres dry land.',
        sourceReference: 'Webland khata ceiling'
      },
      {
        id: 'rb-c4-govt-exclusion',
        field: 'employmentStatus',
        operator: 'not_equals',
        requiredValue: 'Government / Pensioner',
        isMandatory: true,
        label: 'Institutional Exclusion',
        explanation: 'Constitutional post holders, regular government servants, and income tax payees are excluded.',
        sourceReference: 'PM-KISAN Exclusion Criterion'
      },
      {
        id: 'rb-c5-ecrop',
        field: 'employmentStatus',
        operator: 'external_verification',
        isMandatory: true,
        requiresExternalVerification: true,
        label: 'e-Crop Biometric Survey',
        explanation: 'Crop cultivation must be recorded via e-Crop field booking by the Village Agriculture Assistant (VAA).',
        sourceReference: 'AP e-Crop Digital Survey'
      }
    ],
    requiredDocuments: [
      {
        id: 'doc-pattadar-passbook',
        name: 'Pattadar Passbook / 1B Land Record',
        teluguName: 'పట్టాదారు పాస్‌బుక్ / 1B భూమి రికార్డు',
        description: 'Proof of land ownership registered in AP Webland portal.',
        whereToGet: 'Download online from Meebhoomi portal or obtain from Tahsildar / RBK.',
        isMandatory: true
      },
      {
        id: 'doc-ccrc-card',
        name: 'Crop Cultivator Rights Card (CCRC) for Tenant Farmers',
        teluguName: 'కౌలు రైతు గుర్తింపు కార్డు (CCRC)',
        description: '11-month agreement agreement with land owner signed at RBK.',
        whereToGet: 'Facilitated by Village Agriculture Assistant (VAA) at Village RBK.',
        alternativeAllowed: 'Only needed if applying as a tenant farmer.',
        isMandatory: false
      },
      {
        id: 'doc-ecrop-booking',
        name: 'e-Crop Digital Booking Acknowledgement',
        teluguName: 'ఈ-క్రాప్ బుకింగ్ రశీదు',
        description: 'Biometric e-crop survey done each season by VAA in the field.',
        whereToGet: 'Recorded directly by VAA using the AP e-Crop mobile application.',
        isMandatory: true
      }
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'e-Crop Booking at Rythu Bharosa Kendram',
        teluguTitle: 'ఆర్బీకే వద్ద ఈ-క్రాప్ నమోదు',
        description: 'Visit your village RBK. The Village Agriculture Assistant surveys the crop grown and registers the parcel number with your biometric.',
        locationOrUrl: 'Village RBK',
        isOffline: true
      },
      {
        stepNumber: 2,
        title: 'Social Audit List Display',
        teluguTitle: 'సామాజిక తనిఖీ జాబితా ప్రదర్శన',
        description: 'Eligible and ineligible lists are posted transparently at the RBK for 10 days for public grievances and corrections.',
        locationOrUrl: 'Village RBK Notice Board',
        isOffline: true
      },
      {
        stepNumber: 3,
        title: 'Direct Bank Credit via NPCI',
        teluguTitle: 'నేరుగా బ్యాంకు ఖాతాలో జమ',
        description: 'Installments released directly to your bank account using Aadhaar-based DBT payment bridge.',
        locationOrUrl: 'Bank Account'
      }
    ]
  },
  {
    id: 'ysr-cheyutha',
    name: 'YSR Cheyutha',
    code: 'AP-WCD-04',
    teluguName: 'వైఎస్సార్ చేయూత (మహిళా సాధికారత)',
    schemeLevel: 'State',
    department: 'Department of Women Development & Social Welfare, Govt of AP',
    description: 'Financial assistance of ₹75,000 over 4 years (₹18,750 per year) directly credited to middle-aged women belonging to SC, ST, BC, and Minority communities for sustainable entrepreneurship and livelihood.',
    beneficiaryCategory: 'Women & Child Welfare',
    lastVerifiedDate: '2024-08-20',
    dataStatus: 'verified',
    officialInfoUrl: 'https://navasakam.ap.gov.in',
    applicationUrl: 'https://navasakam.ap.gov.in',
    benefitFinancials: '₹18,750 / year (Total ₹75,000 for 4 years)',
    frequency: 'Annual',
    verificationAuthority: 'Village / Ward Secretariat & SERP (Society for Elimination of Rural Poverty)',
    offlineCenter: 'Grama / Ward Sachivalayam (Women Police / Welfare Assistant)',
    helpline: '1902 / 0866-2489830',
    defaultNextAction: 'Verify demographic age details on your Aadhaar card and attend the Navasakam social audit.',
    conditions: [
      {
        id: 'chey-c1-state',
        field: 'state',
        operator: 'equals',
        requiredValue: 'Andhra Pradesh',
        isMandatory: true,
        label: 'Resident of Andhra Pradesh',
        explanation: 'Beneficiary must reside in Andhra Pradesh.',
        sourceReference: 'G.O.Ms.No.29 Social Welfare'
      },
      {
        id: 'chey-c2-gender',
        field: 'gender',
        operator: 'equals',
        requiredValue: 'Female',
        isMandatory: true,
        label: 'Female Applicant',
        explanation: 'Scheme is exclusively for women beneficiaries.',
        sourceReference: 'Cheyutha Guidelines Rule 1'
      },
      {
        id: 'chey-c3-age-between',
        field: 'age',
        operator: 'between',
        requiredValue: [45, 60],
        isMandatory: true,
        label: 'Age Eligibility (45 to 60 Years)',
        explanation: 'Applicant must be between 45 and 60 years old as per Aadhaar Date of Birth.',
        sourceReference: 'UIDAI verified Date of Birth ceiling'
      },
      {
        id: 'chey-c4-community',
        field: 'socialCategory',
        operator: 'in',
        requiredValue: [
          'SC (Scheduled Caste)',
          'ST (Scheduled Tribe)',
          'OBC / BC (Backward Classes)',
          'Minority (Muslim, Christian, etc.)'
        ],
        isMandatory: true,
        label: 'Social Community Category',
        explanation: 'Must belong to SC, ST, BC, or Minority communities.',
        sourceReference: 'Affirmative Action Target Mandate'
      },
      {
        id: 'chey-c5-income',
        field: 'incomeBand',
        operator: 'in',
        requiredValue: [
          'Below ₹1,00,000 / year',
          '₹1,00,000 - ₹2,50,000 / year'
        ],
        isMandatory: true,
        label: 'Income Limit',
        explanation: 'Household income must be within BPL threshold verified by White Rice Card.',
        sourceReference: 'Navasakam Economic Standard'
      }
    ],
    requiredDocuments: [
      {
        id: 'doc-aadhaar-dob',
        name: 'Aadhaar Card with full Date of Birth',
        teluguName: 'ఆధార్ కార్డు (పూర్తి పుట్టిన తేదీతో)',
        description: 'Used for age confirmation (must show 45-60 years).',
        whereToGet: 'UIDAI portal or nearest Aadhaar Seva Kendra.',
        isMandatory: true
      },
      {
        id: 'doc-integrated-caste',
        name: 'Caste Certificate (SC / ST / BC / Minority)',
        teluguName: 'కుల ధ్రువీకరణ పత్రం',
        description: 'Verified with Meeseva barcode.',
        whereToGet: 'Meeseva / Sachivalayam.',
        isMandatory: true
      },
      {
        id: 'doc-rice-card',
        name: 'AP Rice Card',
        teluguName: 'బియ్యం కార్డు',
        description: 'Household economic verification.',
        whereToGet: 'Civil Supplies Dept.',
        isMandatory: true
      }
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Navasakam Household Survey',
        teluguTitle: 'నవశకం సర్వే',
        description: 'Village / Ward volunteer visits household to record consent and inspect age credentials.',
        locationOrUrl: 'Beneficiary Residence',
        isOffline: true
      },
      {
        stepNumber: 2,
        title: 'WEA Social Audit Verification',
        teluguTitle: 'సచివాలయ సామాజిక తనిఖీ',
        description: 'Lists published at Sachivalayam; objections addressed by MPDO / Municipal Commissioner.',
        locationOrUrl: 'Sachivalayam',
        isOffline: true
      },
      {
        stepNumber: 3,
        title: 'DBT Credit & Livelihood Support',
        teluguTitle: 'బ్యాంకు ఖాతాలో జమ మరియు జీవనోపాధి సహాయం',
        description: 'Annual installment credited with optional tie-ups for dairy, grocery, or tailoring business assistance with Amul, Reliance, ITC.',
        locationOrUrl: 'Bank Account'
      }
    ]
  },
  {
    id: 'ysr-aarogyasri',
    name: 'Dr. YSR Aarogyasri Universal Health Scheme',
    code: 'AP-HLT-05',
    teluguName: 'డా. వైఎస్సార్ ఆరోగ్యశ్రీ పథకం (ఉచిత నగదు రహిత చికిత్స)',
    schemeLevel: 'State',
    department: 'Dr. YSR Aarogyasri Health Care Trust, Govt of Andhra Pradesh',
    description: 'Cashless universal tertiary medical and surgical healthcare coverage up to ₹25,00,000 per family per year across 3,257 identified procedures at government and empanelled corporate network hospitals.',
    beneficiaryCategory: 'Healthcare & Insurance',
    lastVerifiedDate: '2024-10-01',
    dataStatus: 'verified',
    officialInfoUrl: 'https://aarogyasri.ap.gov.in',
    applicationUrl: 'https://aarogyasri.ap.gov.in',
    benefitFinancials: 'Cashless hospitalization up to ₹25,00,000 + ₹5,000/mo Aarogya Aasara post-op wage allowance',
    frequency: 'As Needed',
    verificationAuthority: 'Aarogyamithra stationed at Network Hospitals & Sachivalayam ANM',
    offlineCenter: 'Helpdesk of any Empanelled Network Hospital (Aarogyamithra counter)',
    helpline: '104 (Medical Guidance) / 1800-425-1818 (Trust Helpline)',
    defaultNextAction: 'Download digital health card on mobile or present Rice Card at the Aarogyamithra hospital counter.',
    conditions: [
      {
        id: 'aarog-c1-state',
        field: 'state',
        operator: 'equals',
        requiredValue: 'Andhra Pradesh',
        isMandatory: true,
        label: 'Resident of Andhra Pradesh',
        explanation: 'Must be a resident of Andhra Pradesh.',
        sourceReference: 'Aarogyasri Trust Act'
      },
      {
        id: 'aarog-c2-income',
        field: 'incomeBand',
        operator: 'in',
        requiredValue: [
          'Below ₹1,00,000 / year',
          '₹1,00,000 - ₹2,50,000 / year',
          '₹2,50,000 - ₹5,00,000 / year'
        ],
        isMandatory: true,
        label: 'Annual Income up to ₹5,00,000',
        explanation: 'Universal health coverage applies to all households earning up to ₹5,00,000 per annum.',
        sourceReference: 'G.O.Ms.No.179 Health Dept.'
      }
    ],
    requiredDocuments: [
      {
        id: 'doc-aarogyasri-card',
        name: 'Aarogyasri Health Card or Rice Card',
        teluguName: 'ఆరోగ్యశ్రీ కార్డు లేదా రైస్ కార్డు',
        description: 'Physical card or QR digital card on mobile phone.',
        whereToGet: 'Downloaded via Aarogyasri App or Sachivalayam.',
        isMandatory: true
      },
      {
        id: 'doc-patient-aadhaar',
        name: "Patient's Aadhaar Card",
        teluguName: 'రోగి ఆధార్ కార్డు',
        description: 'For hospital biometric eKYC during admission.',
        whereToGet: 'UIDAI.',
        isMandatory: true
      }
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Visit Hospital Aarogyamithra Counter',
        teluguTitle: 'ఆసుపత్రిలోని ఆరోగ్యమిత్ర కౌంటర్ సంప్రదించండి',
        description: 'Walk into any empanelled network hospital (Govt or Private) and meet the Aarogyamithra with your card and Aadhaar.',
        locationOrUrl: 'Network Hospital Helpdesk',
        isOffline: true
      },
      {
        stepNumber: 2,
        title: 'Diagnostic Evaluation & Pre-Authorization',
        teluguTitle: 'వైద్య పరీక్షలు & అనుమతి',
        description: 'Hospital doctor conducts tests. Aarogyamithra uploads diagnosis to the trust server for pre-authorization within 1-2 hours.',
        locationOrUrl: 'Hospital Desk'
      },
      {
        stepNumber: 3,
        title: 'Cashless Admission & Treatment',
        teluguTitle: 'ఉచిత చికిత్స & మందులు',
        description: 'Surgery, ICU, medications, food, and post-discharge medicines for 10 days provided completely free with zero out-of-pocket payment.',
        locationOrUrl: 'Inpatient Ward'
      }
    ]
  },
  {
    id: 'pm-vishwakarma',
    name: 'PM Vishwakarma Scheme',
    code: 'IND-MSME-06',
    teluguName: 'పీఎం విశ్వకర్మ యోజన (చేతివృత్తుల వారి సంక్షేమం)',
    schemeLevel: 'Central',
    department: 'Ministry of Micro, Small and Medium Enterprises (MSME), Govt of India',
    description: 'Central comprehensive support for traditional craftspeople and artisans in 18 trades, providing PM Vishwakarma Certificate & ID, ₹15,000 modern toolkit e-voucher, skill training with ₹500/day stipend, and 5% collateral-free loans.',
    beneficiaryCategory: 'Livelihood & Artisans',
    lastVerifiedDate: '2024-09-15',
    dataStatus: 'verified',
    officialInfoUrl: 'https://pmvishwakarma.gov.in',
    applicationUrl: 'https://pmvishwakarma.gov.in',
    benefitFinancials: '₹15,000 Modern Toolkit Grant + 5% Collateral-Free Loans up to ₹3,00,000 + ₹500/day training stipend',
    frequency: 'One-Time',
    verificationAuthority: '3-tier verification: Gram Panchayat / Sachivalayam, District Committee, National Screening',
    offlineCenter: 'Common Service Centre (CSC) or Village / Ward Sachivalayam',
    helpline: '1800-267-7777 / 011-23061500',
    defaultNextAction: 'Visit nearest CSC or Sachivalayam with active mobile-linked Aadhaar for biometric trade registration.',
    conditions: [
      {
        id: 'pmv-c1-trade',
        field: 'employmentStatus',
        operator: 'in',
        requiredValue: [
          'Artisan / Craftsman / Handloom',
          'Self-Employed / Street Vendor'
        ],
        isMandatory: true,
        label: 'Practicing Traditional Trade / Craft',
        explanation: 'Must be actively practicing one of the 18 recognized traditional artisan trades.',
        sourceReference: 'Ministry of MSME PM Vishwakarma Operational Guidelines Clause 4'
      },
      {
        id: 'pmv-c2-age',
        field: 'age',
        operator: 'greater_than_or_equal',
        requiredValue: 18,
        isMandatory: true,
        label: 'Minimum Age 18 Years',
        explanation: 'Beneficiary must be at least 18 years of age on date of registration.',
        sourceReference: 'PM Vishwakarma Age Rule'
      },
      {
        id: 'pmv-c3-exclusion',
        field: 'employmentStatus',
        operator: 'not_equals',
        requiredValue: 'Government / Pensioner',
        isMandatory: true,
        label: 'Non-Government Family Member',
        explanation: 'Family members of government employees are not eligible.',
        sourceReference: 'PM Vishwakarma Exclusion Matrix'
      }
    ],
    requiredDocuments: [
      {
        id: 'doc-aadhaar-mobile',
        name: 'Aadhaar Card linked to active Mobile Number',
        teluguName: 'మొబైల్ లింక్ అయిన ఆధార్ కార్డు',
        description: 'For OTP verification and biometric enrollment.',
        whereToGet: 'UIDAI.',
        isMandatory: true
      },
      {
        id: 'doc-bank-passbook',
        name: 'Active Savings Bank Account Passbook',
        teluguName: 'బ్యాంక్ పాస్‌బుక్',
        description: 'Required for ₹500/day stipend and ₹15,00,00 toolkit e-voucher.',
        whereToGet: 'Any Scheduled Commercial Bank.',
        isMandatory: true
      },
      {
        id: 'doc-ration-card',
        name: 'Ration Card / Family Proof',
        teluguName: 'రేషన్ కార్డు',
        description: 'To confirm one beneficiary per household limit.',
        whereToGet: 'Civil Supplies Dept.',
        isMandatory: true
      }
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'CSC Biometric Registration',
        teluguTitle: 'సీఎస్‌సీ కేంద్రంలో బయోమెట్రిక్ నమోదు',
        description: 'Visit a Common Service Centre (CSC) or Sachivalayam. Complete Aadhaar e-KYC, select your trade, and submit.',
        locationOrUrl: 'CSC / MeeSeva',
        isOffline: true
      },
      {
        stepNumber: 2,
        title: 'Gram Panchayat & District Verification',
        teluguTitle: 'పంచాయతీ & జిల్లా స్థాయి పరిశీలన',
        description: 'Sarpanch / Sachivalayam Secretary verifies traditional craft practice, followed by District Committee approval.',
        locationOrUrl: 'Local Panchayat / Sachivalayam',
        isOffline: true
      },
      {
        stepNumber: 3,
        title: 'Basic Skill Training & Toolkit E-Voucher',
        teluguTitle: 'శిక్షణ & రూ. 15,000 టూల్‌కిట్ ఈ-వోచర్',
        description: 'Undergo 5-day skill upgrading with ₹500/day stipend. Receive digital e-voucher of ₹15,000 to purchase modern toolkit.',
        locationOrUrl: 'Designated ITI / Training Center'
      },
      {
        stepNumber: 4,
        title: 'Subsidized Enterprise Loan Approval',
        teluguTitle: '5% వడ్డీతో పూచీకత్తు లేని వ్యాపార రుణం',
        description: 'Apply for 1st tranche loan of up to ₹1,00,000 at 5% interest without pledging any collateral.',
        locationOrUrl: 'Commercial Bank Branch'
      }
    ]
  },
  {
    id: 'amma-vodi',
    name: 'Jagananna Amma Vodi',
    code: 'AP-SCH-07',
    teluguName: 'జగనన్న అమ్మ ఒడి (పాఠశాల విద్యార్థుల తల్లులకు సహాయం)',
    schemeLevel: 'State',
    department: 'Department of School Education, Govt of Andhra Pradesh',
    description: 'Financial assistance of ₹15,000 per academic year credited into the bank account of the mother to encourage sending children to schools and junior colleges from Class 1 to 12.',
    beneficiaryCategory: 'Education & Scholarships',
    lastVerifiedDate: '2024-07-15',
    dataStatus: 'verified',
    officialInfoUrl: 'https://jnanabhumi.ap.gov.in',
    applicationUrl: 'https://jnanabhumi.ap.gov.in',
    benefitFinancials: '₹15,000 / year credited directly to mother’s Aadhaar-linked bank account',
    frequency: 'Annual',
    verificationAuthority: 'School Headmaster & Village / Ward Sachivalayam (Welfare Assistant)',
    offlineCenter: 'Child’s School or Village / Ward Sachivalayam',
    helpline: '1902 / 0866-2489830',
    defaultNextAction: 'Verify mother bank account NPCI mapping and ensure child maintains 75% attendance.',
    conditions: [
      {
        id: 'amv-c1-state',
        field: 'state',
        operator: 'equals',
        requiredValue: 'Andhra Pradesh',
        isMandatory: true,
        label: 'Resident of Andhra Pradesh',
        explanation: 'Must be an AP resident mother/guardian.',
        sourceReference: 'G.O.Ms.No.63 School Education'
      },
      {
        id: 'amv-c2-child-enrolled',
        field: 'education',
        operator: 'in',
        requiredValue: [
          'Below 10th',
          '10th Class (SSC)',
          'Intermediate (11th-12th)'
        ],
        isMandatory: true,
        label: 'Child in School / Intermediate',
        explanation: 'Applicant household must have child studying in Classes 1 to 12.',
        sourceReference: 'Amma Vodi Eligibility Matrix'
      },
      {
        id: 'amv-c3-income',
        field: 'incomeBand',
        operator: 'in',
        requiredValue: [
          'Below ₹1,00,000 / year',
          '₹1,00,000 - ₹2,50,000 / year'
        ],
        isMandatory: true,
        label: 'BPL Income Ceiling',
        explanation: 'Household income must not exceed ₹2,50,000 per year.',
        sourceReference: 'Navasakam Rice Card Registry'
      },
      {
        id: 'amv-c4-attendance',
        field: 'education',
        operator: 'external_verification',
        isMandatory: true,
        requiresExternalVerification: true,
        label: '75% Child School Attendance',
        explanation: 'Child must maintain 75% attendance recorded on the Child Info system.',
        sourceReference: 'AP School Education Attendance Portal'
      }
    ],
    requiredDocuments: [
      {
        id: 'doc-child-aadhaar',
        name: "Child's Aadhaar & Student Information (Child Info ID)",
        teluguName: 'పిల్లల ఆధార్ & చైల్డ్ ఇన్ఫో ఐడీ',
        description: 'School enrollment registration record.',
        whereToGet: 'School Headmaster.',
        isMandatory: true
      },
      {
        id: 'doc-mother-bank-npci',
        name: "Mother's Aadhaar Linked Bank Account",
        teluguName: 'తల్లి ఆధార్-లింక్డ్ బ్యాంక్ ఖాతా',
        description: 'Must have active NPCI mapping.',
        whereToGet: 'Bank Branch / Post Office.',
        isMandatory: true
      },
      {
        id: 'doc-rice-card',
        name: 'AP Rice Card',
        teluguName: 'బియ్యం కార్డు',
        description: 'Ration card containing mother and child names.',
        whereToGet: 'Civil Supplies Dept.',
        isMandatory: true
      }
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Data Collection by School Headmaster',
        teluguTitle: 'పాఠశాల ప్రధానోపాధ్యాయుల నమోదు',
        description: 'School HM verifies child attendance and links mother Aadhaar on the Student Info system.',
        locationOrUrl: 'School Office'
      },
      {
        stepNumber: 2,
        title: 'Social Audit at Sachivalayam',
        teluguTitle: 'సచివాలయ సామాజిక తనిఖీ',
        description: 'Beneficiary provisional list published for feedback; e-KYC authenticated with biometric.',
        locationOrUrl: 'Grama / Ward Sachivalayam',
        isOffline: true
      },
      {
        stepNumber: 3,
        title: 'Annual Fund Disbursement',
        teluguTitle: 'వార్షిక నిధుల జమ',
        description: 'Net ₹13,000 credited to mother’s bank account around academic year reopening (June/July).',
        locationOrUrl: 'Bank Account'
      }
    ]
  },
  {
    id: 'post-matric-sc-st-bc',
    name: 'Post-Matric Scholarship for SC/ST/OBC Students',
    code: 'IND-SJE-08',
    teluguName: 'ఎస్సీ/ఎస్టీ/ఓబీసీ విద్యార్థుల పోస్ట్-మెట్రిక్ స్కాలర్‌షిప్',
    schemeLevel: 'Central',
    department: 'Ministry of Social Justice & Empowerment, Govt of India',
    description: 'Centrally sponsored financial assistance for post-secondary education providing full non-refundable compulsory fees and academic maintenance allowance for SC, ST, and OBC students across India.',
    beneficiaryCategory: 'Education & Scholarships',
    lastVerifiedDate: '2024-09-01',
    dataStatus: 'verified',
    officialInfoUrl: 'https://scholarships.gov.in',
    applicationUrl: 'https://scholarships.gov.in',
    benefitFinancials: 'Full mandatory tuition fees + maintenance allowance of ₹2,500 to ₹13,500 per year',
    frequency: 'Annual',
    verificationAuthority: 'National Scholarship Portal (NSP) & State District Welfare Officer',
    offlineCenter: 'College Scholarship Desk / District Welfare Office',
    helpline: '0120-6619540 (NSP Helpdesk)',
    defaultNextAction: 'Complete NSP One-Time Registration (OTR) with face authentication on scholarships.gov.in.',
    conditions: [
      {
        id: 'pms-c1-category',
        field: 'socialCategory',
        operator: 'in',
        requiredValue: [
          'SC (Scheduled Caste)',
          'ST (Scheduled Tribe)',
          'OBC / BC (Backward Classes)'
        ],
        isMandatory: true,
        label: 'SC / ST / OBC Community',
        explanation: 'Applicant must belong to recognized SC, ST, or OBC communities.',
        sourceReference: 'Ministry of Social Justice Post-Matric Guidelines'
      },
      {
        id: 'pms-c2-education',
        field: 'education',
        operator: 'in',
        requiredValue: [
          '10th Class (SSC)',
          'Intermediate (11th-12th)',
          'ITI / Polytechnic Diploma',
          'Undergraduate (BA, B.Sc, B.Com, B.Tech, MBBS)',
          'Postgraduate / Professional'
        ],
        isMandatory: true,
        label: 'Post-Matric Enrolled Student',
        explanation: 'Must have passed 10th class and be pursuing post-matric recognized studies.',
        sourceReference: 'NSP Course Directory'
      },
      {
        id: 'pms-c3-income',
        field: 'incomeBand',
        operator: 'in',
        requiredValue: [
          'Below ₹1,00,000 / year',
          '₹1,00,000 - ₹2,50,000 / year'
        ],
        isMandatory: true,
        label: 'Family Income Limit (<= ₹2.5L)',
        explanation: 'Total family annual income must not exceed ₹2,50,000.',
        sourceReference: 'NSP Income Verification API'
      }
    ],
    requiredDocuments: [
      {
        id: 'doc-caste-nsp',
        name: 'Digitally Signed Caste Certificate',
        teluguName: 'డిజిటల్ కుల ధ్రువీకరణ పత్రం',
        description: 'Must match applicant name with Aadhaar.',
        whereToGet: 'MeeSeva / State Revenue Dept.',
        isMandatory: true
      },
      {
        id: 'doc-income-nsp',
        name: 'Valid Income Certificate',
        teluguName: 'ఆదాయ ధ్రువీకరణ పత్రం',
        description: 'Issued for current financial year.',
        whereToGet: 'MeeSeva.',
        isMandatory: true
      },
      {
        id: 'doc-10th-marksheet',
        name: '10th Class / Previous Year Passed Marksheet',
        teluguName: '10వ తరగతి మార్కుల జాబితా',
        description: 'Proof of qualifying examination.',
        whereToGet: 'State Board / DigiLocker.',
        isMandatory: true
      }
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'NSP One-Time Registration (OTR)',
        teluguTitle: 'ఎన్‌ఎస్‌పీ వన్-టైమ్ రిజిస్ట్రేషన్ (OTR)',
        description: 'Download NSP OTR App, complete Aadhaar face authentication, and generate 14-digit OTR number.',
        locationOrUrl: 'scholarships.gov.in'
      },
      {
        stepNumber: 2,
        title: 'Online Application & Document Upload',
        teluguTitle: 'దరఖాస్తు సమర్పణ',
        description: 'Select Post-Matric Scholarship scheme, enter college roll number, and submit online.',
        locationOrUrl: 'NSP Student Dashboard'
      },
      {
        stepNumber: 3,
        title: 'Institute Level (L1) & District (L2) Verification',
        teluguTitle: 'కళాశాల మరియు జిల్లా స్థాయి పరిశీలన',
        description: 'College verification officer checks original certificates online, followed by District Welfare Officer sanction.',
        locationOrUrl: 'College Administrative Office'
      }
    ]
  },
  {
    id: 'ysr-sunna-vaddi',
    name: 'YSR Sunna Vaddi (Zero Interest Loans for SHGs)',
    code: 'AP-WCD-09',
    teluguName: 'వైఎస్సార్ సున్నా వడ్డీ (డ్వాక్రా మహిళలకు వడ్డీ రహిత రుణాలు)',
    schemeLevel: 'State',
    department: 'SERP (Society for Elimination of Rural Poverty) & MEPMA, Govt of AP',
    description: '100% interest subvention for rural and urban women Self-Help Group (SHG / DWCRA) members, reimbursing bank loan interest paid on bank credit up to ₹3,00,000.',
    beneficiaryCategory: 'Women & Child Welfare',
    lastVerifiedDate: '2024-06-30',
    dataStatus: 'verified',
    officialInfoUrl: 'https://serp.ap.gov.in',
    applicationUrl: 'https://serp.ap.gov.in',
    benefitFinancials: 'Full Interest Subvention (approx ₹3,000 to ₹10,000 credited annually to SHG bank account)',
    frequency: 'Annual',
    verificationAuthority: 'Village Organization (VO) / Community Coordinator & SERP',
    offlineCenter: 'Grama / Ward Sachivalayam or Village Organization (VO)',
    helpline: '1902 / 0866-2489830',
    defaultNextAction: 'Ensure SHG loan monthly EMIs are repaid on time to maintain prompt-payer eligibility.',
    conditions: [
      {
        id: 'sv-c1-state',
        field: 'state',
        operator: 'equals',
        requiredValue: 'Andhra Pradesh',
        isMandatory: true,
        label: 'Resident of Andhra Pradesh',
        explanation: 'Must be an AP resident.',
        sourceReference: 'SERP Policy'
      },
      {
        id: 'sv-c2-gender',
        field: 'gender',
        operator: 'equals',
        requiredValue: 'Female',
        isMandatory: true,
        label: 'Women SHG Member',
        explanation: 'Only women members of recognized SHGs are eligible.',
        sourceReference: 'Sunna Vaddi Guidelines'
      },
      {
        id: 'sv-c3-repayment',
        field: 'employmentStatus',
        operator: 'external_verification',
        isMandatory: true,
        requiresExternalVerification: true,
        label: 'Prompt Bank Loan Repayment',
        explanation: 'SHG group must have repaid monthly installments on-time without NPA default.',
        sourceReference: 'SLBC Bank Repayment Ledger'
      }
    ],
    requiredDocuments: [
      {
        id: 'doc-shg-passbook',
        name: 'SHG Loan Account Passbook & Group Resolution',
        teluguName: 'డ్వాక్రా గ్రూప్ తీర్మానం & లోన్ పాస్‌బుక్',
        description: 'Showing regular monthly loan repayments.',
        whereToGet: 'Financing Bank Branch & SHG Bookkeeper.',
        isMandatory: true
      },
      {
        id: 'doc-member-aadhaar',
        name: "Member's Aadhaar Card",
        teluguName: 'సభ్యురాలి ఆధార్ కార్డు',
        description: 'Linked to SHG member database in SERP portal.',
        whereToGet: 'UIDAI.',
        isMandatory: true
      }
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Regular Bank Loan Repayment',
        teluguTitle: 'సకాలంలో బ్యాంకు వాయిదాల చెల్లింపు',
        description: 'SHG group repays monthly principal and interest on or before the due date to the bank.',
        locationOrUrl: 'Commercial / Grameena Bank'
      },
      {
        stepNumber: 2,
        title: 'Automated Bank Data Pull',
        teluguTitle: 'ఆటోమేటెడ్ బ్యాంకు డేటా రికార్డు',
        description: 'SERP / MEPMA electronically extracts prompt-repayment data directly from SLBC banks without manual paperwork.',
        locationOrUrl: 'SERP System'
      },
      {
        stepNumber: 3,
        title: 'Interest Credit to SHG Savings Account',
        teluguTitle: 'సంఘం ఖాతాలో వడ్డీ మొత్తం జమ',
        description: 'State government credits the complete interest portion back into the SHG account for internal distribution.',
        locationOrUrl: 'Bank Account'
      }
    ]
  },
  {
    id: 'nmmss-central',
    name: 'National Means-cum-Merit Scholarship (NMMSS)',
    code: 'IND-EDU-10',
    teluguName: 'నేషనల్ మీన్స్-కమ్-మెరిట్ స్కాలర్‌షిప్ (NMMSS)',
    schemeLevel: 'Central',
    department: 'Department of School Education & Literacy, Ministry of Education, India',
    description: 'Direct scholarship of ₹12,000 per year for students from economically weaker sections studying in government and aided schools, continuing through 12th class.',
    beneficiaryCategory: 'Education & Scholarships',
    lastVerifiedDate: '2024-08-01',
    dataStatus: 'verified',
    officialInfoUrl: 'https://scholarships.gov.in',
    applicationUrl: 'https://bse.ap.gov.in',
    benefitFinancials: '₹12,000 / year (Deposited annually via DBT on NSP for Class 9 through 12)',
    frequency: 'Annual',
    verificationAuthority: 'Director of Government Examinations (BSE AP) & NSP',
    offlineCenter: 'School Headmaster / District Educational Office (DEO)',
    helpline: '0120-6619540',
    defaultNextAction: 'Apply through school for the state-level NMMSS selection exam conducted by BSE AP.',
    conditions: [
      {
        id: 'nmm-c1-education',
        field: 'education',
        operator: 'in',
        requiredValue: [
          'Below 10th',
          '10th Class (SSC)'
        ],
        isMandatory: true,
        label: 'Secondary School Student (Class 8 to 10)',
        explanation: 'Must be studying in Class 8 appearing for exam or continuing in 9th/10th grade.',
        sourceReference: 'Ministry of Education NMMSS Scheme Clause 3'
      },
      {
        id: 'nmm-c2-income',
        field: 'incomeBand',
        operator: 'in',
        requiredValue: [
          'Below ₹1,00,000 / year',
          '₹1,00,000 - ₹2,50,000 / year',
          '₹2,50,000 - ₹5,00,000 / year'
        ],
        isMandatory: true,
        label: 'Parental Income Ceiling (<= ₹3.5L)',
        explanation: 'Parental annual income from all sources must not exceed ₹3,50,000.',
        sourceReference: 'NMMSS Revised Income Ceiling G.O.'
      },
      {
        id: 'nmm-c3-merit',
        field: 'education',
        operator: 'external_verification',
        isMandatory: true,
        requiresExternalVerification: true,
        label: 'BSE AP Selection Exam Merit Rank',
        explanation: 'Student must qualify in the MAT/SAT competitive exam conducted by BSE AP with at least 55% marks.',
        sourceReference: 'BSE AP State NMMSS Merit List'
      }
    ],
    requiredDocuments: [
      {
        id: 'doc-7th-marksheet',
        name: 'Class 7 Marksheet / Progress Card',
        teluguName: '7వ తరగతి మార్కుల కార్డు',
        description: 'Certified by Headmaster.',
        whereToGet: 'School.',
        isMandatory: true
      },
      {
        id: 'doc-nmms-hallticket',
        name: 'NMMSS Selection Exam Merit List / Rank Card',
        teluguName: 'ఎన్ఎమ్ఎమ్ఎస్ పరీక్ష ర్యాంక్ కార్డు',
        description: 'Selected in district quota merit list.',
        whereToGet: 'bse.ap.gov.in.',
        isMandatory: true
      },
      {
        id: 'doc-student-bank',
        name: "Student's Own Bank Account (Aadhaar Seeded)",
        teluguName: 'విద్యార్థి స్వంత బ్యాంక్ ఖాతా',
        description: 'Must be in student name with active NPCI mapping.',
        whereToGet: 'Any Nationalized Bank / Post Office.',
        isMandatory: true
      }
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Appear for BSE AP NMMSS Exam',
        teluguTitle: 'ప్రవేశ పరీక్ష రాయడం',
        description: 'School registers student for the November/December state-wide Mental Ability Test (MAT) and Scholastic Aptitude Test (SAT).',
        locationOrUrl: 'Designated Exam Center',
        isOffline: true
      },
      {
        stepNumber: 2,
        title: 'NSP Registration on Qualifying',
        teluguTitle: 'ఎన్‌ఎస్‌పీ పోర్టల్‌లో రిజిస్ట్రేషన్',
        description: 'Qualified students submit their application on the National Scholarship Portal under Department of School Education.',
        locationOrUrl: 'scholarships.gov.in'
      },
      {
        stepNumber: 3,
        title: 'Annual Renewal through 12th Class',
        teluguTitle: '12వ తరగతి వరకు వార్షిక రెన్యువల్',
        description: 'Scholarship of ₹12,000 credited every year subject to passing 9th, 10th, and 11th on first attempt with 55% marks.',
        locationOrUrl: 'Direct Bank Credit'
      }
    ]
  },
  {
    id: 'demo-artisan-seed-grant',
    name: 'AP Rural Artisan Seed Innovation Grant (Illustrative Demo)',
    code: 'DEMO-AP-ART-11',
    teluguName: 'గ్రామీణ చేతివృత్తుల వినూత్న గ్రాంట్ (నమూనా మోడల్)',
    schemeLevel: 'State',
    department: 'Directorate of Handlooms & Textiles, Govt of AP (Demonstration Framework)',
    description: 'An illustrative demo grant model representing proposed pilot funding for rural weaving clusters adopting solar looms in Andhra Pradesh. Included as a transparent demo record.',
    beneficiaryCategory: 'Livelihood & Artisans',
    lastVerifiedDate: '2024-10-20',
    dataStatus: 'illustrative_demo',
    officialInfoUrl: 'https://navasakam.ap.gov.in',
    benefitFinancials: 'Illustrative Demo: ₹25,000 One-Time Equipment Subsidy',
    frequency: 'One-Time',
    verificationAuthority: 'District Industries Centre (DIC) Demonstration Desk',
    offlineCenter: 'DIC Office / Cluster Center',
    helpline: '1902',
    defaultNextAction: 'Illustrative record for testing cluster eligibility modeling.',
    conditions: [
      {
        id: 'demo-c1-state',
        field: 'state',
        operator: 'equals',
        requiredValue: 'Andhra Pradesh',
        isMandatory: true,
        label: 'Resident of Andhra Pradesh',
        explanation: 'Applicant must reside in Andhra Pradesh.',
        sourceReference: 'Illustrative Demo Guidelines'
      },
      {
        id: 'demo-c2-trade',
        field: 'employmentStatus',
        operator: 'equals',
        requiredValue: 'Artisan / Craftsman / Handloom',
        isMandatory: true,
        label: 'Handloom / Artisan Worker',
        explanation: 'Must be actively involved in handloom or artisan trade.',
        sourceReference: 'Illustrative Demo Guidelines'
      },
      {
        id: 'demo-c3-rural',
        field: 'isRural',
        operator: 'boolean_true',
        isMandatory: true,
        label: 'Rural Resident',
        explanation: 'Must reside in rural village panchayat area.',
        sourceReference: 'Illustrative Demo Guidelines'
      }
    ],
    requiredDocuments: [
      {
        id: 'doc-weaver-id',
        name: 'Artisan / Weaver Identity Card (Illustrative Demo)',
        teluguName: 'చేనేత గుర్తింపు కార్డు',
        description: 'Issued by Handlooms Dept.',
        whereToGet: 'District Industries Centre.',
        isMandatory: true
      }
    ],
    applicationSteps: [
      {
        stepNumber: 1,
        title: 'Cluster Registration (Demo Step)',
        teluguTitle: 'క్లస్టర్ నమోదు',
        description: 'Demonstration step for testing cluster application submission.',
        locationOrUrl: 'District Industries Centre'
      }
    ]
  }
];

// Helper to provide UI backward compatibility
for (const s of SCHEMES) {
  if (!s.title) s.title = s.name;
  if (!s.teluguTitle) s.teluguTitle = s.teluguName;
  if (!s.category) s.category = s.beneficiaryCategory;
  if (!s.stateOrCentral) s.stateOrCentral = s.schemeLevel === 'State' ? 'Andhra Pradesh' : 'Central Government';
  if (!s.administeringDept) s.administeringDept = s.department;
  if (!s.tagline) s.tagline = s.description.slice(0, 100) + '...';
  if (!s.benefitSummary) s.benefitSummary = s.description;
  if (!s.officialPortal) {
    s.officialPortal = {
      name: s.officialInfoUrl.replace('https://', '').split('/')[0],
      url: s.officialInfoUrl,
      note: 'Official government portal.'
    };
  }
  if (s.isIllustrativeDemo === undefined) {
    s.isIllustrativeDemo = s.dataStatus === 'illustrative_demo';
  }
}
