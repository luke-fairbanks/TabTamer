const $ = s => document.querySelector(s);

function refresh() {
  chrome.runtime.sendMessage({ type: "stats" }, r => {
    if (chrome.runtime.lastError || !r) return;
    $("#loaded").textContent = r.loaded;
    $("#total").textContent = r.total;
  });
}

function paintSwitch(on) {
  $("#autoSw").classList.toggle("on", on);
  $("#autoOn").checked = on;
}

chrome.storage.sync.get({ autoOn: true, minutes: 10 }, c => {
  paintSwitch(c.autoOn !== false);
  $("#minutes").value = c.minutes || 10;
});

$("#snooze").addEventListener("click", () => {
  const btn = $("#snooze");
  btn.textContent = "Snoozing…";
  chrome.runtime.sendMessage({ type: "snoozeNow" }, r => {
    btn.textContent = (r && typeof r.discarded === "number")
      ? `Snoozed ${r.discarded} tab${r.discarded === 1 ? "" : "s"}`
      : "Done";
    refresh();
    setTimeout(() => { btn.textContent = "Snooze background tabs"; }, 1800);
  });
});

$("#autoSw").addEventListener("click", () => {
  const on = !$("#autoOn").checked;
  paintSwitch(on);
  chrome.storage.sync.set({ autoOn: on });
});

$("#minutes").addEventListener("change", e => {
  const v = Math.max(1, Math.min(120, parseInt(e.target.value, 10) || 10));
  e.target.value = v;
  chrome.storage.sync.set({ minutes: v });
});

refresh();
