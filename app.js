"use strict";

const app = document.querySelector("#app");
const dialog = document.querySelector("#record-dialog");
const categoryInfo = {
  accounts: {label:"Accounts", description:"Customers and prospects", id:"account_id", name:"account_name", columns:["account_name","region","industry","type"]},
  opportunities: {label:"Opportunities", description:"Sales pipeline and recorded ACV", id:"opportunity_id", name:"opportunity_name", columns:["opportunity_name","account_region","stage","opportunity_type"]},
  tickets: {label:"Support Tickets", description:"Support demand and resolution states", id:"ticket_id", name:"subject", columns:["subject","account_region","ticket_type","status"]},
  issues: {label:"Product Issues", description:"Recorded product work", id:"issue_id", name:"title", columns:["title","issue_type","priority","status"]},
  articles: {label:"Knowledge Articles", description:"Published guidance index", id:"article_id", name:"title", columns:["title","status","audience"]},
  documents: {label:"Internal Documents", description:"Policy and agreement index", id:"document_id", name:"title", columns:["title","status","audience"]},
  transcripts: {label:"Call Transcripts", description:"Meeting index", id:"transcript_id", name:"title", columns:["title","call_type","account_region"]}
};
let summary;
const cache = new Map();
let explore = {category:"accounts",query:"",facet:"",value:"",account:"",page:0};
let currentView="overview";
let exploreRender=0;
let navigationCycle=0;
const number = value => new Intl.NumberFormat("en-US").format(value);
const display = value => Array.isArray(value) ? value.join(", ") || "Not recorded" : value === null || value === undefined || value === "" ? "Not recorded" : String(value).replaceAll("_"," ");
const titleText = value => String(value).replace(/[\p{L}\p{N}][\p{L}\p{M}\p{N}'’]*/gu,word=>word.charAt(0).toLocaleUpperCase("en-US")+word.slice(1));
const titleTags=new Set(["h1","h2","h3","h4","summary","label","caption","th","dt","strong"]);
const element = (tag, content, className) => {const el=document.createElement(tag);if(content!==undefined){const isTitle=(titleTags.has(tag)||["maker-line","workflow-question","scene-decision-title"].includes(className))&&className!=="source-record-heading";el.textContent=isTitle?titleText(content):content;}if(className)el.className=className;return el;};
const button = (label, action, className="btn") => {const el=element("button",className==="record-button"?label:titleText(label),className);el.addEventListener("click",action);return el;};
const heading = (eyebrow,title,copy) => {const box=element("div");box.append(element("div",eyebrow,"eyebrow"),element("h1",title),element("p",copy,"hero-copy"));return box;};
const sectionHead = (title,copy) => {const box=element("div",undefined,"section-head");box.append(element("h2",title),element("p",copy));return box;};
const panel = (title,copy) => {const box=element("section",undefined,"panel");box.append(element("h3",title));if(copy)box.append(element("p",copy));return box;};
const sourceHref = "https://github.com/devrev/enterprise-bench/tree/";
const views={overview:[renderOverview,"Product Overview"],why:[renderWhy,"Why It Exists"],how:[renderHow,"How It Works"],workflows:[renderWorkflows,"Sample Workflows"],explore:[renderExplore,"Data Workspace"],investigation:[renderInvestigation,"Visual Support Workflow"],case:[renderCase,"End-to-End Case Sample"],about:[renderAbout,"Demo Videos"],engineering:[renderEngineering,"Engineering Deep Dive"],possibilities:[renderPossibilities,"Business Applications"],scale:[renderScale,"Enterprise Scale"],roadmap:[renderRoadmap,"Roadmap and Implementation"]};

function closeNavigation(){document.querySelectorAll(".site-menu[open]").forEach(menu=>menu.open=false);document.querySelector(".site-header").classList.remove("menu-open");document.querySelector("#menu-toggle").setAttribute("aria-expanded","false");}
function workflowContext(kind){const box=element("div",undefined,"workflow-context");box.append(button("← Two sample workflows",()=>navigate("workflows")),element("span",kind==="visual"?"Visual path · follow the data and inspect the records":"Conversational path · an annotated sequence of questions and findings"));app.prepend(box);}

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
  if(!Object.hasOwn(views,view))view="overview";
  const navigation=++navigationCycle;
  currentView=view;
  closeNavigation();
  document.querySelectorAll("[data-view]").forEach(item=>{item.classList.toggle("active",item.dataset.view===view);if(item.dataset.view===view)item.setAttribute("aria-current","page");else item.removeAttribute("aria-current");});
  document.querySelectorAll(".site-menu").forEach(menu=>menu.classList.toggle("current",menu.dataset.pages.split(" ").includes(view)));
  document.querySelector("#view-label").textContent=titleText(views[view][1]);document.title=titleText(views[view][1])+" | Business Analyst";app.dataset.page=view;app.setAttribute("aria-busy","true");
  location.hash=view;
  app.replaceChildren(element("div","Opening view…","loading"));
  Promise.resolve().then(()=>{if(navigation===navigationCycle)return views[view][0]();}).then(()=>{if(navigation===navigationCycle){app.setAttribute("aria-busy","false");const title=app.querySelector("h1");if(title){title.tabIndex=-1;title.focus({preventScroll:true});}}})
    .catch(error=>{if(navigation===navigationCycle){app.setAttribute("aria-busy","false");app.replaceChildren(element("p",error.message+" Please reload the page.","loading"));}});
  window.scrollTo({top:0,behavior:"auto"});
}


function renderCase() {
  app.replaceChildren(heading("VERIFIED SYNTHETIC CASE","End-to-End Case Sample","Follow one management question from source-backed comparison through follow-up analysis, a bounded recommendation, and an operational decision gate."));
  workflowContext("conversation");
  const question=element("section",undefined,"starting-question");question.append(element("span","STARTING QUESTION","architecture-label"),element("blockquote","East leads on contract value. Should West copy its approach?"));app.append(question);
  app.append(element("p","This is an annotated conversational workflow: each follow-up changes the next analytical check. The public page presents verified, precomputed findings; it does not accept new questions or run a model.","workflow-caption"));
  const businessCase=element("section",undefined,"business-case");businessCase.id="regional-case";
  businessCase.append(element("span","END-TO-END CASE · VERIFIED SYNTHETIC RECORDS","architecture-label"),element("h2","East leads in total. That is not a reason to copy its playbook."),element("p","We followed the question from the headline through deal size, sales motion, account coverage, and a decision. The records support a narrower action: commission a comparable pipeline review, not a sales reorganization.","case-intro"));
  const exhibit=element("div",undefined,"case-table-wrap"),table=element("table");table.append(element("caption","East and West · all recorded opportunities in the public snapshot"));
  const head=element("thead"),header=element("tr");["Measure","East","West"].forEach(label=>{const cell=element("th",label);cell.scope="col";header.append(cell);});head.append(header);table.append(head);
  const body=element("tbody");
  [["Recorded won ACV (US dollars)","$217.590M","$173.875M"],["Opportunities marked won","1,923","1,558"],["All recorded opportunities","2,907","2,330"],["Share of records marked won","66.2%","66.9%"],["Indexed accounts","14","11"],["Won ACV per indexed account","$15.542M","$15.807M"]].forEach(([label,east,west])=>{const row=element("tr"),name=element("th",label);name.scope="row";row.append(name,element("td",east),element("td",west));body.append(row);});table.append(body);exhibit.append(table);businessCase.append(exhibit);
  businessCase.append(element("h3","Follow-up questions change the decision.","case-subhead"));
  const caseReading=element("div",undefined,"case-reading");
  [["Is the gap volume or deal size?","East has $43.715M more recorded won ACV and 365 more won records. At West’s average won ACV, those 365 records account for about $40.7M, or 93% of the gap. Average won ACV is $113.2k in East and $111.6k in West. This is arithmetic, not a cause."],["Is one sales motion driving it?","The won ACV gap appears across expansion ($17.0M), renewal ($16.1M), and new business ($10.59M). One East won record worth $0.03M has no recorded opportunity type. The split does not point to a single motion."],["Is East closing more effectively?","West has a 66.9% marked-won share versus East’s 66.2% across all recorded opportunities. That 0.7 percentage point edge is a snapshot stage share, not a time-matched conversion rate. These records cannot establish which team sells better."],["Does account coverage change the reading?","Yes. East has 14 indexed accounts to West’s 11. East’s $15.542M in won ACV per indexed account is slightly below West’s $15.807M. East also has 13 prospect accounts and one customer, while West has three prospects and eight customers. Account mix differs sharply, so this is not a productivity or territory-potential measure."]].forEach(([label,copy],index)=>caseReading.append(findingCheck(label,copy,index===0)));businessCase.append(caseReading);
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
  caseActions.append(button("Watch the regional investigation",()=>{navigate("about");requestAnimationFrame(()=>{document.querySelector('[data-demo="regions"]')?.click();const demo=document.querySelector("#demo-regions");demo?.scrollIntoView({behavior:"smooth",block:"start"});demo?.querySelector("video")?.play().catch(()=>{});});}));businessCase.append(caseActions);app.append(businessCase);
  pageNext("Watch the four investigations","about","See support, contracts, sales, and product priorities in the video collection.");
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
  const renderId=++exploreRender;
  const rows=await records(explore.category);
  if(currentView!=="explore"||renderId!==exploreRender)return;
  const info=categoryInfo[explore.category];app.replaceChildren(heading("THE DATA WORKSPACE","Explore the connected sample.","Choose a collection, combine filters, and open a record. This workspace contains a synthetic snapshot, not live company data."));
  appendDataCoverage();
  const toolbar=element("div",undefined,"toolbar");
  toolbar.append(fieldSelect("Collection",Object.entries(categoryInfo).map(([key,item])=>[key,item.label]),explore.category,value=>{explore={category:value,query:"",facet:"",value:"",account:"",page:0};renderExplore();}));
  const search=element("div",undefined,"field search"),label=element("label","Search Records"),input=element("input");label.htmlFor="record-search";input.id="record-search";input.placeholder="Name, subject, ID…";input.value=explore.query;input.addEventListener("input",()=>{explore.query=input.value;explore.page=0;updateResults();});search.append(label,input);toolbar.append(search);
  const facets=Object.keys(summary.dimensions[explore.category]);
  toolbar.append(fieldSelect("Filter by",[["","Choose A Field"],...facets.map(key=>[key,key.replaceAll("_"," ")])],explore.facet,value=>{explore.facet=value;explore.value="";explore.facet2="";explore.value2="";explore.facet3="";explore.value3="";explore.page=0;renderExplore();}));
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
    if(currentView!=="explore"||renderId!==exploreRender)return;
    toolbar.append(fieldSelect("Account",[["","All accounts"],...accounts.map(item=>[item.account_id,item.account_name]).sort((a,b)=>a[1].localeCompare(b[1]))],explore.account,value=>{explore.account=value;explore.page=0;renderExplore();}));
  }
  app.append(toolbar);
  const meta=element("div",undefined,"result-meta"),container=element("div"),pager=element("div",undefined,"pager");app.append(meta,container,pager);
  function updateResults(){
    const found=matchingRows(rows),start=explore.page*50,pageRows=found.slice(start,start+50);
    meta.replaceChildren(element("span",`${number(found.length)} matching records · ${number(rows.length)} in the connected ${info.label.toLowerCase()} index`),element("strong","Synthetic Snapshot"));
    const shell=element("div",undefined,"table-shell"),table=element("table"),thead=element("thead"),tr=element("tr");
    info.columns.forEach(key=>tr.append(element("th",key.replaceAll("_"," "))));thead.append(tr);table.append(thead);
    const body=element("tbody");pageRows.forEach(row=>{const tr=element("tr");info.columns.forEach((key,i)=>{const td=element("td");if(i===0)td.append(button(display(row[key]),()=>inspectRecord(explore.category,row),"record-button"));else td.append(element("span",display(row[key]),i===2?"pill":""));tr.append(td);});body.append(tr);});table.append(body);shell.append(table);container.replaceChildren(shell);
    pager.replaceChildren(button("Previous",()=>{explore.page--;updateResults();}),element("span",found.length?`${start+1}–${Math.min(start+50,found.length)} of ${number(found.length)}`:"No matching records"),button("Next",()=>{explore.page++;updateResults();}));
    pager.firstChild.disabled=explore.page===0;pager.lastChild.disabled=start+50>=found.length;
  }
  updateResults();
  app.append(element("p","Search covers the included public index fields, not hidden source descriptions or document bodies. Opportunity ACV is recorded source data, not revenue, cash, or a forecast. Product areas are derived only from explicit component-parent links; one record can appear in more than one area.","note"));
  const provenance=panel("Source and scope","Every row above comes from the pinned DevRev Enterprise-Bench / Maple Payments synthetic snapshot. This site distributes a limited field projection for all seven displayed collections, not the original files or model output.");provenance.append(element("p",`Source commit ${summary.source_commit} · Manifest ${summary.manifest_sha256.slice(0,16)}…`,"note"));app.append(provenance);
}

function inspectRecord(category,row) {
  const box=document.querySelector("#dialog-content");box.replaceChildren(element("div","SOURCE RECORD · "+categoryInfo[category].label.toUpperCase(),"eyebrow"),element("h2",categoryInfo[category].label+" · "+display(row[categoryInfo[category].id]),"source-record-heading"),element("blockquote",display(row[categoryInfo[category].name]),"source-title-quote"));
  Object.entries(row).forEach(([key,value])=>{const line=element("div",undefined,"record-kv");line.append(element("b",titleText(key.replaceAll("_"," ")).replace(/\bId\b/g,"ID").replace(/\bAcv\b/g,"ACV")),element("span",display(value)));box.append(line);});
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
  const openTickets=(area,p1=false)=>{explore={category:"tickets",query:"",facet:"ticket_type",value:"incident",facet2:area?"product_areas":"",value2:area||"",facet3:p1?"priority":"",value3:p1?"p1":"",account:vantara.account_id,page:0};navigate("explore");};
  app.replaceChildren(heading("GUIDED INVESTIGATION · VERIFIED SYNTHETIC RECORDS","Where should Vantara’s support team focus?","Follow the support question through product-area comparison, priority, repeated subjects, source inspection, and a decision. These calculations use the published snapshot."));
  workflowContext("visual");
  app.append(element("p","This workflow starts with an account and a visible breakdown. Choose a product area, narrow to P1 cases, and open source records yourself. The findings and review plan below show how a visual exploration can lead to a supported decision.","workflow-caption"));
  const answer=element("section",undefined,"answer");answer.append(element("div","QUESTION · “WHAT IS HAPPENING IN VANTARA SUPPORT?”","eyebrow"),element("h2","Review reporting quality, starting with the 22 P1 cases."),element("p",`Revenue Analytics has ${number(revenueAnalytics.length)} of ${number(incidents.length)} incidents (21.6%), the largest product-area group. Invoicing is close behind with 53 incidents and 21 P1 cases, versus reporting’s 58 and 22. All 269 incidents are marked solved. The supported next step is a historical quality review; the snapshot does not establish a current outage or a cause.`));
  const grid=element("div",undefined,"answer-grid");[[linked.length,"All linked support tickets"],[incidents.length,"Incident tickets"],[priorityOne.length,"Reporting P1 cases to review"]].forEach(([value,label])=>{const metric=element("div",undefined,"answer-metric");metric.append(element("strong",number(value)),element("span",label));grid.append(metric);});answer.append(grid,button(`Inspect the ${number(revenueAnalytics.length)} underlying records`,()=>openTickets("Revenue Analytics & Reporting"),"btn"),button("Review the 22 P1 cases",()=>openTickets("Revenue Analytics & Reporting",true),"btn"));app.append(answer);
  app.append(sectionHead("Is reporting the only concentration?","Compare the full account population before deciding where to focus. Each row links to its underlying incident records."));
  const exhibit=element("div",undefined,"case-table-wrap"),table=element("table");table.append(element("caption","Vantara · all recorded incidents · P1 is the source’s priority label"));
  const head=element("thead"),header=element("tr");["Product area","Incidents","P1"].forEach(label=>{const cell=element("th",label);cell.scope="col";header.append(cell);});head.append(header);table.append(head);
  const body=element("tbody"),areas=[...new Set(incidents.flatMap(row=>row.product_areas))].map(area=>({area,rows:incidents.filter(row=>row.product_areas.includes(area))})).sort((a,b)=>b.rows.length-a.rows.length);
  areas.forEach(({area,rows})=>{const row=element("tr"),name=element("th");name.scope="row";name.append(button(area,()=>openTickets(area),"record-button"));row.append(name,element("td",number(rows.length)),element("td",number(rows.filter(item=>item.priority==="p1").length)));body.append(row);});
  const unmapped=incidents.filter(row=>!row.product_areas.length);const unmappedRow=element("tr");unmappedRow.append(element("th","No recorded product area"),element("td",number(unmapped.length)),element("td",number(unmapped.filter(row=>row.priority==="p1").length)));body.append(unmappedRow);table.append(body);exhibit.append(table);app.append(exhibit);
  app.append(element("p","Reporting leads Invoicing by five incidents and one P1 case. That small gap supports reviewing both areas; it does not establish that reporting has greater business impact. Five incidents have no recorded product area. This snapshot assigns at most one product area to each incident.","note"));
  app.append(sectionHead("What do the follow-up checks reveal?","Priority, timing, and repeated titles narrow the review. They do not substitute for resolution notes or confirmed issue links."));
  const details=element("div",undefined,"followup-checks");
  details.append(findingCheck("How concentrated is the priority?","22 of 58 reporting incidents are P1 (37.9%). Invoicing has 21 P1 cases among 53 incidents (39.6%). Reporting is the largest count, while Invoicing has a slightly higher P1 share. The account has 94 P1 incidents in total.",true));
  details.append(findingCheck("Is this a current escalation?","The 22 reporting P1 cases were created from June 5, 2024 through April 29, 2026, and all are marked solved in the snapshot. Historical volume alone cannot establish a current outage. Closure timestamps and customer confirmation are needed to assess resolution quality."));
  details.append(findingCheck("Is there a repeat signal?","Two reporting P1 tickets share the title “Dashboard loading slowly for large date ranges”: TKT-30404 (November 30, 2025) and TKT-24984 (January 18, 2026). This is a repeated recorded subject. Confirm affected workflows, symptoms, and resolution notes before treating the tickets as the same underlying problem."));
  details.append(findingCheck("Do the labels tell the whole story?","Other reporting P1 subjects include requests for SLA documentation and receipt-template customization. Review ticket classification and product mapping alongside symptoms. A product-area tag is a route to investigation; it does not prove a reporting defect."));app.append(details);
  app.append(sectionHead("Open the records behind the reading","Inspect the two matching dashboard subjects and a separate dashboard/API discrepancy. Their public fields show what was actually recorded."));
  const recordCards=element("div",undefined,"detail-grid");
  ["TKT-30404","TKT-24984","TKT-22426"].forEach(id=>{const row=priorityOne.find(item=>item.ticket_id===id);if(!row)throw new Error("A cited reporting ticket is missing.");const card=panel("Source Record "+id,`${row.created_at.slice(0,10)} · P1 · ${row.status}`);card.append(element("blockquote",row.subject,"source-title-quote"),button("Inspect This Source Record ↗",()=>inspectRecord("tickets",row),"record-button"));recordCards.append(card);});app.append(recordCards);
  const decision=element("div",undefined,"case-decision");decision.append(element("span","DECISION BRIEF · CURRENT EVIDENCE","architecture-label"),element("h3","Commission a reporting-quality review, with Invoicing as a comparison."),element("p","Proposed owner: the support lead. Start with the 22 reporting P1 tickets, validate classification, and compare the 21 Invoicing P1 tickets. Give the repeated dashboard-slowness pair a symptom review. Request a linked product issue only where the evidence supports one. These records support a review order, not an emergency escalation, staffing change, or estimate of lost revenue."));app.append(decision);
  app.append(sectionHead("Take the review through to an outcome","The record checks above are complete in this demonstration. The operational steps below are a proposed handoff for human approval."));
  const actionPath=element("div",undefined,"case-action-path");
  [["01 / ESTABLISH WHAT HAPPENED","The support lead requests ticket histories, closure dates, resolution notes, customer confirmation, and explicit product-issue IDs. Group validated symptoms within a defined period and compare reporting with Invoicing. Check the priority and product-area labels before using them to allocate work."],["02 / MAKE THE DECISION","If matching symptoms and issue history establish a shared defect, the product owner approves a targeted fix and its acceptance checks. If classification is inconsistent, correct the mapping and rerun the comparison. If the records describe separate resolved events, document that result and keep the current support process."],["03 / VERIFY AND CLOSE","For an approved change, define a baseline, observation window, and success criteria: repeat incidents per relevant usage, reopened cases, time to confirmed resolution, and customer confirmation. Compare with the same population after the change. Keep, revise, or stop the intervention based on the results. No fix, business impact, or improvement has been measured here."]].forEach(([label,copy])=>{const item=element("section");item.append(element("span",label,"architecture-label"),element("p",copy));actionPath.append(item);});app.append(actionPath);
  app.append(sectionHead("How to reproduce this finding","Use the same account, incident type, product area, and priority. Counts refer to ticket records, not unique defects or affected customers."));
  const source=panel("Cited synthetic sources");
  [["Vantara incident population",`${number(incidents.length)} incidents · account ${vantara.account_id}`,()=>openTickets("")],["Reporting P1 review set","22 tickets · incident + product area + priority",()=>openTickets("Revenue Analytics & Reporting",true)],["Invoicing P1 comparison","21 tickets · same account and incident type",()=>openTickets("Invoicing & Payment Lifecycle",true)],["Vantara account record",`${vantara.account_id} · ${vantara.region}`,()=>inspectRecord("accounts",vantara)]].forEach(([label,detail,action])=>{const line=element("div",undefined,"source-line");line.append(element("span",`${label} · ${detail}`),button("Open ↗",action,"record-button"));source.append(line);});app.append(source);
  app.append(element("p","Method: filter ticket account_id = ACC-013 and ticket_type = incident; group by the published component-to-product-area mapping; count priority = p1 within each group. Shares use each area’s incident total. Match repeated subjects exactly and inspect their recorded dates. The public index lacks ticket bodies, resolution histories, explicit ticket-to-issue links, usage denominators, and matched business outcomes. It cannot establish cause, recurrence of a confirmed defect, SLA performance, or financial impact. Human review is required before acting.","note"));
  pageNext("Now let the question lead the investigation","case","Follow East and West through a sequence of management questions, findings, and a decision.");
}

function renderAbout(){
  app.replaceChildren(heading("ILLUSTRATED INVESTIGATIONS","Watch the questions become findings.","Four 34-second simulations: a question, a finding, the supporting records, and a next decision. Synthetic data; no live model call."));

  const workspace=element("div",undefined,"demo-workspace"),playlist=element("div",undefined,"demo-playlist"),demos=element("div",undefined,"demo-grid");playlist.setAttribute("role","group");playlist.setAttribute("aria-label","Choose a demo video");const demoCards=[],demoVideos=[],demoButtons=[];
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
  ].forEach(([key,title,description],index)=>{
    const card=element("section",undefined,"demo-card");card.id=`demo-${key}`;
    const visual=element("video");visual.className="tour-video";visual.controls=true;visual.playsInline=true;visual.preload="metadata";visual.poster=`./demo-${key}.png?v=21`;visual.setAttribute("aria-label",`${title}, 34-second simulated analyst interaction`);
    const movie=element("source");movie.src=`./demo-${key}.mp4?v=21`;movie.type="video/mp4";visual.append(movie,element("p","Your browser cannot play this demo. Read the finding and sources below."));
    const transcript=element("details",undefined,"demo-transcript");transcript.append(element("summary","Read the finding and sources"));demoNotes[key].forEach(line=>transcript.append(element("p",line)));
    const mediaStatus=element("p","If the video cannot load, open the written finding and sources below.","demo-media-status");
    visual.addEventListener("error",()=>{mediaStatus.textContent="Video unavailable. The written finding and sources are open below.";mediaStatus.classList.add("show");transcript.open=true;});
    card.append(visual,mediaStatus,element("h3",title),element("p",description),transcript);card.hidden=index!==0;demoCards.push(card);demoVideos.push(visual);demos.append(card);
    const choice=button(title,()=>{demoCards.forEach((item,i)=>item.hidden=i!==index);demoVideos.forEach((video,i)=>{if(i!==index)video.pause();});demoButtons.forEach((item,i)=>{item.classList.toggle("active",i===index);item.setAttribute("aria-pressed",String(i===index));});},"demo-choice"+(index===0?" active":""));choice.dataset.demo=key;choice.setAttribute("aria-pressed",String(index===0));demoButtons.push(choice);playlist.append(choice);
    const actions=element("div",undefined,"actions");if(key==="support"||key==="regions")actions.append(button("Open the full "+(key==="support"?"visual workflow":"conversational case")+" ↗",()=>navigate(key==="support"?"investigation":"case")));else actions.append(button("Explore the "+(key==="contracts"?"document index":"product issues")+" ↗",()=>{explore={category:key==="contracts"?"documents":"issues",query:"",facet:"",value:"",account:"",page:0};navigate("explore");}));card.append(actions);
  });workspace.append(playlist,demos);app.append(workspace);
  const guide=panel("What you can verify here","All four demos use facts checked against the approved synthetic snapshot. The contract video publishes nine extracted terms per tier, not document bodies. Explore seven source indexes and open two precomputed workflows. No live model request runs here. The margin question remains out of scope because this public projection lacks matched revenue and direct costs.");guide.append(button("Choose a workflow",()=>navigate("workflows"),"btn primary"),button("How the engine works",()=>navigate("how")));const publication=deeper("Demo Scope And Source Coverage",guide);app.append(publication);
  publication.append(element("p",`Data source: DevRev Enterprise-Bench / Maple Payments, commit ${summary.source_commit}. Public indexes are generated from a checksum-verified synthetic snapshot. The benchmark's hidden tasks, judging, generated finance scenarios, and saved model attempts are not distributed.`,"note"));
  pageNext("Inspect the engineering behind the experience","engineering","Go deeper into serving, orchestration, analytical tools, provenance, and evaluation.");
}

document.querySelectorAll("[data-view]").forEach(item=>item.addEventListener("click",event=>{event.preventDefault();navigate(item.dataset.view);}));
document.querySelector("#menu-toggle").addEventListener("click",()=>{const header=document.querySelector(".site-header");const open=header.classList.toggle("menu-open");document.querySelector("#menu-toggle").setAttribute("aria-expanded",String(open));});
document.querySelectorAll(".site-menu").forEach(menu=>menu.addEventListener("toggle",()=>{if(menu.open)document.querySelectorAll(".site-menu").forEach(other=>{if(other!==menu)other.open=false;});}));
document.addEventListener("click",event=>{if(!event.target.closest(".site-menu"))document.querySelectorAll(".site-menu").forEach(menu=>menu.open=false);});
document.addEventListener("keydown",event=>{if(event.key==="Escape"){const open=document.querySelector(".site-header").classList.contains("menu-open");closeNavigation();if(open)document.querySelector("#menu-toggle").focus();}});
window.addEventListener("hashchange",()=>{const view=location.hash.slice(1);if(Object.hasOwn(views,view)&&view!==currentView)navigate(view);});
document.querySelector("#dialog-close").addEventListener("click",()=>dialog.close());
dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();});
fetch("./data/summary.json").then(response=>{if(!response.ok)throw Error("Snapshot unavailable");return response.json();}).then(value=>{summary=value;const view=location.hash.slice(1);navigate(Object.hasOwn(views,view)?view:"overview");}).catch(error=>app.replaceChildren(element("p",error.message+". Please reload the preview.","loading")));
