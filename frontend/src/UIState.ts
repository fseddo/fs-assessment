import type { PingOutcome } from "./api";

// Lifecycle-only states unioned with the API result variants. Keeps the
// success/error shapes in lockstep with PingOutcome — change one, both update.
export type UiState = { kind: "idle" } | { kind: "loading" } | PingOutcome;
