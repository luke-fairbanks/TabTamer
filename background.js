// Tab Tamer — frees memory by discarding (snoozing) inactive background tabs.
// Discarded tabs stay in the tab strip and reload instantly when clicked; this
// is Chrome's own native tab-discard, so no page data/URLs are touched.
//
// Needs no "tabs" permission: we only read non-sensitive fields (active, pinned,
// audible, discarded, lastAccessed, id) — never URLs or titles. So the extension
// has zero access to your browsing history.

const DEFAULTS = { autoOn: true, minutes: 10 };

async function getCfg() {
  const c = await chrome.storage.sync.get(DEFAULTS);
  return {
    autoOn: c.autoOn !== false,
    minutes: Math.max(1, Math.min(120, parseInt(c.minutes, 10) || 10)),
  };
}

// A tab is fair game if it's a background tab the user hasn't touched in a while,
// isn't pinned, isn't making noise, and isn't already snoozed.
function snoozeable(t) {
  return !t.active && !t.pinned && !t.audible && !t.discarded;
}

async function snoozeIdle() {
  const { autoOn, minutes } = await getCfg();
  if (!autoOn) return;
  const cutoff = Date.now() - minutes * 60000;
  const tabs = await chrome.tabs.query({});
  for (const t of tabs) {
    if (snoozeable(t) && t.lastAccessed != null && t.lastAccessed <= cutoff) {
      try { await chrome.tabs.discard(t.id); } catch (e) {}
    }
  }
}

async function snoozeNow() {
  const tabs = await chrome.tabs.query({});
  let n = 0;
  for (const t of tabs) {
    if (snoozeable(t)) {
      try { await chrome.tabs.discard(t.id); n++; } catch (e) {}
    }
  }
  return n;
}

function arm() { chrome.alarms.create("sweep", { periodInMinutes: 1 }); }
chrome.runtime.onInstalled.addListener(arm);
chrome.runtime.onStartup.addListener(arm);
chrome.alarms.onAlarm.addListener(a => { if (a.name === "sweep") snoozeIdle(); });
chrome.commands.onCommand.addListener(c => { if (c === "snooze-now") snoozeNow(); });

chrome.runtime.onMessage.addListener((msg, _sender, reply) => {
  if (msg.type === "snoozeNow") { snoozeNow().then(n => reply({ discarded: n })); return true; }
  if (msg.type === "stats") {
    chrome.tabs.query({}).then(tabs => {
      const total = tabs.length;
      const loaded = tabs.filter(t => !t.discarded).length;
      reply({ total, loaded, discarded: total - loaded });
    });
    return true;
  }
});
