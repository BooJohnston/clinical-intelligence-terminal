export default async (req) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });

  try {
    const { query, maxResults = 12 } = await req.json();
    if (!query) return new Response(JSON.stringify({ error: 'No query' }), { status: 400, headers });

    const enc = encodeURIComponent(query);
    const apiKey = Netlify.env.get('NCBI_API_KEY');
    const keyParam = apiKey ? `&api_key=${apiKey}` : '';

    // Search
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&retmode=json&retmax=${maxResults}&sort=relevance&term=${enc}${keyParam}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();
    const ids = searchData.esearchresult?.idlist || [];
    if (!ids.length) return new Response(JSON.stringify({ results: [], source: 'pubmed-live', count: 0 }), { status: 200, headers });

    // Fetch summaries
    const sumUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&retmode=json&id=${ids.join(',')}${keyParam}`;
    const sumRes = await fetch(sumUrl);
    const sumData = await sumRes.json();

    // Fetch abstracts
    const absUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&retmode=xml&rettype=abstract&id=${ids.join(',')}${keyParam}`;
    const absRes = await fetch(absUrl);
    const absXml = await absRes.text();

    // Parse abstracts from XML (simple extraction)
    const abstractMap = {};
    const articleBlocks = absXml.split('<PubmedArticle>');
    for (const block of articleBlocks) {
      const pmidMatch = block.match(/<PMID[^>]*>(\d+)<\/PMID>/);
      const absMatch = block.match(/<AbstractText[^>]*>([\s\S]*?)<\/AbstractText>/g);
      if (pmidMatch && absMatch) {
        abstractMap[pmidMatch[1]] = absMatch.map(a => a.replace(/<[^>]+>/g, '').trim()).join(' ').substring(0, 800);
      }
    }

    const results = ids.map(id => {
      const a = sumData.result?.[id];
      if (!a?.title) return null;
      const authors = a.authors?.slice(0, 5).map(x => x.name) || [];
      const year = parseInt(a.pubdate?.split(' ')[0]) || 2024;
      return {
        id: `pm-${id}`,
        source: 'PubMed',
        sourceType: 'pubmed',
        title: a.title.replace(/<[^>]+>/g, ''),
        abstract: abstractMap[id] || '',
        authors,
        journal: a.source || '',
        year,
        doi: a.elocationid?.replace('doi: ', '') || null,
        url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        publicationDate: a.pubdate || '',
        retrievalDate: new Date().toISOString(),
        studyType: inferStudyType(a.title + ' ' + (abstractMap[id] || '')),
        resultDirection: 'neutral',
        evidenceScore: 55,
        citationCount: 0,
        topicTags: [],
      };
    }).filter(Boolean);

    return new Response(JSON.stringify({ results, source: 'pubmed-live', count: results.length }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, source: 'pubmed-error' }), { status: 500, headers });
  }
};

function inferStudyType(text) {
  const t = text.toLowerCase();
  if (t.includes('meta-analysis') || t.includes('meta analysis')) return 'meta-analysis';
  if (t.includes('systematic review')) return 'systematic-review';
  if (t.includes('randomized') || t.includes('randomised') || t.includes('rct')) return 'rct';
  if (t.includes('cohort')) return 'cohort';
  if (t.includes('case-control') || t.includes('case control')) return 'case-control';
  if (t.includes('case report') || t.includes('case series')) return 'case-series';
  if (t.includes('guideline') || t.includes('practice guideline') || t.includes('consensus statement')) return 'guideline';
  if (t.includes('review')) return 'systematic-review';
  if (t.includes('trial')) return 'rct';
  return 'cohort';
}

export const config = { path: "/api/pubmed" };
