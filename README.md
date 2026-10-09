# Business Analyst — public portfolio preview

This is a separate, static public demonstration of the local-first AI Business Operations
Analyst. It does **not** publish the development server, run an LLM, accept uploaded company
data, or expose saved investigations. Visitors can browse a restricted field projection of
the pinned synthetic Maple Payments snapshot and follow one precomputed, source-backed
example. The [engine repository](https://github.com/gravelgaucho/ai-business-operations-analyst)
continues separately.

## What works

- A concise Overview architecture summary distinguishing the local model boundary, verified
  JSON/SQLite data layer, business semantics, bounded lexical RAG, governed tools, provenance,
  evaluation gates and the planned (not self-service) company-data onboarding path.
- A separate end-state flow and proposed fine-tuning path. Tuning would use independently
  permitted examples, not Enterprise-Bench; no tuned model or live public inference is claimed.
- Seven searchable source indexes covering all 42 accounts, 8,704 opportunities, 32,768
  tickets, 8,448 product issues, 55 articles, eight document index records and three
  transcript index records. Source bodies and people/contact fields are excluded.
- Two combinable dimension filters, an account filter where a recorded account ID exists,
  50-record pages, and inspection of the public fields behind each result.
- A guided Vantara example: 783 linked tickets, 269 incident tickets and 45 incidents in
  Checkout & Customer Experience. The 45-record link applies all three conditions and
  exposes the records. This is an observation, not a causal claim.
- Four captioned, 12-second simulated analyst interactions (`dist/demo-*.mp4`): support
  concentration, Growth-versus-Enterprise agreement terms, an East-versus-West opportunity
  comparison, and a margin question that correctly identifies missing inputs. The first
  three use facts verified against the synthetic source; no model generated these videos.

## Data boundaries

`export_preview.py` verifies the locally pinned DevRev Enterprise-Bench archive before
creating `dist/data/*.json`. It exports an allowlist of fields, not the original files.
The source commit is `c921345cb64f8045d70f79a3f99717008d68f366` and the trusted
file-manifest SHA-256 is recorded in `dist/data/summary.json`. The upstream source is
synthetic and Apache-2.0; the license copy is `dist/THIRD_PARTY_LICENSE.txt`.

No generated finance world, benchmark answer key, review database, model trace, local
credential, document body, description, contact detail or email is included. The separate
`contract_demo_terms.json` publishes only two source-verified SLA terms per synthetic tier
template; it is not an executed-customer-contract comparison. Source
counts are not claims of full company coverage, and recorded CRM ACV is not revenue.

## Reproduce and check

From the existing analyst checkout, with its already prepared `.venv` and verified source:

```sh
.venv/bin/python ../business-analyst-portfolio-site/export_preview.py --project . --output ../business-analyst-portfolio-site/dist
```

From this Site checkout, run the focused offline contract:

```sh
python3 test_preview.py
```

To regenerate the four illustrated videos, use a local Python environment with Pillow, plus a
build-only isolated `.video-venv` containing pinned `imageio-ffmpeg==0.6.0`, then run
`python make_engine_walkthrough.py`. The video dependency is not a website
runtime dependency. The source is static HTML, CSS and JavaScript; no login or backend is
required.

## Status

This public preview demonstrates the dashboard and evidence UX, not production security,
automatic interpretation of arbitrary questions, an official Enterprise-Bench score, or
completed model qualification. Consequential decisions require human review. A future model
can be connected to the local engine through its existing adapter/qualification boundary;
the public page makes no assumption about which model will pass.
