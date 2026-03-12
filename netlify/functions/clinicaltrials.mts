export default async (req) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });

  try {
    const { query, maxResults = 8 } = await req.json();
    if (!query) return new Response(JSON.stringify({ error: 'No query' }), { status: 400, headers });

    const url = `https://clinicaltrials.gov/api/v2/studies?query.term=${encodeURIComponent(query)}&pageSize=${maxResults}&format=json`;
    const res = await fetch(url);
    const data = await res.json();

    const results = (data.studies || []).map(s => {
      const p = s.protocolSection;
      const id = p?.identificationModule?.nctId || 'unknown';
      return {
        id: `ct-${id}`,
        source: 'ClinicalTrials.gov',
        sourceType: 'clinicaltrials',
        title: p?.identificationModule?.briefTitle || '',
        abstract: p?.descriptionModule?.briefSummary || '',
        authors: [p?.identificationModule?.organization?.fullName || ''].filter(Boolean),
        journal: 'ClinicalTrials.gov',
        year: parseInt(p?.statusModule?.startDateStruct?.date?.substring(0, 4)) || 2024,
        doi: null,
        url: `https://clinicaltrials.gov/study/${id}`,
        publicationDate: p?.statusModule?.startDateStruct?.date || '',
        retrievalDate: new Date().toISOString(),
        studyType: 'rct',
        sampleSize: p?.designModule?.enrollmentInfo?.count || null,
        population: p?.eligibilityModule?.eligibilityCriteria?.substring(0, 200) || '',
        intervention: (p?.armsInterventionsModule?.interventions || []).map(i => i.name).join(', ').substring(0, 200),
        resultDirection: 'neutral',
        evidenceScore: 50,
        citationCount: 0,
        topicTags: (p?.conditionsModule?.conditions || []).slice(0, 5),
        status: p?.statusModule?.overallStatus || '',
        phase: (p?.designModule?.phases || []).join(', '),
      };
    });

    return new Response(JSON.stringify({ results, source: 'clinicaltrials-live', count: results.length }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, source: 'clinicaltrials-error' }), { status: 500, headers });
  }
};

export const config = { path: "/api/clinicaltrials" };
