import { describe, it, expect } from "vitest";
import { AppError, isAppError, actionFailure } from "./errors";

describe("AppError", () => {
  it("uses the default message for its code when none is given", () => {
    const error = new AppError("FORBIDDEN");
    expect(error.message).toBe("You don't have access to do that.");
    expect(error.code).toBe("FORBIDDEN");
  });

  it("prefers an explicit message over the default", () => {
    const error = new AppError("VALIDATION_ERROR", "Title is required");
    expect(error.message).toBe("Title is required");
  });

  it("carries a cause without exposing it on the message", () => {
    const cause = new Error("raw db error");
    const error = new AppError("PROVIDER_ERROR", undefined, { cause });
    expect(error.cause).toBe(cause);
    expect(error.message).not.toContain("raw db error");
  });
});

describe("isAppError", () => {
  it("recognizes an AppError instance", () => {
    expect(isAppError(new AppError("NOT_FOUND"))).toBe(true);
  });

  it("rejects a plain Error or arbitrary value", () => {
    expect(isAppError(new Error("oops"))).toBe(false);
    expect(isAppError("oops")).toBe(false);
    expect(isAppError(null)).toBe(false);
  });
});

describe("actionFailure", () => {
  it("preserves the code and message of an AppError", () => {
    const result = actionFailure(new AppError("RATE_LIMITED", "Slow down"));
    expect(result).toEqual({ success: false, code: "RATE_LIMITED", message: "Slow down" });
  });

  it("collapses any non-AppError into a safe UNKNOWN result", () => {
    const result = actionFailure(new Error("some internal detail that shouldn't leak"));
    expect(result.success).toBe(false);
    expect(result.code).toBe("UNKNOWN");
    expect(result.message).not.toContain("internal detail");
  });
});
