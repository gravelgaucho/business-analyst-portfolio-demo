/* Prepared, source-backed story. Scroll changes presentation, never the data. */
function landingIntro(){
  const root=element("section",undefined,"landing-intro");
  root.setAttribute("aria-label","From company data to an informed decision");
  const reduce=matchMedia("(prefers-reduced-motion: reduce)"),steps=[],choices=[];
  const link=(label,view,style="text-button")=>button(label,()=>navigate(view),style);
  const openData=(region="")=>{
    explore={category:"opportunities",query:"",facet:region?"account_region":"",value:region,facet2:region?"stage":"",value2:region?"closed_won":"",account:"",page:0};navigate("explore");
  };
  const caption=text=>element("span",text,"intro-kicker");
  const stage=name=>{const box=element("section",undefined,"intro-step intro-"+name);box.id="intro-"+name;steps.push(box);return box;};
  const stepHead=(number,label,title,copy)=>{const box=element("header",undefined,"intro-step-head");box.append(element("span",number,"intro-step-number"),caption(label),element("h2",title),element("p",copy));return box;};
  const jump=i=>{const offset=document.querySelector(".site-header").getBoundingClientRect().height+24;window.scrollTo({top:Math.max(0,steps[i].getBoundingClientRect().top+scrollY-offset),behavior:reduce.matches?"instant":"smooth"});};

  const lead=stage("explore");lead.classList.add("intro-lead");
  const copy=element("div",undefined,"intro-lead-copy");
  const opening=element("div",undefined,"intro-opening-label");opening.append(element("span","01","intro-step-number"),caption("EXPLORE YOUR DATA"));copy.append(opening);
  const title=element("h1");title.append(element("span","Explore the Business."),element("span","Question the Numbers.","intro-title-accent"));
  copy.append(title,element("p","A business intelligence workspace with an AI analyst. Connect company data, investigate questions, and follow answers back to the evidence.","intro-lead-description"));
  const actions=element("div",undefined,"actions intro-entry-actions");actions.append(link("Explore the demo","workflows","btn primary"),link("View video walk-throughs","about","btn"));copy.append(actions,element("p","Built locally, designed to evolve.","intro-built"));
  const visual=element("div",undefined,"intro-product"),sources=element("div",undefined,"intro-sources");
  ["Sales","Finance","Contracts","Support"].forEach(label=>{const chip=element("div",undefined,"intro-source");chip.append(element("strong",label));sources.append(chip);});
  visual.append(sources,element("div","Separate systems. A connected view.","intro-source-caption"));
  const workspace=element("div",undefined,"intro-workspace"),top=element("div",undefined,"intro-workspace-top");
  top.append(element("span","BA","intro-mini-brand"),element("strong","Data workspace"));workspace.append(top);
  const body=element("div",undefined,"intro-workspace-body");
  body.append(caption("EXPLORE WITHOUT ASKING AI"),element("h2","What Do the Numbers Say?"));
  const stats=element("div",undefined,"intro-stats");
  [["42","Accounts"],["8,704","Opportunities"],["7","Source indexes"]].forEach(([n,label])=>{const stat=element("div");stat.append(element("strong",n),element("span",label));stats.append(stat);});body.append(stats);
  const chart=element("div",undefined,"intro-region-chart");
  chart.append(element("p","Won annual contract value","intro-chart-title"),element("span","Americas · USD · All recorded dates","intro-chart-unit"));
  [["West","$173.875M",.7991],["East","$217.590M",1]].forEach(([name,value,width])=>{
    const row=button("",()=>openData("Americas/"+name),"intro-region-link");row.setAttribute("aria-label","Inspect "+name+" closed-won opportunities");
    const labels=element("span",undefined,"intro-bar-label");labels.append(element("span",name),element("strong",value),element("span","↗","intro-bar-arrow"));
    const track=element("span",undefined,"intro-bar-track"),bar=element("i");bar.style.setProperty("--amount",width);track.append(bar);row.append(labels,track);chart.append(row);
  });
  body.append(chart,button("Browse the source records ↗",()=>openData(),"intro-open-data"));workspace.append(body);visual.append(workspace);lead.append(copy,visual);
  const problem=element("div",undefined,"intro-problem");problem.append(caption("THE PROBLEM"),element("p","Sales has the pipeline. Finance has the revenue. Support has the history. A useful business answer needs the pieces to work together."));lead.append(problem);root.append(lead);
  const nav=element("div",undefined,"intro-story-nav"),tabs=element("div",undefined,"intro-story-tabs");tabs.setAttribute("role","group");tabs.setAttribute("aria-label","Investigation chapters");
  ["Explore","Ask","Inspect","Decide","Under the hood"].forEach((name,i)=>{const item=button("",()=>jump(i),"intro-tab");item.append(element("span",String(i+1).padStart(2,"0")),element("span",name));choices.push(item);tabs.append(item);});
  let paused=false;
  const pause=button("Pause motion",()=>{paused=!paused;root.dataset.motion=paused?"paused":"playing";pause.textContent=paused?"Resume motion":"Pause motion";pause.setAttribute("aria-pressed",String(paused));},"intro-motion-toggle");pause.setAttribute("aria-pressed","false");pause.hidden=reduce.matches;nav.append(tabs,pause);root.insertBefore(nav,lead);
  const handoff=button("",()=>jump(1),"intro-handoff");handoff.append(element("span","↓","intro-handoff-arrow"),element("span","The workspace shows the gap. Now ask what explains it."));root.append(handoff);
  const journey=element("div",undefined,"intro-journey");
  const ask=stage("ask");ask.append(stepHead("02","ASK A QUESTION","The Question Is Just the Beginning.","The model interprets your words. The harness connects the right context and tools. The tools return calculations and records you can check."));
  const investigation=element("div",undefined,"intro-investigation"),prompt=element("blockquote","Why is East ahead of West? How much is deal count versus deal size?","intro-prompt"),path=element("ol",undefined,"intro-tool-path");
  [["Understand","Compare East and West","Language model"],["Scope","Won contracts · USD","Business definitions"],["Calculate","Count × average deal value","Deterministic tool"]].forEach(([label,description,term])=>{const item=element("li");item.append(caption(term),element("strong",label),element("span",description));path.append(item);});
  investigation.append(prompt,path);ask.append(investigation);journey.append(ask);
  const inspect=stage("inspect");inspect.append(stepHead("03","INSPECT THE NUMBERS","See What Sits behind the Gap.","East has $43.715M more won contract value. About 93% of the difference comes from having more won deals. That tells us what makes up the gap, not why it happened."));
  const result=element("div",undefined,"intro-result"),resultTop=element("div",undefined,"intro-result-top");
  resultTop.append(caption("EAST VS. WEST"),element("strong","+$43.715M","intro-result-total"),element("span","Recorded won annual contract value · +25.1%","intro-chart-unit"));result.append(resultTop);
  const bridge=element("div",undefined,"intro-bridge");bridge.setAttribute("aria-label","Deal count accounts for 93.2 percent of the gap; average deal value accounts for 6.8 percent");bridge.append(element("span",undefined,"intro-bridge-volume"),element("span",undefined,"intro-bridge-value"));result.append(bridge);
  const keys=element("div",undefined,"intro-bridge-key");
  [["93.2%","More won deals","$40.735M · 365 additional deals"],["6.8%","Average deal value","$2.980M · about 1.4% higher"]].forEach(([value,label,note])=>{const item=element("div");item.append(element("strong",value),element("span",label),element("small",note));keys.append(item);});result.append(keys);
  const evidence=element("details",undefined,"intro-evidence");evidence.append(element("summary","Inspect the calculation and its limits"),element("p","Using West as the baseline: (1,923 − 1,558) won deals × West’s unrounded average deal value = $40,734,515. The remaining $2,980,485 comes from the average-value difference. Together they reconcile to $43,715,000."),element("p","Source: the account and opportunity indexes across all recorded dates. ACV is annual contract value, not revenue or cash. This descriptive, baseline-dependent calculation does not establish causation."));
  const evidenceLinks=element("div",undefined,"actions");evidenceLinks.append(button("Inspect West records ↗",()=>openData("Americas/West"),"text-button"),button("Inspect East records ↗",()=>openData("Americas/East"),"text-button"));evidence.append(evidenceLinks);result.append(evidence);inspect.append(result);journey.append(inspect);
  const decide=stage("decide");decide.append(stepHead("04","CHALLENGE THE FINDING","Keep Asking. The Reading Changes.","A large total can hide an important difference. Follow-up questions test the first interpretation before anyone changes a plan."));
  const followup=element("div",undefined,"intro-followup");followup.append(caption("FOLLOW-UP QUESTION"),element("blockquote","Should West copy East’s sales approach?"));
  const checks=element("div",undefined,"intro-checks");
  [["Account coverage","14 East / 11 West","East has more indexed accounts."],["Won value per account","West is 1.7% higher","The headline lead does not hold on this basis."],["Comparable populations?","Different account mixes","These totals do not establish which team sells better."]].forEach(([label,value,note])=>{const row=element("div");row.append(caption(label),element("strong",value),element("span",note));checks.append(row);});followup.append(checks);
  const decision=element("div",undefined,"intro-decision");decision.append(caption("THE DECISION THIS EVIDENCE SUPPORTS"),element("h3","Hold the Rollout. Make the Comparison Fair."),element("p","Ask sales operations to compare matched, dated groups and account potential. Test whether West needs more opportunities or a different sales process before proposing a pilot."),link("Follow the complete case ↗","case","btn"));
  followup.append(decision);decide.append(followup);journey.append(decide);
  const engine=stage("engine");engine.append(stepHead("05","THE SYSTEM BEHIND THE EXPERIENCE","The Model Reasons. The Engine Connects.","The agent harness manages the investigation loop: context in, tool requests out, evidence back. Your definitions and tools stay with the system when the model changes."));
  const architecture=element("div",undefined,"intro-architecture"),inputs=element("div",undefined,"intro-engine-inputs");
  [["Company data","Records + document retrieval"],["Business semantics","Metric definitions + scope"],["Replaceable model","Language + tool calling"]].forEach(([name,sub])=>{const node=element("div");node.append(element("strong",name),element("span",sub));inputs.append(node);});architecture.append(inputs);
  const harness=element("div",undefined,"intro-harness");harness.append(caption("THE INVESTIGATION LOOP"),element("strong","Analyst harness"),element("span","Context → tool contracts → execution → evidence → next step"));architecture.append(harness);
  const outputs=element("div",undefined,"intro-engine-outputs");["Deterministic analysis","Inspectable evidence","Human-reviewed decisions"].forEach(label=>outputs.append(element("span",label)));architecture.append(outputs,link("Open the interactive technical schematic ↗","engineering","text-button"));engine.append(architecture);journey.append(engine);root.append(journey);

  // Content remains available without motion. Dispose listeners when leaving this view.
  let frame=0,disposed=false;
  const update=()=>{
    frame=0;if(disposed||!root.isConnected)return;let active=0;
    const journeyRect=journey.getBoundingClientRect();journey.style.setProperty("--progress",Math.max(0,Math.min(1,(innerHeight*.6-journeyRect.top)/journeyRect.height)).toFixed(3));
    const headerHeight=document.querySelector(".site-header").getBoundingClientRect().height;
    const readingLine=headerHeight+Math.min(200,(innerHeight-headerHeight)*.35);
    steps.forEach((step,i)=>{const rect=step.getBoundingClientRect(),contentTop=rect.top+parseFloat(getComputedStyle(step).paddingTop);if(contentTop<=readingLine)active=i;const progress=Math.max(0,Math.min(1,(innerHeight-rect.top)/(innerHeight*.72)));step.style.setProperty("--reveal",progress.toFixed(3));step.style.setProperty("--drift",Math.max(-1,Math.min(1,(rect.top-innerHeight*.28)/innerHeight)).toFixed(3));});
    choices.forEach((choice,i)=>{steps[i].classList.toggle("is-current",i===active);choice.setAttribute("aria-pressed",String(i===active));if(i===active)choice.setAttribute("aria-current","step");else choice.removeAttribute("aria-current");});
  };
  const request=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(update);};
  const preference=()=>{pause.hidden=reduce.matches;request();};
  const removal=new MutationObserver(()=>{if(!root.isConnected){disposed=true;cancelAnimationFrame(frame);window.removeEventListener("scroll",request);window.removeEventListener("resize",request);reduce.removeEventListener("change",preference);removal.disconnect();}});
  removal.observe(app,{childList:true});window.addEventListener("scroll",request,{passive:true});window.addEventListener("resize",request);reduce.addEventListener("change",preference);request();return root;
}
