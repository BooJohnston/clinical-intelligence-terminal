export default async (req) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });

  try {
    const { query, maxResults = 8 } = await req.json();
    if (!query) return new Response(JSON.stringify({ error: 'No query' }), { status: 400, headers });

    const email = Netlify.env.get('OPENALEX_EMAIL') || '';
    const emailParam = email ? `&mailto=${email}` : '';
    const url = `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per_page=${maxResults}&filter=type:article${emailParam}`;
    const res = await fetch(url);
    const data = await res.json();

    const results = (data.results || []).map(w => ({
      id: `oa-${w.id?.split('/').pop()}`,
      source: 'OpenAlex',
      sourceType: 'openalex',
      title: w.title || '',
      abstract: w.abstract_inverted_index ? reconstructAbstract(w.abstract_inverted_index) : '',
      authors: (w.authorships || []).slice(0, 4).map(a => a.author?.display_name || ''),
      institution: (w.authorships || [])[0]?.institutions?.[0]?.display_name || '',
      journal: w.primary_location?.source?.display_name || '',
      year: w.publication_year || 2024,
      doi: w.doi?.replace('https://doi.org/', '') || null,
      url: w.doi || w.id,
      publicationDate: w.publication_date || '',
      retrievalDate: new Date().toISOString(),
      studyType: w.type === 'review' ? 'systematic-review' : 'cohort',
      resultDirection: 'neutral',
      evidenceScore: 55,
      citationCount: w.cited_by_count || 0,
      topicTags: (w.concepts || []).slice(0, 5).map(c => c.display_name),
    }));

    return new Response(JSON.stringify({ results, source: 'openalex-live', count: results.length }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, source: 'openalex-error' }), { status: 500, headers });
  }
};

function reconstructAbstract(invertedIndex) {
  if (!invertedIndex) return '';
  const words = [];
  for (const [word, positions] of Object.entries(invertedIndex)) {
    for (const pos of positions) { words[pos] = word; }
  }
  return words.filter(Boolean).join(' ').substring(0, 800);
}

export const config = { path: "/api/openalex" };
