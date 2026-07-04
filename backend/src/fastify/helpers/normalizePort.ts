/**
 * Normalize a port into a number or undefined.
 */

export function normalizePort(val: unknown): number | undefined {
  const port = Number(val);

  if (isNaN(port)) {
    return undefined;
  }

  if (port >= 0) {
    return port;
  }

  return undefined;
}
