import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Prisma } from "../generated/prisma/client";
import type { ActionResult } from "./types";

const prismaErrorMessages: Record<string, string> = {
  P2000: "A field contains a value that is too long.",
  P2002: "A record with these details already exists.",
  P2003: "This action references related data that no longer exists.",
  P2011: "A required field is missing.",
  P2014: "This record is referenced by other records and cannot be deleted.",
  P2015: "The related record could not be found.",
  P2024: "Database connection timeout. Please try again.",
  P2025: "The requested record was not found.",
  P2027: "Multiple database errors occurred. Please try again.",
};

function formatActionError(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return prismaErrorMessages[error.code] ?? "A database operation failed. Please try again.";
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
