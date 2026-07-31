export type ErrorCode =
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "RATE_LIMITED"
  | "PROVIDER_ERROR"
  | "UNKNOWN";

const DEFAULT_MESSAGE: Record<ErrorCode, string> = {
  UNAUTHENTICATED: "You need to sign in to continue.",
  FORBIDDEN: "You don't have access to do that.",
  NOT_FOUND: "We couldn't find what you were looking for.",
  VALIDATION_ERROR: "Some of the information provided isn't valid.",
  RATE_LIMITED: "Too many attempts — please wait a moment and try again.",
  PROVIDER_ERROR: "A connected service is unavailable right now. Please try again shortly.",
  UNKNOWN: "Something went wrong on our end. Please try again.",
};

/**
 * The one exception type application code should throw deliberately.
 * `message` is always safe to show a user; anything not safe to show
 * (stack traces, DB errors, provider payloads) belongs in `cause`, which
 * is logged but never rendered.
 */
export class AppError extends Error {
  readonly code: ErrorCode;

  constructor(code: ErrorCode, message?: string, options?: { cause?: unknown }) {
    super(message ?? DEFAULT_MESSAGE[code]);
    this.name = "AppError";
    this.code = code;
    if (options?.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Standard shape for a Server Action's failure branch. Keeping this as a
 * plain returned object (rather than a thrown error crossing the
 * server/client boundary) is deliberate — Next.js serializes thrown
 * errors from Server Actions into an opaque generic message in
 * production, which is correct for unexpected errors but would also hide
 * the specific, safe-to-show message from an intentional AppError.
 */
export type ActionResult<T> = { success: true; data: T } | { success: false; code: ErrorCode; message: string };

export function actionFailure(error: unknown): { success: false; code: ErrorCode; message: string } {
  if (isAppError(error)) {
    return { success: false, code: error.code, message: error.message };
  }
  return { success: false, code: "UNKNOWN", message: DEFAULT_MESSAGE.UNKNOWN };
}
