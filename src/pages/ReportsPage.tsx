import { useState } from 'react';
import { EVIDENCE } from '../data/evidence';
import { WATCHLISTS } from '../data/demoData';
import { exportMarkdown, exportCSV, downloadFile, copyToClipboard } from '../services/exportService';
import { assembleClinicalBrief } from '../services/clinicalServices';
import { buildQueryPlan } from '../services/queryPlannerService';
import { parseScenario } from '../services/scenarioParser';

export default function ReportsPage() {
  const [copied, setCopied] = useState(false);
  const handleExportMD = () => {
    const p = parseScenario('Post-MI discharge after PCI, diabetes, smoker, EF 35%');
    const ev = EVIDENCE.slice(0, 10);
    const qp = buildQueryPlan('Post-MI discharge', p);
    const brief = assembleClinicalBrief(p, ev as any, qp);
    downloadFile(exportMarkdown(brief, ev), 'clinical-evidence-brief.md', 'text/markdown');
  };
  const handleExportCSV = () => downloadFile(exportCSV(EVIDENCE), 'evidence-data.csv', 'text/csv');
  const handleCopy = () => {
    const citations = EVIDENCE.slice(0, 8).map((e, i) => `${i + 1}. ${e.authors.join(', ')}. ${e.title}. ${e.journal}. ${e.year}.${e.doi ? ` DOI: ${e.doi}` : ''}`).join('\n');
    copyToClipboard(citations); setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="page-header"><div><div className="page-title">Reports & Watchlists</div><div className="page-subtitle">Export briefs and manage topic monitoring</div></div></div>
      <div className="grid-2">
        <div className="card"><div className="card-accent-top"/><div className="card-title" style={{marginBottom:14}}>Export Options</div>
          {[
            { label:'Markdown Clinical Brief', desc:'Full evidence brief with guideline references', action:handleExportMD },
            { label:'CSV Evidence Export', desc:'Spreadsheet-compatible evidence data', action:handleExportCSV },
            { label:copied?'Copied!':'Copy Citations', desc:'Formatted citation block to clipboard', action:handleCopy },
          ].map(opt => (
            <button key={opt.label} className="btn btn-secondary" onClick={opt.action} style={{width:'100%',justifyContent:'flex-start',padding:'12px 16px',marginBottom:8}}>
              <div style={{textAlign:'left'}}><div style={{fontWeight:600,color:'var(--text-0)'}}>{opt.label}</div><div style={{fontSize:'.7rem',color:'var(--text-3)',fontWeight:400}}>{opt.desc}</div></div>
            </button>
          ))}
        </div>
        <div className="card"><div className="card-title" style={{marginBottom:14}}>Topic Watchlists</div>
          {WATCHLISTS.map(w => (
            <div key={w.id} style={{padding:'10px 0',borderBottom:'1px solid var(--border-1)',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div><div style={{fontSize:'.88rem',fontWeight:600,color:'var(--text-0)'}}>{w.topic}</div><div style={{fontSize:'.7rem',color:'var(--text-3)',marginTop:2}}>{w.newEvidence} new • Last checked {new Date(w.lastChecked).toLocaleDateString()}</div></div>
              {w.alerts.filter(a=>!a.read).length > 0 && <span className="badge badge-negative">{w.alerts.filter(a=>!a.read).length}</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
