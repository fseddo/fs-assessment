/** Express app factories — REST API on :8000, Swagger UI on :8001. */

import express, { type Express, type NextFunction, type Request, type Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { pingRouter, type ErrorResponseBody } from "./routes/ping";
import { openApiSpec } from "./openapi";

export function createApiApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: "16kb" }));

  app.use(pingRouter);

  app.use((_req: Request, res: Response<ErrorResponseBody>): void => {
    res.status(404).json({ error: "Not found." });
  });

  app.use(
    (
      err: unknown,
      _req: Request,
      res: Response<ErrorResponseBody>,
      _next: NextFunction,
    ): void => {
      // body-parser surfaces malformed JSON as SyntaxError with a `body` field.
      if (err instanceof SyntaxError && "body" in err) {
        res.status(400).json({ error: "Request body is not valid JSON." });
        return;
      }
      // eslint-disable-next-line no-console
      console.error("Unhandled error:", err);
      res.status(500).json({ error: "Internal server error." });
    },
  );

  return app;
}

export function createSwaggerApp(): Express {
  const app = express();

  app.get("/openapi.json", (_req: Request, res: Response): void => {
    res.json(openApiSpec);
  });

  app.use("/", swaggerUi.serve, swaggerUi.setup(openApiSpec));

  return app;
}
