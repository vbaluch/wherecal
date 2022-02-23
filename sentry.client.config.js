import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

if (!SENTRY_DSN) {
  throw new Error("Unexpected error: missing Sentry env var.");
}

Sentry.init({
  dsn: SENTRY_DSN,
  tracesSampleRate: 1.0,
});
