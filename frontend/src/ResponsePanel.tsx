import type { ReactNode } from "react";
import type { UiState } from "./UIState";

interface ResponsePanelProps {
  state: UiState;
  /** Re-runs the last submission. Called by the contextual Retry button. */
  onRetry: () => void;
  /** Whether retry should be disabled (mirrors the form's submit-disabled rules). */
  retryDisabled: boolean;
}

/** Renders whichever state-specific panel is appropriate. */
export function ResponsePanel({
  state,
  onRetry,
  retryDisabled,
}: ResponsePanelProps): JSX.Element | null {
  switch (state.kind) {
    case "idle":
      return null;

    case "loading":
      return (
        <div className="alert alert-secondary d-flex align-items-center">
          <span className="spinner-border spinner-border-sm me-2" />
          Loading…
        </div>
      );

    case "success": {
      const { echo, timestamp, env, version } = state.data;
      return (
        <div className="card border-success">
          <div className="card-header bg-success-subtle text-success-emphasis">
            Success
          </div>
          <ul className="list-group list-group-flush">
            <DetailRow label="echo">{echo}</DetailRow>
            <DetailRow label="timestamp">
              {new Date(timestamp * 1000).toLocaleString()}
            </DetailRow>
            <DetailRow label="env">{env}</DetailRow>
            <DetailRow label="version">{version}</DetailRow>
          </ul>
        </div>
      );
    }

    case "error":
      return (
        <div className="alert alert-danger">
          <strong>
            {state.status === null
              ? "Network error."
              : `Request failed (HTTP ${state.status}).`}
          </strong>
          <div>{state.message}</div>
          <button
            type="button"
            className="btn btn-sm btn-outline-danger mt-2"
            onClick={onRetry}
            disabled={retryDisabled}
          >
            Retry
          </button>
        </div>
      );
  }
}

/** A single label/value row inside the success card's list-group. */
function DetailRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <li className="list-group-item d-flex justify-content-between">
      <span className="text-muted">{label}</span>
      <span className="fw-semibold text-break ms-3">{children}</span>
    </li>
  );
}