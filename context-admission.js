"use strict";

// Ignore delayed receipts after any question, scope, or selection edit.
function contextAdmission(send) {
  let revision = 0;
  return {
    invalidate() { revision++; },
    async validate(draft) {
      const current = ++revision;
      try {
        const receipt = await send(draft);
        if (current !== revision) return null;
        if (receipt.status !== "validated_not_executed" || receipt.execution_approved !== false ||
            receipt.model_requests !== 0 || !receipt.context_id || !receipt.context) {
          throw Error("The engine did not return a valid context receipt.");
        }
        return receipt;
      } catch (error) {
        if (current !== revision) return null;
        throw error;
      }
    }
  };
}

async function submitLocalContext(draft) {
  if (globalThis.LOCAL_BUSINESS_CONTEXT !== true ||
      !["127.0.0.1", "localhost"].includes(location.hostname)) {
    throw Error("Context validation is available only in the engine-backed local preview.");
  }
  const response = await fetch("/api/business/context", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body:JSON.stringify(draft), credentials:"omit", redirect:"error",
    signal:AbortSignal.timeout(15000)
  });
  const value = await response.json();
  if (!response.ok) throw Error(value.error || "Context validation failed. Prepare again.");
  return value;
}

if (typeof module !== "undefined") module.exports = {contextAdmission,submitLocalContext};
