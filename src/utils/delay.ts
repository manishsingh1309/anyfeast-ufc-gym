/**
 * Simulates network latency for mock API calls.
 * Production services replace this with real fetch/axios calls.
 */
export const delay = (ms: number = 800): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
