# Business Analyst | Public Portfolio Preview

**Live demo:** https://gravelgaucho.github.io/business-analyst-portfolio-demo/

This GitHub repository is the static deployment mirror. Its site files are at the repository
root, with public synthetic indexes under `data/`. It is separate from the engine repository
and does not include the local export pipeline or model runtime.

This is a separate, static public demonstration of the local-first AI Business Operations
Analyst. It does **not** publish the development server, run an LLM, accept uploaded company
data, or expose saved investigations. Visitors can browse a restricted field projection of
the pinned synthetic Maple Payments snapshot and follow two precomputed, source-backed
workflows. The [engine repository](https://github.com/gravelgaucho/ai-business-operations-analyst)
continues separately.

## What Works

- Navigation groups Product, Workflows, Solutions, Engineering, and Resources. Dedicated
  pages separate Overview, Why, How, Workflows, Videos, Engineering, Possibilities,
  Enterprise Scale, and Roadmap. Each page has a clear next step; old workflow and video
  hashes remain valid.
- The homepage separates a working workspace preview, the two workflow choices, and manual
  source exploration. "Explore Without Asking The AI" contains only source browsing.
  The preview switches between a source-backed support table and an annotated sales brief.
  Its product-area links open the actual incident filters; no editable live-chat box is implied.
- Headings, summaries, UI labels, and portfolio credit lines capitalize every word.
  Source names and subjects remain verbatim in quoted record content and field values.
- A workflow hub explains visual exploration versus conversational investigation.
  The Vantara path starts with an account and filters; the East/West path starts with
  a question and follows an annotated sequence. Neither presents a live model response.
- Nine selectable business-domain examples explain questions, inputs, analytical methods,
  useful outputs, and validation needs. Recruiting, supply chain, finance, strategy,
  and industry adaptations are proposed applications rather than connected capabilities.
- A proposed enterprise-scale design covers source admission, warehouse query pushdown,
  scoped retrieval, permission-aware evidence, private GPU or approved hosted inference,
  queues and workers, observability, and representative load testing. No capacity is claimed.

- A separate, unnumbered end-to-end case sample: an East/West decision exhibit with
  direct links to opportunities and accounts. Four follow-up checks cover deal volume versus size,
  sales motion, snapshot won share, and account footprint. The case recommends against copying
  East's playbook, then hands a proposed sales-operations owner a comparison request,
  a conditional pilot decision gate, and a measurement plan. The synthetic snapshot supports
  the stated figures: East has $43.715M more recorded won ACV and 14 indexed accounts versus
  West's 11, while West has 1.7% more won ACV per indexed account. It does not support a
  causal diagnosis or a completed business pilot.
- A proposed pilot scorecard covers time to a reviewed answer, answer quality, evidence coverage,
  and implementation effort. These are evaluation criteria, not measured benefits or ROI claims.
- An Overview that introduces the engine, its intended users, current status, and two
  workflow entry points. The Why and How pages explain the need and analytical responsibilities.
- A dedicated Engineering page distinguishes the local model boundary, verified
  JSON/SQLite data layer, business semantics, bounded lexical RAG, governed tools, provenance,
  evaluation gates, and the planned (not self-service) company-data onboarding path.
  Eight expandable chapters deepen the serving, data, catalog, orchestration, analytical,
  provenance, state/recovery, and evaluation explanations. Julio's engineering contribution
  remains visible in this section.
- The How page retains the intended end-state flow; Roadmap retains the proposed fine-tuning
  path. Tuning would use independently
  permitted examples, not Enterprise-Bench; no tuned model or live public inference is claimed.
- A portability and implementation roadmap distinguishes the Mac/MLX runtime from reusable
  application contracts, then explains model qualification, company-specific semantic setup,
  second-company transfer and production controls. Other hosts and corporate functions remain
  potential extensions requiring validation.
- Seven searchable source indexes covering all 42 accounts, 8,704 opportunities, 32,768
  tickets, 8,448 product issues, 55 articles, eight document index records, and three
  transcript index records. Source bodies and people/contact fields are excluded.
- Up to three combinable dimension filters, an account filter where a recorded account ID exists,
  50-record pages, and inspection of the public fields behind each result.
- A guided Vantara investigation: 783 linked tickets and 269 incidents. Revenue Analytics
  has 58 incidents and 22 P1 cases; Invoicing has 53 and 21. It compares all product areas,
  checks the historical P1 dates, opens two matching dashboard-slowness subjects and a
  separate dashboard/API discrepancy, and links the 22- and 21-record priority sets.
  A proposed support-lead handoff explains how to validate classification, decide whether
  a fix is supported, and measure the outcome. No confirmed shared defect or completed
  intervention is claimed.
- Four captioned, 34-second, native-1440p simulated analyst interactions (`demo-*.mp4`): support
  concentration, a nine-clause Growth-versus-Enterprise agreement comparison, an
  East-versus-West opportunity comparison, and product-issue prioritization. Each opens
  with a material answer after three seconds, scrolls through the source-checked breakdown,
  opens a filtered source list and a selected record or clause, then shows a bounded decision,
  proposed owner, test, close-out measure, and limit. The full East/West case has its own
  page, linked from the Overview's management-question card. A four-item video playlist
  shows one player at a time, pauses hidden players, and links to workflows or source indexes.
  Expandable text findings accompany the videos. No model generated these videos.

## Data Boundaries

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

## Validation And Implementation

The export was checked against a fixed source commit and file-manifest hash. Focused offline
contracts verified record counts, allowed fields, the guided finding, demo figures, media,
and relative asset paths before publication. The public deployment was then checked in a
browser: the Overview loads, account exploration and the 58-record drill-down work, and all
four videos load. The site is static HTML, CSS and JavaScript; no login, backend or model call
is required. The export and video-generation scripts remain in the separate local build
checkout, not this public deployment mirror.

The regional comparison was checked at 320, 390, 768, and 1280 CSS pixels. It fits
without clipped figures or page overflow. Mobile record inspection,
technical disclosures and regional-video playback were also checked. The comparison
uses its own compact sizing rather than the wider source explorer's table minimum.

The October 9 product-story revision separates presentation content into `story.js`, while
`app.js` retains source exploration, verified workflows, video behavior, and shared routing.
The original material was redistributed across dedicated pages, with domain and scale proposals
added. Workflow follow-up checks expand individually, with the first check open by default.
Source indexes, calculations, and media files were not changed. Navigation groups,
mobile menu behavior, direct routes, browser Back, source inspection, compound drill-downs,
domain selection, technical disclosures, and the four-video playlist were checked locally.
All 12 routes fit at 1280 and 390 CSS pixels. Focused 320-pixel checks found and corrected an
unbroken-source-hash overflow by wrapping the hash, retaining its full text. The reporting
and East won-opportunity paths still return 22 and 1,923 matching records respectively.
Switching from the playing regional video pauses it. Five relevant source-fact,
presentation, and asset contracts and JavaScript syntax checks pass; unchanged media
evidence is retained. The heading audit covers all 12 routes, including the nested
engineering/scale summaries and portfolio credit. The 320-pixel source inspector retains
the original subject text without horizontal overflow. The homepage preview's reporting
link opens exactly 58 incident records; manual browsing and workflow choice have separate
sections with matching headings.

Presentation reference points include [Ramp](https://ramp.com/),
[Linear](https://linear.app/), and [Retool](https://retool.com/). Platform and architecture
reference points include [Glean](https://www.glean.com/),
[Hex](https://hex.tech/), and [Palantir AIP](https://www.palantir.com/docs/foundry/aip/overview).
These inform information hierarchy and architectural comparison; they do not imply affiliation,
feature parity, or enterprise qualification.

## Status

This public preview demonstrates the dashboard and evidence UX, not production security,
automatic interpretation of arbitrary questions, an official Enterprise-Bench score, or
completed model qualification. Consequential decisions require human review. A future model
can be connected to the local engine through its existing adapter/qualification boundary;
the public page makes no assumption about which model will pass.
