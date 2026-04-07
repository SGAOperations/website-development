import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ActionResult } from "./types";

type PrismaLikeKnownRequestError = {
  code: string;
  meta?: {
    target?: string | string[];
  };
};

function isPrismaLikeKnownRequestError(
  error: unknown
): error is PrismaLikeKnownRequestError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code: unknown }).code === "string" &&
    (error as { code: string }).code.startsWith("P")
  );
}

function formatPrismaErrorMessage(error: PrismaLikeKnownRequestError): string {
  switch (error.code) {
    case "P2000":
      return "A field contains a value that is too long.";
    case "P2002": {
      const target = error.meta?.target;
      const fields = Array.isArray(target)
        ? target.join(", ")
        : typeof target === "string"
          ? target
          : null;
      return fields
        ? `A record with this ${fields} already exists.`
        : "A record with these details already exists.";
    }
    case "P2003":
      return "This action references related data that no longer exists.";
    case "P2011":
      return "A required field is missing.";
    case "P2014":
      return "This record is referenced by other records and cannot be deleted.";
    case "P2015":
      return "The related record could not be found.";
    case "P2024":
      return "Database connection timeout. Please try again.";
    case "P2025":
      return "The requested record was not found.";
    case "P2027":
      return "Multiple database errors occurred. Please try again.";
    default:
      return "A database operation failed. Please try again.";
  }
}

function formatActionError(error: unknown): string {
  if (isPrismaLikeKnownRequestError(error)) {
    return formatPrismaErrorMessage(error);
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unknown error";
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function validateName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Name cannot be empty");
  }
  return trimmed;
}

export async function wrapAction<T>(
  fn: () => Promise<T>
): Promise<ActionResult<T>> {
  try {
    return { success: true, data: await fn() };
  } catch (error) {
    return {
      success: false,
      error: formatActionError(error),
    };
  }
}
