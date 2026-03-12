export type UserRole = 'clinician' | 'researcher' | 'care-manager' | 'institution-admin' | 'platform-admin';
export interface User { id: string; email: string; name: string; role: UserRole; institution?: string; }

export type StudyType = 'meta-analysis' | 'systematic-review' | 'rct' | 'cohort' | 'case-control' | 'case-series' | 'case-report' | 'editorial' | 'guideline' | 'preprint';
export type SentimentDirection = 'positive' | 'neutral' | 'negative';
export type StrengthCategory = 'very-high' | 'high' | 'moderate' | 'low' | 'very-low';
export type CarePhase = 'acute' | 'post-acute' | 'discharge' | 'follow-up' | 'chronic' | 'prevention' | 'palliative';
export type CareSetting = 'inpatient' | 'outpatient' | 'home' | 'rehab' | 'ed' | 'icu' | 'long-term-care';

export type QueryIntent =
  | 'clinical-scenario'
  | 'literature-research'
  | 'trial-discovery'
  | 'medication-safety'
  | 'guideline-lookup'
  | 'terminology-mapping'
  | 'ehr-context'
  | 'citation-quality';

export type SourceId =
  | 'pubmed' | 'clinicaltrials' | 'openalex' | 'crossref'
  | 'dailymed' | 'rxnorm'
  | 'umls' | 'snomed' | 'loinc'
  | 'semantic-scholar' | 'europe-pmc'
  | 'guideline-graph' | 'fhir-context'
  | 'internal-outcomes';

export interface QueryPlan {
  intent: QueryIntent;
  sources: SourceId[];
  rationale: string;
  parsed: ParsedScenario;
}

export interface NormalizedRecord {
  id: string;
  source: string;
  sourceType?: SourceId;
  title: string;
  abstract: string;
  authors: string[];
  institution?: string;
  journal: string;
  year: number;
  doi?: string;
  url?: string;
  publicationDate: string;
  retrievalDate: string;
  studyType: StudyType;
  sampleSize?: number;
  population?: string;
  intervention?: string;
  comparator?: string;
  outcomes?: string;
  resultDirection: SentimentDirection;
  evidenceStrength: StrengthCategory;
  evidenceScore: number;
  citationCount: number;
  topicTags: string[];
  specialty?: string;
  guidelineLinked?: string;
  terminologyCodes?: TermCode[];
  qualityFlags?: string[];
  retractionFlags?: string[];
}

export interface TermCode { system: string; code: string; display: string; }

export interface ParsedScenario {
  age?: number;
  sex?: string;
  primaryCondition?: string;
  carePhase?: CarePhase;
  careSetting?: CareSetting;
  recentIntervention?: string;
  comorbidities: string[];
  riskFactors: string[];
  medications: string[];
  observations: string[];
  functionalIndicators: string[];
  missingData: string[];
  specialtyArea?: string;
  pathwayCandidates: string[];
  confidence: number;
  rawText: string;
}

export interface PathwayNode {
  id: string;
  type: 'recommendation' | 'monitoring' | 'followup' | 'education' | 'redflag' | 'contraindication' | 'discharge' | 'escalation';
  title: string;
  description: string;
  evidenceLevel: string;
  certainty: StrengthCategory;
  source: string;
  version?: string;
  tags: string[];
  terminologyCodes?: TermCode[];
}

export interface ClinicalPathway {
  id: string;
  condition: string;
  scenario: string;
  specialty: string;
  nodes: PathwayNode[];
  guidelineSources: { name: string; year: number; url?: string }[];
  version: string;
  lastUpdated: string;
}

export interface ConsensusResult {
  totalStudies: number;
  positiveCount: number;
  neutralCount: number;
  negativeCount: number;
  positivePercent: number;
  neutralPercent: number;
  negativePercent: number;
  weightedConfidence: number;
  contradictionIndex: 'low' | 'medium' | 'high';
  conclusion: string;
  researchGaps: string[];
  contradictions: { id: string; supporting: string; opposing: string; cause: string }[];
}

export interface BriefSection { domain: string; items: { text: string; strength: StrengthCategory; source?: string }[]; }

export interface ClinicalBrief {
  scenarioSummary: string;
  queryPlan: QueryPlan;
  careConsiderations: BriefSection[];
  missingInformation: string[];
  redFlags: string[];
  evidenceSummary: string;
  medicationNotes: string[];
  sourcesAndProvenance: { name: string; type: string; retrieved: string; version?: string }[];
  disclaimer: string;
  generatedAt: string;
}

export interface MedicationInfo {
  name: string;
  rxcui?: string;
  brandNames: string[];
  genericName: string;
  drugClass: string;
  indications: string[];
  warnings: string[];
  interactions: string[];
  doseForms: string[];
  source: string;
}

export interface OutcomeSubmission {
  id: string; condition: string; careScenario: string; ageBucket: string;
  sexCategory?: string; comorbidities: string[]; interventionCategory: string;
  followUpDuration: string; responseCategory: string; adverseEvents: string[];
  outcomeScore: number; institutionType: string; submitterRole: UserRole;
  noPHIAttestation: boolean; adherenceConcerns: string[]; notes: string; submittedAt: string;
}

export interface WatchlistItem {
  id: string; topic: string; addedAt: string; lastChecked: string; newEvidence: number;
  alerts: { id: string; type: string; message: string; timestamp: string; read: boolean }[];
}

export interface SavedQuery { id: string; scenario: string; timestamp: string; starred: boolean; resultCount?: number; }
export interface AuditLogEntry { id: string; userId: string; action: string; details: string; timestamp: string; }

export interface SourceStatus { id: SourceId; name: string; status: 'live' | 'demo' | 'unavailable'; latency?: number; lastChecked: string; }

// Compatibility aliases
export type EvidenceRecord = NormalizedRecord;

export interface FHIRPatient { resourceType: 'Patient'; id: string; name: string; birthDate: string; gender: string; }
export interface FHIRCondition { resourceType: "Condition"; id: string; code: { text: string; coding?: any[] }; clinicalStatus: string; onsetDateTime?: string; }
export interface FHIRMedicationRequest { resourceType: 'MedicationRequest'; id: string; medicationCodeableConcept: { text: string }; status: string; }
export interface FHIRBundle {
  patient?: FHIRPatient;
  conditions: FHIRCondition[];
  medications: FHIRMedicationRequest[];
  allergies: { resourceType: string; substance: string }[];
  observations: { resourceType: string; code: string; value: string; unit?: string }[];
  procedures: { resourceType: string; code: string; performedDateTime?: string }[];
}
