import { defineCloudflareConfig } from '@opennextjs/cloudflare'

/**
 * OpenNext adapter config. No incremental cache is configured: every page is
 * either static at build time or rendered per request, so there is nothing to
 * revalidate. Add an R2 cache here only if ISR is introduced.
 */
export default defineCloudflareConfig()
