import { fs, pathMod } from "../../deps.ts";
import { toResponseFnDecl } from "../../utils.ts";
import { HttpRoutesTree } from "./HttpRoutesTree.ts";
import { CompileOptions } from "../types.ts";
import { format } from "../formatter.ts";

export async function httpWrite(
  tree: HttpRoutesTree,
  opts: Required<CompileOptions>,
) {
  await tree.writeFileIncremental();

  {
    // dusky.main.ts
    const mainPath = pathMod.join(opts.outDir, "http.main.ts");
    await fs.ensureFile(mainPath);
    const content = `// THIS FILE WAS GENERATED BY DUSKY-BACKEND (By Apika Luca)
import * as $Dusky$ from "dusky";
import mainHandler from "./http/index.ts";

${toResponseFnDecl()}

export default async function requestHandler(req: $Dusky$.HTTPRequest): Promise<Response> {
  return toResponse(req, await mainHandler(req) ?? new $Dusky$.HTTPError($Dusky$.StatusCode.NOT_FOUND));
}`;
    await Deno.writeTextFile(
      mainPath,
      format(mainPath, content),
    );
  }
}
