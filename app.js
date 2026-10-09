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
  const left=heading("MODEL-AGNOSTIC · LOCAL-FIRST","Ask a business question. Follow the evidence.","Business decisions depend on information spread across systems. This analyst engine is designed to bring the question, the analysis and the supporting evidence into one workspace, with control over your data and a model you can replace.");
  left.append(element("p","Built by Julio Campos · Applied AI engineering, business analysis, and product design.","maker-line"));
  const actions=element("div",undefined,"actions");
  actions.append(button("Watch the analyst demos",()=>{navigate("about");requestAnimationFrame(()=>{const video=document.querySelector(".tour-video");video?.scrollIntoView({behavior:"smooth",block:"center"});video?.play().catch(()=>{});});},"btn primary"),button("Explore the data",()=>navigate("explore")));
  left.append(actions);
  const aside=element("aside",undefined,"hero-aside");
  aside.append(element("div","THE MANAGEMENT QUESTION","eyebrow"),element("strong","East leads on contract value. Should West copy its approach?"),element("p","No. East has $43.715M more recorded won ACV and 14 indexed accounts to West’s 11, yet West has 1.7% more won ACV per indexed account. Follow the evidence through the decision and operational handoff."),button("See the decision and evidence ↓",()=>document.querySelector("#regional-case").scrollIntoView({behavior:"smooth",block:"start"}),"btn"));
  hero.append(left,aside);app.append(hero);
  const status=element("div",undefined,"status-grid");
  [["BUILT LOCALLY","Model integration, analytical tools, business semantics, source provenance, and evaluation checks."],["SHOWN HERE","Explore the synthetic data, inspect a verified finding, and watch four illustrated investigations. No live model call."],["STILL TO QUALIFY","Reliable open-ended conversations, new-company transfer, and production deployment."]].forEach(([label,copy])=>{const card=element("div",undefined,"status-card");card.append(element("span",label,"architecture-label"),element("p",copy));status.append(card);});
  app.append(sectionHead("The business challenge","A leadership question rarely fits inside one report. Someone must connect the records, agree on what the measures mean, and decide whether the evidence is strong enough to act."));
  const why=element("div",undefined,"story-rows");
  [
    ["01","Connect the business picture","The sales story may be in CRM, delivery details in support records, and obligations in contracts. Reconciling those sources is part of the work before a business conclusion can be trusted."],
    ["02","Agree on what the numbers mean","“Revenue,” “bookings,” and “cash” describe different things. A useful comparison needs shared definitions, compatible periods, and the right population. The model needs those rules as much as it needs the records."],
    ["03","Make the conclusion possible to check","A useful answer should show the size of a change, what supports the explanation, and what is still unknown. Managers need a route from the recommendation back to the figures, assumptions, and sources."]
  ].forEach(([num,title,copy])=>{const row=element("section",undefined,"story-row");row.append(element("span",num,"story-number"),element("h3",title),element("p",copy));why.append(row);});app.append(why);
  const businessCase=element("section",undefined,"business-case");businessCase.id="regional-case";
  businessCase.append(element("span","END-TO-END CASE · VERIFIED SYNTHETIC RECORDS","architecture-label"),element("h2","East leads in total. That is not a reason to copy its playbook."),element("p","We followed the question from the headline through deal size, sales motion, account coverage, and a decision. The records support a narrower action: commission a comparable pipeline review, not a sales reorganization.","case-intro"));
  const exhibit=element("div",undefined,"case-table-wrap"),table=element("table");table.append(element("caption","East and West · all recorded opportunities in the public snapshot"));
  const head=element("thead"),header=element("tr");["Measure","East","West"].forEach(label=>{const cell=element("th",label);cell.scope="col";header.append(cell);});head.append(header);table.append(head);
  const body=element("tbody");
  [["Recorded won ACV (US dollars)","$217.590M","$173.875M"],["Opportunities marked won","1,923","1,558"],["All recorded opportunities","2,907","2,330"],["Share of records marked won","66.2%","66.9%"],["Indexed accounts","14","11"],["Won ACV per indexed account","$15.542M","$15.807M"]].forEach(([label,east,west])=>{const row=element("tr"),name=element("th",label);name.scope="row";row.append(name,element("td",east),element("td",west));body.append(row);});table.append(body);exhibit.append(table);businessCase.append(exhibit);
  businessCase.append(element("h3","Follow-up questions change the decision.","case-subhead"));
  const caseReading=element("div",undefined,"case-reading");
  [["01 / IS THE GAP VOLUME OR DEAL SIZE?","East has $43.715M more recorded won ACV and 365 more won records. At West’s average won ACV, those 365 records account for about $40.7M, or 93% of the gap. Average won ACV is $113.2k in East and $111.6k in West. This is arithmetic, not a cause."],["02 / IS ONE SALES MOTION DRIVING IT?","The won ACV gap appears across expansion ($17.0M), renewal ($16.1M), and new business ($10.59M). One East won record worth $0.03M has no recorded opportunity type. The split does not point to a single motion."],["03 / IS EAST CLOSING MORE EFFECTIVELY?","West has a 66.9% marked-won share versus East’s 66.2% across all recorded opportunities. That 0.7 percentage point edge is a snapshot stage share, not a time-matched conversion rate. These records cannot establish which team sells better."],["04 / DOES ACCOUNT COVERAGE CHANGE THE READING?","Yes. East has 14 indexed accounts to West’s 11. East’s $15.542M in won ACV per indexed account is slightly below West’s $15.807M. East also has 13 prospect accounts and one customer, while West has three prospects and eight customers. Account mix differs sharply, so this is not a productivity or territory-potential measure."]].forEach(([label,copy])=>{const item=element("div");item.append(element("span",label,"architecture-label"),element("p",copy));caseReading.append(item);});businessCase.append(caseReading);
  const caseAudit=element("details",undefined,"case-audit");caseAudit.append(element("summary","Inspect the records behind these follow-ups"));
  const auditLinks=element("div",undefined,"actions");
  [["East won opportunities","Americas/East","stage","closed_won","",""],["West won opportunities","Americas/West","stage","closed_won","",""],["East expansion wins","Americas/East","opportunity_type","expansion","stage","closed_won"],["West expansion wins","Americas/West","opportunity_type","expansion","stage","closed_won"]].forEach(([label,region,facet2,value2,facet3,value3])=>auditLinks.append(button(label,()=>{explore={category:"opportunities",query:"",facet:"account_region",value:region,facet2,value2,facet3,value3,account:"",page:0};navigate("explore");})));
  [["East account index","Americas/East"],["West account index","Americas/West"]].forEach(([label,region])=>auditLinks.append(button(label,()=>{explore={category:"accounts",query:"",facet:"region",value:region,account:"",page:0};navigate("explore");})));
  caseAudit.append(auditLinks);businessCase.append(caseAudit);
  const caseDecision=element("div",undefined,"case-decision");caseDecision.append(element("span","DECISION BRIEF · CURRENT EVIDENCE","architecture-label"),element("h3","Do not roll out East’s playbook or move West’s people based on these totals."),element("p","The recorded value gap is mainly a count gap; East has a larger indexed account footprint, and West is slightly ahead on won ACV per indexed account. Different customer/prospect mixes and absent time-matched cohorts prevent a fair effectiveness comparison. For this synthetic case, the defensible decision is to hold the rollout; the cause remains undiagnosed."));businessCase.append(caseDecision);
  businessCase.append(element("h3","Take the recommendation to a decision gate.","case-subhead"));
  const actionPath=element("div",undefined,"case-action-path");
  [["01 / OWNER AND REQUEST","Proposed owner: sales operations. Request a read-only comparison of East and West for the same time window, customer/prospect status, sales motion, and addressable market. Supply actual opportunity-created and closed dates, account potential, territory assignments, and rep capacity."],["02 / TEST BEFORE CHANGING THE PLAYBOOK","Compare created opportunities per addressable account, time-matched win conversion, won ACV per opportunity, and coverage by segment. If West has a supply gap in a matched segment, propose a small sourcing or coverage pilot. If supply is similar but conversion is lower, investigate execution before piloting coaching or process changes."],["03 / CLOSE THE LOOP","A human owner approves a pilot with a baseline, target metric, duration, and guardrails, then compares results with an appropriate control or prior cohort. Keep, revise, or stop the change based on measured outcomes. No pilot, causal effect, or financial return is claimed by this demo."]].forEach(([label,copy])=>{const item=element("section");item.append(element("span",label,"architecture-label"),element("p",copy));actionPath.append(item);});businessCase.append(actionPath);
  businessCase.append(element("p","Evidence boundary: the synthetic account and opportunity indexes support the counts, ACV values, opportunity-type split, account mix, and snapshot stage shares above. They lack actual close dates, territory potential, sales activity, and rep capacity. Indexed accounts are not a measure of market opportunity. No causal driver, future uplift, or return on a staffing change has been established. ACV is not recognized revenue or cash.","note"));
  const caseActions=element("div",undefined,"actions");
  [["East","Americas/East"],["West","Americas/West"]].forEach(([label,region])=>caseActions.append(button(`Inspect ${label} opportunities`,()=>{explore={category:"opportunities",query:"",facet:"account_region",value:region,account:"",page:0};navigate("explore");})));
  caseActions.append(button("Watch the regional investigation",()=>{navigate("about");requestAnimationFrame(()=>{const demo=document.querySelector("#demo-regions");demo?.scrollIntoView({behavior:"smooth",block:"start"});demo?.querySelector("video")?.play().catch(()=>{});});}));businessCase.append(caseActions);app.append(businessCase);
  app.append(sectionHead("The proposed solution","An analyst workspace that helps people move from a business question to a reviewable decision brief. The case above is a precomputed illustration; the broader experience below is the product we are working toward."));
  app.append(status);
  const contribution=element("section",undefined,"contribution-band");
  contribution.append(element("span","BUILT BY JULIO CAMPOS · FROM BUSINESS PROBLEM TO WORKING PROTOTYPE","architecture-label"),element("h2","The design choices behind the experience."),element("p","I translated the business need into a modular system: model serving, data engineering, semantic modeling, agent orchestration, evaluation, and a usable workspace. Language interpretation and tool selection belong with the model; exact calculations with code; source verification with an inspectable evidence layer."));
  const skills=element("div",undefined,"skill-strip");["Local inference","Typed tool contracts","SQL + Python analytics","Retrieval / RAG","Evidence lineage","Evaluation harness","Dashboard + UX"].forEach(label=>skills.append(element("span",label)));contribution.append(skills);
  app.append(sectionHead("The end goal: ask, investigate, verify","A business analyst and internal strategy consultant that works across approved sources. The user supplies the business question; the system handles the investigation. This is the intended product experience."));
  const vision=element("div",undefined,"vision-flow");
  [
    ["01 / ASK","Start with the business problem","“Bookings rose, but revenue is flat. Why? Break it down by region and explain the biggest drivers.”"],
    ["02 / DISCOVER","Find approved evidence","Identify relevant CRM, finance, and document sources; respect scope, permissions, and business definitions."],
    ["03 / INVESTIGATE","Use the right tools","Retrieve passages, run validated SQL/Python calculations, reconcile sources, and test competing explanations."],
    ["04 / EXPLAIN","Return a decision-ready brief","Quantify the change, explain what supports it, identify uncertainty, and recommend next checks. Let the user inspect the what, why, and how."]
  ].forEach(([label,title,copy])=>{const card=element("div",undefined,"vision-step");card.append(element("span",label,"architecture-label"),element("h3",title),element("p",copy));vision.append(card);});app.append(vision);
  app.append(sectionHead("Explore without asking the AI","The same workspace should support both paths: investigate through conversation or browse the business yourself. Try the public source indexes below: search, filter, open a record and follow its identity."));
  const metrics=element("div",undefined,"metric-grid");
  [["accounts","Accounts"],["opportunities","Opportunities"],["tickets","Support tickets"],["issues","Product issues"]].forEach(([key,label])=>{const card=element("div",undefined,"metric-card");card.append(element("span",label),element("strong",number(summary.totals[key])),element("small","Verified synthetic source index"));metrics.append(card);});app.append(metrics);
  const categories=element("div",undefined,"category-grid overview-collections");
  Object.entries(categoryInfo).forEach(([key,info])=>{const card=button("",()=>{explore={category:key,query:"",facet:"",value:"",account:"",page:0};navigate("explore");},"category-card");card.append(element("span",number(summary.totals[key]),"count"),element("span",info.label,"label"),element("span","Open collection ↗","arrow"));categories.append(card);});app.append(categories);
  app.append(element("p","This public snapshot omits document bodies, contact details, saved model runs, and the separate finance test data. Source coverage is broader than the analyst’s qualified analytical capabilities.","note"));
  const supportProof=panel("Follow another finding","58 of 269 Vantara incidents map to Revenue Analytics, including 22 P1 cases. Inspect the linked records and see what the finding supports and what remains unknown.");supportProof.append(button("Inspect the support finding ↗",()=>navigate("investigation")));app.append(supportProof);
  app.append(contribution);
  const choices=element("div",undefined,"story-rows");
  [["01","Control where analysis happens","Sensitive sales pipelines, customer histories, and commercial terms may need to stay inside a company’s environment. Local inference gives a deployment choice; production identity and access controls still require implementation."],["02","Keep the intelligence replaceable","Models improve faster than business definitions change. Separate the model adapter from analytical tools and evidence contracts so a new candidate can be tested against the same work. Portability still has to be demonstrated."],["03","Make useful answers testable","A fluent answer is only part of the result. Check the figures, scope, requested parts, and source references; retain attempts so failures can be traced to data, tools, orchestration, or the model."]].forEach(([num,title,copy])=>{const row=element("section",undefined,"story-row");row.append(element("span",num,"story-number"),element("h3",title),element("p",copy));choices.append(row);});app.append(choices);
  app.append(sectionHead("Under the hood","Working components, explicit boundaries and repeatable checks. This is where the portfolio demonstrates the engineering behind the interface."));
  const architecture=element("div",undefined,"architecture-grid");
  [
    ["01 / MODEL BOUNDARY","Keep the intelligence replaceable","Apple Silicon + MLX/MLX-VLM serves the current local model through an OpenAI-compatible API. Application contracts sit above the provider adapter; each replacement must pass transport and answer-quality checks."],
    ["02 / DATA ENGINEERING","Establish a source of truth","Pinned synthetic JSON, checksum verification, normalized SQLite, validated relationships, and read-only queries. Report parity checks compare the database with the reference source; original record IDs survive the transformation."],
    ["03 / BUSINESS SEMANTICS","Define what the numbers mean","A governed catalog defines entities, joins, metric definitions, grain, units, time coverage, and enabled methods. It distinguishes a missing input from an unavailable calculation or an unsupported inference."],
    ["04 / RETRIEVAL · RAG","Find evidence in the documents","Scoped lexical retrieval returns approved document passages with section, line range, and SHA-256 provenance. Retrieval is one tool within the investigation; structured questions can use analytical queries instead."],
    ["05 / AGENT ORCHESTRATION","Turn language into tool use","Native tool calling reaches typed Python reports and parameterized SQL. An experimental Pydantic AI loop handles model-led tool selection. Host-side validation, source scope, and execution budgets constrain what runs."],
    ["06 / PROVENANCE · EVALS","Make the result reproducible","Content-addressed evidence, claim-level citations, calculation replay, durable run records and versioned scenarios. Checks cover figures, sources, scope, and answer completeness, alongside speed and memory."]
  ].forEach(([label,title,copy])=>{const card=element("section",undefined,"architecture-card");card.append(element("span",label,"architecture-label"),element("h3",title),element("p",copy));architecture.append(card);});app.append(architecture);
  const technical=element("details",undefined,"technical-notes");technical.append(element("summary","Inspect the technical design decisions"));
  const technicalBody=element("div",undefined,"technical-body");
  [
    ["Contracts beyond the prompt","Typed schemas and runtime validation check tool arguments and evidence references. Native structured output, tool calls and multi-turn continuation are tested at the actual serving boundary; a valid JSON shape alone cannot establish a correct business answer."],
    ["History that stays inspectable","Evidence retains source identity, method, arguments, results, and hashes. Event time and the time information became available are distinct. Saved attempts preserve their code and model identities so a later change cannot quietly rewrite an earlier result."],
    ["Evaluation that measures useful work","Versioned cases check requested parts, numerical correctness, citations, missing-data behavior, and inference limits. Deterministic replay checks the calculations independently. Resource measurements and focused regressions accompany model qualification; an official Enterprise-Bench score remains a future milestone."]
  ].forEach(([title,copy])=>technicalBody.append(panel(title,copy)));technical.append(technicalBody);app.append(technical);
  const portabilityHead=sectionHead("The opportunity ahead","Mac was the starting point because it was the hardware available to me. A reusable analyst engine could extend across models, deployment environments, and corporate functions as each is validated.");
  const portability=element("div",undefined,"portability-grid");
  [
    ["CHANGE THE MODEL","Keep the analytical foundation","Qualify a stronger local model, or add an approved hosted-provider adapter. Preserve business definitions, tools, and evidence contracts. Model-agnostic means replaceable with testing; compatibility is not automatic."],
    ["CHANGE THE HOST","Choose the deployment boundary","A company-managed server or other hardware is a future option. Replace the MLX serving layer, then validate dependencies, performance, and security. Linux/Windows packaging and private-cloud deployment have not been tested."],
    ["CHANGE THE FUNCTION","Reuse the investigation pattern","Revenue operations, finance, support, product, and contract analysis can share the pattern. Each needs its own approved data, semantic mappings, analytical tools, and evaluation cases. Forecasting would also need validated statistical methods."]
  ].forEach(([label,title,copy])=>{const card=element("section",undefined,"architecture-card");card.append(element("span",label,"architecture-label"),element("h3",title),element("p",copy));portability.append(card);});
  app.append(sectionHead("The implementation case","Start with one recurring management question, an accountable business owner, and approved sources. Establish the current process, then test whether the engine produces a useful answer with less review effort."));
  const next=element("ol",undefined,"implementation-steps");
  [
    ["Qualify the next model","Test language interpretation, compound requests, tool use, and evidence-backed answers against the retained cases. Measure memory, speed, and completeness before expanding the live experience."],
    ["Connect a company’s data and meaning","Start with approved read-only sources or reporting views. Map customer and product IDs, define metrics and fiscal periods, reconcile totals, and check coverage. Live refresh and generic onboarding remain to be built."],
    ["Prove transfer, then pilot","Freeze the shared core and test a second approved dataset with independently checked answers. Record the setup effort. Then run a narrow, human-reviewed company pilot with explicit success criteria."],
    ["Prepare for operational use","Implement identity, permissions, secrets handling, retention, and monitoring for the chosen environment. Validate refresh, schema changes, and recovery. Extend domain tools only when their calculations and evidence pass review."]
  ].forEach(([title,copy],i)=>{const row=element("li");row.append(element("span",String(i+1).padStart(2,"0"),"story-number"));const body=element("div");body.append(element("h3",title),element("p",copy));row.append(body);next.append(row);});app.append(next);
  const pilot=element("section",undefined,"pilot-measures");pilot.append(element("span","PROPOSED PILOT SCORECARD · BENEFITS HAVE NOT BEEN MEASURED","architecture-label"),element("h3","Define success before expanding."));
  const measures=element("dl");
  [["Time to a reviewed answer","Compare elapsed time and reviewer effort with the existing process on the same questions."],["Answer quality","Check calculations, question coverage, and appropriate uncertainty against independently reviewed answers."],["Evidence coverage","Measure whether material claims resolve to the correct records and reproducible calculations."],["Implementation effort","Track data mapping and setup effort, then test transfer to a second company without rewriting the shared core."]].forEach(([label,copy])=>{const item=element("div");item.append(element("dt",label),element("dd",copy));measures.append(item);});pilot.append(measures,element("p","Agree targets and review criteria with the pilot owner before testing. No time savings, financial return, or production readiness is claimed by this preview.","note"));app.append(pilot);
  app.append(portabilityHead,portability);
  const tuning=element("details",undefined,"technical-notes tuning-note");tuning.append(element("summary","Where fine-tuning could fit"),element("p","After selecting and qualifying a baseline, fine-tuning could improve question interpretation, tool selection, or answer style using separately permitted training examples. Retrieval and source connections supply current business facts. Held-out evaluations must show a benefit over the untuned baseline; Enterprise-Bench evaluation data must stay out of training. No fine-tuned model is claimed here."));app.append(tuning);
  const qualification=element("div",undefined,"qualification-note");qualification.append(element("span","CURRENT CHECKPOINT","architecture-label"),element("strong","A working foundation, with a clear qualification gap."),element("p","The local 27B baseline has passed selected tool and evidence tests. Reliable general business conversations have not been qualified, and model experimentation is paused. A stronger model or larger machine may help; neither guarantees the missing behavior. The public demo remains a synthetic, read-only preview, with consequential conclusions subject to human review."));app.append(qualification);
  const close=element("div",undefined,"overview-close");close.append(element("p","Start with the evidence. Explore the workspace, inspect a finding, or watch an investigation unfold."),button("Walk through the finding",()=>navigate("investigation"),"btn primary"),button("Watch the demos",()=>navigate("about")));app.append(close);
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
    matches(row,explore.facet,explore.value)&&matches(row,explore.facet2,explore.value2)&&
    matches(row,explore.facet3,explore.value3));
}
async function renderExplore() {
  const rows=await records(explore.category);
  if(currentView!=="explore")return;
  const info=categoryInfo[explore.category];app.replaceChildren(heading("THE DATA WORKSPACE","Explore the connected sample.","Search and filter the published index of all records in each selected collection. Open a row to inspect the fields included in this public preview."));
  const toolbar=element("div",undefined,"toolbar");
  toolbar.append(fieldSelect("Collection",Object.entries(categoryInfo).map(([key,item])=>[key,item.label]),explore.category,value=>{explore={category:value,query:"",facet:"",value:"",account:"",page:0};renderExplore();}));
  const search=element("div",undefined,"field search"),label=element("label","Search source index"),input=element("input");label.htmlFor="record-search";input.id="record-search";input.placeholder="Name, subject, ID…";input.value=explore.query;input.addEventListener("input",()=>{explore.query=input.value;explore.page=0;updateResults();});search.append(label,input);toolbar.append(search);
  const facets=Object.keys(summary.dimensions[explore.category]);
  toolbar.append(fieldSelect("Filter by",[["","Any dimension"],...facets.map(key=>[key,key.replaceAll("_"," ")])],explore.facet,value=>{explore.facet=value;explore.value="";explore.facet2="";explore.value2="";explore.facet3="";explore.value3="";explore.page=0;renderExplore();}));
  if(explore.facet){const values=summary.dimensions[explore.category][explore.facet];toolbar.append(fieldSelect("Value",[["","All values"],...Object.keys(values).sort().map(value=>[value,display(value)])],explore.value,value=>{explore.value=value;explore.page=0;renderExplore();}));}
  if(explore.facet && explore.value){
    toolbar.append(fieldSelect("And filter by",[["","No second filter"],...facets.filter(key=>key!==explore.facet).map(key=>[key,key.replaceAll("_"," ")])],explore.facet2||"",value=>{explore.facet2=value;explore.value2="";explore.facet3="";explore.value3="";explore.page=0;renderExplore();}));
    if(explore.facet2){const values=summary.dimensions[explore.category][explore.facet2];toolbar.append(fieldSelect("Second value",[["","All values"],...Object.keys(values).sort().map(value=>[value,display(value)])],explore.value2||"",value=>{explore.value2=value;explore.page=0;renderExplore();}));}
    if(explore.facet2 && explore.value2 && facets.length>2){
      toolbar.append(fieldSelect("Third filter",[["","No third filter"],...facets.filter(key=>key!==explore.facet&&key!==explore.facet2).map(key=>[key,key.replaceAll("_"," ")])],explore.facet3||"",value=>{explore.facet3=value;explore.value3="";explore.page=0;renderExplore();}));
      if(explore.facet3){const values=summary.dimensions[explore.category][explore.facet3];toolbar.append(fieldSelect("Third value",[["","All values"],...Object.keys(values).sort().map(value=>[value,display(value)])],explore.value3||"",value=>{explore.value3=value;explore.page=0;renderExplore();}));}
    }
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
  app.append(sectionHead("Four questions. Four decision paths.","Each 34-second video moves from a material answer through the breakdown and source record to a decision, proposed owner, test, and close-out measure. These are illustrated simulations, not live model runs or completed business actions."));
  const demos=element("div",undefined,"demo-grid");
  const demoNotes={
    support:["Finding: 269 of 783 Vantara tickets are incidents (34.4%). Revenue Analytics has the largest incident slice: 58 of 269 (21.6%), including 22 P1 incidents.","Drill-down: the video filters those 22 linked P1 records and opens TKT-22426. The 22 P1 cases span June 2024 through April 2026, and all are marked solved. This does not establish a current outage or recurring cause.","Decision: open a scoped reporting-quality review, not an emergency escalation based on historical volume alone.","Proposed owner and test: the support lead clusters the 22 P1 cases by date and symptom, then links confirmed product issues before asserting a pattern.","Close-out: after any approved fix, track recurrence and resolution quality. No fix or improvement has been measured by this demo.","Sources: ticket index, Vantara account ID, and component-to-product-area links."],
    contracts:["Finding: Enterprise versus Growth uptime is 99.95% versus 99.5%; P0 first-response target is 10 versus 30 minutes; P0 resolution target is 2 versus 8 hours.","Drill-down: the video opens matched section 3.2 in MSA-003 and MSA-004. Nine terms cover service, API, notice, and credits. The credit caps have different qualifying conditions.","Decision: prepare a tier-variance checklist, not a claim that any customer agreement was breached.","Proposed owners and test: legal and the service owner compare signed terms and amendments with actual SLA records and applicable remedy conditions.","Close-out: approve any wording or process change, then monitor compliance. These templates are not executed customer agreements, and no breach is established.","Sources: MSA-003 and MSA-004, sections 2, 3, 4, 5, 8, and 11."],
    regions:["Finding: East has $217.590M in recorded won ACV versus West's $173.875M, a $43.715M gap. East has 365 more marked-won records, but West's marked-won share is 66.9% versus 66.2% in East.","Drill-down: the video opens OPP-040 and extends the comparison to 14 East versus 11 West indexed accounts. West has 1.7% more won ACV per indexed account. Different customer/prospect mixes prevent a productivity conclusion.","Decision: hold East's playbook rollout in West. The headline does not establish East's effectiveness advantage.","Proposed owner and test: sales operations builds matched, dated cohorts and compares opportunity supply, win conversion, and rep capacity.","Close-out: pilot a coverage change only for a verified supply gap, then measure against a baseline. No pilot result or staffing return is claimed.","Sources: East and West account and opportunity indexes. Recorded ACV is not revenue or cash."],
    issues:["Finding: 1,360 issues are marked high/highest priority, but only 20 of them are in progress. Checkout, Billing, and Invoicing each have six of those 20.","Drill-down: the video filters the six active Checkout records and opens ISS-001. Across the 20 active records, four are typed as bugs, nine as tasks, and seven as stories.","Decision: triage the active queue, not the historical priority total. The public index lacks customer-impact measures.","Proposed owner and test: the product owner checks age, severity, affected accounts, and linked incidents, then ranks work by current impact.","Close-out: approve remediation, then track linked incidents and closure. No risk reduction has been measured by this demo.","Sources: product-issue index and component-to-product-area links."]
  };
  [
    ["support","01 · Support concentration","Seven product-area rows distinguish volume, P1 priority, and solved status."],
    ["contracts","02 · Agreement comparison","Nine matched T&C clauses show operational and credit differences."],
    ["regions","03 · Regional performance","Value, volume, share, and opportunity mix test an outperformance claim."],
    ["issues","04 · Product issue priorities","Historical high-priority volume is separated from the active queue."]
  ].forEach(([key,title,description])=>{
    const card=element("section",undefined,"demo-card");card.id=`demo-${key}`;
    const visual=element("video");visual.className="tour-video";visual.controls=true;visual.playsInline=true;visual.preload="metadata";visual.poster=`./demo-${key}.png?v=21`;visual.setAttribute("aria-label",`${title}, 34-second simulated analyst interaction`);
    const movie=element("source");movie.src=`./demo-${key}.mp4?v=21`;movie.type="video/mp4";visual.append(movie,element("p","Your browser cannot play this demo. Read the finding and sources below."));
    const transcript=element("details",undefined,"demo-transcript");transcript.append(element("summary","Read the finding and sources"));demoNotes[key].forEach(line=>transcript.append(element("p",line)));
    const mediaStatus=element("p","If the video cannot load, open the written finding and sources below.","demo-media-status");
    visual.addEventListener("error",()=>{mediaStatus.textContent="Video unavailable. The written finding and sources are open below.";mediaStatus.classList.add("show");transcript.open=true;});
    card.append(visual,mediaStatus,element("h3",title),element("p",description),transcript);demos.append(card);
  });app.append(demos);
  app.append(sectionHead("What is built and what is next","The local engine, the public preview, and the intended product are distinct."));
  const split=element("div",undefined,"split");
  const what=panel("Built and inspectable","The local prototype has a model-swappable boundary, bounded analytical tools, source provenance, and evaluation checks. This public preview lets visitors explore seven synthetic indexes and drill into one precomputed finding.");
  const later=panel("Not yet qualified","Open-ended enterprise-grade reasoning, live public asking, production security, cross-source causal analysis, and live-company connections remain future work. The videos illustrate answers; they are not model-run recordings.");split.append(what,later);app.append(split);
  app.append(sectionHead("The architecture in plain language","The model handles language; deterministic tools handle numbers; provenance keeps both accountable."));
  const stages=element("div",undefined,"timeline");
  [["01","Connect approved sources","Each company implementation needs a scoped data setup, permissions, metadata, and source checks."],["02","Investigate a question","The analyst plans, selects approved tools and sources, tests hypotheses, and keeps scope visible."],["03","Produce a reviewable brief","Facts, findings, uncertainty, implications, recommendations, calculations, and citations remain distinguishable."],["04","Let people verify","A business user can move from a high-level conclusion into records and methods, or explore the dashboard independently."]].forEach(([n,title,copy])=>{const card=panel(title,copy);card.prepend(element("span",n,"number"));stages.append(card);});app.append(stages);
  const guide=panel("What you can verify here","All four demos use facts checked against the approved synthetic snapshot. The contract video publishes nine extracted terms per tier, not document bodies. In the working dashboard, you can explore seven source indexes and open the precomputed Vantara finding; no live model request runs here. The margin question remains out of scope because this public projection lacks matched revenue and direct costs.");guide.append(button("Start exploring",()=>navigate("overview"),"btn primary"));app.append(guide);
  app.append(element("p",`Data source: DevRev Enterprise-Bench / Maple Payments, commit ${summary.source_commit}. Public indexes are generated from a checksum-verified synthetic snapshot. The benchmark's hidden tasks, judging, generated finance scenarios, and saved model attempts are not distributed.`,"note"));
}

document.querySelectorAll(".nav-item").forEach(item=>item.addEventListener("click",()=>navigate(item.dataset.view)));
window.addEventListener("hashchange",()=>{const view=location.hash.slice(1);if(["overview","explore","investigation","about"].includes(view)&&view!==currentView)navigate(view);});
document.querySelector("#dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
fetch("./data/summary.json").then(response=>{if(!response.ok)throw Error("Snapshot unavailable");return response.json();}).then(value=>{summary=value;const view=location.hash.slice(1);navigate(["overview","explore","investigation","about"].includes(view)?view:"overview");}).catch(error=>app.replaceChildren(element("p",error.message+". Please reload the preview.","loading")));
