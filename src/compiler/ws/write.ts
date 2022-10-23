import { fs, pathMod } from "../../deps.ts";
import { CompileOptions } from "../types.ts";
import { format } from "../formatter.ts";
import { WsRoutesRoot } from "./WsRoutesRoot.ts";

export async function wsWrite(
  tree: WsRoutesRoot,
  opts: Required<CompileOptions>,
) {
  await tree.writeFileIncremental();

  {
    // ws.main.ts
    const mainPath = pathMod.join(opts.outDir, "ws.main.ts");
    await fs.ensureFile(mainPath);
    const content = `// THIS FILE WAS GENERATED BY DUSKY-BACKEND (By Apika Luca)
import * as $Dusky$ from "dusky";
import mainHandler from "./ws/index.ts";

const ctx = new $Dusky$.SocketCtx();

export default async function requestHandler(req: $Dusky$.HTTPRequest): Promise<Response | null> {
  if (req.pathname === "/ws") {
    if (req.raw.headers.get("upgrade") !== "websocket") {
      return null;
    }

    const {socket: socketRaw, response} = Deno.upgradeWebSocket(req.raw);
    const socket = new $Dusky$.Socket(socketRaw);

    ctx.queueSockets.add(socket);
    ctx.req = req;
    mainHandler(ctx, socket);

    return response;
  }

  return null;
}`;
    await Deno.writeTextFile(
      mainPath,
      format(mainPath, content),
    );
  }
}