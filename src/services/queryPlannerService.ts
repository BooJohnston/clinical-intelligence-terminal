import type { QueryIntent, SourceId, QueryPlan, ParsedScenario } from '../types';

const MED_KEYWORDS = ['medication','drug','dose','dosage','interaction','contraindication','side effect','adverse','label','warning','prescrib','safety','dailymed','rxnorm'];
const TRIAL_KEYWORDS = ['trial','clinical trial','ongoing','recruiting','phase','enrollment','interventional'];
const TERMINOLOGY_KEYWORDS = ['icd','snomed','loinc','code','coding','classification','terminology','map to'];
const CITATION_KEYWORDS = ['retraction','retracted','quality','citation count','impact factor','validity','provenance'];
const FHIR_KEYWORDS = ['fhir','ehr','patient context','smart','cds hook','order set'];

export function classifyIntent(text: string): QueryIntent {
  const l = text.toLowerCase();
  
  // Check for patient-specific context FIRST — age + condition = clinical scenario regardless of other keywords
  const hasAge = /\d{1,3}[\s-]*(year|yr|y\.?o|yo)/i.test(text);
  const hasCondition = /(fracture|stroke|mi |heart|diabetes|cancer|copd|pneumonia|sepsis|wound|ulcer|fall|dementia|hip|knee)/i.test(text);
  if (hasAge && hasCondition) return 'clinical-scenario';
  
  if (FHIR_KEYWORDS.some(k => l.includes(k))) return 'ehr-context';
  if (MED_KEYWORDS.some(k => l.includes(k))) return 'medication-safety';
  if (TRIAL_KEYWORDS.some(k => l.includes(k))) return 'trial-discovery';
  if (TERMINOLOGY_KEYWORDS.some(k => l.includes(k))) return 'terminology-mapping';
  if (CITATION_KEYWORDS.some(k => l.includes(k))) return 'citation-quality';
  if (/(post|after|discharge|follow|care|home|admit|return)/i.test(text)) return 'clinical-scenario';
  return 'literature-research';
}

const INTENT_SOURCE_MAP: Record<QueryIntent, SourceId[]> = {
  'clinical-scenario': ['guideline-graph', 'pubmed', 'clinicaltrials', 'openalex', 'dailymed', 'umls'],
  'literature-research': ['pubmed', 'openalex', 'crossref', 'semantic-scholar', 'europe-pmc'],
  'trial-discovery': ['clinicaltrials', 'pubmed', 'openalex'],
  'medication-safety': ['dailymed', 'rxnorm', 'pubmed'],
  'guideline-lookup': ['guideline-graph', 'pubmed', 'openalex'],
  'terminology-mapping': ['umls', 'snomed', 'loinc'],
  'ehr-context': ['fhir-context', 'guideline-graph', 'umls', 'pubmed'],
  'citation-quality': ['crossref', 'openalex', 'semantic-scholar'],
};

const INTENT_LABELS: Record<QueryIntent, string> = {
  'clinical-scenario': 'Practical clinical scenario — querying pathways, PubMed, ClinicalTrials.gov, OpenAlex, and medication safety',
  'literature-research': 'Literature research — broad multi-database evidence search',
  'trial-discovery': 'Clinical trial discovery — searching for ongoing and completed trials',
  'medication-safety': 'Medication safety — checking drug labels, interactions, and safety data',
  'guideline-lookup': 'Guideline/pathway lookup — searching clinical pathway graph and evidence',
  'terminology-mapping': 'Terminology mapping — normalizing to standard clinical codes',
  'ehr-context': 'EHR context review — incorporating patient context via FHIR',
  'citation-quality': 'Citation quality — checking provenance and retraction status',
};

export function buildQueryPlan(text: string, parsed: ParsedScenario): QueryPlan {
  const intent = classifyIntent(text);
  const sources = [...INTENT_SOURCE_MAP[intent]];

  if (parsed.medications.length > 0 && !sources.includes('dailymed')) {
    sources.push('dailymed', 'rxnorm');
  }

  return {
    intent,
    sources: [...new Set(sources)],
    rationale: INTENT_LABELS[intent],
    parsed,
  };
}
