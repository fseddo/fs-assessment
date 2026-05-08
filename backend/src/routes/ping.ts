/**
 * POST /ping route.
 *
 * Accepts a JSON body of the form `{ "message": string }` and echoes it back
 * along with a Unix timestamp and the current runtime configuration.
 *
 * Responses:
 *   200 -> { echo, timestamp, env, version }
 *   400 -> { error: string } when the request body fails validation
 */

import { Router, type Request, type Response } from "express";
import { config, type Environment } from "../config";

/** Shape of the incoming POST body. */
export interface PingRequestBody {
  message: string;
}

/** Shape of the successful (200) response. */
export interface PingResponseBody {
  /** The `message` parameter received in the request, echoed verbatim. */
  echo: string;
  /** Current Unix timestamp (seconds since epoch). */
  timestamp: number;
  /** Current runtime environment from the config. */
  env: Environment;
  /** Current build version from the config. */
  version: string;
}

/** Shape of the error (4xx) response. */
export interface ErrorResponseBody {
  error: string;
}

/**
 * Validate the incoming request body. Returns the typed body on success or
 * an error string describing the first validation failure encountered.
 */
function validateBody(
  body: unknown,
): { ok: true; value: PingRequestBody } | { ok: false; error: string } {
  if (typeof body !== "object" || body === null) {
    return { ok: false, error: "Request body must be a JSON object." };
  }
  const message = (body as { message?: unknown }).message;
  if (typeof message !== "string") {
    return {
      ok: false,
      error: "Field 'message' is required and must be a string.",
    };
  }
  return { ok: true, value: { message } };
}

export const pingRouter: Router = Router();

pingRouter.post(
  "/ping",
  (
    req: Request,
    res: Response<PingResponseBody | ErrorResponseBody>,
  ): void => {
    const result = validateBody(req.body);
    if (!result.ok) {
      res.status(400).json({ error: result.error });
      return;
    }

    const response: PingResponseBody = {
      echo: result.value.message,
      timestamp: Math.floor(Date.now() / 1000),
      env: config.env,
      version: config.version,
    };
    res.status(200).json(response);
  },
);
