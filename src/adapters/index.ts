import type { NormalizedRecord, MedicationInfo, TermCode } from '../types';

// ── ADAPTER INTERFACE ────────────────────────────────────────────────────────
export interface EvidenceAdapter {
  id: string;
  name: string;
  search(query: string, maxResults?: number): Promise<NormalizedRecord[]>;
  isLive(): boolean;
}

export interface MedicationAdapter {
  id: string;
  lookup(drugName: string): Promise<MedicationInfo | null>;
  isLive(): boolean;
}

export interface TerminologyAdapter {
  id: string;
  normalize(text: string, system: string): Promise<TermCode[]>;
  isLive(): boolean;
}

// ── PUBMED ───────────────────────────────────────────────────────────────────
export const pubmedAdapter: EvidenceAdapter = {
  id: 'pubmed', name: 'PubMed / MEDLINE',
  isLive: () => false, // Set true if NCBI_API_KEY available via server
  async search(query, maxResults = 10): Promise<NormalizedRecord[]> {
    try {
      const enc = encodeURIComponent(query);
      const sr = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=${maxResults}&sort=relevance&term=${enc}`);
      const sd = await sr.json();
      const ids: string[] = sd.esearchresult?.idlist || [];
      if (!ids.length) return [];
      const dr = await fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(',')}`);
      const dd = await dr.json();
      return ids.map(id => {
        const a = dd.result?.[id];
        if (!a?.title) return null;
        return {
          id: `pm-${id}`, source: 'PubMed', sourceType: 'pubmed' as const, title: a.title,
          abstract: '', authors: a.authors?.slice(0, 5).map((x: any) => x.name) || [],
          journal: a.source || '', year: parseInt(a.pubdate?.split(' ')[0]) || 2020,
          doi: a.elocationid || undefined, url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
          publicationDate: a.pubdate || '', retrievalDate: new Date().toISOString(),
          studyType: 'cohort' as const, resultDirection: 'neutral' as const,
          evidenceStrength: 'moderate' as const, evidenceScore: 60, citationCount: 0,
          topicTags: [], specialty: undefined, sampleSize: undefined,
        } as NormalizedRecord;
      }).filter(Boolean) as NormalizedRecord[];
    } catch { return []; }
  },
};

// ── CLINICALTRIALS.GOV ───────────────────────────────────────────────────────
export const clinicalTrialsAdapter: EvidenceAdapter = {
  id: 'clinicaltrials', name: 'ClinicalTrials.gov',
  isLive: () => false,
  async search(query, maxResults = 10): Promise<NormalizedRecord[]> {
    try {
      const r = await fetch(`https://clinicaltrials.gov/api/v2/studies?query.term=${encodeURIComponent(query)}&pageSize=${maxResults}&format=json`);
      const d = await r.json();
      return (d.studies || []).map((s: any) => {
        const p = s.protocolSection;
        return {
          id: `ct-${p?.identificationModule?.nctId}`, source: 'ClinicalTrials.gov', sourceType: 'clinicaltrials' as const,
          title: p?.identificationModule?.briefTitle || '', abstract: p?.descriptionModule?.briefSummary || '',
          authors: [p?.identificationModule?.organization?.fullName || ''], journal: 'ClinicalTrials.gov',
          year: parseInt(p?.statusModule?.startDateStruct?.date?.substring(0, 4)) || 2024,
          url: `https://clinicaltrials.gov/study/${p?.identificationModule?.nctId}`,
          publicationDate: p?.statusModule?.startDateStruct?.date || '', retrievalDate: new Date().toISOString(),
          studyType: 'rct' as const, resultDirection: 'neutral' as const,
          evidenceStrength: 'moderate' as const, evidenceScore: 50, citationCount: 0, topicTags: [],
        } as NormalizedRecord;
      });
    } catch { return []; }
  },
};

// ── OPENALEX ─────────────────────────────────────────────────────────────────
export const openAlexAdapter: EvidenceAdapter = {
  id: 'openalex', name: 'OpenAlex',
  isLive: () => false,
  async search(query, maxResults = 10): Promise<NormalizedRecord[]> {
    try {
      const r = await fetch(`https://api.openalex.org/works?search=${encodeURIComponent(query)}&per_page=${maxResults}`);
      const d = await r.json();
      return (d.results || []).map((w: any) => ({
        id: `oa-${w.id?.split('/').pop()}`, source: 'OpenAlex', sourceType: 'openalex' as const,
        title: w.title || '', abstract: '', authors: (w.authorships || []).slice(0, 3).map((a: any) => a.author?.display_name || ''),
        journal: w.primary_location?.source?.display_name || '', year: w.publication_year || 2024,
        doi: w.doi, url: w.doi || w.id, publicationDate: w.publication_date || '', retrievalDate: new Date().toISOString(),
        studyType: 'cohort' as const, resultDirection: 'neutral' as const,
        evidenceStrength: 'moderate' as const, evidenceScore: 55, citationCount: w.cited_by_count || 0, topicTags: [],
      } as NormalizedRecord));
    } catch { return []; }
  },
};

// ── CROSSREF ─────────────────────────────────────────────────────────────────
export const crossrefAdapter: EvidenceAdapter = {
  id: 'crossref', name: 'Crossref',
  isLive: () => false,
  async search(query, maxResults = 10): Promise<NormalizedRecord[]> {
    try {
      const r = await fetch(`https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=${maxResults}&select=DOI,title,author,container-title,published-print,is-referenced-by-count`);
      const d = await r.json();
      return (d.message?.items || []).map((w: any) => ({
        id: `cr-${w.DOI?.replace(/[^a-z0-9]/gi, '-')}`, source: 'Crossref', sourceType: 'crossref' as const,
        title: w.title?.[0] || '', abstract: '', authors: (w.author || []).slice(0, 3).map((a: any) => `${a.given || ''} ${a.family || ''}`),
        journal: w['container-title']?.[0] || '', year: w['published-print']?.['date-parts']?.[0]?.[0] || 2024,
        doi: w.DOI, url: `https://doi.org/${w.DOI}`, publicationDate: '', retrievalDate: new Date().toISOString(),
        studyType: 'cohort' as const, resultDirection: 'neutral' as const,
        evidenceStrength: 'moderate' as const, evidenceScore: 50, citationCount: w['is-referenced-by-count'] || 0, topicTags: [],
      } as NormalizedRecord));
    } catch { return []; }
  },
};

// ── SEMANTIC SCHOLAR ─────────────────────────────────────────────────────────
export const semanticScholarAdapter: EvidenceAdapter = {
  id: 'semantic-scholar', name: 'Semantic Scholar',
  isLive: () => false,
  async search(query, maxResults = 10): Promise<NormalizedRecord[]> {
    try {
      const r = await fetch(`https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=${maxResults}&fields=title,authors,year,citationCount,journal`);
      const d = await r.json();
      return (d.data || []).map((p: any) => ({
        id: `ss-${p.paperId}`, source: 'Semantic Scholar', sourceType: 'semantic-scholar' as const,
        title: p.title || '', abstract: '', authors: (p.authors || []).slice(0, 3).map((a: any) => a.name),
        journal: p.journal?.name || '', year: p.year || 2024, publicationDate: '', retrievalDate: new Date().toISOString(),
        studyType: 'cohort' as const, resultDirection: 'neutral' as const,
        evidenceStrength: 'moderate' as const, evidenceScore: 55, citationCount: p.citationCount || 0, topicTags: [],
      } as NormalizedRecord));
    } catch { return []; }
  },
};

// ── EUROPE PMC ───────────────────────────────────────────────────────────────
export const europePmcAdapter: EvidenceAdapter = {
  id: 'europe-pmc', name: 'Europe PMC',
  isLive: () => false,
  async search(query, maxResults = 10): Promise<NormalizedRecord[]> {
    try {
      const r = await fetch(`https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=${encodeURIComponent(query)}&resultType=core&pageSize=${maxResults}&format=json`);
      const d = await r.json();
      return (d.resultList?.result || []).map((a: any) => ({
        id: `epmc-${a.pmid || a.id}`, source: 'Europe PMC', sourceType: 'europe-pmc' as const,
        title: a.title || '', abstract: a.abstractText || '', authors: [a.authorString || ''],
        journal: a.journalTitle || '', year: parseInt(a.pubYear) || 2024, doi: a.doi,
        url: a.pmid ? `https://europepmc.org/article/med/${a.pmid}` : '', publicationDate: a.pubYear || '',
        retrievalDate: new Date().toISOString(), studyType: 'cohort' as const, resultDirection: 'neutral' as const,
        evidenceStrength: 'moderate' as const, evidenceScore: 55, citationCount: a.citedByCount || 0, topicTags: [],
      } as NormalizedRecord));
    } catch { return []; }
  },
};

// ── DAILYMED ─────────────────────────────────────────────────────────────────
export const dailyMedAdapter: MedicationAdapter = {
  id: 'dailymed', isLive: () => false,
  async lookup(drugName): Promise<MedicationInfo | null> {
    try {
      const r = await fetch(`https://dailymed.nlm.nih.gov/dailymed/services/v2/spls.json?drug_name=${encodeURIComponent(drugName)}&pagesize=1`);
      const d = await r.json();
      const spl = d.data?.[0];
      if (!spl) return null;
      return { name: drugName, genericName: spl.title || drugName, brandNames: [spl.title || ''], drugClass: '', indications: [], warnings: [], interactions: [], doseForms: [], source: 'DailyMed' };
    } catch { return null; }
  },
};

// ── RXNORM ───────────────────────────────────────────────────────────────────
export const rxnormAdapter: MedicationAdapter = {
  id: 'rxnorm', isLive: () => false,
  async lookup(drugName): Promise<MedicationInfo | null> {
    try {
      const r = await fetch(`https://rxnav.nlm.nih.gov/REST/drugs.json?name=${encodeURIComponent(drugName)}`);
      const d = await r.json();
      const group = d.drugGroup?.conceptGroup?.find((g: any) => g.conceptProperties?.length > 0);
      const concept = group?.conceptProperties?.[0];
      if (!concept) return null;
      return { name: concept.name || drugName, rxcui: concept.rxcui, genericName: concept.name || drugName, brandNames: [], drugClass: concept.tty || '', indications: [], warnings: [], interactions: [], doseForms: [], source: 'RxNorm' };
    } catch { return null; }
  },
};

// ── TERMINOLOGY (UMLS, SNOMED, LOINC) ────────────────────────────────────────
// Demo-mode local mappings (same interface as live API adapters)
const DEMO_TERM_MAP: Record<string, TermCode[]> = {
  'myocardial infarction': [{ system: 'SNOMED-CT', code: '22298006', display: 'Myocardial infarction' }, { system: 'ICD-10-CM', code: 'I21.9', display: 'AMI, unspecified' }],
  'heart failure': [{ system: 'SNOMED-CT', code: '84114007', display: 'Heart failure' }],
  'stroke': [{ system: 'SNOMED-CT', code: '230690007', display: 'Stroke' }],
  'diabetes': [{ system: 'SNOMED-CT', code: '44054006', display: 'Diabetes mellitus type 2' }],
  'atrial fibrillation': [{ system: 'SNOMED-CT', code: '49436004', display: 'Atrial fibrillation' }],
  'hypertension': [{ system: 'SNOMED-CT', code: '38341003', display: 'Essential hypertension' }],
  'aspirin': [{ system: 'RxNorm', code: '1191', display: 'Aspirin' }],
  'ticagrelor': [{ system: 'RxNorm', code: '1116632', display: 'Ticagrelor' }],
  'atorvastatin': [{ system: 'RxNorm', code: '83367', display: 'Atorvastatin' }],
  'metoprolol': [{ system: 'RxNorm', code: '6918', display: 'Metoprolol' }],
  'ejection fraction': [{ system: 'LOINC', code: '10230-1', display: 'Left ventricular ejection fraction' }],
  'hemoglobin a1c': [{ system: 'LOINC', code: '4548-4', display: 'Hemoglobin A1c' }],
  'ldl': [{ system: 'LOINC', code: '2089-1', display: 'LDL cholesterol' }],
  'egfr': [{ system: 'LOINC', code: '62238-1', display: 'GFR/BSA.pred by CKD-EPI' }],
};

export const umlsAdapter: TerminologyAdapter = {
  id: 'umls', isLive: () => false,
  async normalize(text: string, _system: string = ""): Promise<TermCode[]> {
    const lower = text.toLowerCase();
    for (const [key, codes] of Object.entries(DEMO_TERM_MAP)) {
      if (lower.includes(key)) return codes;
    }
    return [];
  },
};

export const snomedAdapter: TerminologyAdapter = {
  id: 'snomed', isLive: () => false,
  async normalize(text: string, _system: string = ""): Promise<TermCode[]> {
    return (await umlsAdapter.normalize(text, '')).filter(c => c.system === 'SNOMED-CT');
  },
};

export const loincAdapter: TerminologyAdapter = {
  id: 'loinc', isLive: () => false,
  async normalize(text: string, _system: string = ""): Promise<TermCode[]> {
    return (await umlsAdapter.normalize(text, '')).filter(c => c.system === 'LOINC');
  },
};

// ── ALL ADAPTERS ─────────────────────────────────────────────────────────────
export const ALL_EVIDENCE_ADAPTERS: EvidenceAdapter[] = [
  pubmedAdapter, clinicalTrialsAdapter, openAlexAdapter, crossrefAdapter, semanticScholarAdapter, europePmcAdapter
];

export const ALL_MED_ADAPTERS: MedicationAdapter[] = [dailyMedAdapter, rxnormAdapter];
export const ALL_TERM_ADAPTERS: TerminologyAdapter[] = [umlsAdapter, snomedAdapter, loincAdapter];
