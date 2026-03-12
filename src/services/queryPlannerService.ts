import type { QueryIntent, SourceId, QueryPlan, ParsedScenario } from '../types';

const MED_KEYWORDS = ['medication','drug','dose','dosage','interaction','contraindication','side effect','adverse','label','warning','prescrib','safety','dailymed','rxnorm','pill','tablet','capsule'];
const TRIAL_KEYWORDS = ['trial','clinical trial','ongoing','recruiting','phase','enrollment','study design','randomized','interventional'];
const GUIDELINE_KEYWORDS = ['guideline','pathway','recommendation','standard of care','protocol','best practice','discharge','follow-up','monitoring'];
const TERMINOLOGY_KEYWORDS = ['icd','snomed','loinc','code','coding','classification','terminology','map to'];
const CITATION_KEYWORDS = ['retraction','retracted','quality','citation count','impact factor','validity','provenance'];
const FHIR_KEYWORDS = ['fhir','ehr','patient context','smart','cds hook','order set'];

export function classifyIntent(text: string): QueryIntent {
  const l = text.toLowerCase();
  if (FHIR_KEYWORDS.some(k => l.includes(k))) return 'ehr-context';
  if (MED_KEYWORDS.some(k => l.includes(k))) return 'medication-safety';
  if (TRIAL_KEYWORDS.some(k => l.includes(k))) return 'trial-discovery';
  if (GUIDELINE_KEYWORDS.some(k => l.includes(k))) return 'guideline-lookup';
  if (TERMINOLOGY_KEYWORDS.some(k => l.includes(k))) return 'terminology-mapping';
  if (CITATION_KEYWORDS.some(k => l.includes(k))) return 'citation-quality';
  // If contains age, condition, or clinical context → clinical scenario
  if (/\d{1,3}[\s-]*(year|yr|y\.?o|yo)/i.test(text) || /(post|after|discharge|follow|care)/i.test(text)) return 'clinical-scenario';
  return 'literature-research';
}

const INTENT_SOURCE_MAP: Record<QueryIntent, SourceId[]> = {
  'clinical-scenario': ['guideline-graph', 'pubmed', 'clinicaltrials', 'dailymed', 'umls'],
  'literature-research': ['pubmed', 'openalex', 'crossref', 'semantic-scholar', 'europe-pmc'],
  'trial-discovery': ['clinicaltrials', 'pubmed', 'openalex'],
  'medication-safety': ['dailymed', 'rxnorm', 'pubmed'],
  'guideline-lookup': ['guideline-graph', 'pubmed'],
  'terminology-mapping': ['umls', 'snomed', 'loinc'],
  'ehr-context': ['fhir-context', 'guideline-graph', 'umls', 'pubmed'],
  'citation-quality': ['crossref', 'openalex', 'semantic-scholar'],
};

const INTENT_LABELS: Record<QueryIntent, string> = {
  'clinical-scenario': 'Practical clinical scenario — querying pathways, evidence, and medication safety',
  'literature-research': 'Literature research — broad multi-database evidence search',
  'trial-discovery': 'Clinical trial discovery — searching for ongoing and completed trials',
  'medication-safety': 'Medication safety — checking drug labels, interactions, and safety data',
  'guideline-lookup': 'Guideline/pathway lookup — searching clinical pathway graph',
  'terminology-mapping': 'Terminology mapping — normalizing to standard clinical codes',
  'ehr-context': 'EHR context review — incorporating patient context via FHIR',
  'citation-quality': 'Citation quality — checking provenance and retraction status',
};

export function buildQueryPlan(text: string, parsed: ParsedScenario): QueryPlan {
  const intent = classifyIntent(text);
  const sources = INTENT_SOURCE_MAP[intent];

  // Augment: if medications mentioned and not already including med sources, add them
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
