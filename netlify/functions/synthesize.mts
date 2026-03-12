export default async (req) => {
  const headers = { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST,OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type' };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers });

  try {
    const { scenario, parsedContext, pathwayMatches, evidenceSummary, clinicalAlerts, consensus } = await req.json();
    const apiKey = Netlify.env.get('ANTHROPIC_API_KEY');

    if (!apiKey) {
      return new Response(JSON.stringify({
        synthesis: null,
        mode: 'demo',
        message: 'ANTHROPIC_API_KEY not configured. AI synthesis unavailable.',
      }), { status: 200, headers });
    }

    const prompt = `You are a clinical evidence synthesis engine embedded in a professional clinical decision-support platform used by physicians, care managers, and clinical researchers.

CRITICAL RULES:
- Never present yourself as the decision-maker
- Never diagnose individual patients
- Never issue direct treatment orders
- Use language like "guideline-supported elements commonly include," "current evidence suggests," "factors often considered"
- Always note that clinical judgment, institutional protocols, and patient-specific factors must guide actual care decisions
- Include source references when citing specific guidelines or trials
- Flag uncertainty and areas where evidence is limited or conflicting

CLINICAL SCENARIO:
${scenario}

PARSED PATIENT CONTEXT:
${JSON.stringify(parsedContext, null, 2)}

MATCHED GUIDELINE PATHWAYS:
${pathwayMatches || 'None matched'}

EVIDENCE SUMMARY:
${evidenceSummary || 'No evidence retrieved'}

CLINICAL ALERTS (from rules engine):
${clinicalAlerts || 'None'}

CONSENSUS DATA:
${consensus || 'Not computed'}

Generate a structured clinical evidence synthesis with these sections:

1. CLINICAL SCENARIO INTERPRETATION
Brief restatement of how the system interpreted the clinical context, including any assumptions made.

2. KEY CARE CONSIDERATIONS
The most important guideline-supported care elements for this scenario, organized by domain (medications, monitoring, rehabilitation, patient education, safety). Reference specific guidelines.

3. MEDICATION SAFETY ANALYSIS
Any contraindications, interactions, age-based modifications, or dosing considerations specific to this patient context.

4. RISK FACTORS AND RED FLAGS
Specific warning signs that would warrant urgent reassessment or escalation for this patient profile.

5. WHAT COULD CHANGE THESE RECOMMENDATIONS
Missing data points that could materially alter the analysis. Be specific about why each matters.

6. EVIDENCE CONFIDENCE ASSESSMENT
How strong is the evidence base? Where are the gaps? Any notable contradictions in the literature?

7. CARE COORDINATION NOTES
Follow-up, referral, and transition considerations specific to the care setting and patient context.

Keep the response under 1200 words. Be precise, not verbose. Every sentence should add clinical value.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text || '';

    return new Response(JSON.stringify({
      synthesis: text,
      mode: 'live',
      model: 'claude-sonnet-4-20250514',
      timestamp: new Date().toISOString(),
    }), { status: 200, headers });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, mode: 'error' }), { status: 500, headers });
  }
};

export const config = { path: "/api/synthesize" };
