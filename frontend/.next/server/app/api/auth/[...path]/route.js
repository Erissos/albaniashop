/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/[...path]/route";
exports.ids = ["app/api/auth/[...path]/route"];
exports.modules = {

/***/ "(rsc)/./app/api/auth/[...path]/route.ts":
/*!*****************************************!*\
  !*** ./app/api/auth/[...path]/route.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n\n\nconst API = process.env.NEXT_PUBLIC_DJANGO_API_URL ?? 'http://127.0.0.1:8000/api';\nasync function forward(req, method) {\n    const cookieStore = await (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)();\n    const sessionId = cookieStore.get('sessionid')?.value;\n    const headers = {\n        'Content-Type': 'application/json'\n    };\n    if (sessionId) headers['Cookie'] = `sessionid=${sessionId}`;\n    const init = {\n        method,\n        headers,\n        cache: 'no-store'\n    };\n    if (method !== 'GET') init.body = await req.text();\n    const path = req.nextUrl.pathname.replace('/api/auth/', '');\n    const res = await fetch(`${API}/auth/${path}/`, init);\n    const data = await res.json().catch(()=>({}));\n    return next_server__WEBPACK_IMPORTED_MODULE_1__.NextResponse.json(data, {\n        status: res.status\n    });\n}\nasync function POST(req) {\n    return forward(req, 'POST');\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2F1dGgvWy4uLnBhdGhdL3JvdXRlLnRzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUF1QztBQUNpQjtBQUV4RCxNQUFNRSxNQUFNQyxRQUFRQyxHQUFHLENBQUNDLDBCQUEwQixJQUFJO0FBRXRELGVBQWVDLFFBQVFDLEdBQWdCLEVBQUVDLE1BQWM7SUFDckQsTUFBTUMsY0FBYyxNQUFNVCxxREFBT0E7SUFDakMsTUFBTVUsWUFBWUQsWUFBWUUsR0FBRyxDQUFDLGNBQWNDO0lBQ2hELE1BQU1DLFVBQWtDO1FBQUUsZ0JBQWdCO0lBQW1CO0lBQzdFLElBQUlILFdBQVdHLE9BQU8sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxVQUFVLEVBQUVILFdBQVc7SUFFM0QsTUFBTUksT0FBb0I7UUFBRU47UUFBUUs7UUFBU0UsT0FBTztJQUFXO0lBQy9ELElBQUlQLFdBQVcsT0FBT00sS0FBS0UsSUFBSSxHQUFHLE1BQU1ULElBQUlVLElBQUk7SUFFaEQsTUFBTUMsT0FBT1gsSUFBSVksT0FBTyxDQUFDQyxRQUFRLENBQUNDLE9BQU8sQ0FBQyxjQUFjO0lBQ3hELE1BQU1DLE1BQU0sTUFBTUMsTUFBTSxHQUFHckIsSUFBSSxNQUFNLEVBQUVnQixLQUFLLENBQUMsQ0FBQyxFQUFFSjtJQUNoRCxNQUFNVSxPQUFPLE1BQU1GLElBQUlHLElBQUksR0FBR0MsS0FBSyxDQUFDLElBQU8sRUFBQztJQUM1QyxPQUFPekIscURBQVlBLENBQUN3QixJQUFJLENBQUNELE1BQU07UUFBRUcsUUFBUUwsSUFBSUssTUFBTTtJQUFDO0FBQ3REO0FBRU8sZUFBZUMsS0FBS3JCLEdBQWdCO0lBQUksT0FBT0QsUUFBUUMsS0FBSztBQUFTIiwic291cmNlcyI6WyJDOlxcVXNlcnNcXGFkZW1tXFxEZXNrdG9wXFxhbGJhbmlhc2hvcFxcZnJvbnRlbmRcXGFwcFxcYXBpXFxhdXRoXFxbLi4ucGF0aF1cXHJvdXRlLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvb2tpZXMgfSBmcm9tICduZXh0L2hlYWRlcnMnO1xyXG5pbXBvcnQgeyBOZXh0UmVxdWVzdCwgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xyXG5cclxuY29uc3QgQVBJID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfREpBTkdPX0FQSV9VUkwgPz8gJ2h0dHA6Ly8xMjcuMC4wLjE6ODAwMC9hcGknO1xyXG5cclxuYXN5bmMgZnVuY3Rpb24gZm9yd2FyZChyZXE6IE5leHRSZXF1ZXN0LCBtZXRob2Q6IHN0cmluZykge1xyXG4gIGNvbnN0IGNvb2tpZVN0b3JlID0gYXdhaXQgY29va2llcygpO1xyXG4gIGNvbnN0IHNlc3Npb25JZCA9IGNvb2tpZVN0b3JlLmdldCgnc2Vzc2lvbmlkJyk/LnZhbHVlO1xyXG4gIGNvbnN0IGhlYWRlcnM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7ICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicgfTtcclxuICBpZiAoc2Vzc2lvbklkKSBoZWFkZXJzWydDb29raWUnXSA9IGBzZXNzaW9uaWQ9JHtzZXNzaW9uSWR9YDtcclxuXHJcbiAgY29uc3QgaW5pdDogUmVxdWVzdEluaXQgPSB7IG1ldGhvZCwgaGVhZGVycywgY2FjaGU6ICduby1zdG9yZScgfTtcclxuICBpZiAobWV0aG9kICE9PSAnR0VUJykgaW5pdC5ib2R5ID0gYXdhaXQgcmVxLnRleHQoKTtcclxuXHJcbiAgY29uc3QgcGF0aCA9IHJlcS5uZXh0VXJsLnBhdGhuYW1lLnJlcGxhY2UoJy9hcGkvYXV0aC8nLCAnJyk7XHJcbiAgY29uc3QgcmVzID0gYXdhaXQgZmV0Y2goYCR7QVBJfS9hdXRoLyR7cGF0aH0vYCwgaW5pdCk7XHJcbiAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcy5qc29uKCkuY2F0Y2goKCkgPT4gKHt9KSk7XHJcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKGRhdGEsIHsgc3RhdHVzOiByZXMuc3RhdHVzIH0pO1xyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXE6IE5leHRSZXF1ZXN0KSB7IHJldHVybiBmb3J3YXJkKHJlcSwgJ1BPU1QnKTsgfVxyXG4iXSwibmFtZXMiOlsiY29va2llcyIsIk5leHRSZXNwb25zZSIsIkFQSSIsInByb2Nlc3MiLCJlbnYiLCJORVhUX1BVQkxJQ19ESkFOR09fQVBJX1VSTCIsImZvcndhcmQiLCJyZXEiLCJtZXRob2QiLCJjb29raWVTdG9yZSIsInNlc3Npb25JZCIsImdldCIsInZhbHVlIiwiaGVhZGVycyIsImluaXQiLCJjYWNoZSIsImJvZHkiLCJ0ZXh0IiwicGF0aCIsIm5leHRVcmwiLCJwYXRobmFtZSIsInJlcGxhY2UiLCJyZXMiLCJmZXRjaCIsImRhdGEiLCJqc29uIiwiY2F0Y2giLCJzdGF0dXMiLCJQT1NUIl0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/auth/[...path]/route.ts\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2F%5B...path%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...path%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...path%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cademm%5CDesktop%5Calbaniashop%5Cfrontend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cademm%5CDesktop%5Calbaniashop%5Cfrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2F%5B...path%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...path%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...path%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cademm%5CDesktop%5Calbaniashop%5Cfrontend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cademm%5CDesktop%5Calbaniashop%5Cfrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var C_Users_ademm_Desktop_albaniashop_frontend_app_api_auth_path_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/auth/[...path]/route.ts */ \"(rsc)/./app/api/auth/[...path]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/[...path]/route\",\n        pathname: \"/api/auth/[...path]\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/[...path]/route\"\n    },\n    resolvedPagePath: \"C:\\\\Users\\\\ademm\\\\Desktop\\\\albaniashop\\\\frontend\\\\app\\\\api\\\\auth\\\\[...path]\\\\route.ts\",\n    nextConfigOutput,\n    userland: C_Users_ademm_Desktop_albaniashop_frontend_app_api_auth_path_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGJTVCLi4ucGF0aCU1RCUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGYXV0aCUyRiU1Qi4uLnBhdGglNUQlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZhdXRoJTJGJTVCLi4ucGF0aCU1RCUyRnJvdXRlLnRzJmFwcERpcj1DJTNBJTVDVXNlcnMlNUNhZGVtbSU1Q0Rlc2t0b3AlNUNhbGJhbmlhc2hvcCU1Q2Zyb250ZW5kJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1DJTNBJTVDVXNlcnMlNUNhZGVtbSU1Q0Rlc2t0b3AlNUNhbGJhbmlhc2hvcCU1Q2Zyb250ZW5kJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PSZwcmVmZXJyZWRSZWdpb249Jm1pZGRsZXdhcmVDb25maWc9ZTMwJTNEISIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUErRjtBQUN2QztBQUNxQjtBQUNxQztBQUNsSDtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IseUdBQW1CO0FBQzNDO0FBQ0EsY0FBYyxrRUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLHNEQUFzRDtBQUM5RDtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUMwRjs7QUFFMUYiLCJzb3VyY2VzIjpbIiJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9yb3V0ZS1raW5kXCI7XG5pbXBvcnQgeyBwYXRjaEZldGNoIGFzIF9wYXRjaEZldGNoIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvbGliL3BhdGNoLWZldGNoXCI7XG5pbXBvcnQgKiBhcyB1c2VybGFuZCBmcm9tIFwiQzpcXFxcVXNlcnNcXFxcYWRlbW1cXFxcRGVza3RvcFxcXFxhbGJhbmlhc2hvcFxcXFxmcm9udGVuZFxcXFxhcHBcXFxcYXBpXFxcXGF1dGhcXFxcWy4uLnBhdGhdXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcIlwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hdXRoL1suLi5wYXRoXS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2F1dGgvWy4uLnBhdGhdXCIsXG4gICAgICAgIGZpbGVuYW1lOiBcInJvdXRlXCIsXG4gICAgICAgIGJ1bmRsZVBhdGg6IFwiYXBwL2FwaS9hdXRoL1suLi5wYXRoXS9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIkM6XFxcXFVzZXJzXFxcXGFkZW1tXFxcXERlc2t0b3BcXFxcYWxiYW5pYXNob3BcXFxcZnJvbnRlbmRcXFxcYXBwXFxcXGFwaVxcXFxhdXRoXFxcXFsuLi5wYXRoXVxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2F%5B...path%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...path%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...path%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cademm%5CDesktop%5Calbaniashop%5Cfrontend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cademm%5CDesktop%5Calbaniashop%5Cfrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/after-task-async-storage.external":
/*!***********************************************************************************!*\
  !*** external "next/dist/server/app-render/after-task-async-storage.external.js" ***!
  \***********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/after-task-async-storage.external.js");

/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Fauth%2F%5B...path%5D%2Froute&page=%2Fapi%2Fauth%2F%5B...path%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2F%5B...path%5D%2Froute.ts&appDir=C%3A%5CUsers%5Cademm%5CDesktop%5Calbaniashop%5Cfrontend%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=C%3A%5CUsers%5Cademm%5CDesktop%5Calbaniashop%5Cfrontend&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();