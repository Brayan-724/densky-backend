// deno-lint-ignore-file
// .densky/http/out/function.ts
// THIS FILE WAS GENERATED BY DENSKY-BACKEND (by Apika Luca)
import * as $Densky$ from "densky";

import { outFunction } from "../../../src/outFunction.ts";

async function handler(
  req: $Densky$.HTTPRequest,
): Promise<$Densky$.HTTPPossibleResponse> {
  const urlMatcherPrepare_pathname = req.pathname;

  if (urlMatcherPrepare_pathname === "/out/function") {
    if (urlMatcherPrepare_pathname === "/out/function") {
      if (req.method === "GET") {
        await req.prepare();

        return new Response(outFunction(1, 2).toString());
      }

      return new $Densky$.HTTPError($Densky$.StatusCode.NOT_METHOD)
        .toResponse();
    }
  }
}

export default handler;
