import type { ClinicalBrief, NormalizedRecord } from '../types';

export function exportMarkdown(brief: ClinicalBrief, evidence: NormalizedRecord[]): string {
  let md = `# Clinical Evidence Brief\n\n`;
  md += `**Generated:** ${new Date(brief.generatedAt).toLocaleString()}\n`;
  md += `**Platform:** Clinical Intelligence Terminal\n\n`;
  md += `> ⚠ ${brief.disclaimer}\n\n`;
  md += `## Scenario\n\n${brief.scenarioSummary}\n\n`;
  md += `## Guideline-Supported Care Considerations\n\n`;
  for (const s of brief.careConsiderations) {
    md += `### ${s.domain}\n\n`;
    for (const item of s.items) md += `- **${item.strength.toUpperCase()}**: ${item.text}${item.source ? ` *(${item.source})*` : ''}\n`;
    md += '\n';
  }
  if (brief.missingInformation.length) {
    md += `## Missing Information\n\n`;
    brief.missingInformation.forEach(m => { md += `- ${m}\n`; });
    md += '\n';
  }
  if (brief.redFlags.length) {
    md += `## Red Flags / Escalation\n\n`;
    brief.redFlags.forEach(r => { md += `- ⚠ ${r}\n`; });
    md += '\n';
  }
  md += `## Evidence Summary\n\n${brief.evidenceSummary}\n\n`;
  md += `## Sources\n\n`;
  brief.sourcesAndProvenance.forEach((s, i) => { md += `${i + 1}. ${s.name} [${s.type}] — Retrieved ${new Date(s.retrieved).toLocaleDateString()}${s.version ? ` (v${s.version})` : ''}\n`; });
  md += `\n---\n*For clinical reference, evidence review, and care-planning support only.*\n`;
  return md;
}

export function exportCSV(evidence: NormalizedRecord[]): string {
  const h = ['Title','Authors','Journal','Year','Type','Sample','Direction','Score','Citations','DOI','Source'];
  const rows = evidence.map(e => [
    `"${e.title.replace(/"/g,'""')}"`, `"${e.authors.join('; ')}"`, e.journal, e.year, e.studyType,
    e.sampleSize || '', e.resultDirection, e.evidenceScore, e.citationCount, e.doi || '', e.source
  ].join(','));
  return [h.join(','), ...rows].join('\n');
}

export function downloadFile(content: string, filename: string, mime = 'text/plain') {
  const b = new Blob([content], { type: mime });
  const u = URL.createObjectURL(b);
  const a = document.createElement('a'); a.href = u; a.download = filename; a.click();
  URL.revokeObjectURL(u);
}

export function copyToClipboard(text: string) { return navigator.clipboard.writeText(text); }
