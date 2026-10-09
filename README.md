# Business Analyst — public portfolio preview

**Live demo:** https://gravelgaucho.github.io/business-analyst-portfolio-demo/

This GitHub repository is the static deployment mirror. Its site files are at the repository
root, with public synthetic indexes under `data/`. It is separate from the engine repository
and does not include the local export pipeline or model runtime.

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
- Four captioned, 24-second simulated analyst interactions (`demo-*.mp4`): support
  concentration, a nine-clause Growth-versus-Enterprise agreement comparison, an
  East-versus-West opportunity comparison, and product-issue prioritization. Each opens
  with a material answer after four seconds, scrolls through the source-checked breakdown,
  then states an implication, next check, and limit. Expandable text findings accompany
  the videos. No model generated these videos.

## Data boundaries

The local export pipeline verifies the pinned DevRev Enterprise-Bench archive before
creating the public `data/*.json` projection. It exports an allowlist of fields, not the original files.
The source commit is `c921345cb64f8045d70f79a3f99717008d68f366` and the trusted
file-manifest SHA-256 is recorded in `data/summary.json`. The upstream source is
synthetic and Apache-2.0; the license copy is `THIRD_PARTY_LICENSE.txt`.

No generated finance world, benchmark answer key, review database, model trace, local
credential, document body, description, contact detail or email is included. The separate
`data/contract_demo_terms.json` publishes only nine source-verified SLA/operations terms per synthetic tier
template; it is not an executed-customer-contract comparison. Source
counts are not claims of full company coverage, and recorded CRM ACV is not revenue.

## Validation and implementation

The export was checked against a fixed source commit and file-manifest hash. Focused offline
contracts verified record counts, allowed fields, the guided finding, demo figures, media,
and relative asset paths before publication. The public deployment was then checked in a
browser: the Overview loads, account exploration and the 45-record drill-down work, and all
four videos load. The site is static HTML, CSS and JavaScript; no login, backend or model call
is required. The export and video-generation scripts remain in the separate local build
checkout, not this public deployment mirror.

## Status

This public preview demonstrates the dashboard and evidence UX, not production security,
automatic interpretation of arbitrary questions, an official Enterprise-Bench score, or
completed model qualification. Consequential decisions require human review. A future model
can be connected to the local engine through its existing adapter/qualification boundary;
the public page makes no assumption about which model will pass.
