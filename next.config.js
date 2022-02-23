/** @type {import('next').NextConfig} */

const { withSentryConfig } = require("@sentry/nextjs");

const moduleExports = {
  reactStrictMode: true,
};

const sentryWebpackPluginOptions = {};

module.exports = process.env.SENTRY_ORG
  ? withSentryConfig(moduleExports, sentryWebpackPluginOptions)
  : moduleExports;
