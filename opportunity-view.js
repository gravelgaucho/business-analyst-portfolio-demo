"use strict";

function opportunityView(rows, getScope, onSelection, category="opportunities") {
  const definition=OpportunityChart.collections[category], isOpportunity=category==="opportunities";
  const box = element("section", undefined, "opportunity-viz panel");
  box.setAttribute("aria-label", `${categoryInfo[category].label} visualization`);
  const options = {category,dimension:definition.defaultDimension,metric:isOpportunity?"acv":"count",currency:"USD"};
  let selection = null, result, identity = "", draft = null, receipt = null;
  const admission = contextAdmission(submitLocalContext);
  const localValidation = globalThis.LOCAL_BUSINESS_CONTEXT === true;
  const top = element("div",undefined,"viz-top");
  top.append(element("div","VISUAL EXPLORATION","eyebrow"),element("h2",definition.title),element("p","Compare the filtered records, then select a bar to inspect what is behind it."));
  const controls = element("div",undefined,"viz-controls");
  function change(key,value){options[key]=value;selection=null;refresh();onSelection();}
  controls.append(fieldSelect("Chart measure",isOpportunity?[["acv","Recorded ACV"],["count","Opportunity count"]]:[["count",`${definition.noun[0].toUpperCase()+definition.noun.slice(1)} count`]],options.metric,value=>change("metric",value)),
    fieldSelect("Group chart by",Object.entries(definition.dimensions),options.dimension,value=>change("dimension",value)));
  const currencyControl = fieldSelect("Chart currency",[...new Set(rows.map(row=>row.currency).filter(Boolean))].sort().map(value=>[value,value]),options.currency,value=>change("currency",value));
  controls.append(currencyControl);
  const headline=element("p",undefined,"viz-headline"),scopeLine=element("p",undefined,"note"),bars=element("div",undefined,"viz-bars"),selected=element("div",undefined,"viz-selection");
  const method=element("details",undefined,"visitor-detail");method.append(element("summary","How this chart is calculated"),element("p",isOpportunity?"The chart uses all matching records before pagination. Counts count opportunity records. Recorded annual contract value (ACV) is summed in the selected source currency, rounded to hundredths per record. Currencies are never converted or combined. Region comes from the linked account; sales motion comes from the recorded opportunity type. Missing groups remain visible.":"Each group counts distinct matching records before pagination. Product areas follow explicit component-parent links. A record can belong to multiple areas, so group counts and shares can overlap. Duplicate links within an area count only once. Records without an area appear under Not recorded. The overall total counts each record once."),element("p",isOpportunity?"This is a snapshot across all recorded stages unless you apply a stage filter above. It is not a historical pipeline trend, recognized revenue, cash, or a forecast. No verified product mapping is available for these opportunities.":"Priority and status are recorded labels in the connected snapshot. Counts do not establish a current outage, customer impact, a common cause, or the value of a fix. Account filtering is available for tickets; product issues do not have a verified direct account mapping in this projection."),element("p",`Pinned source: ${summary.source_commit} · Manifest: ${summary.manifest_sha256}`,"note"));
  const handoff=element("details",undefined,"viz-handoff");handoff.append(element("summary","Prepare a question about these records"));
  handoff.append(element("p",localValidation?"Prepare a question and verify its selection against the local engine's source records. This does not run a model or approve an investigation.":"Save a question with the exact records and filters you selected. Download the draft to inspect or reuse it. This public demo does not submit or answer new questions."));
  const questionLabel=element("label","Your question"),question=element("textarea");question.id="chart-question";questionLabel.htmlFor=question.id;question.rows=3;question.maxLength=2000;question.placeholder=isOpportunity?"What explains the difference between these regions?":"Which of these records should we review first, and why?";
  const draftStatus=element("p","No draft prepared.","note");draftStatus.setAttribute("role","status");
  const draftDetails=element("div",undefined,"viz-draft");
  const download=button("Download context JSON",()=>{if(!draft)return;const url=URL.createObjectURL(new Blob([JSON.stringify(receipt?{draft,receipt}:draft,null,2)],{type:"application/json"}));const link=document.createElement("a");link.href=url;link.download=`${category}-question-context.json`;link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});download.hidden=true;
  const transfer=button("Open in local session",async()=>{
    if(!draft||!receipt||typeof globalThis.LOCAL_SESSION_TRANSFER!=="function")return;
    const captured=draft;transfer.disabled=true;
    try{
      await globalThis.LOCAL_SESSION_TRANSFER(captured);
      if(box.isConnected&&draft===captured)location.assign("/local-session");
      else if(box.isConnected)draftStatus.textContent="The earlier selection was transferred. Your edited selection was not sent. Open the local session to review it; nothing ran.";
    }catch(error){if(box.isConnected&&draft===captured)draftStatus.textContent=error.message;}
    finally{transfer.disabled=false;}
  });transfer.hidden=true;
  function invalidate(){admission.invalidate();draft=null;receipt=null;download.hidden=true;transfer.hidden=true;draftDetails.replaceChildren();draftStatus.textContent="No current draft. Prepare again after editing the question or changing the selection.";}
  question.addEventListener("input",invalidate);
  const prepare=button("Prepare question context",async()=>{
    if(!question.value.trim()){draftStatus.textContent="Enter a question first.";question.focus();return;}
    receipt=null;transfer.hidden=true;
    draft=OpportunityChart.context(result,getScope(),options,selection,summary,question.value.trim());
    draftStatus.textContent=`Draft ready for ${number(draft.record_ids.length)} records. Nothing was sent to a model.`;
    const explanation=element("p",`${draft.units} · ${definition.dimensions[options.dimension]} · ${selection?display(selection.key):"All chart groups"}. Includes your current search, account and dimension filters, source identity, and exact record IDs.`);
    const details=element("details");details.append(element("summary","Inspect the full context"),element("pre",JSON.stringify(draft,null,2)));draftDetails.replaceChildren(explanation,details);download.hidden=false;
    if(localValidation){
      draftStatus.textContent="Checking this selection against the local source records…";
      try{
        const verified=await admission.validate(draft);
        if(!verified||!box.isConnected)return;
        receipt=verified;
        transfer.hidden=typeof globalThis.LOCAL_SESSION_TRANSFER!=="function";
        draftStatus.textContent=`Selection verified: ${number(receipt.context.record_count)} records. No model ran. Investigation approval is still required.`;
        const audit=element("details");audit.append(element("summary","Inspect server evidence"),element("pre",JSON.stringify(receipt,null,2)));draftDetails.append(audit);
      }catch(error){
        if(box.isConnected)draftStatus.textContent=`Not validated: ${error.message} Your draft is retained. Nothing ran.`;
      }
    }
  });
  handoff.append(questionLabel,question,prepare,download,transfer,draftStatus,draftDetails);
  box.append(top,controls,headline,scopeLine,bars,selected,method,handoff);
  function format(value){return options.metric==="acv"?`${options.currency} ${number(value)}`:number(value);}
  function refresh(){
    const focusedGroup=bars.contains(document.activeElement)?document.activeElement.dataset.group:undefined;
    result=OpportunityChart.calculate(rows,getScope(),options);
    const nextIdentity=JSON.stringify([getScope().query,getScope().account,getScope().facet,getScope().value,getScope().facet2,getScope().value2,getScope().facet3,getScope().value3,options]);
    if(nextIdentity!==identity){selection=null;identity=nextIdentity;invalidate();}
    if(selection&&!result.bars.some(bar=>bar.key===selection.key)){selection=null;invalidate();}
    currencyControl.hidden=options.metric!=="acv";
    const largest=result.bars[0];
    const share=largest&&result.total>0&&result.bars.every(bar=>bar.value>=0)?` (${(largest.value/result.total*100).toFixed(1)}% of the displayed total)`:"";
    headline.textContent=largest?`${display(largest.key)} has the largest ${options.metric==="acv"?"recorded ACV":`${definition.noun} count`}: ${format(largest.value)}${share}.`:"No records match this chart scope.";
    const statuses=[...new Set(result.rows.map(row=>display(row[isOpportunity?"stage":"status"])))].sort().join(", ");
    scopeLine.textContent=`${number(result.rows.length)} chart records · Total ${format(result.total)} · All recorded dates. ${isOpportunity?"Stages":"Statuses"}: ${statuses||"none"}. ${result.overlapping?"Product-area groups overlap; their counts and shares are not additive. ":""}${result.otherCurrency?`${number(result.otherCurrency)} records in other or missing currencies excluded. `:""}${result.invalid?`${number(result.invalid)} records with missing or invalid ACV excluded. `:""}${result.bars.some(bar=>bar.value<0)?"Bar lengths show absolute magnitude; labels retain the sign. ":""}Select a bar to narrow the records below.`;
    bars.replaceChildren();const max=Math.max(...result.bars.map(bar=>Math.abs(bar.value)),1);
    for(const group of result.bars){
      const bar=button("",()=>{selection=selection?.key===group.key?null:{key:group.key};invalidate();refresh();onSelection();},"viz-bar");
      bar.setAttribute("aria-pressed",String(selection?.key===group.key));bar.setAttribute("aria-label",`${display(group.key)}: ${format(group.value)}, ${number(group.count)} records`);
      bar.dataset.group=JSON.stringify(group.key);
      const label=element("span",display(group.key),"viz-label"),track=element("span",undefined,"viz-track"),fill=element("span",undefined,"viz-fill");fill.style.width=`${Math.abs(group.value)/max*100}%`;track.append(fill);track.setAttribute("aria-hidden","true");
      bar.append(label,track,element("span",options.metric==="acv"?`${format(group.value)} · ${number(group.count)} records`:`${number(group.count)} records`,"viz-value"));bars.append(bar);
    }
    if(focusedGroup!==undefined)[...bars.children].find(bar=>bar.dataset.group===focusedGroup)?.focus({preventScroll:true});
    const selectedCount=OpportunityChart.selectedRows(result,options,selection).length;
    selected.replaceChildren(element("span",selection?`Inspecting ${display(selection.key)} · ${number(selectedCount)} records`:`Inspecting all chart groups · ${number(selectedCount)} records`));
    if(selection)selected.append(button("Clear chart selection",()=>{selection=null;invalidate();refresh();onSelection();}));
    prepare.disabled=!selectedCount;
    return OpportunityChart.selectedRows(result,options,selection);
  }
  return {box,refresh};
}
