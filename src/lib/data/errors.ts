export type DataErrorKind =
  /** Could not reach the server at all (offline, DNS, CORS). */
  | 'network'
  /** The server asked us to slow down. */
  | 'rate-limit'
  /** The server refuses requests from this region. */
  | 'blocked'
  /** The symbol or file does not exist. */
  | 'not-found'
  /** The response was not in the expected shape. */
  | 'bad-data';

export class DataError extends Error {
  readonly kind: DataErrorKind;
  /** For rate limits: how long the server asked us to wait. */
  readonly retryAfterMs?: number;

  constructor(kind: DataErrorKind, message: string, retryAfterMs?: number) {
    super(message);
    this.name = 'DataError';
    this.kind = kind;
    this.retryAfterMs = retryAfterMs;
  }
}

/** True when trying another host or source could help. */
export function isUnreachable(error: unknown): boolean {
  return error instanceof DataError && (error.kind === 'network' || error.kind === 'blocked');
}

/** A plain-language message for the screen. */
export function describeDataError(error: unknown): string {
  if (!(error instanceof DataError)) return 'Something unexpected went wrong while loading prices.';
  switch (error.kind) {
    case 'network':
      return 'Could not reach the price server. Check your internet connection.';
    case 'rate-limit': {
      const seconds = error.retryAfterMs ? Math.ceil(error.retryAfterMs / 1000) : 60;
      return `The price server asked us to slow down. Try again in about ${seconds} seconds.`;
    }
    case 'blocked':
      return 'This price source is not available in your region.';
    case 'not-found':
      return 'There is no price data for this symbol.';
    case 'bad-data':
      return 'The price server sent data we could not read.';
  }
}
