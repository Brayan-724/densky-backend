import { chalk, path } from "../deps.ts";
import { graphHttpToTerminal, graphWsToTerminal } from "./grapher/terminal.ts";
import {
  log_error,
  log_success,
  makeLog_info,
  makeLog_success_v,
  MakeLogFn,
} from "./logger.ts";
import { CompileOptions } from "./types.ts";
import { httpDiscover } from "./http/discover.ts";
import { httpWrite } from "./http/write.ts";
import { wsDiscover } from "./ws/discover.ts";

export type { CompileOptions };

let log_info: MakeLogFn;
let log_success_v: MakeLogFn;

export async function compile(options: CompileOptions) {
  const opts = normalize_options(options);

  if (!(await request_permisions(opts))) return;

  const httpRoutesTree = await httpDiscover(opts);
  const wsRoutesTree = await wsDiscover(opts);

  if (!httpRoutesTree) return;
  if (opts.wsPath && !wsRoutesTree) return;

  log_info("Writing files");

  // Remove old build
  // We use try-catch for handle 'No such file or directory' error
  try {
    await Deno.remove(opts.outDir, { recursive: true });
  } catch (_) {
    void 0;
  }

  await httpWrite(httpRoutesTree, opts);

  // Show route graph
  console.log("Http route structure:");
  graphHttpToTerminal(httpRoutesTree);
  console.log("");

  if (wsRoutesTree) {
    console.log("WebSocket route structure:");
    graphWsToTerminal(wsRoutesTree);
    console.log("");
  }

  // Legend
  console.log(chalk.gray`★ Root Endpoint (Leaf)`);
  console.log(chalk.gray`☆ Root Invisible (Branch)`);
  console.log(chalk.gray`▲ Endpoint (Leaf)`);
  console.log(chalk.gray`△ Invisible (Branch)`);
  console.log(chalk.gray`■ Convention`);

  log_success("Done");
}

function normalize_options(options: CompileOptions): Required<CompileOptions> {
  const opts: Required<CompileOptions> = Object.assign(
    {
      routesPath: "",
      wsPath: false,
      outDir: ".dusky",
      verbose: false,
    },
    options,
  );

  opts.routesPath = path.resolve(Deno.cwd(), opts.routesPath);
  opts.outDir = path.resolve(Deno.cwd(), opts.outDir);
  if (opts.wsPath) opts.wsPath = path.resolve(Deno.cwd(), opts.wsPath);

  log_info = makeLog_info(opts.verbose);
  log_success_v = makeLog_success_v(opts.verbose);

  log_info(chalk`Options: 
  RoutesPath: {green "${opts.routesPath}"}
  WsPath: {green ${opts.wsPath ? '"' + opts.wsPath + '"' : "false"}}
  OutDir: {green "${opts.outDir}"}
  Verbose: {yellow ${opts.verbose}}`);

  return opts;
}

/** Persmission request helper */
async function request(desc: Deno.PermissionDescriptor, txt: string) {
  switch ((await Deno.permissions.request(desc)).state) {
    case "granted":
      log_success_v(txt);
      return true;

    case "denied":
      log_error(txt);
      return false;

    default:
      return false;
  }
}

async function request_permisions(
  opts: Required<CompileOptions>,
): Promise<boolean> {
  log_info("Prompting permissions");

  const read = (path: string) =>
    request(
      {
        name: "read",
        path: path,
      },
      chalk`Read permission {dim (${path})}`,
    );

  const write = (path: string) =>
    request(
      {
        name: "write",
        path: path,
      },
      chalk`Write permission {dim (${path})}`,
    );

  if (!(await read(opts.routesPath))) return false;
  if (!(await read(opts.outDir))) return false;
  if (!(await write(opts.outDir))) return false;

  log_success("Granted permissions");

  return true;
}
