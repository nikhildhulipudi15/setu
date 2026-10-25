# HaqSetu AI (హక్ సేతు) — Deterministic Civic Eligibility Engine
> **Tagline:** Every eligible person deserves every benefit.

HaqSetu AI is an independent, privacy-first civic-tech entitlement platform built to help Indian citizens—especially students, small farmers, women, and low-income families in Andhra Pradesh—discover government welfare benefits, understand eligibility requirements, prepare document checklists, and take decisive action without exploitation by middlemen.

---

## 🎯 Purpose & Design Direction

- **Deep Navy & Civic Palette:** `#0a121f` foundation, `#fcfbf9` warm surface, `#0d9488` teal accents, and `#d97706` restrained saffron highlights.
- **Client-Side Data Integrity & Privacy:** Zero sensitive data requested. No 12-digit Aadhaar numbers, PAN cards, OTPs, or bank passwords are ever asked for or stored. Everything runs securely in local browser storage.
- **Bilingual Experience:** English & Telugu (తెలుగు) across navigation, scheme summaries, application instructions, and AI troubleshooting.

---

## ⚙️ Deterministic Eligibility Engine Architecture

The eligibility engine is kept completely separate from UI components and AI models. It uses explicit, pure comparison functions without opaque weighted scores or probabilistic decisions.

### 1. Structured Condition Model
Each scheme condition specifies:
- `field`: The specific `UserProfile` field it evaluates (e.g., `state`, `age`, `incomeBand`, `landHoldingAcres`, `employmentStatus`).
- `operator`: An explicit comparison rule (`equals`, `not_equals`, `in`, `not_in`, `less_than_or_equal`, `greater_than_or_equal`, `between`, `boolean_true`, `boolean_false`, or `external_verification`).
- `requiredValue`: The target threshold or valid set.
- `isMandatory`: `true` if failing this condition disqualifies the applicant.
- `explanation`: Plain-language explanation for why the condition exists.
- `sourceReference`: The official Government Order (G.O.), Act, or policy clause reference.
- `requiresExternalVerification`: Flags conditions that cannot be self-certified (such as 75% biometric college attendance or Webland title verification).

### 2. Condition Evaluation States
For each condition evaluated against a profile, the engine returns exactly one of three states:
1. `Satisfied`: The known profile value satisfies the comparison rule.
2. `Not satisfied`: The known profile value conflicts with the comparison rule.
3. `Unknown / needs verification`: The profile field is missing, null, or marked as unknown ("Unknown / Not sure", "Prefer not to say"), or requires official on-ground confirmation.

### 3. Overall Scheme Outcomes
For each scheme evaluated, the engine returns exactly one of three canonical outcomes:
1. `POTENTIAL MATCH`: All mandatory conditions required for a match are known and satisfied, with no known disqualifying condition.
2. `NEEDS VERIFICATION`: One or more material conditions are unknown or require official on-ground confirmation (and no known disqualifying condition).
3. `LIKELY NOT A MATCH`: A known answer conflicts with an explicit mandatory eligibility condition.

> **Civic Trust Disclaimer:** The application clearly displays on all screens: *"Informational Assessment: This assessment is an informational indicator based on your stated profile and does not guarantee eligibility or approval. The final decision rests solely with the competent government authority."*

---

## 🧪 Unit Testing Suite

The eligibility engine has 100% test coverage for key civic evaluation scenarios:
- **Fully matching profiles** $\to$ `POTENTIAL MATCH`
- **Disqualifying conditions** $\to$ `LIKELY NOT A MATCH` with explicit conflict explanations
- **Missing / unknown information** $\to$ `NEEDS VERIFICATION` and automatic extraction of `missingProfileFields`
- **Boundary value analysis**:
  - Exact age boundaries: Age 45 and 60 (satisfies YSR Cheyutha); age 44 and 61 (disqualifies)
  - Land ceiling boundaries: 10.0 acres (satisfies); 10.1 acres (disqualifies)
  - Minimum age boundaries: 18 years (satisfies PM Vishwakarma); 17 years (disqualifies)
- **Incomplete and malformed data safety**:
  - Schemes with empty or missing condition arrays
  - Null or undefined user profiles
  - Unrecognized comparison operators

### Running the Test Suite
```bash
npm test
```

### Production Build
```bash
npm run build
```
