import type { Handler as _typeAlias_Handler } from "jsr:@std/http@1.0.3/route"
/**
 * Request handler for {@linkcode Route}.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 * @param request Request
 * @param info Request info
 * @param params URL pattern result
 */
type Handler = _typeAlias_Handler
export type { Handler }

import type { Route as _interface_Route } from "jsr:@std/http@1.0.3/route"
/**
 * Route configuration for {@linkcode route}.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 */
interface Route extends _interface_Route {}
export type { Route }

import { route as _function_route } from "jsr:@std/http@1.0.3/route"
/**
 * Routes requests to different handlers based on the request path and method.
 *
 * > [!WARNING]
 * > **UNSTABLE**: New API, yet to be vetted.
 *
 * @experimental
 * @example Usage
 * ```ts no-eval
 * import { route, type Route } from "@std/http/route";
 * import { serveDir } from "@std/http/file-server";
 *
 * const routes: Route[] = [
 *   {
 *     pattern: new URLPattern({ pathname: "/about" }),
 *     handler: () => new Response("About page"),
 *   },
 *   {
 *     pattern: new URLPattern({ pathname: "/users/:id" }),
 *     handler: (_req, _info, params) => new Response(params?.pathname.groups.id),
 *   },
 *   {
 *     pattern: new URLPattern({ pathname: "/static/*" }),
 *     handler: (req: Request) => serveDir(req)
 *   }
 * ];
 *
 * function defaultHandler(_req: Request) {
 *   return new Response("Not found", { status: 404 });
 * }
 *
 * Deno.serve(route(routes, defaultHandler));
 * ```
 *
 * @param routes Route configurations
 * @param defaultHandler Default request handler that's returned when no route
 * matches the given request. Serving HTTP 404 Not Found or 405 Method Not
 * Allowed response can be done in this function.
 * @return Request handler
 */
const route = _function_route as typeof _function_route
export { route }