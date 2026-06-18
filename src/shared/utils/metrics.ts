// A tiny, dependency-free metrics registry that speaks the Prometheus text format.
//
// This demonstrates the *idea* behind observability (docs/23-observability.md) without
// adding a client library. In a real service you would use `prom-client`, but the shape is
// the same: you count events as they happen, then expose them at GET /metrics for a scraper
// (Prometheus, Grafana Agent, etc.) to read on an interval.
//
// What we expose:
// - http_requests_total{method,status}  — a counter of handled requests
// - process_uptime_seconds              — how long this process has been running
// - process_resident_memory_bytes       — resident set size (RSS)
//
// Limitation to discuss in interviews: counters live in this process only. With multiple
// instances/workers each has its own numbers, so a scraper must aggregate across them.

import type { Request, Response, NextFunction } from 'express';

// Key is `method|status` (e.g. "GET|200"); value is how many times we have seen it.
const requestCounts = new Map<string, number>();

function increment(method: string, status: number): void {
  const key = `${method}|${status}`;
  requestCounts.set(key, (requestCounts.get(key) ?? 0) + 1);
}

// Express middleware: count every response once it finishes.
// We hook the response `finish` event so we know the final status code.
export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  res.on('finish', () => increment(req.method, res.statusCode));
  next();
}

// Render the current metrics in the Prometheus text exposition format.
// Each metric needs a # HELP and # TYPE line, then one line per series.
export function renderMetrics(): string {
  const lines: string[] = [];

  lines.push('# HELP http_requests_total Total number of HTTP requests handled.');
  lines.push('# TYPE http_requests_total counter');
  for (const [key, count] of requestCounts) {
    const [method, status] = key.split('|');
    lines.push(`http_requests_total{method="${method}",status="${status}"} ${count}`);
  }

  lines.push('# HELP process_uptime_seconds Process uptime in seconds.');
  lines.push('# TYPE process_uptime_seconds gauge');
  lines.push(`process_uptime_seconds ${process.uptime().toFixed(3)}`);

  lines.push('# HELP process_resident_memory_bytes Resident memory size in bytes.');
  lines.push('# TYPE process_resident_memory_bytes gauge');
  lines.push(`process_resident_memory_bytes ${process.memoryUsage().rss}`);

  // Prometheus expects a trailing newline.
  return lines.join('\n') + '\n';
}

// Test-only helper so the suite can start from a clean slate.
export function resetMetrics(): void {
  requestCounts.clear();
}
