import { createStreaming } from "https://deno.land/x/dprint@0.2.0/mod.ts";

// Setup Formatter
const tsFormatter = await createStreaming(
  fetch("https://plugins.dprint.dev/typescript-0.74.0.wasm"),
);
tsFormatter.setConfig(
  { indentWidth: 2, lineWidth: 80 },
  { semiColons: "always", quoteStyle: "preferDouble", quoteProps: "asNeeded" },
);

export function format(filePath: string, content: string): string {
  return tsFormatter.formatText(filePath, content);
}
