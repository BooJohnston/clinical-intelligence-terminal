# Clinical Intelligence Terminal

Multi-database clinical evidence support platform with AI-powered synthesis, guideline pathways, rules engine, and real-time drug interaction checking.

## Live Demo
https://advancedmedicalai.netlify.app

## Features
- Clinical scenario parsing (80+ conditions, all care settings)
- 26 guideline pathways (acute, post-acute, home health, long-term care)
- Multi-database evidence retrieval (PubMed, ClinicalTrials.gov, OpenAlex)
- Clinical rules engine (contraindications, age exclusions, missing data criticality)
- Real-time drug interaction checking via NLM RxNorm
- AI-powered clinical narrative synthesis via Claude
- Consensus and contradiction analysis
- User registration with Supabase cloud storage
- Search result persistence
- FHIR context architecture (SMART on FHIR ready)

## Deploy to Netlify
1. Push this repo to GitHub
2. Go to app.netlify.com → Add new site → Import from Git
3. Select your repo
4. Netlify auto-detects the build settings from netlify.toml
5. Click Deploy

## Environment Variables (Netlify Dashboard → Site Configuration → Environment Variables)
Required:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon public key

Optional (enable live features):
- `ANTHROPIC_API_KEY` - Enables Claude AI synthesis
- `NCBI_API_KEY` - Higher PubMed rate limits
- `OPENALEX_EMAIL` - OpenAlex polite pool access

## Tech Stack
- React + TypeScript + Vite
- Recharts
- Netlify Functions (serverless)
- Supabase (Postgres)
