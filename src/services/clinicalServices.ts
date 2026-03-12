import type { NormalizedRecord, StrengthCategory, ConsensusResult, ParsedScenario, ClinicalBrief, BriefSection, QueryPlan } from '../types';
import { PATHWAYS } from '../data/pathways';
import { EVIDENCE } from '../data/evidence';

// ── EVIDENCE SCORING ─────────────────────────────────────────────────────────
const STUDY_W: Record<string, number> = {
  'meta-analysis':95,'systematic-review':90,'rct':85,'guideline':82,
  'cohort':65,'case-control':55,'case-series':35,'case-report':25,'editorial':15,'preprint':30,
};

export function computeScore(r: Partial<NormalizedRecord>): number {
  let s = STUDY_W[r.studyType || 'editorial'] || 20;
  if (r.sampleSize && r.sampleSize > 0) s += Math.min(15, Math.log10(r.sampleSize) * 3);
  if (r.citationCount && r.citationCount > 0) s += Math.min(10, Math.log10(r.citationCount) * 2);
  const age = new Date().getFullYear() - (r.year || 2020);
  if (age <= 2) s += 4; else if (age <= 5) s += 2;
  return Math.min(100, Math.max(0, Math.round(s)));
}

export function getStrengthCategory(score: number): StrengthCategory {
  if (score >= 85) return 'very-high'; if (score >= 70) return 'high';
  if (score >= 50) return 'moderate'; if (score >= 30) return 'low'; return 'very-low';
}

export function getStrengthColor(c: StrengthCategory): string {
  return {'very-high':'#00D4AA','high':'#3B9EFF','moderate':'#F5B731','low':'#FF7A45','very-low':'#FF4D6A'}[c];
}

// ── CONSENSUS ────────────────────────────────────────────────────────────────
export function computeConsensus(evidence: NormalizedRecord[]): ConsensusResult {
  if (!evidence.length) return { totalStudies:0,positiveCount:0,neutralCount:0,negativeCount:0,positivePercent:0,neutralPercent:0,negativePercent:0,weightedConfidence:0,contradictionIndex:'low',conclusion:'No evidence available.',researchGaps:[],contradictions:[] };
  const pos = evidence.filter(e=>e.resultDirection==='positive');
  const neu = evidence.filter(e=>e.resultDirection==='neutral');
  const neg = evidence.filter(e=>e.resultDirection==='negative');
  const total = evidence.length;
  const positivePercent = Math.round((pos.length/total)*100);
  const neutralPercent = Math.round((neu.length/total)*100);
  const negativePercent = 100-positivePercent-neutralPercent;
  const totalW = evidence.reduce((s,e)=>s+e.evidenceScore,0);
  const posW = pos.reduce((s,e)=>s+e.evidenceScore,0);
  const wc = totalW>0?Math.round((posW/totalW)*100)/100:0;
  const hsO = neg.some(e=>e.evidenceScore>=70); const hsS = pos.some(e=>e.evidenceScore>=70);
  let ci: 'low'|'medium'|'high' = 'low';
  if(hsO&&hsS) ci = neg.length>=pos.length*0.3?'high':'medium'; else if(neg.length>0) ci='medium';
  const dir = positivePercent>=60?'supports':positivePercent>=40?'is mixed regarding':'does not clearly support';
  const qual = wc>=0.8?'strong':wc>=0.6?'moderate':'limited';
  const conclusion = `Current evidence ${dir} the approach with ${qual} overall confidence (${total} studies, weighted confidence ${wc.toFixed(2)}).`;
  const gaps: string[] = [];
  if(evidence.filter(e=>e.studyType==='rct').length<3) gaps.push('Limited RCT evidence');
  if(Math.max(...evidence.map(e=>e.sampleSize||0))<500) gaps.push('No large-scale studies identified');
  if(!neg.length) gaps.push('No negative studies — possible publication bias');
  const contras: ConsensusResult['contradictions'] = [];
  if(pos.length&&neg.length) { const tp=[...pos].sort((a,b)=>b.evidenceScore-a.evidenceScore)[0]; const tn=[...neg].sort((a,b)=>b.evidenceScore-a.evidenceScore)[0]; contras.push({id:`c-auto`,supporting:tp.title,opposing:tn.title,cause:'Differing study designs or populations'}); }
  return {totalStudies:total,positiveCount:pos.length,neutralCount:neu.length,negativeCount:neg.length,positivePercent,neutralPercent,negativePercent,weightedConfidence:wc,contradictionIndex:ci,conclusion,researchGaps:gaps,contradictions:contras};
}

// ── DEMO EVIDENCE SEARCH ─────────────────────────────────────────────────────
export function searchDemoEvidence(query: string, topicTags?: string[]): NormalizedRecord[] {
  const q = query.toLowerCase();
  const kw = q.split(/\s+/).filter(w=>w.length>3);
  let results = (EVIDENCE as NormalizedRecord[]).filter(ev => {
    const text = `${ev.title} ${ev.abstract} ${ev.intervention||''} ${ev.outcomes||''} ${ev.topicTags.join(' ')}`.toLowerCase();
    return kw.some(k=>text.includes(k)) || (topicTags && topicTags.some(t=>ev.topicTags.includes(t)));
  });
  results.sort((a,b)=>b.evidenceScore-a.evidenceScore);
  return results;
}

// ── LIVE API CALLS VIA NETLIFY FUNCTIONS ─────────────────────────────────────
async function fetchFromFunction(endpoint: string, body: Record<string, unknown>): Promise<any> {
  try {
    const res = await fetch(`/api/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function searchPubMedLive(query: string): Promise<NormalizedRecord[]> {
  const data = await fetchFromFunction('pubmed', { query, maxResults: 12 });
  if (!data?.results?.length) return [];
  return data.results.map((r: any) => ({
    ...r,
    evidenceScore: computeScore(r),
    evidenceStrength: getStrengthCategory(computeScore(r)),
  }));
}

async function searchClinicalTrialsLive(query: string): Promise<NormalizedRecord[]> {
  const data = await fetchFromFunction('clinicaltrials', { query, maxResults: 8 });
  if (!data?.results?.length) return [];
  return data.results.map((r: any) => ({
    ...r,
    evidenceScore: computeScore(r),
    evidenceStrength: getStrengthCategory(computeScore(r)),
  }));
}

async function searchOpenAlexLive(query: string): Promise<NormalizedRecord[]> {
  const data = await fetchFromFunction('openalex', { query, maxResults: 8 });
  if (!data?.results?.length) return [];
  return data.results.map((r: any) => ({
    ...r,
    evidenceScore: computeScore(r),
    evidenceStrength: getStrengthCategory(computeScore(r)),
  }));
}

export interface DrugInteraction {
  drug1: string;
  drug2: string;
  severity: string;
  description: string;
  source: string;
}

export async function checkDrugInteractions(medications: string[]): Promise<{ interactions: DrugInteraction[]; drugInfo: Record<string, any> }> {
  const data = await fetchFromFunction('drug-interactions', { medications });
  return { interactions: data?.interactions || [], drugInfo: data?.drugInfo || {} };
}

export async function requestAISynthesis(params: {
  scenario: string;
  parsedContext: ParsedScenario;
  pathwayMatches: string;
  evidenceSummary: string;
  clinicalAlerts: string;
  consensus: string;
}): Promise<{ synthesis: string | null; mode: string }> {
  const data = await fetchFromFunction('synthesize', params);
  return { synthesis: data?.synthesis || null, mode: data?.mode || 'error' };
}

// ── EXECUTE QUERY PLAN WITH LIVE + DEMO ──────────────────────────────────────
export async function executeQueryPlan(plan: QueryPlan, query: string): Promise<{
  demoResults: NormalizedRecord[];
  liveResults: NormalizedRecord[];
  sourcesUsed: string[];
}> {
  const demoResults = searchDemoEvidence(query, plan.parsed.pathwayCandidates);
  const liveResults: NormalizedRecord[] = [];
  const sourcesUsed: string[] = ['demo-fixtures'];

  // Launch live searches in parallel via serverless functions
  const searches: Promise<void>[] = [];

  if (plan.sources.includes('pubmed')) {
    searches.push(searchPubMedLive(query).then(r => { if (r.length) { liveResults.push(...r); sourcesUsed.push('pubmed-live'); } }));
  }
  if (plan.sources.includes('clinicaltrials')) {
    searches.push(searchClinicalTrialsLive(query).then(r => { if (r.length) { liveResults.push(...r); sourcesUsed.push('clinicaltrials-live'); } }));
  }
  if (plan.sources.includes('openalex') || plan.sources.includes('crossref') || plan.sources.includes('semantic-scholar')) {
    searches.push(searchOpenAlexLive(query).then(r => { if (r.length) { liveResults.push(...r); sourcesUsed.push('openalex-live'); } }));
  }

  // Wait for all with timeout
  await Promise.race([
    Promise.allSettled(searches),
    new Promise(r => setTimeout(r, 6000)),
  ]);

  return { demoResults, liveResults, sourcesUsed };
}

// ── CLINICAL BRIEF ───────────────────────────────────────────────────────────
export function assembleClinicalBrief(parsed: ParsedScenario, evidence: NormalizedRecord[], plan: QueryPlan, drugInteractions?: DrugInteraction[]): ClinicalBrief {
  const matchedPathways = PATHWAYS.filter(p => parsed.pathwayCandidates.includes(p.id));
  const parts: string[] = [];
  if(parsed.age) parts.push(`${parsed.age}-year-old`);
  if(parsed.sex) parts.push(parsed.sex.toLowerCase());
  if(parsed.primaryCondition) parts.push(`with ${parsed.primaryCondition}`);
  if(parsed.carePhase) parts.push(`in ${parsed.carePhase} phase`);
  if(parsed.recentIntervention) parts.push(`post-${parsed.recentIntervention}`);
  if(parsed.comorbidities.length) parts.push(`comorbidities: ${parsed.comorbidities.join(', ')}`);
  if(parsed.riskFactors.length) parts.push(`risk factors: ${parsed.riskFactors.join(', ')}`);
  if(parsed.observations.length) parts.push(`key findings: ${parsed.observations.join(', ')}`);
  const scenarioSummary = parts.length>0 ? `Clinical scenario: ${parts.join('; ')}.` : 'Limited scenario information.';

  const careConsiderations: BriefSection[] = [];
  const domains: Record<string,BriefSection> = {};
  for(const pw of matchedPathways) for(const n of pw.nodes) {
    if(n.type==='redflag'||n.type==='escalation') continue;
    const d = n.tags[0]==='medication'?'Medication Considerations':n.type==='monitoring'?'Monitoring & Follow-Up':n.type==='followup'?'Follow-Up & Referrals':n.type==='education'?'Patient Education':n.type==='discharge'?'Discharge & Transition Planning':n.tags.includes('rehab')?'Rehabilitation':n.tags.includes('nutrition')?'Nutrition':'General Care Considerations';
    if(!domains[d]) domains[d]={domain:d,items:[]};
    domains[d].items.push({text:`${n.title}: ${n.description}`,strength:n.certainty,source:n.source});
  }
  careConsiderations.push(...Object.values(domains));

  const redFlags = matchedPathways.flatMap(pw=>pw.nodes.filter(n=>n.type==='redflag').map(n=>n.description));
  const cons = computeConsensus(evidence);
  const evidenceSummary = evidence.length>0 ? `${evidence.length} studies identified across ${plan.sources.length} sources. ${cons.conclusion}` : 'No specific evidence retrieved.';

  // Add drug interaction notes
  const medicationNotes: string[] = [];
  if (drugInteractions?.length) {
    for (const ix of drugInteractions) {
      medicationNotes.push(`⚠ ${ix.drug1} + ${ix.drug2}: ${ix.description} (Severity: ${ix.severity}) [${ix.source}]`);
    }
  }

  const sourcesAndProvenance: ClinicalBrief['sourcesAndProvenance'] = matchedPathways.flatMap(pw=>pw.guidelineSources.map(gs=>({name:gs.name,type:'Guideline',retrieved:new Date().toISOString(),version:pw.version})));
  evidence.slice(0,5).forEach(ev=>sourcesAndProvenance.push({name:`${ev.authors[0]||'Unknown'} et al. ${ev.journal} ${ev.year}`,type:ev.studyType as string,retrieved:ev.retrievalDate}));

  return {scenarioSummary,queryPlan:plan,careConsiderations,missingInformation:parsed.missingData,redFlags,evidenceSummary,medicationNotes,sourcesAndProvenance,disclaimer:'AI-generated synthesis; verify with current guidelines, institutional policy, and treating clinicians.',generatedAt:new Date().toISOString()};
}
