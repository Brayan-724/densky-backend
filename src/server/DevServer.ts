import { StatusCode } from "../common.ts";
import { HTTPError, HTTPRequest } from "../http/index.ts";
import { IController } from "../router/Controller.ts";
import { BaseServer, BaseServerOptions } from "./BaseServer.ts";
import { toResponse } from "../utils.ts";
import { HttpRoutesTree } from "../compiler/http/HttpRoutesTree.ts";
import { httpDiscover } from "../compiler/http/discover.ts";

export class DevServer extends BaseServer {
  routesTree!: HttpRoutesTree;

  constructor(options: BaseServerOptions, readonly routesPath: string) {
    super(options);
  }

  override async start(): Promise<void> {
    const tmpDir = await Deno.makeTempDir({ prefix: "densky-cache" });
    const routesTree = await httpDiscover({
      routesPath: this.routesPath,
      wsPath: "",
      outDir: tmpDir,
      verbose: false,
    }, false);

    if (!routesTree) throw new Error("Can't generate the routes tree");
    this.routesTree = routesTree;

    await super.start();
  }

  async handleRequest(request: Deno.RequestEvent): Promise<Response> {
    const httpRequest = new HTTPRequest(request);
    const controllerUrl = null; // await this.resolveRoute(httpRequest.pathname);

    // There isn't a controller for given path
    if (!controllerUrl) {
      return new HTTPError(StatusCode.NOT_FOUND).toResponse();
    }

    // Try to import and handle import errors
    let controllerMod;

    try {
      controllerMod = await import(controllerUrl);
    } catch (e) {
      return HTTPError.fromError(e as Error).toResponse();
    }

    if (typeof controllerMod["default"] !== "function") {
      return new HTTPError(
        StatusCode.INTERNAL_ERR,
        "Not default export or it isn't a class",
      )
        .withName("ExportError")
        .toResponse();
    }

    const controller: IController = new controllerMod["default"]();
    const method = request.request.method as keyof IController;

    if (method in controller && typeof controller[method] === "function") {
      try {
        const response = await controller[method]!(httpRequest);
        return toResponse(response);
      } catch (e) {
        return HTTPError.fromError(e as Error).toResponse();
      }
    }

    if ("ANY" in controller) {
      return new Response("Teapot ANY");
    }

    return new HTTPError(StatusCode.NOT_METHOD).toResponse();
  }
}
