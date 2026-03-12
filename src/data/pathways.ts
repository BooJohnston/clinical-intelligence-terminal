import type { ClinicalPathway } from '../types';

export const PATHWAYS: ClinicalPathway[] = [
  // ── ORTHOPEDIC / GERIATRIC ─────────────────────────────────────────────────
  {
    id:'pw-hip-fracture', condition:'Hip Fracture', scenario:'Acute management, surgical repair, and post-operative care for hip fracture',
    specialty:'Orthopedics/Geriatrics', version:'2024.1', lastUpdated:'2024-01-15',
    guidelineSources:[{name:'AAOS Clinical Practice Guideline: Hip Fractures in Older Adults',year:2021},{name:'NICE NG124: Hip Fracture Management',year:2023}],
    nodes:[
      {id:'hf1',type:'recommendation',title:'Surgical repair within 24-48 hours',description:'Early surgical fixation (within 24-48 hours of admission) reduces mortality, complications, and length of stay. Delay beyond 48 hours associated with worse outcomes.',evidenceLevel:'1A',certainty:'very-high',source:'AAOS 2021',tags:['surgery','timing']},
      {id:'hf2',type:'recommendation',title:'Perioperative medical optimization',description:'Address anticoagulation reversal, fluid status, cardiac risk, and anemia prior to surgery. Multidisciplinary geriatric co-management reduces complications.',evidenceLevel:'1B',certainty:'high',source:'NICE NG124',tags:['perioperative','medical']},
      {id:'hf3',type:'recommendation',title:'DVT prophylaxis',description:'Pharmacologic thromboprophylaxis (LMWH, fondaparinux, or DOAC) for minimum 10-14 days, extended up to 35 days per risk profile.',evidenceLevel:'1A',certainty:'very-high',source:'AAOS/ACCP',tags:['medication','vte']},
      {id:'hf4',type:'recommendation',title:'Early mobilization',description:'Weight-bearing as tolerated (per surgical fixation type) initiated within 24 hours post-op. PT/OT daily. Reduces delirium, pneumonia, DVT, and functional decline.',evidenceLevel:'1A',certainty:'very-high',source:'NICE NG124',tags:['rehab','mobility']},
      {id:'hf5',type:'recommendation',title:'Pain management — multimodal approach',description:'Multimodal analgesia preferred: regional/neuraxial blocks, acetaminophen scheduled, minimize opioids. Avoid NSAIDs if renal risk. Fascia iliaca blocks reduce opioid requirements.',evidenceLevel:'1B',certainty:'high',source:'AAOS 2021',tags:['medication','pain']},
      {id:'hf6',type:'recommendation',title:'Delirium prevention and screening',description:'Screen for delirium using CAM. Prevent with reorientation, sleep hygiene, early mobilization, minimize sedatives/anticholinergics, maintain hydration.',evidenceLevel:'1B',certainty:'high',source:'AGS/NICE',tags:['geriatric','delirium']},
      {id:'hf7',type:'recommendation',title:'Osteoporosis assessment and treatment',description:'DEXA scan if not done recently. Start calcium/vitamin D. Consider bisphosphonate or denosumab after fracture healing (typically 2-4 weeks post-op).',evidenceLevel:'1A',certainty:'very-high',source:'AAOS/Endocrine Society',tags:['medication','prevention']},
      {id:'hf8',type:'monitoring',title:'Fall risk assessment and prevention',description:'Comprehensive fall risk assessment before discharge. Address vision, medications (sedatives, antihypertensives), footwear, home hazards, balance training.',evidenceLevel:'1B',certainty:'high',source:'AGS/BGS',tags:['prevention','safety']},
      {id:'hf9',type:'discharge',title:'Discharge planning — rehab vs home',description:'Assess for inpatient rehab (IRF) vs SNF vs home with services. Consider functional status, social support, home safety, cognitive status. Most patients benefit from structured rehab setting.',evidenceLevel:'2A',certainty:'moderate',source:'AAOS 2021',tags:['transition','discharge']},
      {id:'hf10',type:'redflag',title:'Post-operative warning signs',description:'Increasing pain, wound drainage, fever, leg length discrepancy, inability to bear weight, chest pain, dyspnea, calf swelling — warrant urgent evaluation.',evidenceLevel:'N/A',certainty:'very-high',source:'Clinical consensus',tags:['redflag']},
      {id:'hf11',type:'education',title:'Patient/caregiver education',description:'Weight-bearing precautions, hip precautions (if arthroplasty), DVT signs, wound care, fall prevention strategies, medication management, follow-up schedule.',evidenceLevel:'1C',certainty:'high',source:'AAOS',tags:['education']},
    ]
  },
  {
    id:'pw-joint-replacement', condition:'Joint Replacement', scenario:'Post-operative care after total hip or knee arthroplasty',
    specialty:'Orthopedics', version:'2023.2', lastUpdated:'2023-10-01',
    guidelineSources:[{name:'AAOS CPG: Surgical Management of Osteoarthritis of the Knee',year:2022}],
    nodes:[
      {id:'jr1',type:'recommendation',title:'Early mobilization — same day or POD 1',description:'Ambulation with PT on day of surgery or POD 1 is standard. Progressive weight-bearing per surgical protocol.',evidenceLevel:'1A',certainty:'very-high',source:'AAOS 2022',tags:['rehab','mobility']},
      {id:'jr2',type:'recommendation',title:'Multimodal pain protocol',description:'Regional nerve blocks, scheduled acetaminophen, NSAIDs (if renal function permits), minimize opioids. Ice/cryotherapy for swelling.',evidenceLevel:'1A',certainty:'very-high',source:'AAOS 2022',tags:['medication','pain']},
      {id:'jr3',type:'recommendation',title:'VTE prophylaxis 10-35 days',description:'Aspirin 81mg BID acceptable for standard-risk TJA. LMWH or DOAC for higher-risk patients. Mechanical prophylaxis in addition.',evidenceLevel:'1A',certainty:'very-high',source:'AAOS/ACCP',tags:['medication','vte']},
      {id:'jr4',type:'followup',title:'Outpatient therapy 2-3x/week for 6-12 weeks',description:'Structured physical therapy focusing on ROM, strengthening, gait training, functional mobility. Home exercise program essential.',evidenceLevel:'1A',certainty:'very-high',source:'AAOS',tags:['rehab']},
      {id:'jr5',type:'redflag',title:'Signs of infection or dislocation',description:'Wound redness/drainage, fever >101°F, sudden severe pain, mechanical catching/locking, inability to bear weight, leg length change.',evidenceLevel:'N/A',certainty:'very-high',source:'Clinical consensus',tags:['redflag']},
    ]
  },
  {
    id:'pw-fall-prevention', condition:'Fall Prevention', scenario:'Multi-factorial fall risk reduction for older adults',
    specialty:'Geriatrics', version:'2023.1', lastUpdated:'2023-06-01',
    guidelineSources:[{name:'AGS/BGS Clinical Practice Guideline: Prevention of Falls in Older Persons',year:2022},{name:'USPSTF: Interventions to Prevent Falls',year:2018}],
    nodes:[
      {id:'fp1',type:'recommendation',title:'Multi-factorial fall risk assessment',description:'Assess: gait/balance (Timed Up and Go), vision, medications (especially psychotropics, antihypertensives), orthostatic BP, footwear, home hazards, cognitive status, vitamin D.',evidenceLevel:'1A',certainty:'very-high',source:'AGS/BGS 2022',tags:['assessment']},
      {id:'fp2',type:'recommendation',title:'Exercise — balance and strength training',description:'Structured exercise (tai chi, balance training, resistance training) reduces falls by 23-30%. Minimum 3x/week. PT-directed initially.',evidenceLevel:'1A',certainty:'very-high',source:'USPSTF/Cochrane',tags:['exercise','prevention']},
      {id:'fp3',type:'recommendation',title:'Medication review — reduce fall-risk drugs',description:'Deprescribe or reduce: benzodiazepines, sedative-hypnotics, anticholinergics, opioids, first-gen antihistamines, alpha-blockers. Use Beers Criteria.',evidenceLevel:'1A',certainty:'very-high',source:'AGS Beers 2023',tags:['medication','safety']},
      {id:'fp4',type:'recommendation',title:'Vitamin D supplementation',description:'Vitamin D 800-1000 IU daily for adults ≥65 with fall risk or deficiency. Addresses bone health and muscle function.',evidenceLevel:'1B',certainty:'high',source:'AGS/Endocrine Society',tags:['medication','prevention']},
      {id:'fp5',type:'recommendation',title:'Home safety assessment',description:'OT home evaluation: grab bars, shower chair, adequate lighting, removal of throw rugs, stair rails, night lights, non-slip surfaces.',evidenceLevel:'1B',certainty:'high',source:'AGS/BGS',tags:['environment','safety']},
      {id:'fp6',type:'recommendation',title:'Vision and hearing assessment',description:'Annual vision exam. Address cataracts, glaucoma. Proper eyeglass prescription. Bifocals may increase fall risk on stairs.',evidenceLevel:'2A',certainty:'moderate',source:'AGS/BGS',tags:['screening']},
      {id:'fp7',type:'monitoring',title:'Orthostatic blood pressure check',description:'Check lying and standing BP. If orthostatic hypotension present, review antihypertensives, ensure adequate hydration, compression stockings, rise slowly.',evidenceLevel:'1B',certainty:'high',source:'AGS',tags:['monitoring','bp']},
    ]
  },
  // ── HOME HEALTH / GERIATRIC HOME CARE ──────────────────────────────────────
  {
    id:'pw-geriatric-home', condition:'Home Health / Geriatric Home Care', scenario:'Comprehensive home-based care planning for older adults',
    specialty:'Geriatrics/Home Health', version:'2024.1', lastUpdated:'2024-02-01',
    guidelineSources:[{name:'CMS Home Health Conditions of Participation',year:2023},{name:'AGS Comprehensive Geriatric Assessment',year:2022}],
    nodes:[
      {id:'gh1',type:'recommendation',title:'Skilled nursing assessment — initial and ongoing',description:'Initial comprehensive assessment within 48 hours. Vital signs, wound assessment, medication reconciliation, fall risk, cognitive screen, pain assessment, caregiver assessment.',evidenceLevel:'1C',certainty:'high',source:'CMS CoP',tags:['assessment','nursing']},
      {id:'gh2',type:'recommendation',title:'Medication reconciliation and management',description:'Complete medication review. Identify high-risk medications (Beers Criteria). Assess adherence barriers: cost, complexity, cognition, vision. Pill box organization. Teach-back method.',evidenceLevel:'1A',certainty:'very-high',source:'AGS/TJC',tags:['medication','safety']},
      {id:'gh3',type:'recommendation',title:'Home safety evaluation',description:'OT-led home safety assessment: fall hazards, bathroom safety, kitchen safety, fire safety, medication storage, emergency plan, phone access, medical alert device.',evidenceLevel:'1B',certainty:'high',source:'CMS CoP',tags:['safety','environment']},
      {id:'gh4',type:'recommendation',title:'Functional mobility and ADL training',description:'PT/OT assessment of mobility, transfers, ADLs, IADLs. Assistive device evaluation (walker, cane, wheelchair). Progressive exercise program. Energy conservation techniques.',evidenceLevel:'1A',certainty:'very-high',source:'Cochrane',tags:['rehab','function']},
      {id:'gh5',type:'recommendation',title:'Nutrition assessment and support',description:'Screen for malnutrition (MNA). Assess diet adequacy, hydration, swallowing safety, dental status, ability to prepare meals. Consider Meals on Wheels or meal delivery. Dietitian referral.',evidenceLevel:'1B',certainty:'high',source:'ASPEN',tags:['nutrition']},
      {id:'gh6',type:'recommendation',title:'Caregiver assessment and support',description:'Assess caregiver burden, health, training needs. Provide respite resources, support groups, training on transfers, medication administration, emergency protocols.',evidenceLevel:'1B',certainty:'high',source:'AGS',tags:['caregiver','support']},
      {id:'gh7',type:'recommendation',title:'Cognitive status monitoring',description:'Regular cognitive screening (MMSE, MoCA). Assess for delirium superimposed on dementia. Safety measures: stove knobs, wandering risk, driving cessation, financial exploitation risk.',evidenceLevel:'1B',certainty:'high',source:'AGS',tags:['cognitive','safety']},
      {id:'gh8',type:'recommendation',title:'Advance care planning',description:'Discuss/document advance directives, healthcare proxy, POLST/MOLST if appropriate. Assess goals of care. Revisit periodically.',evidenceLevel:'1C',certainty:'high',source:'AGS',tags:['planning','palliative']},
      {id:'gh9',type:'recommendation',title:'Telehealth and remote monitoring',description:'Consider remote vital sign monitoring, medication reminders, video visits for chronic disease management. Reduces hospitalizations in appropriate patients.',evidenceLevel:'2A',certainty:'moderate',source:'CMS/AHRQ',tags:['technology','monitoring']},
      {id:'gh10',type:'redflag',title:'Home health escalation triggers',description:'New confusion, fever >100.4, fall with injury, uncontrolled pain, medication error, new shortness of breath, chest pain, stroke symptoms, unresponsiveness — call 911 / contact provider immediately.',evidenceLevel:'N/A',certainty:'very-high',source:'Clinical consensus',tags:['redflag','emergency']},
      {id:'gh11',type:'followup',title:'Care coordination with PCP and specialists',description:'Regular communication with primary care provider. Coordinate with specialists. Update care plan after each visit. Discharge from home health when goals met or transition to hospice/LTC.',evidenceLevel:'1C',certainty:'high',source:'CMS CoP',tags:['coordination']},
    ]
  },
  // ── CARDIAC ────────────────────────────────────────────────────────────────
  {
    id:'pw-postmi', condition:'Post-MI / ACS', scenario:'Discharge and secondary prevention after MI or ACS',
    specialty:'Cardiology', version:'2023.2', lastUpdated:'2023-10-01',
    guidelineSources:[{name:'ACC/AHA Guideline for Chronic Coronary Disease',year:2023},{name:'ESC Guidelines for ACS',year:2023}],
    nodes:[
      {id:'n1',type:'recommendation',title:'Dual antiplatelet therapy (DAPT)',description:'Aspirin plus P2Y12 inhibitor typically continued for 12 months post-ACS; shorter durations considered per bleeding risk.',evidenceLevel:'1A',certainty:'very-high',source:'ACC/AHA 2023',tags:['medication','antiplatelet']},
      {id:'n2',type:'recommendation',title:'High-intensity statin therapy',description:'Atorvastatin 80mg or rosuvastatin 20-40mg; LDL target often <70mg/dL.',evidenceLevel:'1A',certainty:'very-high',source:'ACC/AHA 2023',tags:['medication','lipid']},
      {id:'n3',type:'recommendation',title:'Beta-blocker therapy',description:'Beta-blocker commonly recommended post-MI, particularly with reduced EF; duration debated if preserved EF.',evidenceLevel:'1B',certainty:'high',source:'ACC/AHA 2023',tags:['medication']},
      {id:'n4',type:'recommendation',title:'ACEi/ARB for reduced EF',description:'ACE inhibitor or ARB recommended when EF ≤40% or if hypertension/diabetes.',evidenceLevel:'1A',certainty:'very-high',source:'ACC/AHA 2023',tags:['medication']},
      {id:'n5',type:'monitoring',title:'Follow-up echocardiography',description:'Repeat echo typically at 6-12 weeks to reassess LV function.',evidenceLevel:'2B',certainty:'moderate',source:'ACC/AHA 2023',tags:['imaging','monitoring']},
      {id:'n6',type:'followup',title:'Cardiac rehabilitation referral',description:'Structured cardiac rehab improves outcomes; referral before discharge.',evidenceLevel:'1A',certainty:'very-high',source:'AHA/AACVPR',tags:['rehab']},
      {id:'n7',type:'education',title:'Symptom recognition education',description:'Educate on warning symptoms: chest pain, sudden dyspnea, syncope.',evidenceLevel:'1C',certainty:'high',source:'AHA',tags:['education']},
      {id:'n8',type:'redflag',title:'Recurrent chest pain',description:'New or worsening chest pain post-discharge warrants urgent evaluation.',evidenceLevel:'N/A',certainty:'very-high',source:'Clinical consensus',tags:['redflag']},
      {id:'n9',type:'recommendation',title:'Smoking cessation',description:'Highest-yield secondary prevention intervention. Pharmacotherapy + counseling recommended.',evidenceLevel:'1A',certainty:'very-high',source:'ACC/AHA 2023',tags:['lifestyle']},
      {id:'n10',type:'discharge',title:'Discharge medication reconciliation',description:'Verify all discharge medications, doses, and patient understanding.',evidenceLevel:'1C',certainty:'high',source:'TJC/CMS',tags:['safety','transition']},
    ]
  },
  {
    id:'pw-hfref', condition:'Heart Failure with Reduced EF', scenario:'GDMT and follow-up for HFrEF',
    specialty:'Cardiology', version:'2022.3', lastUpdated:'2022-12-01',
    guidelineSources:[{name:'ACC/AHA/HFSA Guideline for Management of Heart Failure',year:2022}],
    nodes:[
      {id:'hf1',type:'recommendation',title:'Four-pillar GDMT',description:'ACEi/ARB/ARNI + beta-blocker + MRA + SGLT2 inhibitor. Simultaneous or rapid sequencing.',evidenceLevel:'1A',certainty:'very-high',source:'ACC/AHA/HFSA 2022',tags:['medication','gdmt']},
      {id:'hf2',type:'recommendation',title:'SGLT2 inhibitor regardless of diabetes',description:'Dapagliflozin or empagliflozin reduce HF hospitalization and CV death.',evidenceLevel:'1A',certainty:'very-high',source:'DAPA-HF, EMPEROR',tags:['medication']},
      {id:'hf3',type:'monitoring',title:'Serial BNP/NT-proBNP',description:'Natriuretic peptide trends support clinical decision-making.',evidenceLevel:'2A',certainty:'moderate',source:'ACC/AHA 2022',tags:['lab','monitoring']},
      {id:'hf4',type:'redflag',title:'Rapid weight gain or worsening dyspnea',description:'Weight >2 lbs/day or >5 lbs/week, new orthopnea, worsening exertional tolerance — urgent assessment.',evidenceLevel:'N/A',certainty:'very-high',source:'Clinical consensus',tags:['redflag']},
      {id:'hf5',type:'education',title:'Daily weight monitoring',description:'Daily weight tracking is cornerstone of HF self-management.',evidenceLevel:'1C',certainty:'high',source:'AHA',tags:['education']},
      {id:'hf6',type:'recommendation',title:'ICD evaluation for primary prevention',description:'ICD considered for EF ≤35% despite ≥3 months optimal GDMT.',evidenceLevel:'1A',certainty:'high',source:'ACC/AHA 2022',tags:['device']},
    ]
  },
  {
    id:'pw-afib', condition:'Atrial Fibrillation', scenario:'Rate/rhythm control and stroke prevention',
    specialty:'Cardiology', version:'2023.1', lastUpdated:'2023-03-01',
    guidelineSources:[{name:'ACC/AHA/ACCP/HRS Guideline for AF',year:2023}],
    nodes:[
      {id:'af1',type:'recommendation',title:'Anticoagulation based on CHA2DS2-VASc',description:'DOAC preferred over warfarin for non-valvular AF. Score ≥2 (men) or ≥3 (women) generally warrants anticoagulation.',evidenceLevel:'1A',certainty:'very-high',source:'ACC/AHA 2023',tags:['medication','anticoagulation']},
      {id:'af2',type:'recommendation',title:'Rate control — target resting HR <110',description:'Beta-blocker or calcium channel blocker for rate control. Lenient target (<110 resting) acceptable in many patients.',evidenceLevel:'1B',certainty:'high',source:'RACE II, ACC/AHA',tags:['medication']},
      {id:'af3',type:'monitoring',title:'Annual renal and hepatic function',description:'Monitor renal/hepatic function for DOAC dosing adjustment.',evidenceLevel:'1C',certainty:'high',source:'ACC/AHA',tags:['monitoring','lab']},
      {id:'af4',type:'redflag',title:'Stroke symptoms',description:'Sudden weakness, speech changes, vision loss, severe headache — emergency evaluation.',evidenceLevel:'N/A',certainty:'very-high',source:'AHA/ASA',tags:['redflag']},
    ]
  },
  // ── NEUROLOGY ──────────────────────────────────────────────────────────────
  {
    id:'pw-stroke', condition:'Post-Stroke Follow-Up', scenario:'Secondary prevention after ischemic stroke or TIA',
    specialty:'Neurology', version:'2024.1', lastUpdated:'2024-01-15',
    guidelineSources:[{name:'AHA/ASA Guideline for Stroke Prevention',year:2021}],
    nodes:[
      {id:'st1',type:'recommendation',title:'Antiplatelet or anticoagulation per etiology',description:'Antiplatelet for non-cardioembolic; DOAC for AF-related stroke.',evidenceLevel:'1A',certainty:'very-high',source:'AHA/ASA 2021',tags:['medication']},
      {id:'st2',type:'recommendation',title:'BP management <130/80',description:'Target BP <130/80 for secondary stroke prevention.',evidenceLevel:'1A',certainty:'high',source:'AHA/ASA 2021',tags:['medication','bp']},
      {id:'st3',type:'recommendation',title:'High-intensity statin',description:'Statin therapy for atherosclerotic stroke/TIA.',evidenceLevel:'1A',certainty:'very-high',source:'AHA/ASA 2021',tags:['medication']},
      {id:'st4',type:'followup',title:'Neurology follow-up 1-3 months',description:'Outpatient assessment for workup completion and medication adjustment.',evidenceLevel:'2A',certainty:'high',source:'AHA/ASA 2021',tags:['followup']},
      {id:'st5',type:'recommendation',title:'Rehabilitation services',description:'PT, OT, speech therapy referrals based on deficits; early rehab improves outcomes.',evidenceLevel:'1A',certainty:'very-high',source:'AHA/ASA 2021',tags:['rehab']},
      {id:'st6',type:'redflag',title:'New neurological deficit',description:'New weakness, speech change, vision loss, severe headache — emergency.',evidenceLevel:'N/A',certainty:'very-high',source:'Clinical consensus',tags:['redflag']},
    ]
  },
  {
    id:'pw-dementia', condition:'Dementia Care', scenario:'Comprehensive management for dementia across settings',
    specialty:'Neurology/Geriatrics', version:'2023.1', lastUpdated:'2023-09-01',
    guidelineSources:[{name:'AAN Practice Guideline: Mild Cognitive Impairment',year:2018},{name:'Alzheimer Association Care Practice Recommendations',year:2023}],
    nodes:[
      {id:'dm1',type:'recommendation',title:'Cholinesterase inhibitor for mild-moderate AD',description:'Donepezil, rivastigmine, or galantamine for Alzheimer-type dementia. Modest benefit in cognition/function.',evidenceLevel:'1A',certainty:'moderate',source:'AAN 2018',tags:['medication']},
      {id:'dm2',type:'recommendation',title:'Behavioral intervention before medication',description:'Non-pharmacologic strategies first for BPSD: routine, redirection, music therapy, caregiver training, environmental modification.',evidenceLevel:'1B',certainty:'high',source:'APA/AGS',tags:['behavioral']},
      {id:'dm3',type:'recommendation',title:'Safety assessment',description:'Evaluate driving safety, wandering risk, medication self-administration ability, financial vulnerability, firearm access, cooking safety.',evidenceLevel:'1C',certainty:'high',source:'Alzheimer Association',tags:['safety']},
      {id:'dm4',type:'recommendation',title:'Caregiver support and respite',description:'Screen caregiver for burnout/depression. Connect with Alzheimer Association, adult day programs, respite care, support groups.',evidenceLevel:'1B',certainty:'high',source:'Alzheimer Association',tags:['caregiver']},
      {id:'dm5',type:'recommendation',title:'Advance care planning — early',description:'Discuss goals of care, healthcare proxy, advance directives while patient can still participate.',evidenceLevel:'1C',certainty:'very-high',source:'AGS',tags:['planning']},
    ]
  },
  {
    id:'pw-neuro-rehab', condition:'Neurological Rehabilitation', scenario:'Rehab after stroke, TBI, or neurological injury',
    specialty:'PM&R/Neurology', version:'2023.1', lastUpdated:'2023-06-01',
    guidelineSources:[{name:'AHA/ASA Stroke Rehabilitation Guidelines',year:2016}],
    nodes:[
      {id:'nr1',type:'recommendation',title:'Interdisciplinary rehab team',description:'MD, PT, OT, SLP, neuropsych, social work, nursing, case management. Goal-directed, patient-centered.',evidenceLevel:'1A',certainty:'very-high',source:'AHA/ASA 2016',tags:['rehab','team']},
      {id:'nr2',type:'recommendation',title:'Task-specific repetitive training',description:'Repetitive practice of functional tasks is the most evidence-supported rehab approach.',evidenceLevel:'1A',certainty:'very-high',source:'Cochrane',tags:['rehab','exercise']},
      {id:'nr3',type:'recommendation',title:'Dysphagia screening and management',description:'Screen all stroke/TBI patients for swallowing difficulty. Modified barium swallow if concern. Diet texture modification as needed.',evidenceLevel:'1B',certainty:'high',source:'AHA/ASA',tags:['swallowing','safety']},
      {id:'nr4',type:'recommendation',title:'Depression screening',description:'Screen for post-stroke depression (affects 30-50%). Treat with SSRI and/or behavioral therapy.',evidenceLevel:'1A',certainty:'high',source:'AHA/ASA',tags:['mental-health']},
    ]
  },
  // ── PULMONARY ──────────────────────────────────────────────────────────────
  {
    id:'pw-copd', condition:'COPD', scenario:'COPD management and exacerbation prevention',
    specialty:'Pulmonology', version:'2024.1', lastUpdated:'2024-01-01',
    guidelineSources:[{name:'GOLD 2024 Report',year:2024}],
    nodes:[
      {id:'co1',type:'recommendation',title:'Inhaler therapy per GOLD group',description:'LAMA or LABA for Group A/B. LAMA+LABA or LAMA+LABA+ICS for Group E. Step up based on exacerbation history and eosinophils.',evidenceLevel:'1A',certainty:'very-high',source:'GOLD 2024',tags:['medication','inhaler']},
      {id:'co2',type:'recommendation',title:'Pulmonary rehabilitation',description:'Structured pulmonary rehab improves dyspnea, exercise tolerance, quality of life. 6-12 week programs recommended post-exacerbation.',evidenceLevel:'1A',certainty:'very-high',source:'GOLD 2024',tags:['rehab']},
      {id:'co3',type:'recommendation',title:'Smoking cessation — most important intervention',description:'Smoking cessation is the only intervention proven to slow FEV1 decline.',evidenceLevel:'1A',certainty:'very-high',source:'GOLD 2024',tags:['lifestyle']},
      {id:'co4',type:'recommendation',title:'Annual influenza and pneumococcal vaccination',description:'Influenza annually. PCV20 or PCV15+PPSV23 per ACIP.',evidenceLevel:'1A',certainty:'very-high',source:'GOLD/ACIP',tags:['prevention','vaccine']},
      {id:'co5',type:'redflag',title:'Acute exacerbation signs',description:'Increasing dyspnea, purulent sputum, increased sputum volume, fever, confusion, cyanosis — urgent evaluation.',evidenceLevel:'N/A',certainty:'very-high',source:'GOLD',tags:['redflag']},
      {id:'co6',type:'monitoring',title:'Home oxygen assessment',description:'SpO2 monitoring. Prescribe supplemental O2 if resting PaO2 ≤55 or SpO2 ≤88%. Improves survival in severe hypoxemia.',evidenceLevel:'1A',certainty:'very-high',source:'GOLD',tags:['monitoring','oxygen']},
    ]
  },
  {
    id:'pw-pneumonia', condition:'Pneumonia', scenario:'Community-acquired pneumonia management and recovery',
    specialty:'Pulmonology/ID', version:'2023.1', lastUpdated:'2023-05-01',
    guidelineSources:[{name:'ATS/IDSA Guideline for CAP',year:2019}],
    nodes:[
      {id:'pn1',type:'recommendation',title:'Risk stratification — PSI/CURB-65',description:'Use PSI or CURB-65 to guide disposition. Low-risk patients can be treated outpatient.',evidenceLevel:'1A',certainty:'very-high',source:'ATS/IDSA 2019',tags:['assessment']},
      {id:'pn2',type:'recommendation',title:'Empiric antibiotic therapy',description:'Outpatient: amoxicillin or doxycycline (no comorbidities), respiratory fluoroquinolone or beta-lactam+macrolide (comorbidities). Inpatient: beta-lactam+macrolide or respiratory FQ.',evidenceLevel:'1A',certainty:'very-high',source:'ATS/IDSA 2019',tags:['medication','antibiotic']},
      {id:'pn3',type:'followup',title:'Follow-up chest X-ray at 6-12 weeks',description:'Follow-up imaging to confirm resolution, especially in patients >50, smokers, or with persistent symptoms.',evidenceLevel:'2B',certainty:'moderate',source:'ATS/IDSA',tags:['imaging','followup']},
      {id:'pn4',type:'redflag',title:'Clinical deterioration',description:'Worsening dyspnea, persistent fever after 48-72h of antibiotics, hemoptysis, new confusion — reassess.',evidenceLevel:'N/A',certainty:'very-high',source:'Clinical consensus',tags:['redflag']},
    ]
  },
  // ── VTE ────────────────────────────────────────────────────────────────────
  {
    id:'pw-vte', condition:'Venous Thromboembolism', scenario:'DVT/PE treatment and secondary prevention',
    specialty:'Hematology', version:'2023.1', lastUpdated:'2023-09-01',
    guidelineSources:[{name:'ASH VTE Guidelines',year:2020},{name:'ACCP Antithrombotic Therapy Guidelines',year:2021}],
    nodes:[
      {id:'vt1',type:'recommendation',title:'DOAC preferred for initial treatment',description:'Rivaroxaban or apixaban preferred for most VTE (no cancer). LMWH bridge to warfarin if DOAC contraindicated.',evidenceLevel:'1A',certainty:'very-high',source:'ASH 2020',tags:['medication','anticoagulation']},
      {id:'vt2',type:'recommendation',title:'Minimum 3 months anticoagulation',description:'3 months for provoked VTE. Extended/indefinite for unprovoked PE, recurrent VTE, or active cancer.',evidenceLevel:'1A',certainty:'very-high',source:'ACCP 2021',tags:['medication','duration']},
      {id:'vt3',type:'recommendation',title:'Cancer-associated VTE — LMWH or DOAC',description:'LMWH or edoxaban/rivaroxaban for cancer-associated VTE. Avoid DOACs in GI/GU cancers per some guidelines.',evidenceLevel:'1A',certainty:'high',source:'ASH/ISTH',tags:['medication','oncology']},
      {id:'vt4',type:'redflag',title:'Signs of PE or bleeding',description:'Sudden dyspnea, chest pain, hemoptysis, tachycardia — concern for PE. Major bleeding, hematemesis, melena, intracranial symptoms — concern for anticoagulant complication.',evidenceLevel:'N/A',certainty:'very-high',source:'Clinical consensus',tags:['redflag']},
    ]
  },
  // ── WOUND CARE ─────────────────────────────────────────────────────────────
  {
    id:'pw-wound-care', condition:'Wound Care', scenario:'Pressure injury, diabetic foot ulcer, venous leg ulcer management',
    specialty:'Wound Care', version:'2024.1', lastUpdated:'2024-01-15',
    guidelineSources:[{name:'NPUAP/EPUAP Pressure Injury Prevention and Treatment',year:2019},{name:'IWGDF Guidelines on Diabetic Foot',year:2023}],
    nodes:[
      {id:'wc1',type:'recommendation',title:'Wound assessment and staging',description:'Document wound type, stage/depth, size (L×W×D), bed tissue, exudate, periwound skin, signs of infection, pain. Photo documentation. Reassess weekly.',evidenceLevel:'1B',certainty:'high',source:'NPUAP/EPUAP',tags:['assessment']},
      {id:'wc2',type:'recommendation',title:'Moist wound healing environment',description:'Select dressing based on wound characteristics. Foam for moderate exudate, alginate for heavy, hydrogel for dry wounds. Avoid wet-to-dry gauze.',evidenceLevel:'1A',certainty:'very-high',source:'NPUAP/EPUAP',tags:['treatment','dressing']},
      {id:'wc3',type:'recommendation',title:'Pressure redistribution',description:'For pressure injuries: reposition every 2 hours, pressure-relieving mattress, offload bony prominences, float heels.',evidenceLevel:'1A',certainty:'very-high',source:'NPUAP/EPUAP',tags:['prevention']},
      {id:'wc4',type:'recommendation',title:'Nutrition optimization',description:'Protein 1.25-1.5 g/kg/day for wound healing. Adequate calories. Vitamin C, zinc supplementation if deficient. Hydration.',evidenceLevel:'1B',certainty:'high',source:'NPUAP/ASPEN',tags:['nutrition']},
      {id:'wc5',type:'recommendation',title:'Infection management',description:'Topical antimicrobials for biofilm/critical colonization. Systemic antibiotics only for cellulitis, osteomyelitis, or systemic infection signs.',evidenceLevel:'1B',certainty:'high',source:'IWGDF/IDSA',tags:['infection','medication']},
      {id:'wc6',type:'recommendation',title:'Offloading for diabetic foot ulcers',description:'Total contact cast or irremovable knee-high walker is gold standard for neuropathic plantar ulcers.',evidenceLevel:'1A',certainty:'very-high',source:'IWGDF 2023',tags:['treatment','offloading']},
      {id:'wc7',type:'redflag',title:'Wound infection signs',description:'Increasing pain, erythema spreading >2cm, warmth, purulent drainage, fever, foul odor, crepitus — urgent evaluation.',evidenceLevel:'N/A',certainty:'very-high',source:'Clinical consensus',tags:['redflag']},
    ]
  },
  // ── ENDOCRINE ──────────────────────────────────────────────────────────────
  {
    id:'pw-diabetes', condition:'Diabetes Risk Management', scenario:'Comprehensive T2D management',
    specialty:'Endocrinology', version:'2024.1', lastUpdated:'2024-01-01',
    guidelineSources:[{name:'ADA Standards of Care in Diabetes',year:2024}],
    nodes:[
      {id:'dm1',type:'recommendation',title:'A1c target individualization',description:'A1c <7% for most adults; <8% for older adults with comorbidities or hypoglycemia risk.',evidenceLevel:'1A',certainty:'very-high',source:'ADA 2024',tags:['monitoring']},
      {id:'dm2',type:'recommendation',title:'GLP-1 RA or SGLT2i with CV/renal disease',description:'GLP-1 RA or SGLT2i with proven CV benefit recommended for T2D with ASCVD, HF, or CKD.',evidenceLevel:'1A',certainty:'very-high',source:'ADA 2024',tags:['medication']},
      {id:'dm3',type:'monitoring',title:'Annual comprehensive foot exam',description:'Annual foot exam for neuropathy, vascular insufficiency, deformity.',evidenceLevel:'1B',certainty:'high',source:'ADA 2024',tags:['monitoring']},
      {id:'dm4',type:'monitoring',title:'Annual retinal screening',description:'Dilated eye exam at diagnosis and annually.',evidenceLevel:'1B',certainty:'high',source:'ADA 2024',tags:['screening']},
      {id:'dm5',type:'monitoring',title:'Renal function and albuminuria annually',description:'eGFR and UACR screening for diabetic kidney disease.',evidenceLevel:'1B',certainty:'high',source:'ADA 2024',tags:['monitoring','renal']},
      {id:'dm6',type:'recommendation',title:'Statin therapy for CV risk',description:'Moderate- to high-intensity statin for most T2D adults 40-75.',evidenceLevel:'1A',certainty:'very-high',source:'ADA 2024',tags:['medication','lipid']},
    ]
  },
  // ── SMOKING CESSATION ──────────────────────────────────────────────────────
  {
    id:'pw-smoke-cessation', condition:'Smoking Cessation', scenario:'Cessation support after acute CV event',
    specialty:'Preventive Cardiology', version:'2023.1', lastUpdated:'2023-09-01',
    guidelineSources:[{name:'USPSTF Smoking Cessation',year:2021},{name:'ACC/AHA Secondary Prevention',year:2023}],
    nodes:[
      {id:'sm1',type:'recommendation',title:'Combination pharmacotherapy + counseling',description:'Combination approach (varenicline or NRT + behavioral counseling) is most effective.',evidenceLevel:'1A',certainty:'very-high',source:'USPSTF 2021',tags:['medication','behavioral']},
      {id:'sm2',type:'recommendation',title:'Varenicline first-line',description:'Most effective single pharmacotherapy. Safe post-ACS per EAGLES.',evidenceLevel:'1A',certainty:'high',source:'EAGLES, Cochrane',tags:['medication']},
      {id:'sm3',type:'followup',title:'Follow-up at 1, 3, 6 months',description:'Structured follow-up. Relapse common — does not preclude re-attempts.',evidenceLevel:'2A',certainty:'moderate',source:'USPSTF',tags:['followup']},
    ]
  },
  // ── RENAL ──────────────────────────────────────────────────────────────────
  {
    id:'pw-ckd', condition:'Chronic Kidney Disease', scenario:'CKD management and progression prevention',
    specialty:'Nephrology', version:'2024.1', lastUpdated:'2024-01-01',
    guidelineSources:[{name:'KDIGO CKD Guideline',year:2024}],
    nodes:[
      {id:'ck1',type:'recommendation',title:'ACEi/ARB for proteinuric CKD',description:'ACEi or ARB for CKD with albuminuria (UACR >30). Monitor potassium and creatinine.',evidenceLevel:'1A',certainty:'very-high',source:'KDIGO 2024',tags:['medication']},
      {id:'ck2',type:'recommendation',title:'SGLT2 inhibitor for CKD',description:'SGLT2i (dapagliflozin or empagliflozin) for CKD with eGFR ≥20. Slows progression regardless of diabetes.',evidenceLevel:'1A',certainty:'very-high',source:'DAPA-CKD, EMPA-KIDNEY',tags:['medication']},
      {id:'ck3',type:'monitoring',title:'eGFR and UACR monitoring',description:'Monitor eGFR and UACR every 3-12 months based on stage.',evidenceLevel:'1B',certainty:'high',source:'KDIGO',tags:['monitoring','lab']},
      {id:'ck4',type:'recommendation',title:'Avoid nephrotoxins',description:'Minimize NSAIDs, contrast dye, aminoglycosides. Adjust medications for GFR.',evidenceLevel:'1A',certainty:'very-high',source:'KDIGO',tags:['safety','medication']},
    ]
  },
  // ── ONCOLOGY ───────────────────────────────────────────────────────────────
  {
    id:'pw-oncology', condition:'Oncology Supportive Care', scenario:'Supportive care considerations across cancer types',
    specialty:'Oncology', version:'2023.1', lastUpdated:'2023-06-01',
    guidelineSources:[{name:'ASCO Supportive Care Guidelines',year:2023},{name:'NCCN Survivorship',year:2024}],
    nodes:[
      {id:'on1',type:'recommendation',title:'Symptom management',description:'Proactive management of pain, nausea, fatigue, neuropathy, mucositis, anorexia. Use validated symptom assessment tools.',evidenceLevel:'1A',certainty:'high',source:'ASCO',tags:['symptom','supportive']},
      {id:'on2',type:'recommendation',title:'Psychosocial screening',description:'Screen for distress, depression, anxiety at every visit (NCCN Distress Thermometer). Refer to psycho-oncology, social work.',evidenceLevel:'1B',certainty:'high',source:'NCCN',tags:['mental-health']},
      {id:'on3',type:'recommendation',title:'Palliative care integration',description:'Early palliative care consultation improves QoL and may improve survival. Not limited to end-of-life.',evidenceLevel:'1A',certainty:'very-high',source:'ASCO',tags:['palliative']},
      {id:'on4',type:'recommendation',title:'Survivorship care planning',description:'At treatment completion: surveillance schedule, late effects monitoring, health promotion, psychosocial support.',evidenceLevel:'2A',certainty:'moderate',source:'NCCN',tags:['survivorship']},
    ]
  },
  // ── PALLIATIVE ─────────────────────────────────────────────────────────────
  {
    id:'pw-palliative', condition:'Palliative / Hospice Care', scenario:'Comfort-focused care and end-of-life support',
    specialty:'Palliative Medicine', version:'2023.1', lastUpdated:'2023-06-01',
    guidelineSources:[{name:'NCP Clinical Practice Guidelines for Quality Palliative Care',year:2018}],
    nodes:[
      {id:'pl1',type:'recommendation',title:'Goals of care discussion',description:'Structured goals of care conversation. Document preferences. POLST/MOLST. Revisit with disease progression.',evidenceLevel:'1B',certainty:'very-high',source:'NCP 2018',tags:['planning']},
      {id:'pl2',type:'recommendation',title:'Symptom-focused medication review',description:'Discontinue non-essential medications. Focus on comfort: pain, dyspnea, nausea, anxiety, secretions.',evidenceLevel:'1B',certainty:'high',source:'NCP',tags:['medication']},
      {id:'pl3',type:'recommendation',title:'Family/caregiver support',description:'Bereavement support, spiritual care, practical assistance, respite.',evidenceLevel:'1C',certainty:'high',source:'NCP',tags:['caregiver']},
    ]
  },
  // ── UROLOGY ────────────────────────────────────────────────────────────────
  {
    id:'pw-aml', condition:'Renal Angiomyolipoma', scenario:'Surveillance and management of renal AML',
    specialty:'Urology', version:'2023.1', lastUpdated:'2023-06-01',
    guidelineSources:[{name:'AUA: Management of Renal Mass',year:2023}],
    nodes:[
      {id:'am1',type:'recommendation',title:'Active surveillance for AML <4cm',description:'Asymptomatic AML <4cm managed with surveillance imaging.',evidenceLevel:'2B',certainty:'moderate',source:'AUA 2023',tags:['surveillance']},
      {id:'am2',type:'recommendation',title:'mTOR inhibitor for TSC-associated AML',description:'Everolimus reduces AML volume in TSC.',evidenceLevel:'1B',certainty:'high',source:'EXIST-2',tags:['medication']},
      {id:'am3',type:'redflag',title:'Acute flank pain or hematuria',description:'May indicate AML hemorrhage requiring urgent evaluation.',evidenceLevel:'N/A',certainty:'very-high',source:'Clinical consensus',tags:['redflag']},
    ]
  },
  // ── HBOT ───────────────────────────────────────────────────────────────────
  {
    id:'pw-hbot', condition:'Radiation Injury', scenario:'HBOT for late radiation tissue injury',
    specialty:'Radiation Oncology', version:'2024.1', lastUpdated:'2024-02-01',
    guidelineSources:[{name:'UHMS Indications for HBOT',year:2023},{name:'Cochrane: HBOT for Late Radiation Injury',year:2016}],
    nodes:[
      {id:'hb1',type:'recommendation',title:'HBOT for radiation cystitis',description:'Evidence supports HBOT for radiation hemorrhagic cystitis refractory to conservative management.',evidenceLevel:'1B',certainty:'high',source:'Cochrane/Oscarsson 2019',tags:['treatment']},
      {id:'hb2',type:'recommendation',title:'HBOT for radiation proctitis',description:'HBOT improves chronic radiation proctitis symptoms.',evidenceLevel:'2A',certainty:'moderate',source:'Cochrane 2016',tags:['treatment']},
      {id:'hb3',type:'contraindication',title:'ORN mandible — mixed evidence',description:'DAHANCA-21 showed no benefit for mandibular ORN. Other data conflicts.',evidenceLevel:'1B',certainty:'moderate',source:'DAHANCA-21',tags:['contradiction']},
    ]
  },
  // ── PSYCHIATRIC ────────────────────────────────────────────────────────────
  {
    id:'pw-psych', condition:'Psychiatric Care', scenario:'Depression, anxiety, and substance use management',
    specialty:'Psychiatry', version:'2023.1', lastUpdated:'2023-09-01',
    guidelineSources:[{name:'APA Practice Guidelines for MDD',year:2023}],
    nodes:[
      {id:'ps1',type:'recommendation',title:'PHQ-9 screening and monitoring',description:'PHQ-9 at baseline and follow-up. Score ≥10 suggests moderate depression.',evidenceLevel:'1A',certainty:'very-high',source:'USPSTF/APA',tags:['screening']},
      {id:'ps2',type:'recommendation',title:'SSRI or SNRI first-line for MDD',description:'Sertraline, escitalopram, or duloxetine commonly first-line. 4-6 week adequate trial.',evidenceLevel:'1A',certainty:'very-high',source:'APA 2023',tags:['medication']},
      {id:'ps3',type:'recommendation',title:'Psychotherapy — CBT or IPT',description:'CBT and interpersonal therapy equally effective as medication for mild-moderate depression.',evidenceLevel:'1A',certainty:'very-high',source:'APA/Cochrane',tags:['therapy']},
      {id:'ps4',type:'redflag',title:'Suicidality assessment',description:'Screen for suicidal ideation at every visit. Safety plan. If imminent risk — emergency evaluation.',evidenceLevel:'N/A',certainty:'very-high',source:'APA',tags:['redflag','safety']},
    ]
  },
  // ── DELIRIUM ───────────────────────────────────────────────────────────────
  {
    id:'pw-delirium', condition:'Delirium', scenario:'Prevention and management of delirium in hospitalized/home patients',
    specialty:'Geriatrics', version:'2023.1', lastUpdated:'2023-06-01',
    guidelineSources:[{name:'AGS Delirium Prevention Guidelines',year:2022}],
    nodes:[
      {id:'dl1',type:'recommendation',title:'Non-pharmacologic prevention bundle',description:'Reorientation, sleep hygiene, early mobilization, hydration, hearing aids/glasses, minimize tethers (catheters/restraints), avoid deliriogenic medications.',evidenceLevel:'1A',certainty:'very-high',source:'AGS/HELP protocol',tags:['prevention']},
      {id:'dl2',type:'recommendation',title:'Identify and treat underlying cause',description:'Infection, medications, metabolic derangement, pain, urinary retention, constipation, hypoxia.',evidenceLevel:'1A',certainty:'very-high',source:'AGS',tags:['assessment','treatment']},
      {id:'dl3',type:'recommendation',title:'Avoid deliriogenic medications',description:'Minimize benzodiazepines, anticholinergics, meperidine, diphenhydramine. Review with Beers Criteria.',evidenceLevel:'1A',certainty:'very-high',source:'AGS Beers',tags:['medication','safety']},
    ]
  },
  // ── SEPSIS ─────────────────────────────────────────────────────────────────
  {
    id:'pw-sepsis', condition:'Sepsis', scenario:'Early recognition and management of sepsis',
    specialty:'Critical Care/ID', version:'2023.1', lastUpdated:'2023-06-01',
    guidelineSources:[{name:'Surviving Sepsis Campaign Guidelines',year:2021}],
    nodes:[
      {id:'sp1',type:'recommendation',title:'Hour-1 bundle',description:'Measure lactate, obtain blood cultures, administer broad-spectrum antibiotics, begin fluid resuscitation (30 mL/kg crystalloid for hypotension/lactate ≥4), vasopressors if refractory.',evidenceLevel:'1A',certainty:'very-high',source:'SSC 2021',tags:['acute','treatment']},
      {id:'sp2',type:'recommendation',title:'Source control',description:'Identify and control source of infection. Imaging as needed. Drainage/debridement if indicated.',evidenceLevel:'1A',certainty:'very-high',source:'SSC 2021',tags:['treatment']},
      {id:'sp3',type:'monitoring',title:'Serial lactate clearance',description:'Repeat lactate within 2-4 hours if initial elevated. Guide resuscitation adequacy.',evidenceLevel:'1B',certainty:'high',source:'SSC 2021',tags:['monitoring','lab']},
    ]
  },
  // ── NUTRITION ──────────────────────────────────────────────────────────────
  {
    id:'pw-nutrition', condition:'Nutrition Support', scenario:'Nutritional assessment and intervention for at-risk patients',
    specialty:'Nutrition/Geriatrics', version:'2023.1', lastUpdated:'2023-06-01',
    guidelineSources:[{name:'ASPEN/SCCM Nutrition Therapy Guidelines',year:2022}],
    nodes:[
      {id:'nt1',type:'recommendation',title:'Nutritional screening on admission',description:'Screen all patients with validated tool (MNA, MUST, NRS-2002) within 24 hours.',evidenceLevel:'1A',certainty:'very-high',source:'ASPEN',tags:['screening']},
      {id:'nt2',type:'recommendation',title:'Protein targets for healing',description:'1.2-1.5 g/kg/day protein for critically ill, wound healing, or malnourished patients.',evidenceLevel:'1B',certainty:'high',source:'ASPEN/SCCM',tags:['nutrition','protein']},
      {id:'nt3',type:'recommendation',title:'Oral nutrition supplements',description:'ONS between meals for patients not meeting caloric needs. Improves outcomes in malnourished hospitalized patients.',evidenceLevel:'1A',certainty:'high',source:'Cochrane/ASPEN',tags:['nutrition','supplement']},
    ]
  },
  // ── PAIN MANAGEMENT ────────────────────────────────────────────────────────
  {
    id:'pw-pain-mgmt', condition:'Pain Management', scenario:'Multimodal approach to acute and chronic pain',
    specialty:'Pain Management', version:'2023.1', lastUpdated:'2023-09-01',
    guidelineSources:[{name:'CDC Clinical Practice Guideline for Prescribing Opioids',year:2022}],
    nodes:[
      {id:'pm1',type:'recommendation',title:'Multimodal analgesia',description:'Combine non-opioid analgesics (acetaminophen, NSAIDs, gabapentinoids), regional techniques, physical modalities. Reserve opioids for severe pain.',evidenceLevel:'1A',certainty:'very-high',source:'CDC 2022',tags:['medication','multimodal']},
      {id:'pm2',type:'recommendation',title:'Opioid risk mitigation',description:'If opioids used: lowest effective dose, shortest duration. Check PDMP. Prescribe naloxone if risk factors. Reassess regularly.',evidenceLevel:'1A',certainty:'very-high',source:'CDC 2022',tags:['medication','safety']},
      {id:'pm3',type:'recommendation',title:'Non-pharmacologic approaches',description:'PT, cognitive behavioral therapy for pain, mindfulness, acupuncture, TENS. Evidence-supported for chronic pain.',evidenceLevel:'1A',certainty:'high',source:'ACP/Cochrane',tags:['non-pharm']},
    ]
  },
  // ── PAD ────────────────────────────────────────────────────────────────────
  {
    id:'pw-pad', condition:'Peripheral Artery Disease', scenario:'Medical management and surveillance of PAD',
    specialty:'Vascular', version:'2023.1', lastUpdated:'2023-06-01',
    guidelineSources:[{name:'AHA/ACC PAD Guideline',year:2016}],
    nodes:[
      {id:'pd1',type:'recommendation',title:'Antiplatelet therapy',description:'Aspirin or clopidogrel for symptomatic PAD. Rivaroxaban 2.5mg BID + aspirin considered per COMPASS.',evidenceLevel:'1A',certainty:'very-high',source:'AHA/ACC',tags:['medication']},
      {id:'pd2',type:'recommendation',title:'Supervised exercise therapy',description:'Structured walking program (30-45 min, 3x/week, 12 weeks) improves claudication distance.',evidenceLevel:'1A',certainty:'very-high',source:'AHA/ACC',tags:['exercise']},
      {id:'pd3',type:'recommendation',title:'Statin and BP control',description:'High-intensity statin. BP <130/80.',evidenceLevel:'1A',certainty:'very-high',source:'AHA/ACC',tags:['medication']},
      {id:'pd4',type:'redflag',title:'Critical limb ischemia signs',description:'Rest pain, non-healing ulcers, gangrene — urgent vascular referral.',evidenceLevel:'N/A',certainty:'very-high',source:'Clinical consensus',tags:['redflag']},
    ]
  },
  // ── OSTEOPOROSIS ───────────────────────────────────────────────────────────
  {
    id:'pw-osteoporosis', condition:'Osteoporosis', scenario:'Fracture prevention and bone health management',
    specialty:'Endocrinology/Rheumatology', version:'2023.1', lastUpdated:'2023-06-01',
    guidelineSources:[{name:'Endocrine Society Osteoporosis Guideline',year:2020}],
    nodes:[
      {id:'op1',type:'recommendation',title:'Bisphosphonate first-line',description:'Alendronate, risedronate, or zoledronic acid for postmenopausal osteoporosis. Very high fracture risk may warrant denosumab or anabolic agent first.',evidenceLevel:'1A',certainty:'very-high',source:'Endocrine Society',tags:['medication']},
      {id:'op2',type:'recommendation',title:'Calcium and vitamin D',description:'Calcium 1000-1200mg/day, vitamin D 800-1000 IU/day (target 25-OH D >30 ng/mL).',evidenceLevel:'1A',certainty:'high',source:'Endocrine Society',tags:['supplement']},
      {id:'op3',type:'monitoring',title:'DEXA every 2 years on treatment',description:'Repeat DEXA to assess treatment response. More frequently if changing therapy.',evidenceLevel:'2A',certainty:'moderate',source:'Endocrine Society',tags:['monitoring','imaging']},
    ]
  },
  // ── C. DIFF ────────────────────────────────────────────────────────────────
  {
    id:'pw-cdiff', condition:'C. difficile Infection', scenario:'Treatment and recurrence prevention',
    specialty:'Infectious Disease', version:'2023.1', lastUpdated:'2023-06-01',
    guidelineSources:[{name:'IDSA/SHEA CDI Guideline',year:2021}],
    nodes:[
      {id:'cd1',type:'recommendation',title:'Fidaxomicin preferred for initial episode',description:'Fidaxomicin preferred over vancomycin for initial and recurrent CDI. Lower recurrence rates.',evidenceLevel:'1A',certainty:'high',source:'IDSA/SHEA 2021',tags:['medication','antibiotic']},
      {id:'cd2',type:'recommendation',title:'Discontinue inciting antibiotics if possible',description:'Stop unnecessary antibiotics. Avoid PPIs if not clearly indicated.',evidenceLevel:'1A',certainty:'very-high',source:'IDSA/SHEA',tags:['medication']},
      {id:'cd3',type:'recommendation',title:'Fecal microbiota therapy for recurrence',description:'FMT recommended after 2+ recurrences despite appropriate antibiotic therapy.',evidenceLevel:'1A',certainty:'high',source:'IDSA/SHEA',tags:['treatment']},
    ]
  },
  // ── CARDIAC REHAB ──────────────────────────────────────────────────────────
  {
    id:'pw-cardiac-rehab', condition:'Cardiac Rehabilitation', scenario:'Structured cardiac rehab after ACS, CABG, or HF',
    specialty:'Cardiology/Rehab', version:'2023.1', lastUpdated:'2023-06-01',
    guidelineSources:[{name:'AHA/AACVPR Cardiac Rehabilitation Guideline',year:2020}],
    nodes:[
      {id:'cr1',type:'recommendation',title:'Early referral before discharge',description:'Refer to cardiac rehab before discharge. Automatic referral systems improve enrollment.',evidenceLevel:'1A',certainty:'very-high',source:'AHA/AACVPR',tags:['referral']},
      {id:'cr2',type:'recommendation',title:'36 sessions over 12 weeks',description:'Supervised exercise 3x/week. Progressive aerobic and resistance training. Reduces mortality 20-25%.',evidenceLevel:'1A',certainty:'very-high',source:'Cochrane',tags:['exercise','rehab']},
      {id:'cr3',type:'recommendation',title:'Comprehensive secondary prevention',description:'Diet counseling, smoking cessation, stress management, medication adherence, psychosocial support integrated into rehab.',evidenceLevel:'1A',certainty:'very-high',source:'AHA/AACVPR',tags:['prevention','lifestyle']},
    ]
  },
  // ── PULM REHAB ─────────────────────────────────────────────────────────────
  {
    id:'pw-pulm-rehab', condition:'Pulmonary Rehabilitation', scenario:'Structured pulm rehab for COPD and chronic lung disease',
    specialty:'Pulmonology/Rehab', version:'2023.1', lastUpdated:'2023-06-01',
    guidelineSources:[{name:'ATS/ERS Pulmonary Rehabilitation Statement',year:2013}],
    nodes:[
      {id:'pr1',type:'recommendation',title:'6-12 week supervised program',description:'Minimum 12 sessions. Endurance and strength training. Education on disease management, breathing techniques, energy conservation.',evidenceLevel:'1A',certainty:'very-high',source:'ATS/ERS',tags:['rehab','exercise']},
      {id:'pr2',type:'recommendation',title:'Initiate after exacerbation',description:'Starting within 1-4 weeks of exacerbation reduces readmissions and improves recovery.',evidenceLevel:'1A',certainty:'very-high',source:'Cochrane',tags:['timing']},
    ]
  },
];
