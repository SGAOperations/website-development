export function requireEnv(name: string): string {
  const value = process.env[name];

  if (value && value.trim() !== "") {
    return value;
  }

  throw new Error(`Missing required environment variable: ${name}`);
}
