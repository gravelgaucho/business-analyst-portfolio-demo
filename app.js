"use strict";

const app = document.querySelector("#app");
const dialog = document.querySelector("#record-dialog");
const categoryInfo = {
  accounts: {label:"Accounts", description:"Customers and prospects", id:"account_id", name:"account_name", columns:["account_name","region","industry","type"]},
  opportunities: {label:"Opportunities", description:"Sales pipeline and recorded ACV", id:"opportunity_id", name:"opportunity_name", columns:["opportunity_name","account_region","stage","opportunity_type"]},
  tickets: {label:"Support tickets", description:"Support demand and resolution states", id:"ticket_id", name:"subject", columns:["subject","account_region","ticket_type","status"]},
  issues: {label:"Product issues", description:"Recorded product work", id:"issue_id", name:"title", columns:["title","issue_type","priority","status"]},
  articles: {label:"Knowledge articles", description:"Published guidance index", id:"article_id", name:"title", columns:["title","status","audience"]},
  documents: {label:"Internal documents", description:"Policy and agreement index", id:"document_id", name:"title", columns:["title","status","audience"]},
  transcripts: {label:"Call transcripts", description:"Meeting index", id:"transcript_id", name:"title", columns:["title","call_type","account_region"]}
};
let summary;
const cache = new Map();
let explore = {category:"accounts",query:"",facet:"",value:"",account:"",page:0};
let currentView="overview";
const number = value => new Intl.NumberFormat("en-US").format(value);
const display = value => Array.isArray(value) ? value.join(", ") || "Not recorded" : value === null || value === undefined || value === "" ? "Not recorded" : String(value).replaceAll("_"," ");
const element = (tag, content, className) => {const el=document.createElement(tag);if(content!==undefined)el.textContent=content;if(className)el.className=className;return el;};
const button = (label, action, className="btn") => {const el=element("button",label,className);el.addEventListener("click",action);return el;};
const heading = (eyebrow,title,copy) => {const box=element("div");box.append(element("div",eyebrow,"eyebrow"),element("h1",title),element("p",copy,"hero-copy"));return box;};
const sectionHead = (title,copy) => {const box=element("div",undefined,"section-head");box.append(element("h2",title),element("p",copy));return box;};
const panel = (title,copy) => {const box=element("section",undefined,"panel");box.append(element("h3",title));if(copy)box.append(element("p",copy));return box;};
const sourceHref = "https://github.com/devrev/enterprise-bench/tree/";

async function records(category) {
  if(!cache.has(category)) {
    const response=await fetch(`./data/${category}.json`);
    if(!response.ok) throw new Error("The verified preview could not be loaded.");
    const rows=await response.json();
    if(rows.length!==summary.totals[category]) throw new Error("Preview record count does not match its manifest.");
    cache.set(category,rows);
  }
  return cache.get(category);
}

function navigate(view) {
  currentView=view;
  document.querySelectorAll(".nav-item").forEach(item=>item.classList.toggle("active",item.dataset.view===view));
  location.hash=view;
  app.replaceChildren(element("div","Opening view…","loading"));
  Promise.resolve(({overview:renderOverview,explore:renderExplore,investigation:renderInvestigation,about:renderAbout})[view]())
    .catch(error=>app.replaceChildren(element("p",error.message+" Please reload the page.","loading")));
  window.scrollTo({top:0,behavior:"smooth"});
}

function renderOverview() {
  app.replaceChildren();
  const hero=element("section",undefined,"hero");
  const left=heading("MODEL-AGNOSTIC · LOCAL-FIRST","Ask a business question. Follow the evidence.","This Mac-first AI business analyst prototype is built to interpret questions, use approved data and analytical tools, and cite the records behind its findings. Explore the synthetic sample here and watch illustrated investigations; this public site does not run live model queries.");
  const actions=element("div",undefined,"actions");
  actions.append(button("Watch the analyst demos",()=>{navigate("about");requestAnimationFrame(()=>{const video=document.querySelector(".tour-video");video?.scrollIntoView({behavior:"smooth",block:"center"});video?.play().catch(()=>{});});},"btn primary"),button("Explore the data",()=>navigate("explore")));
  left.append(actions);
  const aside=element("aside",undefined,"hero-aside");
  aside.append(element("div","EXAMPLE · VERIFIED SYNTHETIC RECORDS","eyebrow"),element("strong","58 of 269 Vantara incidents map to Revenue Analytics."),element("p","It is the largest linked product-area group; 22 are P1. The records identify a place to investigate, not a root cause."),button("Inspect the finding ↗",()=>navigate("investigation"),"btn"));
  hero.append(left,aside);app.append(hero);
  const status=element("div",undefined,"status-grid");
  [["BUILT LOCALLY","A bounded analyst engine, source checks and evaluation harness."],["SHOWN HERE","Read-only synthetic data exploration and four simulated investigations."],["STILL TO QUALIFY","Open-ended reasoning, live public asking and production use."]].forEach(([label,copy])=>{const card=element("div",undefined,"status-card");card.append(element("span",label,"architecture-label"),element("p",copy));status.append(card);});app.append(status);
  app.append(sectionHead("The end goal: ask, investigate, verify","A business user asks a question, not for a file path, query or analytical method. This is the target experience—not a claim about the current public demo."));
  const vision=element("div",undefined,"vision-flow");
  [
    ["01 / ASK","Start with the business problem","“Bookings rose, but revenue is flat. Why?”"],
    ["02 / DISCOVER","Find approved evidence","Identify relevant CRM, finance and document sources; respect scope, permissions and business definitions."],
    ["03 / INVESTIGATE","Use the right tools","Retrieve passages, run validated SQL/Python calculations, reconcile sources and test competing explanations."],
    ["04 / EXPLAIN","Return a decision-ready brief","Lead with quantified findings; separate facts from hypotheses; cite records, methods, limits and next actions."]
  ].forEach(([label,title,copy])=>{const card=element("div",undefined,"vision-step");card.append(element("span",label,"architecture-label"),element("h3",title),element("p",copy));vision.append(card);});app.append(vision);
  app.append(sectionHead("Under the hood","A model is the language layer—not the database, calculator or source of truth."));
  const architecture=element("div",undefined,"architecture-grid");
  [
    ["01 / MODEL BOUNDARY","Swap the model","Apple Silicon + MLX/MLX-VLM behind an OpenAI-compatible API. Model ID and endpoint are configuration; replacements must pass the same evaluations."],
    ["02 / DATA LAYER","Verify the sources","Pinned synthetic JSON is authenticated, normalized into SQLite and checked for report parity. Original record IDs remain traceable."],
    ["03 / SEMANTICS","Define business meaning","A governed catalog records entities, joins, metric definitions, grain, units, time coverage and which analytical capabilities are actually enabled."],
    ["04 / RETRIEVAL · RAG","Cite the passage","Scoped lexical retrieval searches approved published documents and returns section, line range and SHA-256. This is not arbitrary-file or vector RAG."],
    ["05 / AGENT · TOOLS","Reason, then calculate","Native tool calls reach typed read-only Python reports and parameterized SQL. An experimental Pydantic AI loop adds model-led selection; the host validates arguments and budgets."],
    ["06 / TRUST · EVALS","Make it auditable","Content-addressed evidence, claim-level citations, calculation replay, durable run records and versioned scenario gates separate facts, inference and missing data."]
  ].forEach(([label,title,copy])=>{const card=element("section",undefined,"architecture-card");card.append(element("span",label,"architecture-label"),element("h3",title),element("p",copy));architecture.append(card);});app.append(architecture);
  const onboarding=element("div",undefined,"onboarding-note");onboarding.append(element("span","COMPANY DATA / IMPLEMENTATION PATH","architecture-label"),element("strong","Bring the source and its meaning—not just a file."),element("p","A new company would register approved read-only sources, map IDs and metric semantics, validate joins and coverage, then qualify retrieval, tools and answers against its own cases. That onboarding and live synchronization are a documented roadmap, not a one-click feature today."));app.append(onboarding);
  const qualification=element("div",undefined,"qualification-note");qualification.append(element("span","PROTOTYPE / QUALIFICATION STATUS","architecture-label"),element("strong","Swappable model boundary. Unfinished general reasoning."),element("p","The local 27B baseline passed bounded tool and evidence tests, not broad enterprise-grade question answering. A more capable model has not been qualified at usable memory and speed on this Mac. Live browser asking, production controls and second-company portability remain open; consequential findings require human review."));app.append(qualification);
  const tuning=element("div",undefined,"tuning-note");tuning.append(element("span","PROPOSED MODEL UPGRADE / FINE-TUNING","architecture-label"),element("strong","Tune behavior, not business facts."),element("p","On a suitable platform, a compatible model could be fine-tuned on separately permitted examples of question interpretation, tool selection and evidence-aware answers. Retrieval keeps company facts current. Training and serving are separate choices: local deployment still needs memory, latency and held-out quality gates. Enterprise-Bench data must stay out of training. This is a proposed experiment, not an implemented capability or release claim."));app.append(tuning);
  app.append(sectionHead("A connected business snapshot","These are source-record counts, not a claim of company completeness or model readiness."));
  const metrics=element("div",undefined,"metric-grid");
  [["accounts","Accounts"],["opportunities","Opportunities"],["tickets","Support tickets"],["issues","Product issues"]].forEach(([key,label])=>{const card=element("div",undefined,"metric-card");card.append(element("span",label),element("strong",number(summary.totals[key])),element("small","Pinned synthetic source index"));metrics.append(card);});app.append(metrics);
  app.append(sectionHead("Explore without asking the AI","Choose a source, search its public index, and narrow by recorded dimensions. Every displayed record keeps its source identity."));
  const categories=element("div",undefined,"category-grid");
  Object.entries(categoryInfo).forEach(([key,info])=>{const card=button("",()=>{explore={category:key,query:"",facet:"",value:"",account:"",page:0};navigate("explore");},"category-card");card.append(element("span",number(summary.totals[key]),"count"),element("span",info.label,"label"),element("span","Open collection ↗","arrow"));categories.append(card);});app.append(categories);
  app.append(element("p","The public index omits descriptions, document bodies, people, emails, saved model attempts, and generated finance data. The full local workspace has broader source inspection.","note"));
  app.append(sectionHead("A decision-ready workflow","The long-term product combines direct exploration with a question-led analyst. This preview is honest about which parts are demonstrable today."));
  const split=element("div",undefined,"split");
  const steps=panel("From ambiguity to evidence");
  const list=element("ol",undefined,"step-list");
  [["Ask a business question","The local analyst should form an investigation plan and select appropriate approved sources."],["Inspect the calculations","Deterministic tools and source records support the numbers rather than an unsupported narrative."],["Review the answer","A manager sees the finding first, with the what, why, how and limitations one click away."]].forEach((entry,i)=>{const li=element("li");li.append(element("b",String(i+1)));const content=element("div");content.append(element("strong",entry[0]),element("p",entry[1]));li.append(content);list.append(li);});steps.append(list);
  const callout=element("div",undefined,"callout");callout.append(element("div","OPEN A GUIDED EXAMPLE","eyebrow"),element("h2","What is happening in Vantara support?"),element("p","See how a broad account question narrows into recorded support types and product areas—without pretending a correlation proves a cause."),button("Walk through the finding",()=>navigate("investigation"),"btn"));split.append(steps,callout);app.append(split);
}

function fieldSelect(label,values,current,change) {
  const wrapper=element("div",undefined,"field"),caption=element("label",label),select=element("select");
  const id="filter-"+label.toLowerCase().replaceAll(" ","-");caption.htmlFor=id;select.id=id;
  values.forEach(([value,text])=>{const option=element("option",text);option.value=value;select.append(option);});
  select.value=current;select.addEventListener("change",()=>change(select.value));wrapper.append(caption,select);return wrapper;
}
function matchingRows(rows) {
  const needle=explore.query.trim().toLowerCase();
  const matches=(row,field,value)=>!field||!value||((Array.isArray(row[field])?row[field]:[row[field]]).some(item=>(item??"Not recorded")===value));
  return rows.filter(row=>(!needle||Object.values(row).some(value=>display(value).toLowerCase().includes(needle)))&&
    (!explore.account||row.account_id===explore.account)&&
    matches(row,explore.facet,explore.value)&&matches(row,explore.facet2,explore.value2));
}
async function renderExplore() {
  const rows=await records(explore.category);
  if(currentView!=="explore")return;
  const info=categoryInfo[explore.category];app.replaceChildren(heading("THE DATA WORKSPACE","Explore the connected sample.","Search and filter the published index of all records in each selected collection. Open a row to inspect the fields included in this public preview."));
  const toolbar=element("div",undefined,"toolbar");
  toolbar.append(fieldSelect("Collection",Object.entries(categoryInfo).map(([key,item])=>[key,item.label]),explore.category,value=>{explore={category:value,query:"",facet:"",value:"",account:"",page:0};renderExplore();}));
  const search=element("div",undefined,"field search"),label=element("label","Search source index"),input=element("input");label.htmlFor="record-search";input.id="record-search";input.placeholder="Name, subject, ID…";input.value=explore.query;input.addEventListener("input",()=>{explore.query=input.value;explore.page=0;updateResults();});search.append(label,input);toolbar.append(search);
  const facets=Object.keys(summary.dimensions[explore.category]);
  toolbar.append(fieldSelect("Filter by",[["","Any dimension"],...facets.map(key=>[key,key.replaceAll("_"," ")])],explore.facet,value=>{explore.facet=value;explore.value="";explore.facet2="";explore.value2="";explore.page=0;renderExplore();}));
  if(explore.facet){const values=summary.dimensions[explore.category][explore.facet];toolbar.append(fieldSelect("Value",[["","All values"],...Object.keys(values).sort().map(value=>[value,display(value)])],explore.value,value=>{explore.value=value;explore.page=0;renderExplore();}));}
  if(explore.facet && explore.value){
    toolbar.append(fieldSelect("And filter by",[["","No second filter"],...facets.filter(key=>key!==explore.facet).map(key=>[key,key.replaceAll("_"," ")])],explore.facet2||"",value=>{explore.facet2=value;explore.value2="";explore.page=0;renderExplore();}));
    if(explore.facet2){const values=summary.dimensions[explore.category][explore.facet2];toolbar.append(fieldSelect("Second value",[["","All values"],...Object.keys(values).sort().map(value=>[value,display(value)])],explore.value2||"",value=>{explore.value2=value;explore.page=0;renderExplore();}));}
  }
  if(["opportunities","tickets","transcripts"].includes(explore.category)){
    const accounts=await records("accounts");
    toolbar.append(fieldSelect("Account",[["","All accounts"],...accounts.map(item=>[item.account_id,item.account_name]).sort((a,b)=>a[1].localeCompare(b[1]))],explore.account,value=>{explore.account=value;explore.page=0;renderExplore();}));
  }
  app.append(toolbar);
  const meta=element("div",undefined,"result-meta"),container=element("div"),pager=element("div",undefined,"pager");app.append(meta,container,pager);
  function updateResults(){
    const found=matchingRows(rows),start=explore.page*50,pageRows=found.slice(start,start+50);
    meta.replaceChildren(element("span",`${number(found.length)} matching records · ${number(rows.length)} in the connected ${info.label.toLowerCase()} index`),element("strong","Snapshot, not live company data"));
    const shell=element("div",undefined,"table-shell"),table=element("table"),thead=element("thead"),tr=element("tr");
    info.columns.forEach(key=>tr.append(element("th",key.replaceAll("_"," "))));thead.append(tr);table.append(thead);
    const body=element("tbody");pageRows.forEach(row=>{const tr=element("tr");info.columns.forEach((key,i)=>{const td=element("td");if(i===0)td.append(button(display(row[key]),()=>inspectRecord(explore.category,row),"record-button"));else td.append(element("span",display(row[key]),i===2?"pill":""));tr.append(td);});body.append(tr);});table.append(body);shell.append(table);container.replaceChildren(shell);
    pager.replaceChildren(button("Previous",()=>{explore.page--;updateResults();}),element("span",found.length?`${start+1}–${Math.min(start+50,found.length)} of ${number(found.length)}`:"No matching records"),button("Next",()=>{explore.page++;updateResults();}));
    pager.firstChild.disabled=explore.page===0;pager.lastChild.disabled=start+50>=found.length;
  }
  updateResults();
  app.append(element("p","Search covers the included public index fields, not hidden source descriptions or document bodies. Opportunity ACV is recorded source data, not revenue, cash or a forecast. Product areas are derived only from explicit component-parent links; one record can appear in more than one area.","note"));
  const provenance=panel("Source and scope","Every row above comes from the pinned DevRev Enterprise-Bench / Maple Payments synthetic snapshot. This site distributes a limited field projection for all seven displayed collections, not the original files or model output.");provenance.append(element("p",`Source commit ${summary.source_commit} · Manifest ${summary.manifest_sha256.slice(0,16)}…`,"note"));app.append(provenance);
}

function inspectRecord(category,row) {
  const box=document.querySelector("#dialog-content");box.replaceChildren(element("div","SOURCE RECORD · "+categoryInfo[category].label.toUpperCase(),"eyebrow"),element("h2",display(row[categoryInfo[category].name])));
  Object.entries(row).forEach(([key,value])=>{const line=element("div",undefined,"record-kv");line.append(element("b",key.replaceAll("_"," ")),element("span",display(value)));box.append(line);});
  const source=element("p",`Pinned synthetic source · ${categoryInfo[category].id}: ${row[categoryInfo[category].id]}`, "note");box.append(source);dialog.showModal();
}

async function renderInvestigation(){
  const [accounts,tickets]=await Promise.all([records("accounts"),records("tickets")]);if(currentView!=="investigation")return;
  const vantara=accounts.find(row=>row.account_name==="Vantara");
  if(!vantara)throw new Error("The guided account is missing.");
  const linked=tickets.filter(row=>row.account_id===vantara.account_id);
  const incidents=linked.filter(row=>row.ticket_type==="incident");
  const revenueAnalytics=incidents.filter(row=>row.product_areas.includes("Revenue Analytics & Reporting"));
  const priorityOne=revenueAnalytics.filter(row=>row.priority==="p1");
  app.replaceChildren(heading("GUIDED FINDING · PRECOMPUTED","A finding you can verify.","This reviewed example uses the same Vantara support result shown in the first video. It is not a new model response; these synthetic ticket counts do not establish a trend, cause or business impact."));
  const answer=element("section",undefined,"answer");answer.append(element("div","QUESTION · “WHAT IS HAPPENING IN VANTARA SUPPORT?”","eyebrow"),element("h2",`${number(revenueAnalytics.length)} of ${number(incidents.length)} incidents map to Revenue Analytics.`),element("p",`This is Vantara's largest linked product-area group: ${(100*revenueAnalytics.length/incidents.length).toFixed(1)}% of its incidents, including ${number(priorityOne.length)} P1 tickets. All ${number(incidents.length)} incidents are marked solved. Inspecting the records is the next step; these counts do not explain why they occurred.`));
  const grid=element("div",undefined,"answer-grid");[[linked.length,"All linked support tickets"],[incidents.length,"Incident tickets"],[revenueAnalytics.length,"Revenue Analytics incidents"]].forEach(([value,label])=>{const metric=element("div",undefined,"answer-metric");metric.append(element("strong",number(value)),element("span",label));grid.append(metric);});answer.append(grid,button(`Inspect the ${number(revenueAnalytics.length)} underlying records`,()=>{explore={category:"tickets",query:"",facet:"ticket_type",value:"incident",facet2:"product_areas",value2:"Revenue Analytics & Reporting",account:vantara.account_id,page:0};navigate("explore");},"btn"));app.append(answer);
  app.append(sectionHead("What, why, and how","A useful answer makes the observed result, the method, and its limits separable."));
  const details=element("div",undefined,"detail-grid");
  details.append(panel("Verified observation",`${number(incidents.length)} tickets are classified “incident” and reference Vantara’s recorded account ID. ${number(revenueAnalytics.length)} link to Revenue Analytics & Reporting; ${number(priorityOne.length)} of those are P1.`));
  details.append(panel("Method","Filter support tickets by account_id, then ticket_type = incident. Follow each recorded component ID through the published product hierarchy to its product area. Count matching records, not customers or unique problems."));
  details.append(panel("Not established","This does not show whether support demand rose over time, whether a product issue caused the incidents, or whether pipeline or revenue was affected. Those require separate tests and additional evidence."));
  details.append(panel("Recommended next check",`Review the ${number(priorityOne.length)} P1 cases and dates, compare against a defined earlier period, and check linked product-issue history before suggesting a cause or action.`));app.append(details);
  app.append(sectionHead("Follow the evidence","The public demo exposes only the fields needed to inspect this example. The local workspace can open more of the underlying synthetic source."));
  const source=panel("Cited synthetic sources");
  [["Support ticket index",`${number(tickets.length)} tickets · account and type filter`,()=>{explore={category:"tickets",query:"",facet:"ticket_type",value:"incident",account:vantara.account_id,page:0};navigate("explore");}],["Vantara account record",`${vantara.account_id} · ${vantara.region}`,()=>{explore={category:"accounts",query:"Vantara",facet:"",value:"",account:"",page:0};navigate("explore");}]].forEach(([label,detail,action])=>{const line=element("div",undefined,"source-line");line.append(element("span",`${label} · ${detail}`),button("Open ↗",action,"record-button"));source.append(line);});app.append(source);
  app.append(element("p","Human review is required before consequential decisions. No live model call, official Enterprise-Bench score, causal proof or production claim is made by this example.","note"));
}

function renderAbout(){
  app.replaceChildren(heading("ILLUSTRATED INVESTIGATIONS","Watch the questions become findings.","Four brief, source-checked simulations show the kind of business answer this project is designed to deliver. They use approved synthetic records; the public site does not run a live model."));
  app.append(sectionHead("Four questions. Four material findings.","Each 25-second video moves from the answer to its full breakdown, then into a filtered source list and an individual record or clause. The final frame separates implication from what remains unproven. These are illustrated simulations—not live model runs."));
  const demos=element("div",undefined,"demo-grid");
  const demoNotes={
    support:["Finding: 269 of 783 Vantara tickets are incidents (34.4%). Revenue Analytics has the largest incident slice: 58 of 269 (21.6%), including 22 P1 incidents.","Drill-down: the video filters those 22 linked P1 records and opens TKT-22426 as one inspectable example; one record does not establish a cause or trend.","All 269 incidents are marked solved. Review the P1 records and dates before inferring repeat patterns or service quality.","Sources: ticket index, Vantara account ID and component-to-product-area links."],
    contracts:["Finding: Enterprise vs Growth uptime is 99.95% vs 99.5%; P0 first-response target is 10 vs 30 minutes; P0 resolution target is 2 vs 8 hours.","Drill-down: the video opens matched section 3.2 in MSA-003 and MSA-004, showing the 20-minute P0 response-target difference.","Nine matched terms cover service, API, notice and credits. The maximum credit figures have different qualifying conditions. These synthetic tier templates are not executed customer terms.","Sources: MSA-003 and MSA-004, sections 2, 3, 4, 5, 8 and 11."],
    regions:["Finding: East has $217.590M in recorded won ACV versus West's $173.875M, a $43.715M gap. East has 365 more marked-won records, but West's marked-won share is 66.9% versus 66.2% in East.","Drill-down: the video opens example record OPP-040 after filtering the 3,481 East/West marked-won records. That example does not explain the aggregate gap.","The record populations differ (2,907 vs 2,330). Normalize by period, market size and mix before calling one region stronger. Recorded CRM ACV is not revenue or cash.","Source: all East and West records in the synthetic opportunity index."],
    issues:["Finding: 1,360 issues are marked high/highest priority, but only 20 of them are in progress. Checkout, Billing and Invoicing each have 6 of those 20.","Drill-down: the video filters the six active Checkout records and opens ISS-001. The public index does not include customer-impact measures.","Review the 20 active records for age and customer impact. Historical issue volume and priority/status labels alone are not a business-risk ranking.","Sources: product-issue index and component-to-product-area links."]
  };
  [
    ["support","01 · Support concentration","Seven product-area rows distinguish volume, P1 priority and solved status."],
    ["contracts","02 · Agreement comparison","Nine matched T&C clauses show operational and credit differences."],
    ["regions","03 · Regional performance","Value, volume, share and opportunity mix test an outperformance claim."],
    ["issues","04 · Product issue priorities","Historical high-priority volume is separated from the active queue."]
  ].forEach(([key,title,description])=>{
    const card=element("section",undefined,"demo-card");
    const visual=element("video");visual.className="tour-video";visual.controls=true;visual.playsInline=true;visual.preload="metadata";visual.poster=`./demo-${key}.png?v=19`;visual.setAttribute("aria-label",`${title}, 25-second simulated analyst interaction`);
    const movie=element("source");movie.src=`./demo-${key}.mp4?v=19`;movie.type="video/mp4";visual.append(movie,element("p","Your browser cannot play this demo. Read the finding and sources below."));
    const transcript=element("details",undefined,"demo-transcript");transcript.append(element("summary","Read the finding and sources"));demoNotes[key].forEach(line=>transcript.append(element("p",line)));
    const mediaStatus=element("p","If the video cannot load, open the written finding and sources below.","demo-media-status");
    visual.addEventListener("error",()=>{mediaStatus.textContent="Video unavailable. The written finding and sources are open below.";mediaStatus.classList.add("show");transcript.open=true;});
    card.append(visual,mediaStatus,element("h3",title),element("p",description),transcript);demos.append(card);
  });app.append(demos);
  app.append(sectionHead("What is built—and what is next","The local engine, the public preview and the intended product are distinct."));
  const split=element("div",undefined,"split");
  const what=panel("Built and inspectable","The local prototype has a model-swappable boundary, bounded analytical tools, source provenance and evaluation checks. This public preview lets visitors explore seven synthetic indexes and drill into one precomputed finding.");
  const later=panel("Not yet qualified","Open-ended enterprise-grade reasoning, live public asking, production security, cross-source causal analysis and live-company connections remain future work. The videos illustrate answers; they are not model-run recordings.");split.append(what,later);app.append(split);
  app.append(sectionHead("The architecture in plain language","The model handles language; deterministic tools handle numbers; provenance keeps both accountable."));
  const stages=element("div",undefined,"timeline");
  [["01","Connect approved sources","Each company implementation needs a scoped data setup, permissions, metadata and source checks."],["02","Investigate a question","The analyst plans, selects approved tools and sources, tests hypotheses and keeps scope visible."],["03","Produce a reviewable brief","Facts, findings, uncertainty, implications, recommendations, calculations and citations remain distinguishable."],["04","Let people verify","A business user can move from a high-level conclusion into records and methods, or explore the dashboard independently."]].forEach(([n,title,copy])=>{const card=panel(title,copy);card.prepend(element("span",n,"number"));stages.append(card);});app.append(stages);
  const guide=panel("What you can verify here","All four demos use facts checked against the approved synthetic snapshot. The contract video publishes nine extracted terms per tier, not document bodies. In the working dashboard, you can explore seven source indexes and open the precomputed Vantara finding; no live model request runs here. The margin question remains out of scope because this public projection lacks matched revenue and direct costs.");guide.append(button("Start exploring",()=>navigate("overview"),"btn primary"));app.append(guide);
  app.append(element("p",`Data source: DevRev Enterprise-Bench / Maple Payments, commit ${summary.source_commit}. Public indexes are generated from a checksum-verified synthetic snapshot. The benchmark's hidden tasks, judging, generated finance scenarios and saved model attempts are not distributed.`,"note"));
}

document.querySelectorAll(".nav-item").forEach(item=>item.addEventListener("click",()=>navigate(item.dataset.view)));
window.addEventListener("hashchange",()=>{const view=location.hash.slice(1);if(["overview","explore","investigation","about"].includes(view)&&view!==currentView)navigate(view);});
document.querySelector("#dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
fetch("./data/summary.json").then(response=>{if(!response.ok)throw Error("Snapshot unavailable");return response.json();}).then(value=>{summary=value;const view=location.hash.slice(1);navigate(["overview","explore","investigation","about"].includes(view)?view:"overview");}).catch(error=>app.replaceChildren(element("p",error.message+". Please reload the preview.","loading")));
