import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Resolve um arquivo de `public/` respeitando o caminho base da publicação.
// Em desenvolvimento e na raiz de um domínio o base é "/"; no GitHub Pages o
// portal fica sob "/<repositório>/", então os caminhos não podem ser absolutos.
export function asset(file: string): string {
  const base = (import.meta as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/";
  return base.replace(/\/$/, "") + "/" + file.replace(/^\//, "");
}
