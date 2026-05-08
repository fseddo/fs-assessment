/**
 * Root React component.
 *
 * Renders an input + submit button and a response panel that surfaces every UI state:
 *   - idle              : initial state, no request has been made
 *   - validation error  : displayed inline when the input violates the rules
 *   - loading           : a request is in flight
 *   - success           : the API returned 200 with a valid body
 *   - error             : the request failed (API non-2xx OR network failure)
 */

import { useMemo, useState, type FormEvent } from "react";
import { ping } from "./api";
import { MAX_MESSAGE_LENGTH, validateMessage } from "./validation";
import type { UiState } from "./UIState";
import { ResponsePanel } from "./ResponsePanel";

export function App(): JSX.Element {
  const [message, setMessage] = useState<string>("");
  const [state, setState] = useState<UiState>({ kind: "idle" });

  const validation = useMemo(() => validateMessage(message), [message]);

  const isLoading = state.kind === "loading";

  // The submit button is disabled when a request is in flight or the input is invalid.
  const disableSubmit = isLoading || !validation.valid;


  // The page is in its initial state
  const inDefaultState = state.kind === "idle" && message === "";

  // Disabled mid-request and when the page is in its initial state
  const disableReset = isLoading || inDefaultState;

  // Reset returns the page to its initial state — empty input + idle. 
  function reset(): void {
    setMessage("");
    setState({ kind: "idle" });
  }

  // Shared submission path used by both the form's Send button and the
  // contextual Retry button shown in the error alert.
  async function submit(): Promise<void> {
    if (!validation.valid) return;
    // Set the loading state immediately, before the async ping() call,
    setState({ kind: "loading" });
    // then update it with the ping outcome once the promise resolves.
    setState(await ping(message));
  }

  async function handleSubmit(e: FormEvent): Promise<void> {
    e.preventDefault();
    await submit();
  }

  return (
    <main className="container py-5" style={{ maxWidth: 640 }}>
      <header className="mb-4">
        <h1 className="h3 mb-1">Ping</h1>
        <p className="text-muted mb-0">
          Send a message to the backend and see the echoed response.
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <input
            id="message"
            type="text"
            className={`form-control${!validation.valid ? " is-invalid" : ""}`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. hello world"
            autoComplete="off"
            disabled={isLoading}
          />
          <div id="message-help" className="form-text">
            Up to {MAX_MESSAGE_LENGTH} characters, all lowercase.
          </div>
          {!validation.valid && (
            <div id="message-errors" className="invalid-feedback d-block">
              <ul className="mb-0 ps-3">
                {validation.errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={disableSubmit}
        >
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Sending…
            </>
          ) : (
            "Send"
          )}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary ms-2"
          onClick={reset}
          disabled={disableReset}
        >
          Reset
        </button>
      </form>

      <section className="mt-4">
        <ResponsePanel
          state={state}
          onRetry={submit}
          retryDisabled={disableSubmit}
        />
      </section>
    </main>
  );
}


