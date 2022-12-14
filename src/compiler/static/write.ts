import { fs, pathMod } from "../../deps.ts";
import { CompileOptions } from "../types.ts";
import { format } from "../formatter.ts";
import { StaticFileTree } from "./StaticFileTree.ts";
import { Globals } from "../../globals.ts";

export async function staticWrite(
  tree: StaticFileTree,
  opts: Required<CompileOptions>,
) {
  if (!opts.staticPath) return;

  const nodes: string[] = [];

  tree.files.forEach((node) => {
    const filePath = pathMod.relative(opts.staticPath as string, node.filePath);
    const staticFile =
      `new $Densky$.StaticFileNode("${node.urlPath}", "${filePath}", staticTree.staticFiles)`;
    nodes.push(`staticTree.files.set("${node.urlPath}", ${staticFile});`);
  });

  {
    // static.main.ts
    const mainPath = pathMod.join(opts.outDir, "static.main.ts");
    await fs.ensureFile(mainPath);
    const staticPath = pathMod.relative(Globals.cwd, opts.staticPath);
    const content =
      `// THIS FILE WAS GENERATED BY DENSKY-BACKEND (By Apika Luca)
import * as $Densky$ from "densky";

const staticTree = new $Densky$.StaticFileTree("${staticPath}", "static");
${nodes.join("\n")}

export default function requestHandler(req: $Densky$.HTTPRequest): Promise<Response | null> {
  return staticTree.handleRequest(req.pathname);
}`;
    await Deno.writeTextFile(mainPath, format(mainPath, content));
  }
}
