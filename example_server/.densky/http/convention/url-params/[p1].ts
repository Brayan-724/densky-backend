// deno-lint-ignore-file
// .densky/http/convention/url-params/[p1].ts
// THIS FILE WAS GENERATED BY DENSKY-BACKEND (by Apika Luca)
import * as $Densky$ from "densky";

const urlMatcherSerial_pathname = [{ raw: "convention", isVar: false }, {
  raw: "url-params",
  isVar: false,
}, { raw: "[p1]", isVar: true, varname: "p1" }];

async function handler(
  req: $Densky$.HTTPRequest,
): Promise<$Densky$.HTTPPossibleResponse> {
  const urlMatcherPrepare_pathname = req.byParts;

  if (
    (() => {
      const t = urlMatcherPrepare_pathname;
      const p = urlMatcherSerial_pathname;
      const m = req.params;

      if (t.length !== p.length) return false;
      m.clear();
      return t.every((tp, i) => {
        if (!p[i]) return false;
        if (p[i].isVar) {
          m.set(p[i].varname, tp);
          return true;
        }
        if (p[i].raw === tp) return true;
        return false;
      });
    })()
  ) {
    if (
      (() => {
        const t = urlMatcherPrepare_pathname;
        const p = urlMatcherSerial_pathname;
        const m = req.params;

        if (t.length !== p.length) return false;
        m.clear();
        return t.every((tp, i) => {
          if (!p[i]) return false;
          if (p[i].isVar) {
            m.set(p[i].varname, tp);
            return true;
          }
          if (p[i].raw === tp) return true;
          return false;
        });
      })()
    ) {
      if (req.method === "GET") {
        await req.prepare();

        return new Response(
          "PARAM: Matched (" + req.params.get("p1") + ") " + req.pathname,
        );
      }

      return new $Densky$.HTTPError($Densky$.StatusCode.NOT_METHOD)
        .toResponse();
    }
  }
}

export default handler;
