"use strict";

// Product narrative stays separate from the record explorer and verified workflow calculations.
function storyLink(label,href){const link=element("a",label,"text-link");link.href=href;link.target="_blank";link.rel="noreferrer";return link;}
function findingCheck(title,copy,open=false){const item=element("details",undefined,"finding-check");item.open=open;item.append(element("summary",title),element("p",copy));return item;}
function deeper(label,...content){const section=element("details",undefined,"technical-notes visitor-detail");section.append(element("summary",label),...content);return section;}
function chapterSummary(step,title){const summary=element("summary");summary.append(element("span",step,"chapter-number"),element("span",sentenceText(title)));return summary;}
function pageNext(label,view,copy){const next=element("section",undefined,"next-page");next.append(element("div","CONTINUE EXPLORING","eyebrow"),element("h2",label),element("p",copy),button(views[view][1]+" ↗",()=>navigate(view),"btn primary"));app.append(next);}
function storyRows(rows){const box=element("div",undefined,"story-rows");rows.forEach(([title,copy],i)=>{const row=element("section",undefined,"story-row");row.append(element("span",String(i+1).padStart(2,"0"),"story-number"),element("h3",title),element("p",copy));box.append(row);});return box;}
function workflowCards(){const cards=element("div",undefined,"workflow-grid");[
  ["VISUAL EXPLORATION","Start with the data.","Where should Vantara’s support team focus?","Compare six product areas, inspect priority and timing, open individual tickets, and follow the evidence to a review decision.","58 reporting incidents · 22 tagged P1 priority","investigation","Open the visual workflow"],
  ["CONVERSATIONAL INVESTIGATION","Start with the question.","Should West copy East’s sales approach?","Follow a chain of management questions through volume, deal size, sales motion, and account mix before deciding what to do.","$43.715M contract-value gap · follow-ups change the decision","case","Open the end-to-end case"]
].forEach(([label,title,question,copy,proof,view,cta])=>{const card=element("section",undefined,"workflow-card");card.append(element("span",label,"architecture-label"),element("h3",title),element("strong",question,"workflow-question"),element("p",copy),element("p",proof,"workflow-proof"),button(cta+" ↗",()=>navigate(view),"btn primary"));cards.append(card);});return cards;}

function openCollection(category){explore={category,query:"",facet:"",value:"",account:"",page:0};navigate("explore");}
function manualSourceSection(){
  const section=element("section",undefined,"home-section manual-source-section");section.dataset.purpose="manual-exploration";
  const intro=element("div",undefined,"manual-intro");intro.append(element("span","THE DATA WORKSPACE","architecture-label"),element("h2","Explore Without Asking the AI"),element("p","Compare opportunity values, support demand, and product-issue counts in interactive charts. Select a bar to inspect its records, or browse any of the seven synthetic collections."),button("Open the Data Workspace ↗",()=>navigate("explore"),"btn primary"));
  const collections=element("div",undefined,"source-gallery");Object.entries(categoryInfo).forEach(([key,info])=>{const item=button("",()=>openCollection(key),"source-tile");item.append(element("span",info.label,"source-name"),element("strong",number(summary.totals[key])),element("span","Browse ↗","source-action"));collections.append(item);});section.append(intro,collections);return section;
}
function productScene(){
  const section=element("section",undefined,"product-scene");section.dataset.purpose="product-preview";
  const top=element("div",undefined,"scene-top");top.append(element("span","INSIDE THE WORKSPACE","architecture-label"),element("span","Interactive preview · Synthetic snapshot","scene-snapshot"));section.append(top);
  const shell=element("div",undefined,"scene-shell"),rail=element("aside",undefined,"scene-rail"),main=element("div",undefined,"scene-main");
  rail.append(element("strong","Business Analyst"),element("span","Workspace","scene-rail-label"));[["Accounts","accounts"],["Opportunities","opportunities"],["Support Tickets","tickets"],["Product Issues","issues"]].forEach(([label,key])=>rail.append(button(label,()=>key==="tickets"?show(0):loadCollection(key),"scene-collection")));rail.append(element("p","Selections stay in this preview. Labeled links open the full pages."));
  const tabs=element("div",undefined,"scene-tabs");tabs.setAttribute("role","group");tabs.setAttribute("aria-label","Choose a workspace preview");const body=element("div",undefined,"scene-body"),buttons=[];let previewCycle=0;
  const show=mode=>{previewCycle++;body.setAttribute("aria-busy","false");rail.querySelectorAll("button").forEach((item,i)=>item.classList.toggle("active",mode===0&&i===2));buttons.forEach((item,i)=>{item.classList.toggle("active",i===mode);item.setAttribute("aria-pressed",String(i===mode));});body.replaceChildren();
    if(mode===0){
      body.append(element("div","VANTARA / SUPPORT / INCIDENTS","scene-breadcrumb"),element("h3","See where support demand is concentrated."));
      const stats=element("div",undefined,"scene-stats");[["269","Incident Records"],["58","Reporting Incidents"],["22","Reporting P1 Cases"]].forEach(([value,label])=>{const item=element("div");item.append(element("strong",value),element("span",sentenceText(label)));stats.append(item);});body.append(stats);
      const table=element("table",undefined,"scene-table"),head=element("thead"),header=element("tr");["Product Area","Incidents","P1"].forEach(label=>header.append(element("th",label)));head.append(header);table.append(head);const rows=element("tbody");
      [["Revenue Analytics & Reporting",58,22],["Invoicing & Payment Lifecycle",53,21],["Billing & Subscription Management",47,16],["Checkout & Customer Experience",45,13],["Developer Experience & APIs",36,9],["Merchant Billing & Contracts",25,12]].forEach(([area,count,p1])=>{const row=element("tr"),name=element("td");name.append(button(area,()=>loadCollection("tickets",area),"record-button"));row.append(name,element("td",String(count)),element("td",String(p1)));rows.append(row);});const unclassified=element("tr");unclassified.append(element("td","No Recorded Product Area"),element("td","5"),element("td","1"));rows.append(unclassified);table.append(rows);body.append(table,element("p","Account ACC-013 · P1 is the recorded priority label. All 269 incidents are marked solved; counts do not establish current impact.","scene-note"),button("Open the full visual workflow ↗",()=>navigate("investigation"),"btn"));
    }else{
      body.append(element("div","EAST / WEST / ALL RECORDED OPPORTUNITIES","scene-breadcrumb"),element("h3","A better decision starts with the next question."));
      const prompt=element("blockquote","East leads on contract value. Should West copy its approach?","scene-prompt");body.append(prompt);
      const brief=element("div",undefined,"scene-brief");brief.append(element("span","DECISION BRIEF","architecture-label"),element("strong","Do not copy East’s playbook based on totals."),element("p","East’s recorded won ACV is $43.715M higher, but West has 1.7% more won ACV per indexed account. The account mixes differ, so the totals do not establish which team sells better."));
      const checks=element("ul");["Separate volume from average deal size.","Compare sales motion and account coverage.","Commission a matched pipeline review before a rollout."].forEach(copy=>checks.append(element("li",copy)));brief.append(checks);body.append(brief,element("p","Precomputed Case · ACV is annual contract value, not revenue or cash.","scene-note"),button("Open the full case and follow-ups ↗",()=>navigate("case"),"btn primary"));
    }
  };

  const openFull=(category,area="")=>{explore=area?{category,query:"",facet:"ticket_type",value:"incident",facet2:"product_areas",value2:area,account:"ACC-013",page:0}:{category,query:"",facet:"",value:"",account:"",page:0};navigate("explore");};
  const showList=(category,area,rows)=>{
    body.replaceChildren(element("div",area?"VANTARA / SUPPORT / "+area.toUpperCase():"WORKSPACE / "+categoryInfo[category].label.toUpperCase(),"scene-breadcrumb"),element("h3",area||categoryInfo[category].label));
    body.append(element("p",`Previewing ${Math.min(5,rows.length)} of ${number(rows.length)} records. Select a row to inspect it here.`,"scene-note"));
    const list=element("div",undefined,"scene-record-list");
    rows.slice(0,5).forEach(row=>{const item=button("",()=>showRecord(category,area,rows,row),"scene-record-choice");item.append(element("span",row[categoryInfo[category].id],"scene-record-id"),element("span",display(row[categoryInfo[category].name])));list.append(item);});
    body.append(list,button("Back to support overview",()=>show(0),"text-button"),button("Open this selection in the full workspace ↗",()=>openFull(category,area),"btn"));
  };
  const showRecord=(category,area,rows,row)=>{
    body.replaceChildren(element("div","SOURCE RECORD / "+row[categoryInfo[category].id],"scene-breadcrumb"),element("h3","Inspect the source record"),element("blockquote",display(row[categoryInfo[category].name]),"source-title-quote"));
    const detail=element("div",undefined,"scene-record");
    Object.entries(row).forEach(([key,value])=>{const line=element("div",undefined,"record-kv");line.append(element("b",sentenceText(key.replaceAll("_"," ")).replace(/\\bid\\b/gi,"ID").replace(/\\bacv\\b/gi,"ACV")),element("span",display(value)));detail.append(line);});
    body.append(detail,button("Back to these records",()=>showList(category,area,rows),"text-button"),button("Open this selection in the full workspace ↗",()=>openFull(category,area),"btn"));
  };
  const loadCollection=async(category,area="")=>{
    const cycle=++previewCycle;buttons.forEach((item,i)=>{item.classList.toggle("active",i===0);item.setAttribute("aria-pressed",String(i===0));});rail.querySelectorAll("button").forEach((item,i)=>item.classList.toggle("active",["accounts","opportunities","tickets","issues"][i]===category));
    body.replaceChildren(element("p","Loading the preview records…","scene-note"));body.setAttribute("aria-busy","true");
    try{const source=await records(category);if(cycle!==previewCycle||currentView!=="overview")return;const rows=area?source.filter(row=>row.account_id==="ACC-013"&&row.ticket_type==="incident"&&row.product_areas.includes(area)):source;showList(category,area,rows);}
    catch{if(cycle===previewCycle)body.replaceChildren(element("p","Preview records could not load. Please try the selection again.","scene-note"));}
    finally{if(cycle===previewCycle)body.setAttribute("aria-busy","false");}
  };
  ["Data Explorer","Analyst Brief"].forEach((label,index)=>{const item=button(label,()=>show(index),"scene-tab");buttons.push(item);tabs.append(item);});main.append(tabs,body);shell.append(rail,main);section.append(shell);show(0);return section;
}
function analystSystemDiagram(){
  const section=element("section",undefined,"home-section analyst-system");
  section.append(sectionHead("How the Analyst Works","Ask a business question. The analyst checks the connected records, runs the calculations, and shows what supports its answer."));
  const figure=element("figure",undefined,"analyst-system-figure");
  const question=element("div",undefined,"analyst-system-question");
  question.append(element("span","A QUESTION FROM SALES LEADERSHIP","architecture-label"),element("p","“Why did East close more annual contract value than West?”"));
  const flow=element("div",undefined,"analyst-system-flow");
  const column=(label,title,items,className="")=>{
    const node=element("div",undefined,"analyst-system-node "+className);
    node.append(element("span",label,"architecture-label"),element("h3",title));
    const list=element("ul");
    items.forEach(([name,description])=>{
      const item=element("li");item.append(element("strong",name),element("p",description));list.append(item);
    });
    node.append(list);return node;
  };
  const arrow=()=>{const node=element("span",undefined,"analyst-system-arrow");node.setAttribute("aria-hidden","true");return node;};
  flow.append(
    column("01 / INPUTS","What It Connects",[
      ["Business records","Accounts, opportunities, support tickets, product issues, and a separate finance sample."],
      ["Documents and search","Retrieve relevant passages from approved documents, with their source locations."],
      ["Business definitions","Agree what terms such as annual contract value mean and which records are in scope."]
    ]),
    arrow(),
    column("02 / COORDINATION","The Analyst Harness",[
      ["Local language model","Interprets the question, requests tools, and drafts an explanation. The model can be replaced."],
      ["Analysis tools","SQL and Python calculate totals, compare groups, and break down what drove a difference."],
      ["Scope, history, and evidence","The harness checks tool requests, carries forward accepted context, and saves the evidence for review."]
    ],"analyst-system-hub"),
    arrow(),
    column("03 / RESULTS","What You Get Back",[
      ["An answer for the decision","A finding with numbers, caveats, and a suggested next check or action."],
      ["Charts and records","Explore breakdowns and inspect the underlying records in the workspace."],
      ["An audit trail","Open sources and calculations to see how the result was produced. Missing evidence stays visible."]
    ])
  );
  const example=element("figcaption",undefined,"analyst-system-example");
  example.append(element("span","FROM THE PREPARED REGIONAL CASE","architecture-label"),element("p","East led by $43.7M in closed-won annual contract value. Deal count accounted for about 93% of the gap in the comparison. That tells us what drove the arithmetic, but not why East won more deals."),button("Follow the full investigation ↗",()=>navigate("case"),"text-button"));
  figure.append(question,flow,example);
  section.append(figure,element("p","The public portfolio uses prepared examples and synthetic data. The separate Mac prototype runs the model and tools locally.","note"),button("Inspect the engineering ↗",()=>navigate("engineering"),"text-button"));
  return section;
}
function renderOverview(){
  app.replaceChildren();
  const hero=element("section",undefined,"hero home-hero");
  const left=heading("MODEL-AGNOSTIC · LOCAL-FIRST","Ask a business question. Follow the evidence.","A locally run AI analyst for leaders, analysts, and operations teams. Bring company data, business definitions, and analytical tools together. Inspect the answer. Replace the model as better options arrive.");
  const actions=element("div",undefined,"actions");actions.append(button("Explore the Demo ↗",()=>navigate("workflows"),"btn primary"),button("Watch the analyst demos",()=>navigate("about")));left.append(actions,element("p","Interactive portfolio demo · Synthetic data · No live model call","demo-expectation"),element("p","Built by Julio Campos · Applied AI engineering, business analysis, and product design.","maker-line"));
  const aside=element("aside",undefined,"hero-aside");aside.append(element("div","A QUESTION WORTH INVESTIGATING","eyebrow"),element("strong","Should West copy East’s sales approach?"),element("p","East leads by $43.715M in annual contract value from won opportunities. West leads by 1.7% per indexed account. Follow the questions that change the decision."),button("See the end-to-end case ↗",()=>navigate("case"),"btn"));hero.append(left,aside);app.append(hero);
  const introduction=element("section",undefined,"product-introduction");
  const identity=element("div");identity.append(element("span","THE PROJECT","architecture-label"),element("h2","What This Is"),element("p","A model-agnostic AI business analyst prototype: a workspace for exploring company data and investigating business questions. Its architecture brings approved records, document search, exact calculations, and language-model reasoning together."),element("p","The goal is a useful management answer: what happened, why the evidence supports it, and what to do next, with sources and methods you can inspect. Built locally on a Mac, with a model layer designed to be replaced as better options arrive."),button("How The Engine Works ↗",()=>navigate("how"),"text-button"));
  const problem=element("div");problem.append(element("span","THE BUSINESS NEED","architecture-label"),element("h2","The Problem We’re Solving"),element("p","“Bookings are up, but revenue is flat. Why?” Answering that can mean connecting sales records, financial reports, contracts, and customer histories. Teams must reconcile definitions, check the calculations, and distinguish a plausible explanation from a supported finding."),element("p","Even a capable model needs the right company context, access rules, and analytical tools. Some businesses also need sensitive data to stay within their own environment. This project explores how to bring those pieces into a reviewable investigation."),button("Why This Needs An Engine ↗",()=>navigate("why"),"text-button"));
  introduction.append(identity,problem);app.append(introduction,analystSystemDiagram(),productScene());
  const workflows=element("section",undefined,"home-section workflow-section");workflows.dataset.purpose="workflow-comparison";workflows.append(sectionHead("Two Ways to Investigate","Start with the data and choose your own path, or start with a business question and follow the analytical sequence."),workflowCards());app.append(workflows);
  app.append(manualSourceSection());
  const engineering=element("section",undefined,"home-section home-engineering");const engineeringCopy=element("div");engineeringCopy.append(element("span","APPLIED AI ENGINEERING","architecture-label"),element("h2","Follow the work all the way down."),element("p","Inspect how the engine connects models, data, tools, and evidence. Follow the design decisions, working components, and tests still to pass."),button("Explore the Engineering ↗",()=>navigate("engineering"),"btn"));const skills=element("div",undefined,"engineering-keywords");["Agent Harness","Context Engineering","SQL + Python","Retrieval / RAG","Evidence Lineage","Evaluation Gates"].forEach(label=>skills.append(element("span",sentenceText(label))));engineering.append(engineeringCopy,skills);app.append(engineering);
  const status=element("details",undefined,"technical-notes home-status");status.append(element("summary","Project Status: What Is Built, Demonstrated, and Next"));const cards=element("div",undefined,"status-grid");[["BUILT LOCALLY","A dedicated analyst application, local model integration, CRM and product analytics, saved investigations, and inspectable evidence."],["SHOWN HERE","Interactive charts and source records, two verified sample workflows, and four prepared conversation videos using synthetic data."],["STILL TO QUALIFY","Reliable open-ended conversations, new-company transfer, and production deployment. Model experimentation is paused."]].forEach(([label,copy])=>{const card=element("div",undefined,"status-card");card.append(element("span",label,"architecture-label"),element("p",copy));cards.append(card);});status.append(cards,element("p","The charts and filters run in your browser without an LLM. The example investigations are precomputed and source-backed; new questions run only in the separate local application.","note"));app.append(status);
  pageNext("Why build an engine around a model?","why","The business problem is bigger than generating a fluent answer.");
}

function renderWhy(){
  app.replaceChildren(heading("WHY IT EXISTS","Your business question crosses systems.","Sales has the pipeline. Finance has the revenue. Support has the customer history. The answer often lives between them."));
  app.append(sectionHead("Three Gaps Between Data And A Decision","The engine is designed to close these gaps before a recommendation reaches a business user."));
  app.append(storyRows([
    ["Scattered Evidence","Bring relevant records and documents into the same investigation, with a route back to each source."],
    ["Conflicting Definitions","Agree what bookings, revenue, and cash mean. Compare the right periods, customers, and units."],
    ["Answers You Cannot Check","Show the size of the change, the supporting calculation, and what remains unknown."]
  ]));
  app.append(sectionHead("Who It Is For","For teams that need to understand what happened and decide what to do next."));
  const people=element("div",undefined,"foundation-pillars");
  [["Business Leaders","Frame the question, review the finding, and choose the next action."],["Analysts And Operators","Explore records, compare explanations, and inspect the calculations."],["Data And AI Teams","Scrutinize source access, tool contracts, orchestration, and evaluation."]].forEach(([title,copy])=>people.append(panel(title,copy)));app.append(people);
  app.append(panel("Keep Control Of Your Data And Model","Some companies need sensitive records to stay inside their environment. This prototype runs locally on a Mac. Its modular design leaves room for a company-managed server or approved hosted model, subject to testing."));
  app.append(deeper("Why A Model Needs An Engine",
    element("p","A model can interpret a question and reason about evidence. The application connects approved sources, supplies business definitions, runs calculations, and records how the answer was produced."),
    element("p","Model replacements must pass the same tool and answer checks. A new deployment also needs appropriate permissions, security, and operational controls."),
    button("Inspect The Engineering ↗",()=>navigate("engineering"),"text-button")));
  const value=panel("The Value To Prove","Less time reconciling reports. A clearer explanation of the numbers. A recommendation someone can check. A company pilot would measure these benefits against its current process.");
  value.append(button("See The Pilot Scorecard ↗",()=>navigate("roadmap"),"text-button"));app.append(value);
  pageNext("From Question To Evidence","how","See how language, analytical tools, and source records work together.");
}

function renderHow(){
  app.replaceChildren(heading("HOW IT WORKS","Ask. Investigate. Check. Decide.","The intended experience starts with a business question and ends with a concise answer, supporting evidence, and a useful next action."));
  app.append(element("p","Product Vision · The public workflows are precomputed examples. Reliable open-ended conversation remains to be qualified.","scope-banner"));
  app.append(sectionHead("From Question To Decision","You frame the concern. The engine brings together the evidence and tools."));
  const vision=element("div",undefined,"vision-flow");
  [
    ["01 / ASK","Frame The Question","“Bookings rose, but revenue is flat. Why?” Add follow-ups, request a breakdown, or challenge the explanation."],
    ["02 / FIND","Locate Relevant Evidence","Find approved records and document passages using the company’s definitions and access rules."],
    ["03 / ANALYZE","Calculate And Test","Use analytical tools to measure changes, reconcile sources, and test competing explanations."],
    ["04 / EXPLAIN","Make The Answer Useful","Lead with the finding and its business implication. Show sources, uncertainty, and a recommended next step."]
  ].forEach(([label,title,copy])=>{const card=element("div",undefined,"vision-step");card.append(element("span",label,"architecture-label"),element("h3",title),element("p",copy));vision.append(card);});app.append(vision);
  app.append(deeper("An Investigation Loop, Not a Single Prompt",
    element("p","The model can request a calculation or document search, examine the returned evidence, and choose what to check next. The engine validates each request, runs the tool, and saves the result. The loop ends with a draft, a clarification or approval request, or a recorded stop."),
    element("p","The software managing that loop is the agent harness. It carries conversation context, enforces scope and execution limits, and keeps the evidence available for review. The local loop is implemented; the prepared public examples illustrate the experience without running a model."),
    button("Inspect the harness design ↗",()=>navigate("engineering"),"text-button")));
  app.append(sectionHead("What You Get Back","A short answer first. The evidence and method are one level deeper."));
  app.append(storyRows([
    ["The Finding","What changed, by how much, and which contributors matter."],
    ["The Explanation","What the evidence supports, what is uncertain, and which explanations were tested."],
    ["The Next Action","A practical recommendation, the evidence still needed, and a decision for the human owner."]
  ]));
  app.append(deeper("Connecting A Company’s Data",
    element("p","Start with approved exports or read-only reporting views. Map account and product IDs, agree metric definitions, currencies, and fiscal periods, and reconcile known totals."),
    element("p","Register the supported calculations and document search. Live refresh and generic onboarding remain to be built."),
    button("See The Implementation Roadmap ↗",()=>navigate("roadmap"),"text-button")));
  const responsibilities=element("div",undefined,"split");
  responsibilities.append(panel("The Model","Interprets language, follows the conversation, selects tools, and explains their results. General conversation and compound-request reliability remain qualification gaps."),panel("The Engine","Checks scope and inputs, runs exact calculations, verifies citations, and saves the sources and methods for review."));
  app.append(deeper("Under The Hood: Language, Tools, And RAG",responsibilities,
    element("p","Tool calling lets the model request a supported calculation or search. SQL and Python perform numerical work. Retrieval-augmented generation (RAG) supplies relevant document passages. Shared business definitions keep those tools consistent."),
    element("p","The audit records executed methods, parameters, filters, assumptions, and sources. It explains how the result was produced without claiming to reveal private model reasoning."),
    button("Explore All Eight Engineering Boundaries ↗",()=>navigate("engineering"),"text-button")));
  pageNext("Try The Two Ways Of Working","workflows","Explore the data yourself, or follow a question through a prepared investigation.");
}

function renderWorkflows(){
  app.replaceChildren(heading("TWO SAMPLE WORKFLOWS","Start with records. Or start with a question.","Browse an account and follow the records, or follow a business question through successive answers. Both paths show the evidence and the next decision."));
  app.append(element("p","Interactive Records · Prepared Investigations · Synthetic Data · No Live AI Chat","demo-expectation"));
  app.append(workflowCards());

  const table=element("div",undefined,"comparison-matrix");
  [["Entry point","An account or a data collection","A management question"],["Who chooses the next step?","The user follows filters, breakdowns, and record links","The intended agent proposes and executes supported analytical steps"],["What you inspect","Counts, priorities, dates, and individual source records","Follow-up questions, competing readings, calculations, and a decision brief"],["The examples here","Vantara support: product areas to P1 tickets to a review plan","East/West sales: headline gap to volume, mix, and a rollout decision"],["What is actually running?","Browser filters, record inspection, and deterministic counts","A precomputed, annotated sequence; no live conversation or model call"]].forEach(([label,visual,conversation])=>{const row=element("section",undefined,"matrix-row");row.append(element("h3",label),element("p",visual),element("p",conversation));table.append(row);});const labels=element("div",undefined,"matrix-row matrix-head");labels.append(element("span","COMPARE THE PATHS","architecture-label"),element("strong","Visual exploration"),element("strong","Conversational investigation"));table.prepend(labels);app.append(deeper("Compare The Two Workflows",table));
  const explorePanel=panel("Explore without asking the AI","Compare opportunities, support tickets, and product issues in interactive charts, then select a bar to inspect its records. Seven searchable source indexes also cover accounts, knowledge articles, internal documents, and call transcripts.");
  explorePanel.append(button("Open the data workspace ↗",()=>navigate("explore"),"btn primary"));app.append(explorePanel);
  app.append(element("p","Both case pages retain their source scope, methods, missing evidence, proposed owner, decision criteria, and outcome checks. Operational interventions are proposed, not completed business actions.","note"));
  pageNext("Watch four investigations unfold","about","The videos illustrate support, contract comparison, sales performance, and product priorities.");
}

function processSchematic(){
  const section=element("section",undefined,"process-schematic");
  section.append(sectionHead("Process Architecture","Follow one investigation through the local runtime. The harness coordinates the loop; the model selects tools, and code executes them."));
  const map=element("div",undefined,"process-map");
  const node=(className,label,title,copy)=>{
    const card=element("section",undefined,"process-node "+className);
    card.append(element("span",label,"architecture-label"),element("h3",title),element("p",copy));return card;
  };
  const edge=(className,label)=>element("div",label,"process-edge "+className);
  map.append(
    node("process-input","01 / WORKSPACE","Question + Approved Scope","A new question or follow-up, with the admitted records and any selected chart scope."),
    edge("process-admission","↓  Admit scope and restore accepted history"),
    node("process-harness","02 / PYDANTIC AI + HOST CONTROLS","Agent Harness","Assemble the request, enforce scope and budgets, and decide whether to continue, pause for approval, or stop."),
    edge("process-model-edge","↕  Request / tool call or draft"),
    node("process-model","03 / INFERENCE","Replaceable Local Model","An OpenAI-compatible adapter sends messages and tool schemas to the local MLX-VLM runtime."),
    edge("process-tool-edge","↕  Validated call / evidence result"),
    node("process-tools","04 / EXECUTION","Typed Analytical Tools","SQL and Python calculate results; document retrieval returns passages and source locations. Tool results go back to the harness for the next model request."),
    edge("process-source-edge","↕  Read approved sources"),
    node("process-sources","DATA BOUNDARY","Sources + Definitions","Pinned records and documents, shared metric definitions, exact filter values, and selected-record limits."),
    edge("process-save","↓  Save attempts, evidence, and review state"),
    node("process-evidence","05 / PERSISTENCE","Session Store + Evidence Records","SQLite retains attempts and accepted history. Versioned evidence records retain sources, arguments, and results for replay. Accepted history feeds the next turn."),
    edge("process-review-edge","↓  Present draft with supporting evidence"),
    node("process-review","06 / HUMAN REVIEW","Answer + Evidence for Review","Read the finding and its limits, inspect charts or source records, and review the calculations. Accept or reject the draft, or ask a follow-up.")
  );
  const canvas=element("div",undefined,"process-canvas");
  canvas.tabIndex=0;canvas.setAttribute("role","region");canvas.setAttribute("aria-label","Process flowchart; scroll horizontally on narrow screens");
  const drawing=element("div",undefined,"process-drawing runtime-map");
  const svg=(tag,attrs={})=>{const node=document.createElementNS("http://www.w3.org/2000/svg",tag);Object.entries(attrs).forEach(([key,value])=>node.setAttribute(key,value));return node;};
  // Routes and their endpoints share the same coordinate space as the component cards.
  const links={
    submit:["M234 258H380",["workspace","harness"],"Question + scope",307,244],
    context:["M466 218V142",["harness","model"],"Context + schemas",456,177,"end"],
    proposal:["M594 142V218",["model","harness"],"Tool call / draft",604,177,"start"],
    dispatch:["M466 338V435",["harness","tools"],"Validated call",454,392,"end"],
    result:["M594 435V338",["tools","harness"],"Evidence result",606,392,"start"],
    read:["M380 485H234",["tools","sources"],"Scoped read",307,470],
    records:["M234 507H380",["sources","tools"],"Source records",307,529],
    draft:["M680 258H826",["harness","review"],"Draft + citations",753,244],
    persist:["M680 311H716Q730 311 730 325V484Q730 498 744 498H826",["harness","ledger"],"Record attempt",778,482],
    restore:["M826 521H715Q701 521 701 507V335H680",["ledger","harness"],"Restore history",764,541],
    inspect:["M926 338V449",["review","ledger"],"Inspect evidence",938,394,"start"],
    replay:["M900 449V338",["ledger","review"],"Replay result",888,394,"end"],
    follow:["M826 297H780Q768 297 768 309V353Q768 366 755 366H307Q294 366 294 353V309Q294 297 281 297H234",["review","workspace"],"Follow-up",305,352,"start"]
  };
  const base=svg("svg",{viewBox:"0 0 1060 610",class:"runtime-map-wires","aria-hidden":"true"});
  const defs=svg("defs");
  [["runtime-arrow","#687a96"],["runtime-arrow-active","#83e0ca"]].forEach(([id,fill])=>{
    const marker=svg("marker",{id,viewBox:"0 0 10 10",refX:9,refY:5,markerWidth:6,markerHeight:6,orient:"auto"});
    marker.append(svg("path",{d:"M1 1L9 5L1 9",fill:"none",stroke:fill,"stroke-width":1.7}));defs.append(marker);
  });
  base.append(defs);
  const wireLabels=svg("g",{class:"runtime-map-labels"});
  const nodes=new Map();
  Object.entries(links).forEach(([id,[d,,label,x,y,anchor]])=>{
    const wire=svg("path",{d,class:"runtime-wire "+(["inspect","replay","follow"].includes(id)?"runtime-wire-human":""),"marker-end":"url(#runtime-arrow)"});
    base.append(wire);
    const caption=svg("text",{x,y,"text-anchor":anchor||"middle","data-wire":id});caption.textContent=label;wireLabels.append(caption);
  });
  const highlight=svg("svg",{viewBox:"0 0 1060 610",class:"process-route-overlay"});
  highlight.setAttribute("aria-hidden","true");
  const labels=svg("svg",{viewBox:"0 0 1060 610",class:"runtime-label-layer","aria-hidden":"true"});labels.append(wireLabels);
  drawing.append(element("div","LOCAL APPLICATION","runtime-map-boundary"),base,highlight,labels);
  const components=[
    ["workspace","01","Workspace","Question · chart selection",24,218,210,120],
    ["model","AI","Local model","OpenAI-compatible API · MLX-VLM",380,35,300,107],
    ["harness","∿","Agent harness","Pydantic AI · scope · context · approvals",380,218,300,120],
    ["review","04","Human review","Draft · citations · decision",826,218,210,120],
    ["sources","DB","Source catalog","Records · docs · definitions",24,449,210,106],
    ["tools","ƒ","Analysis & retrieval","Typed contracts · SQL · Python · RAG",380,435,300,120],
    ["ledger","EV","Evidence store","SQLite · provenance · replay",826,449,210,106]
  ];
  components.forEach(([id,glyph,title,copy,x,y,w,h])=>{
    const card=element("div",undefined,"runtime-node runtime-node-"+id);
    Object.assign(card.style,{left:x/10.6+"%",top:y/6.1+"%",width:w/10.6+"%",height:h/6.1+"%"});
    card.append(element("span",glyph,"runtime-node-mark"),element("strong",title),element("span",copy,"runtime-node-copy"));
    card.firstChild.setAttribute("aria-hidden","true");
    nodes.set(id,card);drawing.append(card);
  });
  drawing.append(element("p","Active route lights up as you step through. Dashed lines mark a human action.","runtime-map-key"));
  canvas.append(drawing);
  const trace=element("section",undefined,"process-trace");
  trace.append(element("span","LOCAL RUNTIME","architecture-label"),element("h3","Request Lifecycle"));
  const controls=element("div",undefined,"process-trace-controls"), detail=element("div",undefined,"process-trace-detail");
  const guide=element("div",undefined,"process-handoff");
  const progress=element("span",undefined,"architecture-label");
  const handoff=element("strong"), takeaway=element("p");
  const pager=element("div",undefined,"process-pager");
  const back=button("← Previous",()=>select(active-1),"process-pager-button");
  const next=button("Next step →",()=>select(active+1),"process-pager-button");
  pager.append(back,next);guide.append(progress,handoff,takeaway,pager);
  guide.setAttribute("aria-live","polite");
  controls.setAttribute("role","group");controls.setAttribute("aria-label","Investigation stages");
  const stages=[
    ["Scope","What goes into the run","The workspace sends the question and approved records. The harness restores accepted history and carries the same scope into tool execution."],
    ["Model","What crosses the model boundary","The harness sends messages and typed tool definitions to the local model. A tool call is a proposal: the host validates it and can pause for approval when required."],
    ["Tools","What comes back from the tools","Validated calls run calculations or retrieve documents within the approved scope. The model receives a compact evidence result; the full record retains the source, arguments, method, and result for replay."],
    ["Review","How a draft is checked","The app checks that cited IDs resolve to evidence in the session. The human reviewer checks factual support and completeness before accepting or rejecting the draft."],
    ["Follow-up","What carries into the next request","The harness restores accepted conversation history and review notes. A follow-up uses the existing approved scope; widening that scope requires a new approval."]
  ];
  const concepts=[
    [["Semantic layer","The business vocabulary the tools share: metric meanings, units, and valid filters."],["Semantic tuning","Refine metric definitions, field mappings, and terminology in the application without changing model weights."]],
    [["Context engineering","Assemble instructions, accepted history, tool schemas, and scoped evidence for the next request."],["Native tool calling","The model proposes a named tool and structured arguments; the host decides whether it can run."]],
    [["Typed tool contracts","Pydantic schemas define valid arguments. The host enforces source scope, prerequisites, and execution limits."],["Deterministic analytics","SQL and Python calculate totals and comparisons from the admitted records."],["Retrieval-augmented generation (RAG)","Search approved documents and supply matching passages with source locations. The current retrieval is lexical."]],
    [["Evidence provenance","A citation resolves to the recorded source, method, arguments, and result. Replay checks the record against the source and method."],["Human-in-the-loop review","The app checks citation IDs. A reviewer judges factual support and completeness, and decides whether to accept the draft."]],
    [["Durable session state","Accepted turns and review notes carry forward through saved history; the model does not remember them on its own."],["Evaluation harness","Offline fixtures test tool calls, continuation, and replay. Live model quality is a separate qualification step."]]
  ];
  const walkthrough=[
    ["Set the scope","Workspace → Harness","The question and the data it’s allowed to use travel together.",307,["submit"]],
    ["Ask the model","Harness → Model → Harness","The model reads the context and proposes what to do. It doesn’t query the data itself.",530,["context","proposal"]],
    ["Run the tools","Harness → Tools → Harness","Code does the calculation or search. The result goes back to the harness so the model can decide what to check next.",530,["dispatch","read","records","result"]],
    ["Review the draft","Harness → Reviewer ↔ Evidence","The reviewer gets the answer and can inspect the evidence before accepting it.",835,["persist","draft","inspect","replay"]],
    ["Continue the conversation","Reviewer → Workspace → Harness","The next question can reuse accepted history and evidence within the approved scope.",530,["follow","submit","restore"]]
  ];
  const steps=[];
  let active=0, beatIndex=0, playback=null;
  const drawRoute=(paths)=>{
    highlight.replaceChildren();
    const activeNodes=new Set(paths.flatMap(id=>links[id][1]));
    nodes.forEach((card,id)=>card.classList.toggle("is-active",activeNodes.has(id)));
    wireLabels.querySelectorAll("[data-wire]").forEach(label=>label.classList.toggle("is-active",paths.includes(label.getAttribute("data-wire"))));
    const moving=!matchMedia("(prefers-reduced-motion: reduce)").matches;
    paths.forEach((id,i)=>{
      const [d]=links[id];
      highlight.append(svg("path",{d,class:"process-active-route","marker-end":"url(#runtime-arrow-active)"}));
      if(moving){
        const pulse=svg("circle",{r:4.5,class:"process-route-pulse",opacity:0});
        const motion=svg("animateMotion",{path:d,begin:"indefinite",dur:"0.66s",fill:"remove"});
        const visible=svg("set",{attributeName:"opacity",to:1,begin:"indefinite",dur:"0.66s"});
        pulse.append(motion,visible);highlight.append(pulse);
        if(highlight.isConnected){motion.beginElementAt(i*0.68);visible.beginElementAt(i*0.68);}
      }
    });
  };
  const beats=[
    ["Propose","MODEL → HARNESS","Tool request","The model names an available tool and supplies arguments. It hasn’t run anything yet.",[["Tool","analyze_business_records"],["Arguments","Collection, filters, and breakdown"]],["proposal"],530],
    ["Check","HARNESS → ANALYSIS TOOL","Contract check","The harness checks the arguments and the approved scope. Only a valid, admitted request reaches the tool.",[["Check","Typed inputs and approved records"],["On success","Dispatch the calculation"]],["dispatch"],530],
    ["Return","ANALYSIS TOOL → HARNESS","Evidence result","Code computes the breakdown. A compact result goes back into the model context, while the full record can be replayed.",[["Model receives","Result and evidence ID"],["Audit retains","Source, method, inputs, and result"]],["read","records","result"],530]
  ];
  const lab=element("section",undefined,"handoff-lab");
  const labHeader=element("div",undefined,"handoff-lab-header"), beatControls=element("div",undefined,"handoff-beat-controls");
  const beatCard=element("div",undefined,"handoff-beat-card");
  beatCard.setAttribute("aria-live","polite");
  const beatButtons=[];
  const stop=()=>{if(playback!==null)clearTimeout(playback);playback=null;play.textContent="Play the handoff";};
  const frame=(index)=>{
    beatIndex=index;
    const [,route,title,copy,fields,paths,center]=beats[index];
    beatButtons.forEach((item,i)=>item.setAttribute("aria-pressed",String(i===index)));
    const message=element("div",undefined,"handoff-payload");
    message.append(element("span",route,"architecture-label"),element("strong",title));
    const data=element("dl");
    fields.forEach(([key,value])=>{const row=element("div");row.append(element("dt",key),element("dd",value));data.append(row);});
    message.append(data);
    const note=element("div",undefined,"handoff-caption");note.append(element("span","HANDOFF "+(index+1)+" / 3","architecture-label"),element("p",copy));
    beatCard.replaceChildren(message,note);
    drawRoute(paths);
    canvas.scrollLeft=Math.max(0,center/1060*drawing.clientWidth-canvas.clientWidth/2);
  };
  const play=button("Play the handoff",()=>{
    if(playback!==null){stop();return;}
    play.textContent="Pause";
    const advance=(index)=>{
      frame(index);
      playback=setTimeout(()=>{
        if(!lab.isConnected || active!==2 || index===beats.length-1){stop();return;}
        advance(index+1);
      },2300);
    };
    advance(beatIndex===beats.length-1?0:beatIndex);
  },"handoff-play");
  beats.forEach(([label],i)=>{const item=button((i+1)+" · "+label,()=>{stop();frame(i);},"process-trace-step");beatButtons.push(item);beatControls.append(item);});
  beatControls.setAttribute("role","group");beatControls.setAttribute("aria-label","Tool handoff stages");
  const labTitle=element("div");labTitle.append(element("span","INTERACTIVE TECHNICAL EXPLAINER","architecture-label"),element("h4","What Actually Moves Between Components?"));
  labHeader.append(labTitle,play);lab.append(labHeader,beatControls,beatCard);
  const select=(index)=>{
    if(index<0 || index>=stages.length)return;
    stop();active=index;
    steps.forEach((step,i)=>step.setAttribute("aria-pressed",String(i===index)));
    const [,route,plain,center,paths]=walkthrough[index];
    progress.textContent="STEP "+(index+1)+" OF "+stages.length;
    handoff.textContent=route;takeaway.textContent=plain;
    back.disabled=index===0;next.disabled=index===stages.length-1;
    lab.hidden=index!==2;
    if(index===2)frame(0);
    else{drawRoute(paths);canvas.scrollLeft=Math.max(0,center/1060*drawing.clientWidth-canvas.clientWidth/2);}
    const [,title,copy]=stages[index];
    const terms=element("dl",undefined,"process-terms");
    concepts[index].forEach(([term,meaning])=>{const entry=element("div");entry.append(element("dt",term),element("dd",meaning));terms.append(entry);});
    detail.replaceChildren(element("span","UNDER THE HOOD","architecture-label"),element("strong",title),element("p",copy),terms);
  };
  walkthrough.forEach(([name],i)=>{const step=button((i+1)+" · "+name,()=>select(i),"process-trace-step");steps.push(step);controls.append(step);});
  const workflow=element("div",undefined,"process-workflow-frame");
  workflow.append(canvas,lab);
  trace.append(element("p","Follow the request one handoff at a time. Use Next or jump to any step; the highlighted route shows where to look.","process-trace-guide"),controls,guide,workflow,detail);
  select(0);
  section.append(trace,deeper("Read the Process Step by Step",map),element("p","This diagram documents the local analyst runtime. It does not execute requests.","note"));
  return section;
}

function renderEngineering(){
  app.replaceChildren(heading("ENGINEERING DEEP DIVE","The system behind the answer.","A modular local prototype spanning model serving, an agent harness, context engineering, verified data, business semantics, deterministic analytics, retrieval, and evidence lineage. Later experimental components remain local; the linked public repository contains published milestones."));
  const contribution=element("section",undefined,"contribution-band");
  contribution.append(element("span","BUILT BY JULIO CAMPOS · FROM BUSINESS PROBLEM TO WORKING PROTOTYPE","architecture-label"),element("h2","The design choices behind the experience."),element("p","I translated the business need into a modular system: model serving, data engineering, semantic modeling, agent orchestration, evaluation, and a usable workspace. Language interpretation and tool selection belong with the model; exact calculations with code; source verification with an inspectable evidence layer."));
  const skills=element("div",undefined,"skill-strip");["Local inference","Agent harness","Context engineering","Typed tool contracts","SQL + Python analytics","Retrieval / RAG","Evidence lineage","Evaluation harness","Dashboard + UX"].forEach(label=>skills.append(element("span",sentenceText(label))));contribution.append(skills);

  app.append(element("p","Built by Julio Campos · Applied AI engineering, business analysis, and product design.","maker-line"));
  const principles=element("details",undefined,"technical-notes");principles.append(element("summary","Core Design Principles"));
  const choices=element("div",undefined,"story-rows");
  [["01","Control where analysis happens","Sensitive sales pipelines, customer histories, and commercial terms may need to stay inside a company’s environment. Local inference gives a deployment choice; production identity and access controls still require implementation."],["02","Keep the intelligence replaceable","Models improve faster than business definitions change. Separate the model adapter from analytical tools and evidence contracts so a new candidate can be tested against the same work. Portability still has to be demonstrated."],["03","Make useful answers testable","A fluent answer is only part of the result. Check the figures, scope, requested parts, and source references; retain attempts so failures can be traced to data, tools, orchestration, or the model."]].forEach(([num,title,copy])=>{const row=element("section",undefined,"story-row");row.append(element("span",num,"story-number"),element("h3",title),element("p",copy));choices.append(row);});principles.append(choices);
  app.append(processSchematic());
  const componentCatalog=element("details",undefined,"technical-notes component-catalog");componentCatalog.append(element("summary","Component Catalog and Technical Notes"));
  componentCatalog.append(sectionHead("Under the hood","Working components, explicit boundaries, and repeatable checks. This is where the portfolio demonstrates the engineering behind the interface."));
  const architecture=element("div",undefined,"architecture-grid");
  [
    ["01 / MODEL BOUNDARY","Keep the intelligence replaceable","Apple Silicon + MLX/MLX-VLM serves the current local model through an OpenAI-compatible API. Application contracts sit above the provider adapter; each replacement must pass transport and answer-quality checks."],
    ["02 / DATA ENGINEERING","Establish a source of truth","Pinned synthetic JSON, checksum verification, normalized SQLite, validated relationships, and read-only queries. Report parity checks compare the database with the reference source; original record IDs survive the transformation."],
    ["03 / BUSINESS SEMANTICS","Define what the numbers mean","A governed catalog defines entities, joins, metric definitions, grain, units, time coverage, and enabled methods. It distinguishes a missing input from an unavailable calculation or an unsupported inference."],
    ["04 / RETRIEVAL · RAG","Find evidence in the documents","Scoped lexical retrieval returns approved document passages with section, line range, and SHA-256 provenance. Retrieval is one tool within the investigation; structured questions can use analytical queries instead."],
    ["05 / AGENT HARNESS","Turn language into tool use","Pydantic AI manages the model and native-tool loop. The surrounding harness admits sources, validates typed requests, carries accepted conversation history, records attempts, and enforces execution budgets. Governed Python and SQL components perform calculations."],
    ["06 / PROVENANCE · EVALS","Make the result reproducible","Content-addressed evidence, claim-level citations, calculation replay, durable run records, and versioned scenarios. Checks cover figures, sources, scope, and answer completeness, alongside speed and memory."]
  ].forEach(([label,title,copy])=>{const card=element("section",undefined,"architecture-card");card.append(element("span",label,"architecture-label"),element("h3",title),element("p",copy));architecture.append(card);});componentCatalog.append(architecture);
  const technical=element("details",undefined,"technical-notes");technical.append(element("summary","Inspect the technical design decisions"));
  const technicalBody=element("div",undefined,"technical-body");
  [
    ["Contracts beyond the prompt","Typed schemas and runtime validation check tool arguments and evidence references. Native structured output, tool calls, and multi-turn continuation are tested at the actual serving boundary; a valid JSON shape alone cannot establish a correct business answer."],
    ["History that stays inspectable","Evidence retains source identity, method, arguments, results, and hashes. Event time and the time information became available are distinct. Saved attempts preserve their code and model identities so a later change cannot quietly rewrite an earlier result."],
    ["Evaluation that measures useful work","Versioned cases check requested parts, numerical correctness, citations, missing-data behavior, and inference limits. Deterministic replay checks the calculations independently. Resource measurements and focused regressions accompany model qualification; an official Enterprise-Bench score remains a future milestone."]
  ].forEach(([title,copy])=>technicalBody.append(panel(title,copy)));technical.append(technicalBody);componentCatalog.append(technical);

  app.append(sectionHead("Eight Engineering Boundaries","Explore each subsystem, the responsibilities it owns, and the integration still to qualify. The local model has passed selected checks; reliable general business conversations remain unqualified."));
  const chapters=element("div",undefined,"engineering-chapters");
  [
    ["01","Serving and provider transport","OpenAI-compatible Chat Completions HTTP keeps MLX-specific imports outside the application. The current Qwen3.8 vision-language baseline uses MLX-VLM over Apple Silicon; text-only serving still needs the correct native template. Application types and the provider adapter are separate. A future transport must preserve tool messages, continuation, structured-output behavior, and durable session identity.",
      "Qualification checks the actual accepted and rejected decoder outputs, native tool arguments, multi-turn tool continuation, context and output capacity, precision, runtime versions, latency, and memory. A process RSS sample is not a Metal peak-memory measurement. A compatible endpoint is the start of qualification, not evidence of interchangeable behavior."],
    ["02","Data admission and storage","The approved synthetic source is pinned by commit and manifest hashes. Original JSON remains the reference; a normalized SQLite repository provides read-only analytical access with relationship checks and parity verification. Source-specific adapters own field names and joins while reusable analytical functions operate on application types.",
      "Public browsing uses an explicit field allowlist. It excludes document bodies, people/contact fields, saved model attempts, and the separate finance test world. Live company refresh, change-data capture, and automated onboarding would need connector-specific coverage and integrity tests."],
    ["03","Semantic and capability catalogs","A governed catalog describes entities, joins, measures, grain, units, time coverage, source locators, method versions, input schemas, output shapes, and inference limits. Planning, dispatch, evidence construction, and evaluation refer to those definitions instead of maintaining separate copies in prompts.",
      "The catalog separates missing input from an unavailable calculation and from an unsupported inference. It also keeps annual contract value, recognized revenue, invoice value, cash, and order count distinct. Catalog identities allow a saved investigation to retain the definitions under which it was run."],
    ["04","Agent harness and investigation loop","An experimental Pydantic AI loop lets the model interpret language, select typed tools, observe returned evidence, and continue or stop. The harness owns source authority, scope, request limits, tool-call budgets, and durable run persistence. The model chooses analytical steps within those boundaries; the application enforces them. Original controller paths remain preserved with their historical contracts.",
      "The desired conversation can include several requests in one message, corrections, and references such as “those shares.” Every requested part must remain accounted for, including blocked parts. A missing capability should identify the necessary calculation or source instead of silently answering a different question. This behavior remains an acceptance target."],
    ["05","Deterministic analysis and retrieval","Reviewed Python reports and governed parameterized SQL perform the numerical work. CRM and product tools discover recorded categories, group opportunities, tickets, and issues, and compare counts and ACV with explicit currency and exclusion rules. Financial scenarios retain their signing-date, service-period, and revenue-event semantics. Document tools use bounded lexical retrieval with passage-level source locations.",
      "Retrieval does not define the architecture. It supplies document evidence alongside structured reports. A future hybrid lexical/vector retriever or sandboxed code tool would require its own admission, permission, execution, and evaluation boundary. Neither is claimed as a working enterprise subsystem here."],
    ["06","Evidence, claims, and reproducibility","Content-addressed evidence records preserve the approved source, executed method, validated arguments, returned values, logical source locations, record IDs, and hashes. A citation must resolve to admitted evidence. Claim bindings retain dimensions, units, periods, and result paths; deterministic replay checks calculations against the authenticated source.",
      "The current conversational harness checks citation identity and source replay. It does not automatically prove that every free-form claim follows from its citation. Typed claim bindings in earlier workflows do not certify the experimental agent's prose. Metric meanings and inference limits accompany evidence; factual support, completeness, and consequential recommendations still require human review."],
    ["07","Time, state, and failure recovery","Event time and the time information became available are represented separately where the source supports them. Saved attempts retain original model output, execution state, code and model identities, and clean, degraded, insufficient, or failed outcomes. Historical schema readers and original attempts remain preserved.",
      "Invalid citations, conflicting evidence, failed execution, or stopped work stay visible. Request deadlines and budgets bound dispatch; a synchronous operation already running is not necessarily forcibly cancelled. Future distributed cancellation and recovery would need separate tests."],
    ["08","Evaluation and release decisions","Versioned cases check requested-part coverage, arithmetic, scope, units, source provenance, interpretation limits, and readable business conclusions. Deterministic checks run independently of the model; focused regressions identify the failing boundary before another live call. Qualification records latency, token counts, and the measured memory boundary.",
      "The candidate sequence starts with native transport, then retained answer-only cases, tool execution, and multi-turn conversation cases. A held-out company transfer test, human usefulness review, and an official Enterprise-Bench score remain future milestones. Known synthetic checks are not proof of enterprise generalization."]
  ].forEach(([num,title,copy,detail])=>{const chapter=element("details",undefined,"engineering-chapter");chapter.append(chapterSummary(num,title),element("p",copy),element("p",detail));chapters.append(chapter);});app.append(chapters,componentCatalog,principles,contribution);
  app.append(sectionHead("Harness Engineering in Practice","Keep the model focused on useful evidence while preserving the full investigation for inspection."));
  const harness=element("div",undefined,"engineering-chapters");
  [
    ["01","The execution loop","Question and accepted history → model request → validated tool call → deterministic result → evidence returned to the model. The model may request another tool or produce a draft. Clarifications, partial-work approvals, exhausted budgets, and failures have explicit states.","This is an agent harness, the runtime around the model. The separate evaluation harness tests that runtime and its outputs. Offline SDK fixtures test tool dispatch and continuation; they are not model-generated answers or proof of language quality."],
    ["02","Context engineering and memory","The complete audit and the model's working context serve different purposes. Compact financial and business-report views retain citation IDs, results, method arguments, scope, and interpretation limits while keeping internal audit metadata in storage. Document passages retain their source locations.","Accepted messages, tool results, and human review qualifications are supplied on follow-up turns. Stable policy and tool definitions lead each request; changing execution counters are appended to a copy of its final message. Saved conversation messages retain their original content and JSON order across reloads. Offline checks verify these boundaries. Context admission counts the serialized prompt and reserves output capacity; automatic history compaction is not enabled."],
    ["03","Measured efficiency, explicit limits","A retained request can be retokenized offline to compare evidence presentations before spending another inference call. New request records separate local admission time from HTTP response time and preserve the original wire payloads and reported token usage.","Transport time includes waiting, prompt processing, reasoning, and answer generation; it does not isolate those components. The request layout now preserves stable conversation prefixes in offline checks. Actual prefix-cache reuse, lower latency, and answer-quality gains still require separate measurement. Streamed draft delivery remains future work."],
    ["04","Structural diagnosis before another retry","Locate a failure in data, calculation, tool contracts, transport, context capacity, interpretation, or presentation. Reproduce it at that boundary, preserve the original attempt, and use focused offline regressions before considering another model call.","A valid citation is necessary but insufficient: average contract value is not unit price, and a descriptive contribution is not a causal effect. The harness supplies those distinctions and leaves unsupported prose visible for review. More fluent models still need this evidence discipline."],
    ["05","Discovery sized to the question","The existing discovery tool offers a compact catalog or a catalog with the account directory. Both retain field meanings, exact query values, method prerequisites, scope restrictions, and evidence gaps. Account names and IDs remain available when needed, within the approved population.","With the cached tokenizer, the compact v4 result uses 1,998 tokens versus 3,003 with all 42 accounts: 1,005 fewer tokens, or 33.47% of that result. This is an offline comparison of serialized result text, not a whole-investigation saving or a speed claim. The tool requires an explicit include_accounts boolean. Fetching compact and then full can cost more than requesting full once. Earlier evidence versions retain their original replay contracts."]
  ].forEach(([num,title,copy,detail])=>{const chapter=element("details",undefined,"engineering-chapter");chapter.append(chapterSummary(num,title),element("p",copy),element("p",detail));harness.append(chapter);});app.append(harness);
  const implementation=deeper("Inspect the implementation: frameworks, contracts, and request lifecycle",
    element("p","Pydantic AI runs the agent loop. Pydantic validates application data. Neither replaces the analytical methods, evidence ledger, or human review. This walkthrough describes the local experimental implementation, not a model running on this public site."));
  const implementationBody=element("div",undefined,"technical-body");
  [
    ["1. Compose the agent, not another planner","create_analyst_agent builds a Pydantic AI Agent with EvidenceToolbox dependencies, registered native tools, and outputs of either text or DeferredToolRequests. RunContext gives tools access to the admitted toolbox. Evidence extensions register additional capabilities without rewriting the model loop. The model interprets language and chooses available tools; the host does not route questions through a growing phrase-matching tree."],
    ["2. Keep serving behind an adapter","OpenAIChatModel and OpenAIProvider connect through the OpenAI Python client and an HTTPX transport to the localhost MLX-VLM server. OpenAI-compatible describes the protocol, not a cloud dependency. The transport checks the serialized request against the cached tokenizer and output reserve, captures request and response records, and validates completion metadata. Replacing the model still requires native tool-call, template, context, and answer-quality qualification."],
    ["3. Execute typed tools against admitted data","Pydantic schemas validate application contracts, while Pydantic AI exposes typed Python tool signatures to the model. EvidenceToolbox supplies approved sources and evidence operations. Governed Python reports and parameterized SQLite queries calculate results; the model is not asked to invent totals. Registered tools execute sequentially around shared evidence and session state. This is not unrestricted SQL, arbitrary Python execution, or a multi-agent swarm."],
    ["4. Return evidence, not just a tool message","A report produces an EvidenceRecord with source identity, method version, validated arguments, values, and a content-derived citation ID. Source replay checks that result against the admitted source. model_evidence_view creates a separate, versioned presentation for the model, preserving business meaning while leaving audit-only metadata in storage. Scoped lexical retrieval supplies document passages and locations; a vector database is not required or claimed."],
    ["5. Persist conversation and review state","The SQLite-backed session shell passes accepted message_history into the SDK and retains original SDK messages through ModelMessagesTypeAdapter. Human review qualifications accompany later turns without rewriting the original answer. The request wrapper adds a versioned execution-context suffix to a copy of the outgoing request and records that snapshot separately; it does not accumulate obsolete counters in saved history. JSON insertion order survives reopening, while identity hashing remains canonical. UsageLimits and durable reservations enforce request budgets. DeferredToolRequests and DeferredToolResults support partial-work approval. Failed attempts remain inspectable, with automatic retries disabled."],
    ["6. Separate execution checks from answer judgment","Offline FunctionModel fixtures exercise the SDK loop without inference; HTTPX fixtures check the actual transport boundary. Focused pytest checks cover dispatch, source replay, history, capacity, and failure states. These checks prove particular contracts, not that a model reasons reliably. Citation resolution does not prove a free-form claim, and valid JSON does not prove a useful answer. Human review and separate model-quality qualification remain necessary."],
    ["An example through those boundaries","For a regional performance question, the model can discover recorded categories, request a closed-won ACV breakdown, and compare two groups. Deterministic code computes counts, totals, means, and a volume/value bridge. The model receives evidence IDs and interpretation limits, then drafts an explanation or requests another supported check. A follow-up carries the accepted exchange and its review notes. The bridge describes the difference; it does not establish pricing behavior or causation."],
    ["What is reusable, and what still needs work","The reusable seams are the model/provider adapter, typed tool registry, source adapters, semantic definitions, evidence contracts, and session interface. Local modules include analyst_agent.py, agent_session.py, agent_capacity.py, agent_evidence_view.py, and provenance.py. These identify implementation responsibilities, not a promise that every local module is in the published milestone repository. Automatic context compaction, proven prefix-cache gains, streaming delivery, enterprise access controls, and qualified portability remain separate work."]
  ].forEach(([title,copy])=>implementationBody.append(panel(title,copy)));implementation.append(implementationBody);app.append(implementation);
  app.append(deeper("Current Local Integration Checkpoint",element("p","The dedicated local application connects source exploration, chart selections, model-led investigations, saved sessions, and evidence replay. The October 19 harness checkpoint adds compact evidence views, admission and transport timing, stable request-context assembly, and optional account-directory discovery. Focused offline checks cover request construction, historical replay, selected-source authority, native tool transport, and continuation."),element("p","A subsequent app check passed three HTTP checks and 12 interface checks. Browser inspection followed an account into its 232 opportunities, opened supporting chart records, and preserved that selection in Analyst's scope review. Those checks used scripted controls and deterministic calculations. Selected historical model runs returned verified regional figures but also exposed interpretation failures; model-quality qualification remains paused. The public site serves prepared examples, while newer engine changes remain local. General conversation reliability, performance gains, and production readiness are still unqualified.")));
  pageNext("How this could scale","scale","A larger model is one part of a larger operating system.");
}

const domainIdeas=[
  ["Revenue operations","Why is pipeline growing while revenue stays flat?","CRM, contract lines, revenue schedules, activation history, and account hierarchies.","Reconcile measures, segment the difference, identify contributors, and test timing explanations.","A reviewable account or segment plan, with missing evidence separated from a verified timing finding.","Contract value, cash, and recognized revenue need different measures."],
  ["Finance and FP&A","Revenue is stable. Why did gross margin move?","General ledger, recognized revenue, costs of service, products, cost centers, and allocation policies.","Build a margin bridge, separate mix from price and cost, and run explicit assumption scenarios.","A quantified explanation of the margin movement and a sensitivity range for a reviewed action.","The public sample has no matched costs. Forecasts need validated statistical methods and assumption disclosures."],
  ["Recruiting and people operations","Where is our hiring funnel slowing down?","ATS stage events, requisitions, interview scheduling, role requirements, and aggregated source data.","Compare time in stage, cohort conversion, vacancy age, and interview capacity for comparable roles.","A process bottleneck review and scheduling or sourcing experiment for human approval.","Start with aggregate process analysis. Individual hiring decisions need human judgment, appropriate access, and independently reviewed criteria."],
  ["Supply chain and operations","Why did on-time delivery fall while demand barely changed?","Purchase orders, inventory, shipment milestones, supplier lead times, demand, and capacity.","Segment delays, reconcile planned versus actual dates, and test supplier, stock, and capacity explanations.","A supplier or product review, followed by a controlled inventory or scheduling pilot where supported.","Forecasts and optimization need validated models, constraints, and uncertainty. Correlated delays do not establish a cause."],
  ["Customer support","Which issues deserve attention before the next customer review?","Ticket histories, severity, reopened cases, product issues, usage, and account context.","Compare demand, inspect repeated symptoms, verify issue links, and assess resolution quality.","A scoped quality review with traceable cases, an owner, and follow-up measures.","Ticket volume alone does not prove defects, customer loss, or financial impact."],
  ["Product and engineering","Which backlog items could relieve the most customer friction?","Issue state history, confirmed ticket links, usage, release events, and impact assessments.","Separate the active queue from historical volume, cluster verified symptoms, and compare candidate interventions.","An evidence-backed prioritization discussion and a measured release experiment.","Business impact and engineering effort must be supplied or estimated through reviewed methods."],
  ["Procurement and commercial terms","How do these agreements change our delivery obligations?","Executed agreements, amendments, service policies, supplier performance, and approved term definitions.","Retrieve cited clauses, compare obligations and exceptions, and reconcile terms with operational evidence.","A side-by-side negotiation brief with clear questions for the commercial or legal owner.","Templates are not executed contracts. Clause comparisons support review rather than legal conclusions."],
  ["Strategy and market planning","Which segments are worth a deeper expansion review?","Customer cohorts, market assumptions, product economics, pipeline history, and research sources.","Compare segment economics, separate scale from efficiency, and test scenarios using explicit assumptions.","A ranked set of research questions or pilot options with sensitivity and evidence coverage.","The engine should not invent market sizes, returns, or confidence probabilities."],
  ["Project and service delivery","Why are similar projects producing different outcomes?","Scope, milestones, capacity, timesheets, change orders, service costs, and client feedback.","Compare matched projects, quantify scope and cost differences, and test delivery explanations.","A process or staffing review with measurable pilot criteria.","Comparability, allocation rules, and source quality determine whether the comparison is useful."]
];

function renderPossibilities(){
  app.replaceChildren(heading("POSSIBILITIES","Different Teams. The Same Need For Answers.","Choose a business function to see a potential question, useful output, and the data it would require."));
  app.append(element("p","Potential Applications · These extensions would require additional data, tools, and validation.","scope-banner"));
  const tabs=element("div",undefined,"domain-tabs");tabs.setAttribute("role","group");tabs.setAttribute("aria-label","Choose a business domain");
  const detail=element("section",undefined,"domain-detail");
  const showDomain=index=>{tabs.querySelectorAll("button").forEach((item,i)=>{item.classList.toggle("active",i===index);item.setAttribute("aria-pressed",String(i===index));});const [name,question,data,analysis,outcome,limit]=domainIdeas[index];detail.replaceChildren(element("span","POTENTIAL APPLICATION","architecture-label"),element("h2",name),element("blockquote",question));const rows=element("dl",undefined,"domain-description");[["Connected evidence",data],["Analytical work",analysis],["What must be validated",limit]].forEach(([label,copy])=>{const row=element("div");row.append(element("dt",label),element("dd",copy));rows.append(row);});detail.append(element("h3","The Useful Outcome"),element("p",outcome),deeper("Data, Method, And Validation",rows));};
  domainIdeas.forEach(([name],i)=>tabs.append(button(name,()=>showDomain(i),"domain-tab")));app.append(tabs,detail);showDomain(0);
  app.append(sectionHead("The domain changes. So does the industry context.","Reuse the shared engine; configure the business vocabulary, source relationships, and tested methods for the implementation."));
  app.append(storyRows([["Software and subscription businesses","Connect sales, subscriptions, activation, support, and product work to investigate expansion, service delivery, and commercial obligations."],["Manufacturing and distribution","Use parts, plants, suppliers, orders, inventory, and shipment milestones to explore shortages, delivery performance, capacity, and cost variation."],["Retail and consumer businesses","Compare SKU and store economics, promotions, fulfillment, and demand. Scenario work needs explicit assumptions and appropriate forecasting methods."],["Professional services","Investigate project margins, utilization, delivery milestones, scope changes, and client demand with consistent allocation rules."],["Financial services and healthcare operations","Start with approved operational questions such as service demand, procurement, staffing capacity, and process delays. Regulated or consequential decisions require specialized governance and human authority."]]));
  const reuse=panel("What stays reusable?","Provider adapters, tool contracts, execution controls, evidence identity, replay, conversation state, and evaluation machinery can remain shared. Company joins, definitions, permissions, domain methods, and expected answers must be configured and validated.");app.append(reuse);
  pageNext("From one Mac to an enterprise deployment","scale","See what changes when the data estate, model, and user population become much larger.");
}

function renderScale(){
  app.replaceChildren(heading("ENTERPRISE SCALE · PROPOSED ARCHITECTURE","More data. More compute. The same evidence discipline.","A larger model could support deeper investigations. More users and more data also require reliable connections, permissions, and execution."));
  app.append(element("p","The Mac prototype is the starting point. The architecture below is a proposed expansion path, not a tested enterprise deployment or a capacity claim.","scope-banner"));
  app.append(sectionHead("Three deployment options","Choose where data and inference belong, then qualify the complete path."));
  const hosts=element("div",undefined,"portability-grid");[["LOCAL WORKSTATION","The starting point","Mac + MLX/MLX-VLM runs the current local baseline. Good for learning and scoped demonstrations; memory, latency, and concurrent use have practical limits."],["COMPANY-MANAGED GPU","A private runtime","A larger GPU host or cluster could serve a stronger model and queue concurrent investigations. Replace the serving adapter, then validate message formats, tools, quality, memory, and load."],["APPROVED HOSTED INFERENCE","A provider option","A company could choose a hosted model under its data and access policies. Minimize transmitted context, preserve source permissions and evidence contracts, and evaluate the adapter and answers."]].forEach(([label,title,copy])=>{const card=element("section",undefined,"architecture-card");card.append(element("span",label,"architecture-label"),element("h3",title),element("p",copy));hosts.append(card);});app.append(hosts);
  app.append(sectionHead("The model should receive the relevant evidence","Large enterprise tables belong in databases and analytical systems. Query and summarize them close to the source, then send bounded results and relevant document passages to the model."));
  const path=element("ol",undefined,"system-pipeline");[["SYSTEMS","CRM · ERP · documents"],["DATA ACCESS","Approved reporting views"],["SEMANTICS","Definitions + permissions"],["EXECUTION","Queries + retrieval"],["MODEL","Relevant evidence → answer"]].forEach(([label,copy])=>{const item=element("li");item.append(element("span",label,"architecture-label"),element("strong",copy));path.append(item);});app.append(path);
  const deep=element("div",undefined,"engineering-chapters");[
    ["01","Connect and maintain the data estate","Build versioned connectors for approved APIs, reporting views, warehouses, and document repositories. Use incremental refresh or change-data capture where appropriate. Map stable identities and relationships, retain provenance and freshness, and detect schema drift. Admission checks should reconcile known measures before the source becomes available to an analyst."],
    ["02","Execute analysis where it belongs","Push filtered joins and aggregations to the warehouse or lakehouse. Partition large queries, reuse validated reports, and cache results with their source version, semantics, and authorized scope. Run more specialized Python work in resource-limited workers with timeouts and isolated execution. Only relevant results enter the model context."],
    ["03","Retrieve documents with context and permissions","A future search layer could combine lexical retrieval, embeddings, metadata, and reranking. Document chunks need source locations and stable identities. Authorization must apply before evidence is returned, including caches and citations, so a user's answer never inherits another user's access."],
    ["04","Scale models and investigations independently","Separate model serving from orchestration and tool workers. Queues, admission control, batching, routing, and cancellation manage concurrent users and expensive work. Preserve per-run deadlines and tool budgets. A larger model may improve interpretation and multi-step reasoning; every candidate still needs the retained quality and conversation checks."],
    ["05","Make enterprise operations observable","Add identity, source-level permissions, secret handling, retention, monitoring, and recovery. Track source freshness, query time, model tokens, latency, cost per reviewed answer, failed steps, and citation coverage. Keep the executed methods and source versions available for replay rather than relying on a prose explanation alone."]
  ].forEach(([num,title,copy])=>{const chapter=element("details",undefined,"engineering-chapter");chapter.append(chapterSummary(num,title),element("p",copy));deep.append(chapter);});app.append(deep);
  app.append(sectionHead("What stronger compute could unlock","These are hypotheses to test against real workloads, not promised outcomes."));
  app.append(storyRows([["Deeper investigations","A more capable model could track compound questions, compare explanations, and use tools more reliably. It still needs sufficient source coverage and validated analytical methods."],["More simultaneous users","A larger serving pool and separate execution workers could support concurrent investigations. Measure queue delay, query contention, GPU memory, token throughput, and end-to-end answer quality under load."],["Richer source combinations","More connectors and a larger governed catalog could let one question cross more business systems. Correct joins, permissions, and time semantics become more important as coverage grows."]]));
  const capacity=panel("How to prove that it scales","Start with a representative question mix and real source distributions. Increase data volume and concurrency separately; measure p50/p95 response time, query cost, model memory, token use, citation correctness, and reviewer acceptance. Exercise stale sources, permission changes, timeouts, and recovery. No maximum data volume, concurrent-user count, or enterprise-grade SLA is claimed for this prototype.");app.append(deeper("How We Would Test Enterprise Scale",capacity));
  pageNext("A practical implementation roadmap","roadmap","Expand through measured company pilots, model qualification, and demonstrated transfer.");
}

function renderRoadmap(){
  app.replaceChildren(heading("ROADMAP + IMPLEMENTATION","A foundation that can grow with the models.","Start with one recurring management question, prove a useful answer, and expand only when the data, tools, and evidence support the next capability."));
  app.append(sectionHead("Four Steps To A Company Pilot","Qualify the model, configure the business context, prove useful work, and prepare the operating environment."));
  const next=element("ol",undefined,"implementation-steps");
  [
    ["Qualify the next model","Test language interpretation, compound requests, tool use, and evidence-backed answers against the retained cases. Measure memory, speed, and completeness before expanding the live experience."],
    ["Connect a company’s data and meaning","Start with approved read-only sources or reporting views. Map customer and product IDs, define metrics and fiscal periods, reconcile totals, and check coverage. Live refresh and generic onboarding remain to be built."],
    ["Prove transfer, then pilot","Freeze the shared core and test a second approved dataset with independently checked answers. Record the setup effort. Then run a narrow, human-reviewed company pilot with explicit success criteria."],
    ["Prepare for operational use","Implement identity, permissions, secrets handling, retention, and monitoring for the chosen environment. Validate refresh, schema changes, and recovery. Extend domain tools only when their calculations and evidence pass review."]
  ].forEach(([title,copy],i)=>{const row=element("li");row.append(element("span",String(i+1).padStart(2,"0"),"story-number"));const body=element("div");body.append(element("h3",title),element("p",copy));row.append(body);next.append(row);});app.append(next);
  const pilot=element("section",undefined,"pilot-measures");pilot.append(element("span","PROPOSED PILOT SCORECARD · BENEFITS HAVE NOT BEEN MEASURED","architecture-label"),element("h3","Define success before expanding."));
  const measures=element("dl");
  [["Time to a reviewed answer","Compare elapsed time and reviewer effort with the existing process on the same questions."],["Answer quality","Check calculations, question coverage, and appropriate uncertainty against independently reviewed answers."],["Evidence coverage","Measure whether material claims resolve to the correct records and reproducible calculations."],["Implementation effort","Track data mapping and setup effort, then test transfer to a second company without rewriting the shared core."]].forEach(([label,copy])=>{const item=element("div");item.append(element("dt",label),element("dd",copy));measures.append(item);});pilot.append(measures,element("p","Agree targets and review criteria with the pilot owner before testing. No time savings, financial return, or production readiness is claimed by this preview.","note"));app.append(deeper("How A Company Pilot Would Be Measured",pilot));

  const portabilityHead=sectionHead("The opportunity ahead","Mac was the starting point because it was the hardware available to me. A reusable analyst engine could extend across models, deployment environments, and corporate functions as each is validated.");
  const portability=element("div",undefined,"portability-grid");
  [
    ["CHANGE THE MODEL","Keep the analytical foundation","Qualify a stronger local model, or add an approved hosted-provider adapter. Preserve business definitions, tools, and evidence contracts. Model-agnostic means replaceable with testing; compatibility is not automatic."],
    ["CHANGE THE HOST","Choose the deployment boundary","A company-managed server or other hardware is a future option. Replace the MLX serving layer, then validate dependencies, performance, and security. Linux/Windows packaging and private-cloud deployment have not been tested."],
    ["CHANGE THE FUNCTION","Reuse the investigation pattern","Revenue operations, finance, support, product, and contract analysis can share the pattern. Each needs its own approved data, semantic mappings, analytical tools, and evaluation cases. Forecasting would also need validated statistical methods."]
  ].forEach(([label,title,copy])=>{const card=element("section",undefined,"architecture-card");card.append(element("span",label,"architecture-label"),element("h3",title),element("p",copy));portability.append(card);});

  app.append(deeper("Portability: Models, Hardware, And Business Functions",portabilityHead,portability));
  const tuning=element("details",undefined,"technical-notes tuning-note");tuning.append(element("summary","Where fine-tuning could fit"),element("p","After selecting and qualifying a baseline, fine-tuning could improve question interpretation, tool selection, or answer style using separately permitted training examples. Retrieval and source connections supply current business facts. Held-out evaluations must show a benefit over the untuned baseline; Enterprise-Bench evaluation data must stay out of training. No fine-tuned model is claimed here."));app.append(tuning);
  const qualification=element("div",undefined,"qualification-note");qualification.append(element("span","CURRENT CHECKPOINT","architecture-label"),element("strong","A working foundation, with a clear qualification gap."),element("p","The local 27B baseline has passed selected tool and evidence tests. Reliable general business conversations have not been qualified, and model experimentation is paused. A stronger model or larger machine may help; neither guarantees the missing behavior. The public demo remains a synthetic, read-only preview, with consequential conclusions subject to human review."));app.append(qualification);

  app.append(sectionHead("Where we can go from here","Separate useful product work from model-dependent qualification."));
  app.append(storyRows([["While model development is paused","Retain the verified harness checkpoint: compact evidence, optional account-directory discovery, stable request assembly, token accounting, and inspectable attempts. The dedicated app has passed focused offline checks. Further engine changes need a demonstrated gap; history compaction and streaming remain future options. Actual cache reuse, speed, and answer-quality gains await separate qualification."],["When a candidate is worth testing","Qualify native transport and known answer cases first. Then test tool execution, follow-ups, corrections, compound requests, and missing evidence. Review the business usefulness of the result before connecting live asking."],["After a useful company pilot","Test a second company with the shared core frozen and independent expected answers. Build refresh, production permissions, and recovery for the selected environment. Forecasting, optimization, and new domains each need reviewed methods."],["For broader credibility","Pursue the official Enterprise-Bench protocol when ready. Keep published benchmark results separate from known synthetic checks, private experiments, and company-transfer evidence."]]));
  const closing=panel("Why this is a portfolio project","The work connects business problem framing with data engineering, local inference, agent design, deterministic analysis, provenance, evaluation, and product UX. The strongest demonstration is a useful answer whose figures and limitations remain inspectable.");
  closing.append(storyLink("Explore the published engine milestones ↗","https://github.com/gravelgaucho/ai-business-operations-analyst"));app.append(closing);
  pageNext("Return to the two workflows","workflows","See the business experience that these engineering choices are intended to support.");
}

function appendDataCoverage(){
  const coverage=element("details",undefined,"technical-notes data-coverage");coverage.append(element("summary","What is connected? Seven synthetic source indexes"));
  const content=element("div");
  const metrics=element("div",undefined,"metric-grid");
  [["accounts","Accounts"],["opportunities","Opportunities"],["tickets","Support tickets"],["issues","Product issues"]].forEach(([key,label])=>{const card=element("div",undefined,"metric-card");card.append(element("span",sentenceText(label)),element("strong",number(summary.totals[key])),element("small","Verified synthetic source index"));metrics.append(card);});content.append(metrics);
  const categories=element("div",undefined,"category-grid overview-collections");
  Object.entries(categoryInfo).forEach(([key,info])=>{const card=button("",()=>{explore={category:key,query:"",facet:"",value:"",account:"",page:0};navigate("explore");},"category-card");card.append(element("span",number(summary.totals[key]),"count"),element("span",info.label,"label"),element("span","Open collection ↗","arrow"));categories.append(card);});content.append(categories);
  content.append(element("p","This public snapshot omits document bodies, contact details, saved model runs, and the separate finance test data. Source coverage is broader than the analyst’s qualified analytical capabilities.","note"));

  coverage.append(content);app.append(coverage);
}
