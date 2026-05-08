/**
 * Application configuration.
 *
 * Manages two configuration variables:
 *   - env     -> current runtime environment ("development" | "production"),
 *                derived from NODE_ENV with "development" as the default
 *   - version -> current build version, "0.0.0" by default
 */

export type Environment = "development" | "production";

export interface AppConfig {
  /** Current runtime environment. */
  env: Environment;
  /** Current build version. */
  version: string;
}

const VERSION = "0.0.0";

const env: Environment =
  process.env.NODE_ENV === "production" ? "production" : "development";

export const config: AppConfig = {
  env,
  version: VERSION,
};
