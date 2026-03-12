import { useState } from 'react';
import { parseScenario } from '../services/scenarioParser';
import { buildQueryPlan } from '../services/queryPlannerService';
import { executeQueryPlan, computeConsensus, assembleClinicalBrief, getStrengthColor, checkDrugInteractions, requestAISynthesis, type DrugInteraction } from '../services/clinicalServices';
import { runAllClinicalChecks, buildRetrievalFilter, applyRetrievalFilter, type ClinicalAlert } from '../services/clinicalRulesEngine';
import { saveSearchResult } from '../services/supabaseService';
import { useAuth } from '../hooks/useAuth';
import { QUERIES } from '../data/demoData';
import type { ParsedScenario, NormalizedRecord, ClinicalBrief, ConsensusResult, QueryPlan } from '../types';

const SRC: Record<string, string> = {
  'pubmed':'PubMed','pubmed-live':'PubMed (Live)','clinicaltrials':'ClinicalTrials.gov','clinicaltrials-live':'ClinicalTrials.gov (Live)',
  'openalex':'OpenAlex','openalex-live':'OpenAlex (Live)','crossref':'Crossref','dailymed':'DailyMed','rxnorm':'RxNorm',
  'umls':'UMLS','snomed':'SNOMED CT','loinc':'LOINC','guideline-graph':'Guideline Graph','demo-fixtures':'Demo Data',
};

export default function QueryWorkspacePage() {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [parsed, setParsed] = useState<ParsedScenario | null>(null);
  const [plan, setPlan] = useState<QueryPlan | null>(null);
  const [evidence, setEvidence] = useState<NormalizedRecord[]>([]);
  const [brief, setBrief] = useState<ClinicalBrief | null>(null);
  const [consensus, setConsensus] = useState<ConsensusResult | null>(null);
  const [sourcesUsed, setSourcesUsed] = useState<string[]>([]);
  const [clinicalAlerts, setClinicalAlerts] = useState<ClinicalAlert[]>([]);
  const [drugInteractions, setDrugInteractions] = useState<DrugInteraction[]>([]);
  const [aiSynthesis, setAiSynthesis] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [expandedEv, setExpandedEv] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true); setAiSynthesis(null); setDrugInteractions([]);

    // Step 1: Parse
    setLoadingStep('Parsing clinical scenario...');
    const p = parseScenario(text);
    setParsed(p);

    // Step 2: Plan
    setLoadingStep('Building query plan...');
    const qp = buildQueryPlan(text, p);
    setPlan(qp);

    // Step 3: Clinical rules
    setLoadingStep('Running clinical rules engine...');
    const alerts = runAllClinicalChecks(p);
    setClinicalAlerts(alerts);

    // Step 4: Search evidence (live + demo in parallel)
    setLoadingStep('Searching PubMed, ClinicalTrials.gov, OpenAlex...');
    const { demoResults, liveResults, sourcesUsed: su } = await executeQueryPlan(qp, text);
    const allEvidence = [...demoResults, ...liveResults];
    const filter = buildRetrievalFilter(p);
    const filtered = applyRetrievalFilter(allEvidence, filter);
    const seen = new Set<string>();
    const deduped = filtered.filter(e => { const k = e.title.toLowerCase().substring(0, 50); if (seen.has(k)) return false; seen.add(k); return true; });

    setEvidence(deduped);
    setSourcesUsed(su);
    const cons = computeConsensus(deduped);
    setConsensus(cons);

    // Step 5: Drug interactions (if medications found)
    let ixResults: DrugInteraction[] = [];
    if (p.medications.length >= 2) {
      setLoadingStep('Checking drug interactions via RxNorm...');
      const ixData = await checkDrugInteractions(p.medications);
      ixResults = ixData.interactions;
      setDrugInteractions(ixResults);
    }

    // Step 6: Build brief
    setLoadingStep('Assembling clinical evidence brief...');
    setBrief(assembleClinicalBrief(p, deduped, qp, ixResults));
    setLoading(false);

    // Step 7: AI synthesis (async, don't block UI)
    setLoadingStep('Requesting AI synthesis...');
    const { PATHWAYS: allPw } = await import('../data/pathways');
    const pathwayNames = p.pathwayCandidates.map(id => {
      const pw = allPw.find((p: any) => p.id === id);
      return pw ? `${pw.condition}: ${pw.nodes.map((n: any) => n.title).join(', ')}` : id;
    }).join('\n');

    requestAISynthesis({
      scenario: text,
      parsedContext: p,
      pathwayMatches: pathwayNames,
      evidenceSummary: `${deduped.length} studies. ${cons.conclusion}`,
      clinicalAlerts: alerts.map(a => `[${a.severity}] ${a.title}: ${a.detail}`).join('\n'),
      consensus: JSON.stringify(cons),
    }).then(result => {
      setAiSynthesis(result.synthesis);
      setAiMode(result.mode);
    }).catch(() => {});

    // Save to Supabase
    if (user?.email) {
      saveSearchResult({
        user_email: user.email, query_text: text, query_intent: qp.intent,
        sources_used: su, result_count: deduped.length, evidence_ids: deduped.slice(0, 20).map(e => e.id),
        consensus_score: cons.weightedConfidence, contradiction_index: cons.contradictionIndex,
        brief_summary: deduped.length > 0 ? cons.conclusion : 'No evidence found',
      }).catch(() => {});
    }
  };

  const liveCount = sourcesUsed.filter(s => s.includes('live')).length;

  return (
    <div>
      <div className="page-header"><div><div className="page-title">Query Workspace</div><div className="page-subtitle">Multi-database clinical evidence analysis</div></div></div>

      {/* Scenario Input */}
      <div className="card" style={{marginBottom:16}}>
        <div className="card-accent-top"/>
        <textarea className="form-input-full" style={{padding:'12px 14px',fontSize:'.95rem',minHeight:70,marginBottom:10}} placeholder="Enter a clinical scenario or research question..." value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();handleAnalyze();}}} />
        <div style={{display:'flex',gap:8,alignItems:'center',flexWrap:'wrap'}}>
          <button className="btn btn-primary" onClick={handleAnalyze} disabled={loading} style={{padding:'10px 22px'}}>{loading?'Analyzing...':'Analyze'}</button>
          <span style={{fontSize:'.7rem',color:'var(--text-3)'}}>Try:</span>
          {QUERIES.slice(0,2).map(q=><button key={q.id} className="btn btn-ghost btn-sm" style={{fontSize:'.68rem'}} onClick={()=>setText(q.scenario)}>{q.scenario.substring(0,40)}…</button>)}
        </div>
      </div>

      {loading && <div className="loading-state"><div className="loading-spinner"/><div style={{fontSize:'.88rem',color:'var(--text-1)'}}>{loadingStep}</div><div style={{fontSize:'.72rem',color:'var(--text-3)',marginTop:4}}>Querying multiple databases simultaneously...</div></div>}

      {!loading && plan && parsed && brief && (
        <>
          {/* Query Plan */}
          <div className="card" style={{marginBottom:14}}>
            <div className="card-header">
              <div className="card-title">Query Plan</div>
              <div style={{display:'flex',gap:6}}>
                <span className="badge badge-source">{plan.intent.replace(/-/g,' ')}</span>
                {liveCount > 0 && <span className="badge badge-positive">{liveCount} live sources</span>}
              </div>
            </div>
            <div style={{fontSize:'.82rem',color:'var(--text-2)',marginBottom:8}}>{plan.rationale}</div>
            <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
              {sourcesUsed.map(s=><span key={s} className={`chip ${s.includes('live')?'chip-accent':''}`}>{SRC[s]||s}</span>)}
            </div>
          </div>

          <div className="three-col">
            {/* LEFT */}
            <div>
              <div className="card card-sm" style={{marginBottom:12}}>
                <div className="card-title" style={{marginBottom:8}}>Parsed Context</div>
                <div style={{fontSize:'.7rem',color:'var(--text-3)',marginBottom:6}}>Confidence: <span style={{color:'var(--accent)',fontFamily:'var(--mono)',fontWeight:600}}>{Math.round(parsed.confidence*100)}%</span></div>
                <div style={{display:'flex',flexWrap:'wrap',gap:3}}>
                  {parsed.age && <span className="chip chip-accent">Age: {parsed.age}</span>}
                  {parsed.sex && <span className="chip chip-accent">{parsed.sex}</span>}
                  {parsed.primaryCondition && <span className="chip chip-accent">{parsed.primaryCondition}</span>}
                  {parsed.carePhase && <span className="chip">Phase: {parsed.carePhase}</span>}
                  {parsed.careSetting && <span className="chip">Setting: {parsed.careSetting}</span>}
                  {parsed.recentIntervention && <span className="chip">Post-{parsed.recentIntervention}</span>}
                  {parsed.comorbidities.map(c=><span key={c} className="chip">{c}</span>)}
                  {parsed.riskFactors.map(r=><span key={r} className="chip" style={{borderColor:'rgba(245,183,49,.2)',color:'var(--warning)'}}>{r}</span>)}
                  {parsed.observations.map(f=><span key={f} className="chip chip-accent">{f}</span>)}
                  {parsed.medications.map(m=><span key={m} className="chip" style={{borderColor:'rgba(59,158,255,.2)',color:'var(--accent-2)'}}>{m}</span>)}
                </div>
              </div>

              {/* Missing Info */}
              {parsed.missingData.length>0 && (
                <div className="card card-sm" style={{borderColor:'rgba(245,183,49,.2)',marginBottom:12}}>
                  <div className="card-title" style={{color:'var(--warning)',marginBottom:6}}>⚠ Missing Information</div>
                  {parsed.missingData.map(m=><div key={m} style={{fontSize:'.78rem',color:'var(--text-1)',padding:'3px 0',borderBottom:'1px solid var(--border-1)'}}>{m}</div>)}
                </div>
              )}

              {/* Clinical Alerts */}
              {clinicalAlerts.length > 0 && (
                <div className="card card-sm" style={{borderColor:clinicalAlerts[0]?.severity==='critical'?'rgba(255,77,106,.3)':'rgba(245,183,49,.2)',marginBottom:12}}>
                  <div className="card-title" style={{color:'var(--negative)',marginBottom:8}}>Clinical Alerts ({clinicalAlerts.length})</div>
                  {clinicalAlerts.map((alert, i) => (
                    <div key={i} style={{padding:'5px 0',borderBottom:'1px solid var(--border-1)'}}>
                      <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:2}}>
                        <span className="badge" style={{background:alert.severity==='critical'?'rgba(255,77,106,.15)':alert.severity==='important'?'rgba(245,183,49,.15)':'rgba(59,158,255,.15)',color:alert.severity==='critical'?'var(--negative)':alert.severity==='important'?'var(--warning)':'var(--accent-2)',fontSize:'.55rem'}}>{alert.severity}</span>
                        <span className="badge" style={{background:'rgba(255,255,255,.05)',color:'var(--text-2)',fontSize:'.55rem'}}>{alert.type.replace(/-/g,' ')}</span>
                      </div>
                      <div style={{fontSize:'.76rem',fontWeight:600,color:'var(--text-0)'}}>{alert.title}</div>
                      <div style={{fontSize:'.7rem',color:'var(--text-2)',lineHeight:1.3}}>{alert.detail}</div>
                      <div style={{fontSize:'.6rem',color:'var(--text-3)',marginTop:1}}>{alert.source}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Drug Interactions */}
              {drugInteractions.length > 0 && (
                <div className="card card-sm" style={{borderColor:'rgba(255,77,106,.3)'}}>
                  <div className="card-title" style={{color:'var(--negative)',marginBottom:8}}>Drug Interactions ({drugInteractions.length})</div>
                  {drugInteractions.map((ix, i) => (
                    <div key={i} style={{padding:'5px 0',borderBottom:'1px solid var(--border-1)'}}>
                      <div style={{fontSize:'.76rem',fontWeight:600,color:'var(--text-0)'}}>{ix.drug1} + {ix.drug2}</div>
                      <div style={{fontSize:'.7rem',color:'var(--text-2)',lineHeight:1.3}}>{ix.description.substring(0, 200)}</div>
                      <div style={{display:'flex',gap:4,marginTop:2}}>
                        <span className="badge badge-negative" style={{fontSize:'.55rem'}}>{ix.severity}</span>
                        <span style={{fontSize:'.6rem',color:'var(--text-3)'}}>{ix.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* MIDDLE — Brief + AI Synthesis */}
            <div>
              <div className="card" style={{marginBottom:14}}>
                <div className="card-accent-top"/>
                <div className="card-title" style={{marginBottom:10}}>Clinical Evidence Brief</div>
                <div style={{fontSize:'.7rem',color:'var(--warning)',marginBottom:10,padding:'5px 8px',background:'rgba(245,183,49,0.05)',borderRadius:'var(--radius-sm)'}}>AI-generated synthesis; verify with current guidelines, institutional policy, and treating clinicians.</div>
                <div style={{fontSize:'.86rem',color:'var(--text-0)',lineHeight:1.6,marginBottom:14,padding:'8px 10px',background:'var(--bg-2)',borderRadius:'var(--radius-sm)'}}>{brief.scenarioSummary}</div>
                {brief.careConsiderations.map(section=>(<div key={section.domain} className="brief-section"><div className="brief-section-title">{section.domain}</div>{section.items.map((item,i)=>(<div key={i} className="brief-item"><span className="badge" style={{marginRight:5,background:`${getStrengthColor(item.strength)}20`,color:getStrengthColor(item.strength),fontSize:'.6rem'}}>{item.strength}</span>{item.text}{item.source&&<span style={{fontSize:'.68rem',color:'var(--text-3)',marginLeft:3}}>({item.source})</span>}</div>))}</div>))}

                {/* Medication interaction notes */}
                {brief.medicationNotes.length > 0 && (
                  <div className="brief-section" style={{borderLeftColor:'var(--negative)'}}>
                    <div className="brief-section-title" style={{color:'var(--negative)'}}>Medication Interaction Alerts</div>
                    {brief.medicationNotes.map((n,i) => <div key={i} className="brief-item" style={{fontSize:'.78rem'}}>{n}</div>)}
                  </div>
                )}

                {brief.redFlags.length>0 && (<div className="brief-section" style={{borderLeftColor:'var(--negative)'}}><div className="brief-section-title" style={{color:'var(--negative)'}}>Red Flags / Escalation</div>{brief.redFlags.map((r,i)=><div key={i} className="brief-item" style={{color:'var(--text-0)'}}>⚠ {r}</div>)}</div>)}
                <div style={{marginTop:12,fontSize:'.72rem',color:'var(--text-3)',lineHeight:1.4}}>
                  <strong>Sources:</strong> {brief.sourcesAndProvenance.slice(0,4).map(s=>s.name).join(' • ')}<br/>
                  <strong>Generated:</strong> {new Date(brief.generatedAt).toLocaleString()}
                </div>
              </div>

              {/* AI Synthesis */}
              {aiSynthesis && (
                <div className="card">
                  <div className="card-accent-top" style={{background:'linear-gradient(90deg, #A855F7, var(--accent))'}}/>
                  <div className="card-header">
                    <div className="card-title" style={{color:'#A855F7'}}>AI Clinical Synthesis</div>
                    <span className="badge" style={{background:'rgba(168,85,247,.12)',color:'#A855F7',fontSize:'.6rem'}}>{aiMode === 'live' ? 'Claude' : 'Demo'}</span>
                  </div>
                  <div style={{fontSize:'.84rem',color:'var(--text-1)',lineHeight:1.7,whiteSpace:'pre-wrap'}}>{aiSynthesis}</div>
                  <div style={{marginTop:10,fontSize:'.68rem',color:'var(--text-3)',padding:'6px 8px',background:'rgba(168,85,247,0.04)',borderRadius:'var(--radius-sm)'}}>
                    AI-generated analysis. These findings should be interpreted in context of clinician judgment, institutional protocols, and individual patient factors.
                  </div>
                </div>
              )}
              {!aiSynthesis && aiMode === 'demo' && (
                <div className="card card-sm" style={{opacity:.6}}>
                  <div style={{fontSize:'.78rem',color:'var(--text-3)',textAlign:'center',padding:12}}>
                    AI synthesis unavailable — add ANTHROPIC_API_KEY in Netlify environment variables to enable Claude-powered narrative analysis.
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT — Consensus + Evidence */}
            <div>
              {consensus && (<div className="card card-sm" style={{marginBottom:12}}>
                <div className="card-title" style={{marginBottom:8}}>Consensus</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginBottom:8}}>
                  <div><div className="stat-value" style={{fontSize:'1.2rem'}}>{consensus.totalStudies}</div><div className="stat-label">Studies</div></div>
                  <div><div className="stat-value" style={{fontSize:'1.2rem',color:'var(--accent)'}}>{consensus.weightedConfidence.toFixed(2)}</div><div className="stat-label">Confidence</div></div>
                </div>
                <div style={{display:'flex',height:5,borderRadius:3,overflow:'hidden',marginBottom:6}}>
                  <div style={{width:`${consensus.positivePercent}%`,background:'var(--positive)'}}/>
                  <div style={{width:`${consensus.neutralPercent}%`,background:'var(--neutral)'}}/>
                  <div style={{width:`${consensus.negativePercent}%`,background:'var(--negative)'}}/>
                </div>
                <div style={{display:'flex',gap:8,fontSize:'.68rem',color:'var(--text-2)'}}>
                  <span>+{consensus.positiveCount}</span><span>~{consensus.neutralCount}</span><span>-{consensus.negativeCount}</span>
                  <span style={{marginLeft:'auto',color:consensus.contradictionIndex==='high'?'var(--negative)':consensus.contradictionIndex==='medium'?'var(--warning)':'var(--positive)'}}>Contradictions: {consensus.contradictionIndex}</span>
                </div>
              </div>)}

              {consensus?.researchGaps && consensus.researchGaps.length>0 && (
                <div className="card card-sm" style={{marginBottom:12,borderColor:'rgba(245,183,49,.2)'}}>
                  <div className="card-title" style={{color:'var(--warning)',marginBottom:6}}>Research Gaps</div>
                  {consensus.researchGaps.map((g,i)=><div key={i} style={{fontSize:'.76rem',color:'var(--text-1)',padding:'3px 0'}}>{g}</div>)}
                </div>
              )}

              <div className="card card-sm">
                <div className="card-title" style={{marginBottom:8}}>Evidence ({evidence.length})</div>
                {evidence.slice(0,15).map(ev=>(<div key={ev.id} style={{padding:'6px 0',borderBottom:'1px solid var(--border-1)',cursor:'pointer'}} onClick={()=>setExpandedEv(expandedEv===ev.id?null:ev.id)}>
                  <div style={{display:'flex',alignItems:'flex-start',gap:5}}>
                    <div style={{width:3,minHeight:24,borderRadius:2,background:getStrengthColor(ev.evidenceStrength || 'moderate'),flexShrink:0,marginTop:2}}/>
                    <div style={{flex:1}}>
                      <div style={{fontSize:'.76rem',fontWeight:500,color:'var(--text-0)',lineHeight:1.3}}>{ev.title.substring(0,80)}{ev.title.length>80?'…':''}</div>
                      <div style={{display:'flex',gap:3,marginTop:3,flexWrap:'wrap'}}>
                        <span className={`badge ${(ev as any).sourceType?.includes?.('live') || ev.source?.includes('Live') ? 'badge-positive' : 'badge-source'}`} style={{fontSize:'.52rem'}}>{ev.source}</span>
                        <span className={`badge ${ev.resultDirection==='positive'?'badge-positive':ev.resultDirection==='negative'?'badge-negative':'badge-neutral'}`} style={{fontSize:'.52rem'}}>{ev.resultDirection}</span>
                        <span style={{fontSize:'.58rem',color:'var(--text-3)'}}>{ev.journal} {ev.year}</span>
                        {ev.citationCount > 0 && <span style={{fontSize:'.58rem',color:'var(--text-3)'}}>Cited: {ev.citationCount}</span>}
                      </div>
                      {expandedEv===ev.id && ev.abstract && <div style={{marginTop:6,fontSize:'.74rem',color:'var(--text-2)',lineHeight:1.4,padding:'6px',background:'var(--bg-2)',borderRadius:'var(--radius-sm)'}}>{ev.abstract.substring(0,400)}{ev.abstract.length>400?'…':''}</div>}
                    </div>
                  </div>
                </div>))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
