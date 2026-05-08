/**
 * Entry point — starts the REST API on port 8000 and the Swagger UI on port 8001.
 *
 * Both ports are hardcoded here.
 */

import { createApiApp, createSwaggerApp } from "./server";
import { config } from "./config";

const API_PORT = 8000;
const SWAGGER_PORT = 8001;

function main(): void {
  const apiApp = createApiApp();
  const swaggerApp = createSwaggerApp();

  apiApp.listen(API_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(
      `[api] listening on http://localhost:${API_PORT} (env=${config.env}, version=${config.version})`,
    );
  });

  swaggerApp.listen(SWAGGER_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`[swagger] docs at http://localhost:${SWAGGER_PORT}`);
  });
}

main();
