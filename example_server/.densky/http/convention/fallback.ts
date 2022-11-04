// deno-lint-ignore-file
// .densky/http/convention/fallback.ts
// THIS FILE WAS GENERATED BY DENSKY-BACKEND (by Apika Luca)
import * as $Densky$ from "densky";
import $child$0 from "./fallback/route.ts";

async function handler(
  req: $Densky$.HTTPRequest,
): Promise<$Densky$.HTTPPossibleResponse> {
  const urlMatcherPrepare_pathname = req.pathname;
  if (urlMatcherPrepare_pathname.startsWith("/convention/fallback")) {
    const out$0 = await $child$0(req);
    if (out$0) return out$0;

    if (urlMatcherPrepare_pathname === "/convention/fallback/_fallback") {
      if (req.method === "GET") {
        await req.prepare();

        return new Response("FALLBACK: Matched " + req.pathname);
      }

      return new $Densky$.HTTPError($Densky$.StatusCode.NOT_METHOD)
        .toResponse();
    }
  }
}

export default handler;
