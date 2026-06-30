# Privacy Policy — Tab Tamer

_Last updated: 2026-06-27_

Tab Tamer does **not** collect, store, transmit, or sell any personal or
browsing data. Everything it does happens locally in your browser.

## What it accesses

- **Tab state (in-memory only):** Tab Tamer reads non-sensitive tab properties
  — whether a tab is active, pinned, playing audio, already discarded, and when
  it was last focused — solely to decide which background tabs to discard
  (snooze). It does **not** request Chrome's `tabs` permission and therefore
  **cannot read your URLs, page contents, titles, or browsing history.**
- **Preferences (`storage`):** Your settings (auto-snooze on/off and the idle
  timeout in minutes) are saved using Chrome's extension storage so they persist
  and sync across your own signed-in Chrome instances. Nothing else is stored.
- **Alarms (`alarms`):** A once-per-minute timer wakes the extension to snooze
  tabs that have been idle past your timeout.

## What it does NOT do

- No data is sent to any server. Tab Tamer makes **zero network requests**.
- No analytics, telemetry, tracking, or advertising.
- No remotely hosted or executed code.
- No access to website content, cookies, or history.

## Contact

Questions or issues: https://github.com/luke-fairbanks/TabTamer/issues
