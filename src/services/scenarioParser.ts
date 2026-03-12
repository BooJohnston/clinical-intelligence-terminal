import type { ParsedScenario, CarePhase, CareSetting } from '../types';

const AGE_PATTERN = /(\d{1,3})[\s-]*(?:year|yr|y\.?o\.?|yo)/i;
const SEX_PATTERN = /\b(male|female|man|woman)\b/i;

// ── CONDITIONS (ordered by specificity — longer/more-specific first) ─────────
const CONDITIONS: [RegExp, string][] = [
  // Orthopedic / Fracture
  [/hip\s*fracture|fractured?\s*hip|broken\s*hip|femoral\s*(?:neck)?\s*fracture|nof\s*fracture/i, 'Hip Fracture'],
  [/total\s*hip\s*(?:replacement|arthroplasty)|tha\b/i, 'Total Hip Arthroplasty'],
  [/total\s*knee\s*(?:replacement|arthroplasty)|tka\b/i, 'Total Knee Arthroplasty'],
  [/spinal?\s*fracture|vertebral\s*fracture|compression\s*fracture/i, 'Vertebral Fracture'],
  [/(?:distal\s*)?radius\s*fracture|colles|wrist\s*fracture/i, 'Distal Radius Fracture'],
  [/rotator\s*cuff/i, 'Rotator Cuff Injury'],
  [/fracture/i, 'Fracture (Unspecified)'],
  // Cardiac
  [/st[\s-]*(?:elevation|segment).*(?:mi|myocardial)|stemi\b/i, 'ST-Elevation MI'],
  [/n?stemi|non[\s-]*st.*(?:mi|myocardial)/i, 'Non-ST-Elevation MI'],
  [/myocardial\s*infarction|heart\s*attack|\bmi\b(?=.*(?:post|after|acute|discharge|pci|stent))/i, 'Myocardial Infarction'],
  [/acute\s*coronary|acs\b/i, 'Acute Coronary Syndrome'],
  [/heart\s*failure.*(?:reduced|low)|hfref\b/i, 'Heart Failure with Reduced EF'],
  [/heart\s*failure.*preserved|hfpef\b/i, 'Heart Failure with Preserved EF'],
  [/heart\s*failure|chf\b|\bhf\b/i, 'Heart Failure'],
  [/atrial\s*fib|afib\b|\baf\b(?=.*(?:anticoag|stroke|rhythm))/i, 'Atrial Fibrillation'],
  [/aortic\s*(?:stenosis|valve)/i, 'Aortic Valve Disease'],
  [/cabg|coronary\s*(?:artery)?\s*bypass/i, 'Post-CABG'],
  // Neurological
  [/hemorrhagic\s*stroke|intracerebral\s*hemorrhage|ich\b/i, 'Hemorrhagic Stroke'],
  [/ischemic\s*stroke/i, 'Ischemic Stroke'],
  [/stroke|cva\b/i, 'Stroke'],
  [/\btia\b|transient\s*ischemic/i, 'Transient Ischemic Attack'],
  [/parkinson/i, 'Parkinson Disease'],
  [/alzheimer|dementia/i, 'Dementia'],
  [/multiple\s*sclerosis|\bms\b(?=.*(?:neuro|relaps|symptom))/i, 'Multiple Sclerosis'],
  [/seizure|epilepsy/i, 'Seizure Disorder'],
  [/traumatic\s*brain|tbi\b/i, 'Traumatic Brain Injury'],
  // Pulmonary
  [/copd|chronic\s*obstructive/i, 'COPD'],
  [/pneumonia/i, 'Pneumonia'],
  [/pulmonary\s*embolism|\bpe\b(?=.*(?:anticoag|lung|clot|dvt))/i, 'Pulmonary Embolism'],
  [/asthma/i, 'Asthma'],
  [/pulmonary\s*fibrosis|ipf\b/i, 'Pulmonary Fibrosis'],
  [/(?:covid|sars).*(?:long|post)|long\s*covid/i, 'Post-COVID Syndrome'],
  [/ventilat|tracheostom/i, 'Ventilator/Tracheostomy Care'],
  // Renal
  [/end[\s-]*stage\s*renal|esrd|dialysis/i, 'End-Stage Renal Disease'],
  [/chronic\s*kidney|ckd\b/i, 'Chronic Kidney Disease'],
  [/acute\s*kidney|aki\b/i, 'Acute Kidney Injury'],
  // GI
  [/gi\s*bleed|gastrointestinal\s*bleed/i, 'GI Bleeding'],
  [/cirrhosis|liver\s*(?:failure|disease)/i, 'Liver Disease'],
  [/pancreatitis/i, 'Pancreatitis'],
  [/bowel\s*obstruct/i, 'Bowel Obstruction'],
  [/colostomy|ileostomy|ostomy/i, 'Ostomy Care'],
  // Endocrine
  [/type\s*1\s*diabet|t1d\b/i, 'Type 1 Diabetes'],
  [/diabet|dm\b|t2d\b|t2dm\b/i, 'Type 2 Diabetes'],
  [/hypoglycemia/i, 'Hypoglycemia'],
  [/thyroid/i, 'Thyroid Disorder'],
  // Oncology
  [/lung\s*cancer|nsclc|sclc/i, 'Lung Cancer'],
  [/breast\s*cancer/i, 'Breast Cancer'],
  [/colon\s*cancer|colorectal/i, 'Colorectal Cancer'],
  [/prostate\s*cancer/i, 'Prostate Cancer'],
  [/pancreatic\s*cancer/i, 'Pancreatic Cancer'],
  [/leukemia|lymphoma|myeloma/i, 'Hematologic Malignancy'],
  [/cancer|malignancy|oncology|chemotherapy|radiation\s*therapy/i, 'Cancer (General)'],
  [/radiation\s*(?:injury|cystitis|proctitis)|osteoradionecrosis|\born\b/i, 'Radiation Injury'],
  // Infectious
  [/sepsis|septic/i, 'Sepsis'],
  [/cellulitis/i, 'Cellulitis'],
  [/urinary\s*tract\s*infection|uti\b/i, 'Urinary Tract Infection'],
  [/osteomyelitis/i, 'Osteomyelitis'],
  [/endocarditis/i, 'Endocarditis'],
  [/c[\.\s]*diff|clostridioides/i, 'C. difficile Infection'],
  // Wound / Skin
  [/pressure\s*(?:ulcer|injury|sore)|decubitus|stage\s*[1-4]/i, 'Pressure Injury'],
  [/diabetic\s*(?:foot|ulcer)|dfu\b/i, 'Diabetic Foot Ulcer'],
  [/venous\s*(?:ulcer|stasis)|leg\s*ulcer/i, 'Venous Leg Ulcer'],
  [/wound|surgical\s*site/i, 'Wound Care'],
  [/burn/i, 'Burn Injury'],
  [/amputation/i, 'Amputation'],
  // Psychiatric / Behavioral
  [/depression|major\s*depressive/i, 'Major Depression'],
  [/anxiety\s*disorder|gad\b/i, 'Anxiety Disorder'],
  [/bipolar/i, 'Bipolar Disorder'],
  [/schizophrenia|psychosis/i, 'Schizophrenia/Psychosis'],
  [/substance\s*(?:abuse|use)|alcohol\s*(?:use|dependence)|opioid\s*(?:use|dependence)/i, 'Substance Use Disorder'],
  [/delirium/i, 'Delirium'],
  // Geriatric Syndromes
  [/(?:fall|fell|falling)(?!\s*(?:creek|river|city|out))/i, 'Fall / Fall Risk'],
  [/frailty|frail/i, 'Frailty'],
  [/malnutrition|failure\s*to\s*thrive/i, 'Malnutrition / FTT'],
  [/dysphagia|swallowing/i, 'Dysphagia'],
  [/incontinence/i, 'Incontinence'],
  [/polypharmacy/i, 'Polypharmacy'],
  // Urology
  [/angiomyolipoma|aml(?=.*(?:renal|kidney|tsc))/i, 'Renal Angiomyolipoma'],
  [/renal\s*mass|kidney\s*mass/i, 'Renal Mass'],
  [/benign\s*prostatic|bph\b/i, 'BPH'],
  // Vascular
  [/dvt|deep\s*vein\s*thrombosis/i, 'Deep Vein Thrombosis'],
  [/peripheral\s*(?:artery|arterial|vascular)|pad\b|pvd\b/i, 'Peripheral Artery Disease'],
  [/aortic\s*aneurysm|aaa\b/i, 'Aortic Aneurysm'],
  // Other
  [/hyperbaric|hbot\b/i, 'Hyperbaric Oxygen Therapy'],
  [/palliative|hospice|end[\s-]*of[\s-]*life|comfort\s*care/i, 'Palliative / Hospice'],
  [/rehab(?:ilitation)?/i, 'Rehabilitation'],
  [/pain\s*management|chronic\s*pain/i, 'Chronic Pain'],
  [/obesity|bariatric/i, 'Obesity'],
  [/sleep\s*apnea|osa\b/i, 'Sleep Apnea'],
];

const COMORBIDITY_KEYWORDS = ['diabetes','hypertension','ckd','copd','obesity','afib','atrial fibrillation','cancer','osa','sleep apnea','anemia','cirrhosis','depression','anxiety','dementia','pad','pvd','hiv','hepatitis','hypothyroid','hyperthyroid','gerd','osteoporosis','arthritis','gout','asthma','chf','heart failure'];
const RISK_KEYWORDS = ['smoker','smoking','current smoker','former smoker','obese','sedentary','alcohol','family history','hyperlipidemia','dyslipidemia','fall risk','high risk','malnourished','immunocompromised','anticoagulated','on oxygen','bed bound','non-ambulatory','wheelchair'];
const MED_KEYWORDS = ['aspirin','clopidogrel','ticagrelor','prasugrel','statin','atorvastatin','rosuvastatin','metoprolol','carvedilol','bisoprolol','lisinopril','ramipril','enalapril','losartan','valsartan','sacubitril','dapagliflozin','empagliflozin','metformin','insulin','glipizide','semaglutide','liraglutide','warfarin','apixaban','rivaroxaban','edoxaban','dabigatran','enoxaparin','heparin','furosemide','spironolactone','eplerenone','amlodipine','hydralazine','isosorbide','digoxin','amiodarone','levothyroxine','prednisone','dexamethasone','gabapentin','pregabalin','oxycodone','morphine','hydrocodone','acetaminophen','ibuprofen','naproxen','omeprazole','pantoprazole','sertraline','fluoxetine','escitalopram','quetiapine','risperidone','donepezil','memantine','albuterol','tiotropium','budesonide','calcium','vitamin d','iron','b12','potassium','magnesium'];
const OBSERVATION_KEYWORDS = ['ejection fraction','ef ','egfr','creatinine','hemoglobin','a1c','hba1c','blood pressure','bp ','heart rate','hr ','bmi','weight','temperature','oxygen','spo2','o2 sat','inr','ptt','platelet','wbc','albumin','prealbumin','bnp','troponin','lactate','glucose','sodium','potassium','calcium'];

const PHASE_KEYWORDS: Record<string, CarePhase> = {
  'discharge':'discharge','discharg':'discharge','returning home':'discharge','going home':'discharge','sent home':'discharge',
  'post-acute':'post-acute','post acute':'post-acute','transitional':'post-acute',
  'follow-up':'follow-up','follow up':'follow-up','outpatient follow':'follow-up',
  'chronic':'chronic','long-term':'chronic','long term':'chronic','ongoing':'chronic',
  'prevention':'prevention','screening':'prevention','wellness':'prevention',
  'acute':'acute','admitted':'acute','admission':'acute','hospitalized':'acute','inpatient':'acute',
  'icu':'acute','intensive care':'acute','critical':'acute',
  'palliative':'palliative','hospice':'palliative','end of life':'palliative','comfort care':'palliative',
};

const SETTING_KEYWORDS: Record<string, CareSetting> = {
  'home health':'home','home care':'home','home':'home','returning home':'home','at home':'home','visiting nurse':'home',
  'snf':'long-term-care','skilled nursing':'long-term-care','nursing home':'long-term-care','nursing facility':'long-term-care','long-term care':'long-term-care','ltc':'long-term-care','long term care':'long-term-care','assisted living':'long-term-care',
  'inpatient':'inpatient','hospital':'inpatient','admitted':'inpatient','floor':'inpatient','med-surg':'inpatient','telemetry':'inpatient',
  'outpatient':'outpatient','clinic':'outpatient','office visit':'outpatient','ambulatory':'outpatient',
  'rehab':'rehab','rehabilitation':'rehab','inpatient rehab':'rehab','irf':'rehab','ltach':'rehab',
  'ed':'ed','emergency':'ed','er ':'ed',
  'icu':'icu','intensive care':'icu','ccu':'icu','micu':'icu','sicu':'icu',
};

const INTERVENTION_KEYWORDS: [RegExp, string][] = [
  [/pci|percutaneous\s*coronary|stent(?:ing)?/i, 'PCI/Stenting'],
  [/cabg|bypass\s*surg/i, 'CABG'],
  [/orif|open\s*reduction|internal\s*fixation/i, 'ORIF'],
  [/hip\s*(?:replacement|arthroplasty)|tha\b/i, 'Hip Arthroplasty'],
  [/knee\s*(?:replacement|arthroplasty)|tka\b/i, 'Knee Arthroplasty'],
  [/hemiarthroplasty/i, 'Hemiarthroplasty'],
  [/spinal?\s*fusion|laminectomy|discectomy/i, 'Spine Surgery'],
  [/craniotomy/i, 'Craniotomy'],
  [/thrombectomy/i, 'Thrombectomy'],
  [/thrombolysis|tpa\b|alteplase/i, 'Thrombolysis'],
  [/ablation/i, 'Ablation'],
  [/cardioversion/i, 'Cardioversion'],
  [/pacemaker|icd\b|defibrillator/i, 'Cardiac Device'],
  [/dialysis|hemodialysis|peritoneal/i, 'Dialysis'],
  [/ventilat|intubat|mechanical\s*vent/i, 'Mechanical Ventilation'],
  [/tracheostom/i, 'Tracheostomy'],
  [/colostomy|ileostomy/i, 'Ostomy Creation'],
  [/amputation/i, 'Amputation'],
  [/debridement/i, 'Wound Debridement'],
  [/skin\s*graft/i, 'Skin Graft'],
  [/chemotherapy|chemo\b/i, 'Chemotherapy'],
  [/radiation\s*(?:therapy|treatment)/i, 'Radiation Therapy'],
  [/immunotherapy/i, 'Immunotherapy'],
  [/surgery|surgical|procedure|operation|resection|excision|repair/i, 'Surgery (General)'],
  [/hbot|hyperbaric/i, 'HBOT'],
  [/embolization/i, 'Embolization'],
  [/transfusion/i, 'Blood Transfusion'],
];

// ── PATHWAY MAPPING ──────────────────────────────────────────────────────────
const PATHWAY_MAP: Record<string, string[]> = {
  'Hip Fracture': ['pw-hip-fracture','pw-fall-prevention','pw-geriatric-home'],
  'Total Hip Arthroplasty': ['pw-joint-replacement','pw-geriatric-home'],
  'Total Knee Arthroplasty': ['pw-joint-replacement'],
  'Vertebral Fracture': ['pw-osteoporosis','pw-fall-prevention'],
  'Fracture (Unspecified)': ['pw-fall-prevention'],
  'Fall / Fall Risk': ['pw-fall-prevention','pw-geriatric-home'],
  'Myocardial Infarction': ['pw-postmi','pw-smoke-cessation'],
  'ST-Elevation MI': ['pw-postmi','pw-smoke-cessation'],
  'Non-ST-Elevation MI': ['pw-postmi','pw-smoke-cessation'],
  'Acute Coronary Syndrome': ['pw-postmi','pw-smoke-cessation'],
  'Heart Failure': ['pw-hfref'],
  'Heart Failure with Reduced EF': ['pw-hfref'],
  'Heart Failure with Preserved EF': ['pw-hfref'],
  'Post-CABG': ['pw-postmi','pw-cardiac-rehab'],
  'Stroke': ['pw-stroke'],
  'Ischemic Stroke': ['pw-stroke'],
  'Hemorrhagic Stroke': ['pw-stroke'],
  'Transient Ischemic Attack': ['pw-stroke'],
  'Dementia': ['pw-dementia','pw-geriatric-home'],
  'Parkinson Disease': ['pw-neuro-rehab','pw-fall-prevention'],
  'Traumatic Brain Injury': ['pw-neuro-rehab'],
  'COPD': ['pw-copd','pw-pulm-rehab'],
  'Pneumonia': ['pw-pneumonia'],
  'Pulmonary Embolism': ['pw-vte'],
  'Deep Vein Thrombosis': ['pw-vte'],
  'Asthma': ['pw-copd'],
  'Type 2 Diabetes': ['pw-diabetes'],
  'Type 1 Diabetes': ['pw-diabetes'],
  'Chronic Kidney Disease': ['pw-ckd'],
  'End-Stage Renal Disease': ['pw-ckd'],
  'Pressure Injury': ['pw-wound-care','pw-geriatric-home'],
  'Diabetic Foot Ulcer': ['pw-wound-care','pw-diabetes'],
  'Venous Leg Ulcer': ['pw-wound-care'],
  'Wound Care': ['pw-wound-care'],
  'Sepsis': ['pw-sepsis'],
  'Renal Angiomyolipoma': ['pw-aml'],
  'Radiation Injury': ['pw-hbot'],
  'Hyperbaric Oxygen Therapy': ['pw-hbot'],
  'Palliative / Hospice': ['pw-palliative'],
  'Cancer (General)': ['pw-oncology','pw-palliative'],
  'Lung Cancer': ['pw-oncology'],
  'Breast Cancer': ['pw-oncology'],
  'Major Depression': ['pw-psych'],
  'Substance Use Disorder': ['pw-psych'],
  'Delirium': ['pw-delirium','pw-geriatric-home'],
  'Frailty': ['pw-geriatric-home','pw-fall-prevention'],
  'Malnutrition / FTT': ['pw-nutrition','pw-geriatric-home'],
  'Dysphagia': ['pw-nutrition','pw-neuro-rehab'],
  'Obesity': ['pw-diabetes'],
  'Chronic Pain': ['pw-pain-mgmt'],
  'Rehabilitation': ['pw-neuro-rehab'],
  'Peripheral Artery Disease': ['pw-pad'],
  'Ostomy Care': ['pw-wound-care'],
  'C. difficile Infection': ['pw-cdiff'],
  'Incontinence': ['pw-geriatric-home'],
  'Atrial Fibrillation': ['pw-afib'],
};

// ── SPECIALTY MAPPING ────────────────────────────────────────────────────────
const SPECIALTY_MAP: Record<string, string> = {
  'Hip Fracture':'Orthopedics/Geriatrics', 'Total Hip Arthroplasty':'Orthopedics', 'Total Knee Arthroplasty':'Orthopedics',
  'Vertebral Fracture':'Orthopedics', 'Fracture (Unspecified)':'Orthopedics',
  'Fall / Fall Risk':'Geriatrics', 'Frailty':'Geriatrics', 'Delirium':'Geriatrics',
  'Dementia':'Neurology/Geriatrics', 'Malnutrition / FTT':'Geriatrics',
  'Myocardial Infarction':'Cardiology', 'Heart Failure':'Cardiology', 'Atrial Fibrillation':'Cardiology',
  'Post-CABG':'Cardiology/CT Surgery',
  'Stroke':'Neurology', 'Ischemic Stroke':'Neurology', 'Parkinson Disease':'Neurology',
  'COPD':'Pulmonology', 'Pneumonia':'Pulmonology/Infectious Disease',
  'Type 2 Diabetes':'Endocrinology', 'Chronic Kidney Disease':'Nephrology',
  'Pressure Injury':'Wound Care', 'Diabetic Foot Ulcer':'Wound Care/Podiatry',
  'Sepsis':'Critical Care/Infectious Disease', 'Cancer (General)':'Oncology',
  'Major Depression':'Psychiatry', 'Chronic Pain':'Pain Management',
  'Radiation Injury':'Radiation Oncology', 'Renal Angiomyolipoma':'Urology',
  'Palliative / Hospice':'Palliative Medicine',
  'Pulmonary Embolism':'Pulmonology/Hematology', 'Deep Vein Thrombosis':'Hematology',
};

// ── PARSER ───────────────────────────────────────────────────────────────────
export function parseScenario(text: string): ParsedScenario {
  const lower = text.toLowerCase();

  const ageMatch = text.match(AGE_PATTERN);
  const age = ageMatch ? parseInt(ageMatch[1]) : undefined;

  const sexMatch = lower.match(SEX_PATTERN);
  let sex: string | undefined;
  if (sexMatch) { const s = sexMatch[1]; sex = (s === 'male' || s === 'man') ? 'Male' : 'Female'; }

  // Primary condition — match first (most specific) hit
  let primaryCondition: string | undefined;
  for (const [re, cond] of CONDITIONS) {
    if (re.test(text)) { primaryCondition = cond; break; }
  }

  // Additional conditions as comorbidities
  const allConditions: string[] = [];
  for (const [re, cond] of CONDITIONS) {
    if (re.test(text) && cond !== primaryCondition) allConditions.push(cond);
  }

  let carePhase: CarePhase | undefined;
  for (const [kw, phase] of Object.entries(PHASE_KEYWORDS)) {
    if (lower.includes(kw)) { carePhase = phase; break; }
  }

  let careSetting: CareSetting | undefined;
  for (const [kw, setting] of Object.entries(SETTING_KEYWORDS)) {
    if (lower.includes(kw)) { careSetting = setting; break; }
  }

  // If text mentions "home" in context of care, infer home setting
  if (!careSetting && /home\s*(?:care|health|bound|setting)/i.test(text)) careSetting = 'home';
  if (!careSetting && carePhase === 'discharge') careSetting = 'home';

  let recentIntervention: string | undefined;
  for (const [re, label] of INTERVENTION_KEYWORDS) {
    if (re.test(text)) { recentIntervention = label; break; }
  }

  const comorbidities = [...new Set([
    ...COMORBIDITY_KEYWORDS.filter(k => lower.includes(k)),
    ...allConditions.filter(c => c !== primaryCondition),
  ])];

  const riskFactors = RISK_KEYWORDS.filter(k => lower.includes(k));
  const medications = MED_KEYWORDS.filter(k => lower.includes(k));

  const observations: string[] = [];
  const efMatch = lower.match(/ef\s*(?:of\s*)?(\d+)%?/);
  if (efMatch) observations.push(`EF ${efMatch[1]}%`);
  const egfrMatch = lower.match(/egfr\s*(\d+)/);
  if (egfrMatch) observations.push(`eGFR ${egfrMatch[1]}`);
  const a1cMatch = lower.match(/a1c\s*(?:of\s*)?(\d+\.?\d*)/);
  if (a1cMatch) observations.push(`A1c ${a1cMatch[1]}%`);
  const bpMatch = lower.match(/(?:bp|blood\s*pressure)\s*(\d+\/\d+)/);
  if (bpMatch) observations.push(`BP ${bpMatch[1]}`);
  const bmiMatch = lower.match(/bmi\s*(\d+\.?\d*)/);
  if (bmiMatch) observations.push(`BMI ${bmiMatch[1]}`);

  const functionalIndicators: string[] = [...observations];

  // Pathway candidates
  const pathwayCandidates: string[] = [];
  if (primaryCondition && PATHWAY_MAP[primaryCondition]) pathwayCandidates.push(...PATHWAY_MAP[primaryCondition]);
  // Add setting-specific pathways
  if (careSetting === 'home' && !pathwayCandidates.includes('pw-geriatric-home')) pathwayCandidates.push('pw-geriatric-home');
  if (careSetting === 'long-term-care') pathwayCandidates.push('pw-geriatric-home');
  if (riskFactors.some(r => r.includes('smok')) && !pathwayCandidates.includes('pw-smoke-cessation')) pathwayCandidates.push('pw-smoke-cessation');
  if (comorbidities.includes('diabetes') && !pathwayCandidates.includes('pw-diabetes')) pathwayCandidates.push('pw-diabetes');
  if ((age && age >= 65) || comorbidities.includes('dementia') || lower.includes('elderly') || lower.includes('geriatric')) {
    if (!pathwayCandidates.includes('pw-fall-prevention')) pathwayCandidates.push('pw-fall-prevention');
  }

  // Missing data
  const missingData: string[] = [];
  if (!age) missingData.push('Patient age');
  if (!sex) missingData.push('Patient sex');
  if (observations.length === 0 && primaryCondition?.includes('Heart')) missingData.push('Ejection fraction');
  if (!lower.includes('egfr') && !lower.includes('creatinine') && !lower.includes('renal function')) missingData.push('Renal function (eGFR/creatinine)');
  if (!lower.includes('allerg')) missingData.push('Allergy status');
  if (!lower.includes('blood pressure') && !lower.includes('bp')) missingData.push('Blood pressure');
  if (primaryCondition?.includes('Fracture') || primaryCondition?.includes('Hip')) {
    if (!lower.includes('ambul') && !lower.includes('weight bear') && !lower.includes('mobil')) missingData.push('Weight-bearing / mobility status');
    if (!lower.includes('dexa') && !lower.includes('osteoporo') && !lower.includes('bone density')) missingData.push('Osteoporosis / DEXA status');
  }
  if (careSetting === 'home' || lower.includes('home')) {
    if (!lower.includes('caregiver') && !lower.includes('family') && !lower.includes('social support') && !lower.includes('lives with')) missingData.push('Caregiver / social support status');
    if (!lower.includes('home safety') && !lower.includes('stairs') && !lower.includes('bathroom')) missingData.push('Home safety assessment');
  }
  if (age && age >= 65) {
    if (!lower.includes('cogniti') && !lower.includes('mental status') && !lower.includes('oriented') && !lower.includes('dementia')) missingData.push('Cognitive status');
    if (!lower.includes('nutrition') && !lower.includes('weight') && !lower.includes('albumin') && !lower.includes('eating')) missingData.push('Nutritional status');
  }
  if (!lower.includes('med') && !lower.includes('rx') && medications.length === 0) missingData.push('Current medication list');
  if (primaryCondition?.includes('Diabet') && !a1cMatch) missingData.push('HbA1c level');

  const specialtyArea = primaryCondition ? SPECIALTY_MAP[primaryCondition] : undefined;

  // Confidence
  let confidence = 0.25;
  if (primaryCondition) confidence += 0.25;
  if (age) confidence += 0.08;
  if (sex) confidence += 0.05;
  if (carePhase) confidence += 0.1;
  if (careSetting) confidence += 0.08;
  if (comorbidities.length > 0) confidence += 0.08;
  if (recentIntervention) confidence += 0.08;
  if (observations.length > 0) confidence += 0.05;
  if (medications.length > 0) confidence += 0.05;
  confidence = Math.min(0.98, confidence);

  return {
    age, sex, primaryCondition, carePhase, careSetting, recentIntervention,
    comorbidities, riskFactors, medications, observations, functionalIndicators,
    missingData, specialtyArea, pathwayCandidates, confidence, rawText: text,
  };
}
