// .dusky/hello.ts
// THIS FILE WAS GENERATED BY DUSKY-BACKEND (by Apika Luca)
import * as $Dusky$ from "dusky"
import { HTTPError, IController } from "dusky"
import { StatusCode } from "dusky/common.ts"

async function handler(req: $Dusky$.HTTPRequest) {
  if (req.pathname === "hello") {
    if (req.method === "GET") {
      return new Response("Hola")
    }
    if (req.method === "POST") {
      return new HTTPError(StatusCode.TEAPOT)
    }
    return new Response("Hola (ANY)")

    return new $Dusky$.HTTPError($Dusky$.StatusCode.NOT_METHOD)
  }
}

export default handler