"use strict";

// One population contract for the chart, record list, and prospective engine handoff.
const OpportunityChart = (() => {
  const dimensions = {account_region:"Region", stage:"Stage", opportunity_type:"Sales motion"};
  const collections = {
    opportunities:{dimensions,id:"opportunity_id",title:"See the Opportunity Mix",noun:"opportunity",defaultDimension:"account_region"},
    tickets:{dimensions:{product_areas:"Product area",ticket_type:"Ticket type",priority:"Priority",status:"Status",account_region:"Region"},id:"ticket_id",title:"See the Support Mix",noun:"ticket",defaultDimension:"product_areas"},
    issues:{dimensions:{product_areas:"Product area",issue_type:"Issue type",priority:"Priority",status:"Status"},id:"issue_id",title:"See the Product Issue Mix",noun:"issue",defaultDimension:"product_areas"}
  };
  const groupsOf = (row, dimension) => {
    const value=row[dimension];
    const values=[...new Set((Array.isArray(value)?value:[value]).filter(item=>item!=null&&item!==""))];
    return values.length?values:[null];
  };
  function matches(row, scope) {
    const needle = (scope.query || "").trim().toLowerCase();
    const text = value => value == null || value === "" ? "Not recorded" : Array.isArray(value) ? value.join(", ") : String(value).replaceAll("_", " ");
    return (!needle || Object.values(row).some(value => text(value).toLowerCase().includes(needle))) &&
      (!scope.account || row.account_id === scope.account) &&
      [[scope.facet,scope.value],[scope.facet2,scope.value2],[scope.facet3,scope.value3]].every(([field,value]) =>
        !field || !value || (Array.isArray(row[field])?row[field]:[row[field]??"Not recorded"]).includes(value));
  }
  function calculate(rows, scope, options) {
    const category=options.category||"opportunities", definition=collections[category];
    if (!definition || !Object.hasOwn(definition.dimensions, options.dimension) || !["count","acv"].includes(options.metric) || (category!=="opportunities"&&options.metric!=="count")) throw Error("Unknown chart definition.");
    const filtered = rows.filter(row => matches(row, scope));
    const currencyRows = options.metric === "acv" ? filtered.filter(row => row.currency === options.currency) : filtered;
    const usable = options.metric === "acv" ? currencyRows.filter(row => typeof row.acv === "number" && Number.isFinite(row.acv)) : currencyRows;
    const groups = new Map();
    // Integer hundredths prevent accumulated binary rounding in displayed monetary totals.
    for (const row of usable) {
      const amount = options.metric === "acv" ? Math.round(row.acv * 100) : 1;
      for(const key of groupsOf(row,options.dimension)){
        if (!groups.has(key)) groups.set(key, {key, count:0, minor:0});
        const group = groups.get(key);
        group.count++;
        if (!Number.isSafeInteger(amount) || !Number.isSafeInteger(group.minor + amount)) throw Error("Value exceeds the supported calculation range.");
        group.minor += amount;
      }
    }
    const divisor = options.metric === "acv" ? 100 : 1;
    const bars = [...groups.values()].map(group => ({key:group.key,count:group.count,value:group.minor/divisor})).sort((a,b) => b.value-a.value || String(a.key).localeCompare(String(b.key)));
    const totalMinor = usable.reduce((total,row)=>total+(options.metric==="acv"?Math.round(row.acv*100):1),0);
    if (!Number.isSafeInteger(totalMinor)) throw Error("Total exceeds the supported calculation range.");
    return {rows:usable, bars, total:totalMinor/divisor, filteredCount:filtered.length,
      overlapping:usable.some(row=>groupsOf(row,options.dimension).length>1),
      otherCurrency:filtered.length-currencyRows.length, invalid:currencyRows.length-usable.length};
  }
  function selectedRows(result, options, selection) {
    return selection ? result.rows.filter(row => groupsOf(row, options.dimension).includes(selection.key)) : result.rows;
  }
  function context(result, scope, options, selection, source, question) {
    const category=options.category||"opportunities", definition=collections[category];
    return {version:1, status:"draft_not_submitted", question, source:{dataset:source.dataset,commit:source.source_commit,manifest_sha256:source.manifest_sha256},
      collection:category, metric:options.metric === "acv" ? "recorded_acv" : `${definition.noun}_count`,
      units:options.metric === "acv" ? options.currency : "records", group_by:options.dimension,
      filters:Object.fromEntries(["query","account","facet","value","facet2","value2","facet3","value3"].map(key=>[key,scope[key]||""])),
      selected_group:selection ? {field:options.dimension,value:selection.key} : null,
      record_ids:selectedRows(result,options,selection).map(row=>row[definition.id]),
      chart_total:result.total, chart_record_count:result.rows.length,
      exclusions:{other_or_missing_currency:result.otherCurrency,invalid_acv:result.invalid},
      time_scope:"Pinned snapshot; no period filter or historical stage reconstruction",
      limits:["Synthetic data",...(category==="opportunities"?["ACV is not revenue, cash, or a forecast", "No verified opportunity-to-product mapping"]:["Recorded status is not verified current impact", "Product areas follow explicit component-parent links; memberships can overlap"]), "No causal conclusion", "Engine must validate this context before use"],
      group_memberships_overlap:result.overlapping};
  }
  return {dimensions,collections,calculate,selectedRows,context};
})();
if (typeof module !== "undefined") module.exports = OpportunityChart;
