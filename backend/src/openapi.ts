/**
 * OpenAPI 3.0 specification for the REST API.
 *
 * Served by Swagger UI on port 8001. Kept in code (rather than YAML) so it
 * stays in lockstep with the TypeScript request/response types and benefits
 * from the same type checking as the rest of the codebase.
 */

import { config } from "./config";

export const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "fs-assessment API",
    version: config.version,
    description:
      "Simple echo API for the FS backend coding challenge. Exposes a single POST /ping endpoint.",
  },
  servers: [
    {
      url: "http://localhost:8000",
      description: "Local development server",
    },
  ],
  paths: {
    "/ping": {
      post: {
        summary: "Echo a message back to the caller.",
        description:
          "Accepts a JSON body with a `message` string and returns the message echoed back along with a Unix timestamp and the current runtime configuration.",
        operationId: "ping",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PingRequest" },
              examples: {
                hello: {
                  summary: "A simple message",
                  value: { message: "hello world" },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Echo response.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PingResponse" },
              },
            },
          },
          "400": {
            description: "Validation error — the request body is malformed.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      PingRequest: {
        type: "object",
        required: ["message"],
        properties: {
          message: {
            type: "string",
            description: "The message to echo back.",
            example: "hello world",
          },
        },
      },
      PingResponse: {
        type: "object",
        required: ["echo", "timestamp", "env", "version"],
        properties: {
          echo: {
            type: "string",
            description: "The message string received in the request.",
          },
          timestamp: {
            type: "integer",
            format: "int64",
            description: "Current Unix timestamp (seconds since epoch).",
          },
          env: {
            type: "string",
            enum: ["development", "production"],
            description: "Current runtime environment from the config.",
          },
          version: {
            type: "string",
            description: "Current build version from the config.",
          },
        },
      },
      ErrorResponse: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "string",
            description: "Human-readable error message.",
          },
        },
      },
    },
  },
} as const;
