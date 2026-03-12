import type { ParsedScenario, NormalizedRecord, StrengthCategory } from '../types';

// ── CONTRAINDICATION RULES ───────────────────────────────────────────────────
interface ContraindicationRule {
  medication: string;
  conditions: string[];
  severity: 'absolute' | 'relative';
  reason: string;
  source: string;
}

const CONTRAINDICATION_RULES: ContraindicationRule[] = [
  { medication: 'metformin', conditions: ['end-stage renal disease','acute kidney injury','egfr <30','severe ckd'], severity: 'absolute', reason: 'Risk of lactic acidosis with severe renal impairment (eGFR <30)', source: 'FDA Label / KDIGO' },
  { medication: 'nsaid', conditions: ['chronic kidney disease','ckd','heart failure','gi bleeding','peptic ulcer'], severity: 'relative', reason: 'NSAIDs increase risk of renal injury, fluid retention, and GI bleeding', source: 'AGS Beers / KDIGO' },
  { medication: 'ibuprofen', conditions: ['chronic kidney disease','ckd','heart failure','gi bleeding'], severity: 'relative', reason: 'NSAIDs contraindicated with CKD, HF, or GI bleed history', source: 'AGS Beers' },
  { medication: 'warfarin', conditions: ['active bleeding','hemorrhagic stroke','severe thrombocytopenia'], severity: 'absolute', reason: 'Active bleeding or hemorrhagic event contraindicates warfarin', source: 'ACCP Guidelines' },
  { medication: 'ticagrelor', conditions: ['active bleeding','prior intracranial hemorrhage','severe hepatic impairment'], severity: 'absolute', reason: 'Contraindicated with active pathological bleeding or ICH history', source: 'FDA Label' },
  { medication: 'sacubitril', conditions: ['angioedema history','pregnancy','bilateral renal artery stenosis'], severity: 'absolute', reason: 'ARNI contraindicated with angioedema history; do not use with ACEi within 36h', source: 'ACC/AHA' },
  { medication: 'beta-blocker', conditions: ['severe bradycardia','high-degree av block','decompensated heart failure','severe asthma'], severity: 'relative', reason: 'Beta-blockers may worsen bradycardia, AV block, or bronchospasm', source: 'ACC/AHA' },
  { medication: 'ace inhibitor', conditions: ['angioedema history','bilateral renal artery stenosis','pregnancy','hyperkalemia >5.5'], severity: 'absolute', reason: 'ACEi contraindicated with angioedema history or pregnancy', source: 'ACC/AHA' },
  { medication: 'statin', conditions: ['active liver disease','pregnancy'], severity: 'absolute', reason: 'Statins contraindicated in active liver disease and pregnancy', source: 'FDA Label' },
  { medication: 'benzodiazepine', conditions: ['dementia','fall risk','elderly','respiratory depression','severe copd'], severity: 'relative', reason: 'Increased fall risk, cognitive impairment, and respiratory depression in elderly/dementia', source: 'AGS Beers 2023' },
  { medication: 'diphenhydramine', conditions: ['dementia','elderly','fall risk','urinary retention','glaucoma'], severity: 'relative', reason: 'Anticholinergic — avoid in elderly per Beers Criteria', source: 'AGS Beers 2023' },
  { medication: 'opioid', conditions: ['respiratory depression','severe copd','untreated sleep apnea','concurrent benzodiazepine'], severity: 'relative', reason: 'Increased risk of respiratory depression; black box warning with concurrent benzodiazepines', source: 'CDC Opioid Guideline 2022' },
  { medication: 'dapagliflozin', conditions: ['type 1 diabetes','dialysis','egfr <20'], severity: 'absolute', reason: 'SGLT2i not recommended for T1D or eGFR <20', source: 'FDA Label / KDIGO' },
  { medication: 'spironolactone', conditions: ['hyperkalemia >5.0','severe renal failure','anuria'], severity: 'absolute', reason: 'Risk of life-threatening hyperkalemia', source: 'ACC/AHA' },
];

// ── AGE-BASED EXCLUSION RULES ────────────────────────────────────────────────
interface AgeRule {
  condition: string;
  ageMin?: number;
  ageMax?: number;
  modification: string;
  source: string;
}

const AGE_RULES: AgeRule[] = [
  { condition: 'statin therapy', ageMin: 76, modification: 'Statin initiation for primary prevention in patients >75 requires shared decision-making; benefit less certain', source: 'ACC/AHA Lipid 2018' },
  { condition: 'intensive bp control', ageMin: 80, modification: 'BP targets may be relaxed in patients ≥80; <150/90 may be acceptable per clinician judgment', source: 'ACP/AAFP 2017' },
  { condition: 'cancer screening', ageMin: 76, modification: 'Cancer screening generally not recommended after age 75-85 unless life expectancy >10 years', source: 'USPSTF' },
  { condition: 'diabetes a1c target', ageMin: 75, modification: 'A1c target <8% for older adults with comorbidities; avoid hypoglycemia', source: 'ADA 2024' },
  { condition: 'icd implantation', ageMin: 80, modification: 'ICD benefit attenuated in patients >80 or with significant comorbidity burden', source: 'ACC/AHA HF 2022' },
  { condition: 'hip fracture surgery', ageMax: 110, modification: 'Advanced age alone is not a contraindication to hip fracture surgery; functional status and goals of care guide decisions', source: 'AAOS 2021' },
  { condition: 'dual antiplatelet', ageMin: 80, modification: 'Bleeding risk increases significantly with age; shorter DAPT duration may be preferred', source: 'ACC/AHA 2023' },
];

// ── MISSING DATA CRITICALITY ─────────────────────────────────────────────────
interface MissingDataRule {
  field: string;
  contexts: string[];
  criticality: 'critical' | 'important' | 'helpful';
  impact: string;
}

const MISSING_DATA_RULES: MissingDataRule[] = [
  { field: 'Renal function (eGFR/creatinine)', contexts: ['medication','ckd','diabetes','heart failure','contrast','nsaid','ace inhibitor','metformin','sglt2','anticoagulation'], criticality: 'critical', impact: 'Multiple medication dosing decisions depend on renal function' },
  { field: 'Ejection fraction', contexts: ['heart failure','post-mi','icd','cardiac device','carvedilol','sacubitril'], criticality: 'critical', impact: 'EF determines GDMT intensity, device eligibility, and prognosis' },
  { field: 'Allergy status', contexts: ['medication','antibiotic','contrast','nsaid','penicillin','sulfa'], criticality: 'critical', impact: 'Unknown allergies pose patient safety risk' },
  { field: 'Bleeding risk assessment', contexts: ['anticoagulation','dapt','antiplatelet','warfarin','apixaban','surgery'], criticality: 'critical', impact: 'Bleeding risk affects antithrombotic agent selection and duration' },
  { field: 'Blood pressure', contexts: ['hypertension','stroke','heart failure','ckd','diabetes','medication'], criticality: 'important', impact: 'BP targets vary by condition; needed for medication titration' },
  { field: 'Weight-bearing / mobility status', contexts: ['hip fracture','knee replacement','hip replacement','fracture','fall','rehab'], criticality: 'critical', impact: 'Determines rehab approach, discharge disposition, and DVT risk' },
  { field: 'Cognitive status', contexts: ['elderly','dementia','delirium','fall','home care','discharge','medication management'], criticality: 'important', impact: 'Affects medication self-management, safety planning, discharge disposition' },
  { field: 'Caregiver / social support', contexts: ['home care','home health','discharge','elderly','dementia','frailty','fall'], criticality: 'important', impact: 'Critical for safe discharge planning and home care adequacy' },
  { field: 'Home safety assessment', contexts: ['home care','home health','fall','hip fracture','elderly','discharge home'], criticality: 'important', impact: 'Environmental hazards are leading modifiable fall risk factor' },
  { field: 'Nutritional status', contexts: ['wound care','pressure injury','malnutrition','elderly','cancer','surgery','icu'], criticality: 'important', impact: 'Malnutrition impairs wound healing, immune function, and recovery' },
  { field: 'Current medication list', contexts: ['any'], criticality: 'critical', impact: 'Required for drug interaction checking and reconciliation' },
  { field: 'HbA1c level', contexts: ['diabetes','pre-diabetes','metabolic syndrome','sglt2','glp-1','metformin'], criticality: 'important', impact: 'Needed for glycemic control assessment and medication adjustment' },
  { field: 'Smoking status', contexts: ['cardiovascular','copd','lung cancer','stroke','wound care','surgery'], criticality: 'important', impact: 'Smoking cessation is highest-yield intervention for many conditions' },
  { field: 'Code status / advance directives', contexts: ['palliative','hospice','elderly','critical','icu','cancer','dementia','heart failure'], criticality: 'important', impact: 'Essential for aligning care with patient goals' },
  { field: 'Insurance / coverage status', contexts: ['discharge','home health','snf','rehab','medication','dme'], criticality: 'helpful', impact: 'Affects discharge disposition options and medication access' },
];

// ── STRUCTURED RETRIEVAL FILTERS ─────────────────────────────────────────────
export interface RetrievalFilter {
  specialty?: string;
  diagnosisCategory?: string;
  ageBand?: string;
  careSetting?: string;
  studyTypes?: string[];
  minEvidenceScore?: number;
  yearFrom?: number;
}

export function buildRetrievalFilter(parsed: ParsedScenario): RetrievalFilter {
  const filter: RetrievalFilter = {};
  if (parsed.specialtyArea) filter.specialty = parsed.specialtyArea;
  if (parsed.primaryCondition) filter.diagnosisCategory = parsed.primaryCondition;
  if (parsed.age) {
    if (parsed.age < 18) filter.ageBand = 'pediatric';
    else if (parsed.age < 40) filter.ageBand = 'young-adult';
    else if (parsed.age < 65) filter.ageBand = 'middle-aged';
    else if (parsed.age < 80) filter.ageBand = 'elderly';
    else filter.ageBand = 'very-elderly';
  }
  if (parsed.careSetting) filter.careSetting = parsed.careSetting;
  filter.minEvidenceScore = 40;
  return filter;
}

export function applyRetrievalFilter(records: NormalizedRecord[], filter: RetrievalFilter): NormalizedRecord[] {
  let results = [...records];
  if (filter.minEvidenceScore) results = results.filter(r => r.evidenceScore >= filter.minEvidenceScore!);
  if (filter.yearFrom) results = results.filter(r => r.year >= filter.yearFrom!);
  if (filter.specialty) {
    const spec = filter.specialty.toLowerCase();
    results.sort((a, b) => {
      const aMatch = a.specialty?.toLowerCase().includes(spec) ? 1 : 0;
      const bMatch = b.specialty?.toLowerCase().includes(spec) ? 1 : 0;
      return bMatch - aMatch;
    });
  }
  return results;
}

// ── PUBLIC API ───────────────────────────────────────────────────────────────
export interface ClinicalAlert {
  type: 'contraindication' | 'age-caution' | 'missing-data';
  severity: 'critical' | 'important' | 'helpful';
  title: string;
  detail: string;
  source: string;
}

export function checkContraindications(parsed: ParsedScenario): ClinicalAlert[] {
  const alerts: ClinicalAlert[] = [];
  const allContext = [
    ...(parsed.primaryCondition ? [parsed.primaryCondition.toLowerCase()] : []),
    ...parsed.comorbidities.map(c => c.toLowerCase()),
    ...parsed.observations.map(o => o.toLowerCase()),
  ].join(' ');

  for (const med of parsed.medications) {
    const medLower = med.toLowerCase();
    for (const rule of CONTRAINDICATION_RULES) {
      if (medLower.includes(rule.medication) || rule.medication.includes(medLower)) {
        for (const cond of rule.conditions) {
          if (allContext.includes(cond.toLowerCase())) {
            alerts.push({
              type: 'contraindication',
              severity: rule.severity === 'absolute' ? 'critical' : 'important',
              title: `${rule.medication.charAt(0).toUpperCase() + rule.medication.slice(1)} — potential ${rule.severity} contraindication`,
              detail: rule.reason,
              source: rule.source,
            });
            break;
          }
        }
      }
    }
  }
  return alerts;
}

export function checkAgeExclusions(parsed: ParsedScenario): ClinicalAlert[] {
  const alerts: ClinicalAlert[] = [];
  if (!parsed.age) return alerts;

  const allContext = [
    parsed.primaryCondition?.toLowerCase() || '',
    ...parsed.comorbidities.map(c => c.toLowerCase()),
    ...parsed.medications.map(m => m.toLowerCase()),
  ].join(' ');

  for (const rule of AGE_RULES) {
    if (rule.ageMin && parsed.age >= rule.ageMin && allContext.includes(rule.condition.toLowerCase().split(' ')[0])) {
      alerts.push({
        type: 'age-caution',
        severity: 'important',
        title: `Age consideration: ${rule.condition}`,
        detail: rule.modification,
        source: rule.source,
      });
    }
  }
  return alerts;
}

export function checkMissingData(parsed: ParsedScenario): ClinicalAlert[] {
  const alerts: ClinicalAlert[] = [];
  const allContext = [
    parsed.primaryCondition?.toLowerCase() || '',
    ...parsed.comorbidities.map(c => c.toLowerCase()),
    ...parsed.medications.map(m => m.toLowerCase()),
    parsed.careSetting || '',
    parsed.carePhase || '',
  ].join(' ');

  for (const field of parsed.missingData) {
    const rule = MISSING_DATA_RULES.find(r => r.field === field);
    if (rule) {
      const relevant = rule.contexts.includes('any') || rule.contexts.some(ctx => allContext.includes(ctx));
      if (relevant) {
        alerts.push({
          type: 'missing-data',
          severity: rule.criticality,
          title: `Missing: ${rule.field}`,
          detail: rule.impact,
          source: 'Clinical decision-support rules',
        });
      }
    }
  }
  return alerts;
}

export function runAllClinicalChecks(parsed: ParsedScenario): ClinicalAlert[] {
  return [
    ...checkContraindications(parsed),
    ...checkAgeExclusions(parsed),
    ...checkMissingData(parsed),
  ].sort((a, b) => {
    const order = { critical: 0, important: 1, helpful: 2 };
    return order[a.severity] - order[b.severity];
  });
}
