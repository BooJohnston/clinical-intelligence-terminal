import { useState } from 'react';
import { MOCK_FHIR_BUNDLE } from '../data/demoData';
import type { FHIRBundle } from '../types';
import type { ParsedScenario } from '../types';
import { parseScenario } from '../services/scenarioParser';

function fhirToScenarioText(bundle: FHIRBundle): string {
  const parts: string[] = [];
  if (bundle.patient) {
    const age = bundle.patient.birthDate ? new Date().getFullYear() - new Date(bundle.patient.birthDate).getFullYear() : null;
    if (age) parts.push(`${age}-year-old`);
    if (bundle.patient.gender) parts.push(bundle.patient.gender);
  }
  bundle.conditions.filter(c => c.clinicalStatus === 'active' || c.clinicalStatus === 'resolved').forEach(c => parts.push(c.code.text));
  bundle.procedures.forEach(p => parts.push(`post ${p.code}`));
  bundle.observations.forEach(o => { if (o.code === 'Left ventricular ejection fraction') parts.push(`EF ${o.value}%`); if (o.code === 'Smoking status') parts.push(o.value.toLowerCase()); });
  bundle.medications.forEach(m => parts.push(m.medicationCodeableConcept.text));
  return parts.join(', ');
}

export default function FHIRContextPage() {
  const [loaded, setLoaded] = useState(false);
  const [parsed, setParsed] = useState<ParsedScenario | null>(null);
  const bundle = MOCK_FHIR_BUNDLE;

  const handleLoad = () => {
    setLoaded(true);
    const text = fhirToScenarioText(bundle);
    setParsed(parseScenario(text));
  };

  return (
    <div>
      <div className="page-header"><div><div className="page-title">FHIR Context</div><div className="page-subtitle">SMART on FHIR integration (mock mode)</div></div></div>
      <div className="card" style={{marginBottom:16}}>
        <div className="card-accent-top"/>
        <div className="card-title" style={{marginBottom:10}}>SMART on FHIR Configuration</div>
        <div style={{fontSize:'.82rem',color:'var(--text-2)',marginBottom:14,lineHeight:1.5}}>
          This page demonstrates the FHIR adapter architecture. In production, this would connect to an EHR via SMART on FHIR launch context and CDS Hooks. Currently operating in mock mode with sample FHIR resources.
        </div>
        <div className="grid-2" style={{marginBottom:14}}>
          <div className="form-group"><label className="form-label">FHIR Server</label><input className="form-input-full" value="https://fhir.demo.cit/r4" readOnly style={{opacity:.6}}/></div>
          <div className="form-group"><label className="form-label">Client ID</label><input className="form-input-full" value="cit-smart-app-demo" readOnly style={{opacity:.6}}/></div>
        </div>
        <button className="btn btn-primary" onClick={handleLoad}>Load Mock FHIR Context</button>
      </div>

      {loaded && (
        <div className="grid-2">
          <div>
            <div className="card" style={{marginBottom:14}}><div className="card-title" style={{marginBottom:10}}>Patient Context (De-Identified)</div>
              <div style={{fontSize:'.85rem',color:'var(--text-0)',marginBottom:6}}>{bundle.patient?.name}</div>
              <div style={{fontSize:'.78rem',color:'var(--text-2)'}}>DOB: {bundle.patient?.birthDate} • Gender: {bundle.patient?.gender}</div>
            </div>
            <div className="card" style={{marginBottom:14}}><div className="card-title" style={{marginBottom:10}}>Conditions ({bundle.conditions.length})</div>
              {bundle.conditions.map(c => <div key={c.id} style={{padding:'5px 0',borderBottom:'1px solid var(--border-1)',fontSize:'.82rem',color:'var(--text-1)'}}><span className={`badge ${c.clinicalStatus==='active'?'badge-negative':'badge-neutral'}`} style={{marginRight:6,fontSize:'.6rem'}}>{c.clinicalStatus}</span>{c.code.text}</div>)}
            </div>
            <div className="card" style={{marginBottom:14}}><div className="card-title" style={{marginBottom:10}}>Medications ({bundle.medications.length})</div>
              {bundle.medications.map(m => <div key={m.id} style={{padding:'4px 0',fontSize:'.82rem',color:'var(--text-1)',borderBottom:'1px solid var(--border-1)'}}>{m.medicationCodeableConcept.text}</div>)}
            </div>
            <div className="card"><div className="card-title" style={{marginBottom:10}}>Observations</div>
              {bundle.observations.map((o,i) => <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'4px 0',borderBottom:'1px solid var(--border-1)',fontSize:'.82rem'}}><span style={{color:'var(--text-2)'}}>{o.code}</span><span style={{fontFamily:'var(--mono)',color:'var(--text-0)'}}>{o.value}{o.unit ? ` ${o.unit}` : ''}</span></div>)}
            </div>
          </div>
          <div>
            <div className="card"><div className="card-accent-top"/><div className="card-title" style={{marginBottom:10}}>Mapped Clinical Context</div>
              {parsed && (
                <div>
                  <div style={{fontSize:'.72rem',color:'var(--text-3)',marginBottom:8}}>Parser confidence: <span style={{color:'var(--accent)',fontFamily:'var(--mono)'}}>{Math.round(parsed.confidence*100)}%</span></div>
                  <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
                    {parsed.age && <span className="chip chip-accent">Age: {parsed.age}</span>}
                    {parsed.sex && <span className="chip chip-accent">{parsed.sex}</span>}
                    {parsed.primaryCondition && <span className="chip chip-accent">{parsed.primaryCondition}</span>}
                    {parsed.comorbidities.map(c=><span key={c} className="chip">{c}</span>)}
                    {parsed.riskFactors.map(r=><span key={r} className="chip" style={{borderColor:'rgba(245,183,49,.2)',color:'var(--warning)'}}>{r}</span>)}
                    {parsed.functionalIndicators.map(f=><span key={f} className="chip chip-accent">{f}</span>)}
                    {parsed.medications.map(m=><span key={m} className="chip">{m}</span>)}
                  </div>
                  {parsed.missingData.length > 0 && (
                    <div style={{marginTop:12}}><div style={{fontSize:'.72rem',fontWeight:600,color:'var(--warning)',marginBottom:6}}>Missing Data Points</div>
                      {parsed.missingData.map(m=><div key={m} style={{fontSize:'.78rem',color:'var(--text-2)',padding:'3px 0'}}>{m}</div>)}
                    </div>
                  )}
                  {parsed.pathwayCandidates.length > 0 && (
                    <div style={{marginTop:12}}><div style={{fontSize:'.72rem',fontWeight:600,color:'var(--accent)',marginBottom:6}}>Matched Pathways</div>
                      {parsed.pathwayCandidates.map(p=><span key={p} className="chip chip-accent">{p}</span>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
