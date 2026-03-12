export default async (req) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });

  try {
    const { medications } = await req.json();
    if (!medications?.length) return new Response(JSON.stringify({ interactions: [], rxcuis: {} }), { status: 200, headers });

    // Step 1: Resolve drug names to RxCUIs
    const rxcuis = {};
    for (const med of medications.slice(0, 10)) {
      try {
        const r = await fetch(`https://rxnav.nlm.nih.gov/REST/rxcui.json?name=${encodeURIComponent(med)}&search=1`);
        const d = await r.json();
        const rxcui = d.idGroup?.rxnormId?.[0];
        if (rxcui) rxcuis[med] = rxcui;
      } catch {}
    }

    // Step 2: Check interactions between all resolved RxCUIs
    const rxcuiList = Object.values(rxcuis);
    const interactions = [];

    if (rxcuiList.length >= 2) {
      try {
        const url = `https://rxnav.nlm.nih.gov/REST/interaction/list.json?rxcuis=${rxcuiList.join('+')}`;
        const r = await fetch(url);
        const d = await r.json();

        const pairs = d.fullInteractionTypeGroup?.[0]?.fullInteractionType || [];
        for (const pair of pairs) {
          const drugs = pair.minConcept || [];
          for (const ip of pair.interactionPair || []) {
            interactions.push({
              drug1: drugs[0]?.name || 'Unknown',
              drug2: drugs[1]?.name || 'Unknown',
              severity: ip.severity || 'unknown',
              description: ip.description || '',
              source: 'NLM RxNorm Interaction API',
            });
          }
        }
      } catch {}
    }

    // Step 3: Get drug class info for each medication
    const drugInfo = {};
    for (const [med, rxcui] of Object.entries(rxcuis)) {
      try {
        const r = await fetch(`https://rxnav.nlm.nih.gov/REST/rxclass/class/byRxcui.json?rxcui=${rxcui}&relaSource=ATC`);
        const d = await r.json();
        const classes = d.rxclassDrugInfoList?.rxclassDrugInfo?.map(c => c.rxclassMinConceptItem?.className) || [];
        drugInfo[med] = { rxcui, classes: [...new Set(classes)].slice(0, 3) };
      } catch {
        drugInfo[med] = { rxcui, classes: [] };
      }
    }

    return new Response(JSON.stringify({
      interactions,
      rxcuis,
      drugInfo,
      count: interactions.length,
      source: 'rxnorm-live',
    }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, source: 'rxnorm-error' }), { status: 500, headers });
  }
};

export const config = { path: "/api/drug-interactions" };
