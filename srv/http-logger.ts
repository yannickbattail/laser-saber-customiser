import { randomUUID } from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
});

export function httpLogger(req: Request, res: Response, next: NextFunction) {
  const requestId = randomUUID();
  const start = process.hrtime.bigint();

  res.setHeader("X-Request-ID", requestId);

  let logged = false;

  const logRequest = (aborted = false) => {
    if (logged) return;
    logged = true;

    const duration = Number(process.hrtime.bigint() - start);

    const status = res.statusCode;

    const log = {
      "@timestamp": new Date().toISOString(),
      "log.level": status >= 500 ? "error" : status >= 400 ? "warn" : "info",
      "event.dataset": "http.access",
      "event.duration": duration,
      "event.outcome": aborted ? "failure" : status >= 400 ? "failure" : "success",

      "http.request.id": requestId,
      "http.request.method": req.method,
      "http.response.status_code": status,

      "url.path": req.path,
      "url.domain": req.hostname,

      "client.address": req.ip,
      "user_agent.original": req.get("user-agent"),
      "http.request.referrer": req.get("referer"),

      "event.aborted": aborted,
    };

    if (status >= 500) {
      logger.error(log, "HTTP request");
    } else if (status >= 400) {
      logger.warn(log, "HTTP request");
    } else {
      logger.info(log, "HTTP request");
    }
  };

  res.on("finish", () => logRequest());

  res.on("close", () => {
    if (!res.writableFinished) {
      logRequest(true);
    }
  });

  next();
}
