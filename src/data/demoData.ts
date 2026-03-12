import type { OutcomeSubmission, WatchlistItem, SavedQuery, AuditLogEntry, FHIRBundle } from '../types';

export const OUTCOMES: OutcomeSubmission[] = [
  { id:'oc1', condition:'Post-MI ACS', careScenario:'Discharge after PCI with DAPT', ageBucket:'55-64', sexCategory:'Male', comorbidities:['Diabetes','Hypertension'], interventionCategory:'DAPT + statin + beta-blocker + ACEi', followUpDuration:'12 months', responseCategory:'Good response', adverseEvents:['Minor bleeding'], outcomeScore:8, adherenceConcerns:['Medication complexity'], institutionType:'Academic Medical Center', submitterRole:'clinician', noPHIAttestation:true, notes:'A1c improved. BP well controlled. Cardiac rehab completed.', submittedAt:'2026-02-15T10:00:00Z' },
  { id:'oc2', condition:'HFrEF', careScenario:'GDMT initiation, EF 30%', ageBucket:'65-74', sexCategory:'Female', comorbidities:['CKD stage 3','T2D'], interventionCategory:'ARNI + beta-blocker + MRA + SGLT2i', followUpDuration:'6 months', responseCategory:'Partial response', adverseEvents:['Hypotension episodes'], outcomeScore:6, adherenceConcerns:['Polypharmacy fatigue'], institutionType:'Community Hospital', submitterRole:'care-manager', noPHIAttestation:true, notes:'EF improved to 35%. Still symptomatic with exertion.', submittedAt:'2026-01-20T14:00:00Z' },
  { id:'oc3', condition:'Ischemic Stroke', careScenario:'Secondary prevention, AF-related', ageBucket:'75+', comorbidities:['Atrial fibrillation','CKD stage 2'], interventionCategory:'Apixaban + statin + BP management', followUpDuration:'12 months', responseCategory:'Good response', adverseEvents:[], outcomeScore:8, adherenceConcerns:[], institutionType:'Academic Medical Center', submitterRole:'clinician', noPHIAttestation:true, notes:'No recurrent events. Functional recovery with rehab.', submittedAt:'2026-02-28T09:00:00Z' },
  { id:'oc4', condition:'Radiation Cystitis', careScenario:'HBOT 30 sessions', ageBucket:'65-74', sexCategory:'Male', comorbidities:['Prior prostate radiation'], interventionCategory:'HBOT 2.4 ATA × 30', followUpDuration:'6 months', responseCategory:'Partial response', adverseEvents:['Mild barotrauma'], outcomeScore:7, adherenceConcerns:['Treatment access'], institutionType:'Community Hospital', submitterRole:'clinician', noPHIAttestation:true, notes:'Hematuria improved but not fully resolved.', submittedAt:'2026-01-10T11:00:00Z' },
  { id:'oc5', condition:'Post-MI Smoking Cessation', careScenario:'Varenicline + counseling after ACS', ageBucket:'45-54', sexCategory:'Male', comorbidities:['Dyslipidemia'], interventionCategory:'Varenicline 1mg BID + behavioral', followUpDuration:'6 months', responseCategory:'Complete cessation', adverseEvents:['Nausea (mild)'], outcomeScore:9, adherenceConcerns:[], institutionType:'VA Medical Center', submitterRole:'researcher', noPHIAttestation:true, notes:'Sustained cessation at 6 months confirmed with cotinine.', submittedAt:'2026-03-01T15:00:00Z' },
];

export const WATCHLISTS: WatchlistItem[] = [
  { id:'wl1', topic:'Post-MI Secondary Prevention', addedAt:'2025-06-01', lastChecked:'2026-03-11T08:00:00Z', newEvidence:8, alerts:[
    { id:'a1', type:'new-evidence', message:'ABYSS trial: Beta-blocker discontinuation non-inferior in preserved EF post-MI', timestamp:'2026-03-08T12:00:00Z', read:false },
    { id:'a2', type:'guideline-revision', message:'AHA updated recommendations on DAPT duration individualization', timestamp:'2026-02-15T09:00:00Z', read:true },
  ]},
  { id:'wl2', topic:'Heart Failure GDMT', addedAt:'2025-09-15', lastChecked:'2026-03-10T10:00:00Z', newEvidence:12, alerts:[
    { id:'a3', type:'new-evidence', message:'SGLT2i meta-analysis confirms benefit across full EF spectrum', timestamp:'2026-02-20T11:00:00Z', read:false },
  ]},
  { id:'wl3', topic:'Hyperbaric Oxygen Therapy', addedAt:'2025-11-01', lastChecked:'2026-03-09T14:00:00Z', newEvidence:4, alerts:[
    { id:'a4', type:'contradiction', message:'DAHANCA-21 ORN results conflict with prior cohort data', timestamp:'2026-01-15T10:00:00Z', read:false },
  ]},
  { id:'wl4', topic:'Post-Stroke Anticoagulation', addedAt:'2026-01-10', lastChecked:'2026-03-08T16:00:00Z', newEvidence:3, alerts:[] },
  { id:'wl5', topic:'Smoking Cessation Pharmacotherapy', addedAt:'2026-02-01', lastChecked:'2026-03-07T12:00:00Z', newEvidence:2, alerts:[] },
];

export const QUERIES: SavedQuery[] = [
  { id:'q1', scenario:'60-year-old male post MI after PCI, diabetes, smoker, EF 35%, returning home from acute care', timestamp:'2026-03-10T10:00:00Z', starred:true, resultCount:14 },
  { id:'q2', scenario:'Evidence-based discharge considerations after PCI with reduced EF', timestamp:'2026-03-09T14:30:00Z', starred:true, resultCount:10 },
  { id:'q3', scenario:'Post-stroke anticoagulation follow-up in patient with atrial fibrillation', timestamp:'2026-03-08T09:15:00Z', starred:false, resultCount:8 },
  { id:'q4', scenario:'Hyperbaric oxygen evidence for radiation-induced cystitis and proctitis', timestamp:'2026-03-07T16:45:00Z', starred:false, resultCount:6 },
  { id:'q5', scenario:'Renal angiomyolipoma 3.5cm in TSC patient — surveillance vs intervention', timestamp:'2026-03-05T11:00:00Z', starred:true, resultCount:5 },
  { id:'q6', scenario:'Smoking cessation strategies immediately after acute coronary syndrome', timestamp:'2026-03-04T08:00:00Z', starred:false, resultCount:7 },
];

export const AUDIT_LOG: AuditLogEntry[] = [
  { id:'al1', userId:'demo-clinician', action:'QUERY', details:'Clinical scenario query: post-MI discharge planning', timestamp:'2026-03-10T10:00:00Z' },
  { id:'al2', userId:'demo-researcher', action:'EXPORT', details:'Exported evidence brief: HBOT radiation injury', timestamp:'2026-03-09T14:30:00Z' },
  { id:'al3', userId:'demo-clinician', action:'OUTCOME_SUBMIT', details:'Outcome submitted: Post-MI DAPT', timestamp:'2026-03-08T09:15:00Z' },
  { id:'al4', userId:'demo-admin', action:'CONFIG_CHANGE', details:'Updated disclaimer text', timestamp:'2026-03-07T16:45:00Z' },
];

export const MOCK_FHIR_BUNDLE: FHIRBundle = {
  patient: { resourceType:'Patient', id:'mock-pt-001', name:'Demo Patient (De-Identified)', birthDate:'1964-05-15', gender:'male' },
  conditions: [
    { resourceType:'Condition', id:'c1', code:{ text:'Acute ST-elevation myocardial infarction', coding:[{system:'http://snomed.info/sct',code:'401303003'}] }, clinicalStatus:'resolved', onsetDateTime:'2026-02-01' },
    { resourceType:'Condition', id:'c2', code:{ text:'Type 2 diabetes mellitus' }, clinicalStatus:'active' },
    { resourceType:'Condition', id:'c3', code:{ text:'Essential hypertension' }, clinicalStatus:'active' },
    { resourceType:'Condition', id:'c4', code:{ text:'Heart failure with reduced ejection fraction' }, clinicalStatus:'active' },
  ],
  medications: [
    { resourceType:'MedicationRequest', id:'m1', medicationCodeableConcept:{ text:'Aspirin 81mg' }, status:'active' },
    { resourceType:'MedicationRequest', id:'m2', medicationCodeableConcept:{ text:'Ticagrelor 90mg BID' }, status:'active' },
    { resourceType:'MedicationRequest', id:'m3', medicationCodeableConcept:{ text:'Atorvastatin 80mg' }, status:'active' },
    { resourceType:'MedicationRequest', id:'m4', medicationCodeableConcept:{ text:'Metoprolol succinate 50mg' }, status:'active' },
    { resourceType:'MedicationRequest', id:'m5', medicationCodeableConcept:{ text:'Lisinopril 10mg' }, status:'active' },
    { resourceType:'MedicationRequest', id:'m6', medicationCodeableConcept:{ text:'Metformin 1000mg BID' }, status:'active' },
  ],
  allergies: [
    { resourceType:'AllergyIntolerance', substance:'Sulfa antibiotics' },
  ],
  observations: [
    { resourceType:'Observation', code:'Left ventricular ejection fraction', value:'35', unit:'%' },
    { resourceType:'Observation', code:'HbA1c', value:'7.8', unit:'%' },
    { resourceType:'Observation', code:'LDL cholesterol', value:'92', unit:'mg/dL' },
    { resourceType:'Observation', code:'Blood pressure', value:'138/82', unit:'mmHg' },
    { resourceType:'Observation', code:'eGFR', value:'68', unit:'mL/min/1.73m²' },
    { resourceType:'Observation', code:'Smoking status', value:'Current smoker' },
  ],
  procedures: [
    { resourceType:'Procedure', code:'Percutaneous coronary intervention with drug-eluting stent', performedDateTime:'2026-02-01' },
  ],
};
